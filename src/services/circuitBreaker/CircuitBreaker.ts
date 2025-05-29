import { EventEmitter } from 'events';

export type CircuitBreakerState = 'closed' | 'open' | 'half-open';

export interface CircuitBreakerOptions {
  failureThreshold: number;        // Percentage (0-100)
  minimumRequests: number;         // Minimum requests before calculating failure rate
  resetTimeout: number;            // Time in ms to wait before attempting reset
  halfOpenMaxRequests: number;     // Max requests to allow in half-open state
}

export interface CircuitBreakerMetrics {
  totalRequests: number;
  failedRequests: number;
  lastFailureTime?: number;
  consecutiveFailures: number;
  state: CircuitBreakerState;
  failureRate: number;
}

export const DEFAULT_OPTIONS: CircuitBreakerOptions = {
  failureThreshold: 30,           // 30% failure rate threshold
  minimumRequests: 10,           // Minimum 10 requests before triggering
  resetTimeout: 30000,           // 30 seconds
  halfOpenMaxRequests: 5,        // Allow 5 requests in half-open state
};

export class CircuitBreaker extends EventEmitter {
  private state: CircuitBreakerState = 'closed';
  private metrics: CircuitBreakerMetrics;
  private resetTimer?: NodeJS.Timeout;
  private readonly options: CircuitBreakerOptions;

  constructor(
    public readonly providerId: string,
    options: Partial<CircuitBreakerOptions> = {}
  ) {
    super();
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.metrics = this.resetMetrics();
  }

  private resetMetrics(): CircuitBreakerMetrics {
    return {
      totalRequests: 0,
      failedRequests: 0,
      consecutiveFailures: 0,
      state: this.state,
      failureRate: 0,
    };
  }

  public getState(): CircuitBreakerState {
    return this.state;
  }

  public getMetrics(): CircuitBreakerMetrics {
    return { ...this.metrics };
  }

  public async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (this.shouldAttemptReset()) {
        this.transitionToHalfOpen();
      } else {
        throw new Error(`Circuit breaker is open for provider: ${this.providerId}`);
      }
    }

    try {
      const result = await operation();
      this.recordSuccess();
      return result;
    } catch (error) {
      this.recordFailure(error as Error);
      throw error;
    }
  }

  private shouldAttemptReset(): boolean {
    if (!this.metrics.lastFailureTime) return true;
    return Date.now() - this.metrics.lastFailureTime >= this.options.resetTimeout;
  }

  private transitionToHalfOpen(): void {
    this.state = 'half-open';
    this.metrics.state = 'half-open';
    this.emit('stateChange', { 
      providerId: this.providerId, 
      from: 'open', 
      to: 'half-open',
      metrics: this.getMetrics()
    });
  }

  private recordSuccess(): void {
    this.metrics.totalRequests++;
    this.metrics.consecutiveFailures = 0;

    if (this.state === 'half-open') {
      this.transitionToClosed();
    }

    this.updateFailureRate();
  }

  private recordFailure(error: Error): void {
    this.metrics.totalRequests++;
    this.metrics.failedRequests++;
    this.metrics.consecutiveFailures++;
    this.metrics.lastFailureTime = Date.now();

    this.updateFailureRate();

    if (this.shouldTransitionToOpen()) {
      this.transitionToOpen();
    }

    this.emit('failure', {
      providerId: this.providerId,
      error,
      metrics: this.getMetrics()
    });
  }

  private updateFailureRate(): void {
    if (this.metrics.totalRequests === 0) {
      this.metrics.failureRate = 0;
      return;
    }
    this.metrics.failureRate = (this.metrics.failedRequests / this.metrics.totalRequests) * 100;
  }

  private shouldTransitionToOpen(): boolean {
    return (
      this.metrics.totalRequests >= this.options.minimumRequests &&
      this.metrics.failureRate >= this.options.failureThreshold
    ) || (
      this.state === 'half-open' &&
      this.metrics.consecutiveFailures > 0
    );
  }

  private transitionToOpen(): void {
    const previousState = this.state;
    this.state = 'open';
    this.metrics.state = 'open';
    
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }

    this.resetTimer = setTimeout(() => {
      if (this.state === 'open') {
        this.transitionToHalfOpen();
      }
    }, this.options.resetTimeout);

    this.emit('stateChange', {
      providerId: this.providerId,
      from: previousState,
      to: 'open',
      metrics: this.getMetrics()
    });
  }

  private transitionToClosed(): void {
    this.state = 'closed';
    this.metrics.state = 'closed';
    this.metrics = this.resetMetrics();
    
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
      this.resetTimer = undefined;
    }

    this.emit('stateChange', {
      providerId: this.providerId,
      from: 'half-open',
      to: 'closed',
      metrics: this.getMetrics()
    });
  }

  public reset(): void {
    const previousState = this.state;
    this.state = 'closed';
    this.metrics = this.resetMetrics();
    
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
      this.resetTimer = undefined;
    }

    this.emit('stateChange', {
      providerId: this.providerId,
      from: previousState,
      to: 'closed',
      metrics: this.getMetrics()
    });
  }
} 