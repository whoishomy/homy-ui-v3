import { CircuitBreaker, type CircuitBreakerOptions, type CircuitBreakerState, type CircuitBreakerMetrics } from './CircuitBreaker';
import { EventEmitter } from 'events';

export interface RegistryOptions {
  defaultOptions?: Partial<CircuitBreakerOptions>;
  providers?: string[];
}

export interface RegistryMetrics {
  [providerId: string]: CircuitBreakerMetrics;
}

export class CircuitBreakerRegistry extends EventEmitter {
  private breakers: Map<string, CircuitBreaker> = new Map();
  private readonly defaultOptions: Partial<CircuitBreakerOptions>;

  constructor(options: RegistryOptions = {}) {
    super();
    this.defaultOptions = options.defaultOptions || {};

    // Initialize circuit breakers for provided providers
    if (options.providers) {
      options.providers.forEach(providerId => {
        this.getOrCreateBreaker(providerId);
      });
    }
  }

  public getOrCreateBreaker(providerId: string): CircuitBreaker {
    let breaker = this.breakers.get(providerId);
    
    if (!breaker) {
      breaker = new CircuitBreaker(providerId, this.defaultOptions);
      this.breakers.set(providerId, breaker);

      // Forward events from individual circuit breakers
      breaker.on('stateChange', (event) => {
        this.emit('stateChange', event);
      });

      breaker.on('failure', (event) => {
        this.emit('failure', event);
      });
    }

    return breaker;
  }

  public async executeOperation<T>(
    providerId: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const breaker = this.getOrCreateBreaker(providerId);
    return breaker.execute(operation);
  }

  public getState(providerId: string): CircuitBreakerState {
    const breaker = this.breakers.get(providerId);
    return breaker ? breaker.getState() : 'closed';
  }

  public getMetrics(): RegistryMetrics {
    const metrics: RegistryMetrics = {};
    this.breakers.forEach((breaker, providerId) => {
      metrics[providerId] = breaker.getMetrics();
    });
    return metrics;
  }

  public reset(providerId?: string): void {
    if (providerId) {
      const breaker = this.breakers.get(providerId);
      if (breaker) {
        breaker.reset();
      }
    } else {
      this.breakers.forEach(breaker => breaker.reset());
    }
  }

  public removeBreaker(providerId: string): void {
    this.breakers.delete(providerId);
  }

  public getAllProviders(): string[] {
    return Array.from(this.breakers.keys());
  }

  public isProviderAvailable(providerId: string): boolean {
    const breaker = this.breakers.get(providerId);
    return breaker ? breaker.getState() !== 'open' : true;
  }

  public getAvailableProviders(): string[] {
    return this.getAllProviders().filter(providerId => this.isProviderAvailable(providerId));
  }
} 