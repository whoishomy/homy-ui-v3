# Health Insights Middleware System

The middleware system provides a flexible and extensible way to process health insights through a chain of middleware components. Each middleware can modify, enhance, or handle errors in the insight generation process.

## Core Components

### RetryMiddleware

The `RetryMiddleware` implements robust retry and error handling strategies for insight generation operations. It supports:

- Multiple backoff strategies (exponential, linear, fixed)
- Provider fallback on specific error types
- Comprehensive telemetry integration
- Customizable retry conditions

#### Usage

```typescript
const retryMiddleware = new RetryMiddleware({
  telemetryLogger,
  strategy: {
    maxAttempts: 3,
    backoffType: 'exponential',
    initialDelay: 1000,
    maxDelay: 30000,
    jitter: true,
  },
  providerFallback: {
    enabled: true,
    providers: ['openai', 'anthropic', 'local'],
    errorMapping: {
      'rate_limit': ['anthropic', 'local'],
      'timeout': ['local', 'openai'],
    },
  },
});
```

#### Features

1. **Backoff Strategies**
   - Exponential: Delay increases exponentially (default)
   - Linear: Delay increases linearly
   - Fixed: Constant delay between retries
   - Optional jitter for all strategies

2. **Error Handling**
   - Configurable retryable error patterns
   - Non-retryable error patterns
   - Custom retry predicates

3. **Provider Fallback**
   - Dynamic provider switching based on error types
   - Ordered fallback sequence
   - Provider-specific error mappings

4. **Telemetry Integration**
   - Detailed retry attempt logging
   - Error tracking and categorization
   - Performance metrics collection

### FallbackMiddleware

The `FallbackMiddleware` provides caching and alternative provider strategies when primary operations fail.

#### Features

- Cache-based fallback with TTL
- Provider rotation
- Customizable error handling
- User notifications

### TelemetryMiddleware

The `TelemetryMiddleware` captures detailed metrics and events throughout the insight generation process.

#### Features

- Operation timing
- Error tracking
- Provider performance metrics
- Custom event annotations

## Integration Example

```typescript
const chain = new MiddlewareChain();

// Add telemetry first to capture all events
chain.addMiddleware(new TelemetryMiddleware({
  logger: telemetryLogger,
  includeMetadata: true,
}));

// Add retry middleware for error handling
chain.addMiddleware(new RetryMiddleware({
  telemetryLogger,
  strategy: {
    maxAttempts: 3,
    backoffType: 'exponential',
  },
}));

// Add fallback middleware for caching
chain.addMiddleware(new FallbackMiddleware(cache, {
  enableCacheFallback: true,
  maxCacheAge: 24 * 60 * 60 * 1000,
}));

// Execute the chain
const insight = await chain.executeGenerateInsight(
  params,
  options,
  context,
  operation
);
```

## Error Handling Flow

1. Operation fails with an error
2. RetryMiddleware checks if error is retryable
3. If retryable:
   - Apply backoff delay
   - Switch provider if applicable
   - Retry operation
4. If non-retryable or max attempts reached:
   - FallbackMiddleware checks cache
   - If cache miss, try alternative providers
   - If all fails, throw error
5. All attempts logged via TelemetryMiddleware

## Best Practices

1. **Order Matters**
   - Place TelemetryMiddleware first to capture all events
   - Place RetryMiddleware before FallbackMiddleware
   - Place validation/sanitization middleware last

2. **Configuration**
   - Set reasonable retry limits and delays
   - Configure provider fallback based on error patterns
   - Enable telemetry for monitoring and debugging

3. **Error Handling**
   - Define clear retry conditions
   - Use appropriate backoff strategies
   - Implement comprehensive fallback logic

4. **Monitoring**
   - Monitor retry patterns
   - Track provider performance
   - Analyze error distributions

## Testing

The middleware system includes comprehensive test coverage:

- Unit tests for individual middleware
- Integration tests for middleware chains
- Error scenario testing
- Performance testing

See the `__tests__` directory for examples. 