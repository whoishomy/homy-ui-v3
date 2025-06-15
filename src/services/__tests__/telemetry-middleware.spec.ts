import { describe, it, expect, jest, beforeEach  } from '@jest/globals';
import { TelemetryMiddleware } from '../middleware/TelemetryMiddleware';
import { InMemoryTelemetryLogger } from '../telemetry/InsightTelemetryLogger';
import { MiddlewareChain } from '../middleware/MiddlewareChain';
import type { HealthInsight } from '@/types/analytics';
import { InsightCategory } from '@/types/analytics';
import type { InsightGenerationParams, InsightGenerationOptions } from '../interfaces/AIInsightProvider';

describe('Telemetry System', () => {
  let chain: MiddlewareChain;
  let logger: InMemoryTelemetryLogger;
  
  const mockInsight: HealthInsight = {
    id: 'test-id',
    type: 'success',
    category: InsightCategory.PHYSICAL,
    message: 'Test insight',
    date: new Date(),
    relatedMetrics: ['steps', 'distance'],
    source: 'test-provider',
  };

  const mockParams: InsightGenerationParams = {
    category: InsightCategory.PHYSICAL,
    metrics: { steps: 1000 },
  };

  const mockOptions: InsightGenerationOptions = {
    maxTokens: 100,
    temperature: 0.7,
  };

  beforeEach(() => {
    chain = new MiddlewareChain();
    logger = new InMemoryTelemetryLogger();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('TelemetryMiddleware', () => {
    it('logs successful operations', async () => {
      const middleware = new TelemetryMiddleware({ logger });
      const operation = jest.fn().mockResolvedValue(mockInsight);

      chain.addMiddleware(middleware);
      await chain.executeGenerateInsight(
        mockParams,
        mockOptions,
        { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
        operation
      );

      const snapshot = logger.getSnapshot();
      expect(snapshot.events).toHaveLength(1);
      expect(snapshot.events[0]).toMatchObject({
        status: 'success',
        operation: 'generateInsight',
        provider: 'test-provider',
        type: 'insight_generation',
      });
    });

    it('logs failed operations with error categorization', async () => {
      const middleware = new TelemetryMiddleware({ logger });
      const error = new Error('Rate limit exceeded');
      const operation = jest.fn().mockRejectedValue(error);

      chain.addMiddleware(middleware);
      await expect(chain.executeGenerateInsight(
        mockParams,
        mockOptions,
        { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
        operation
      )).rejects.toThrow(error);

      const snapshot = logger.getSnapshot();
      expect(snapshot.events).toHaveLength(1);
      expect(snapshot.events[0]).toMatchObject({
        status: 'error',
        operation: 'generateInsight',
        error: {
          type: 'rate_limit',
          message: 'Rate limit exceeded',
        },
      });
    });

    it('includes metadata when configured', async () => {
      const middleware = new TelemetryMiddleware({
        logger,
        includeMetadata: true,
      });
      const operation = jest.fn().mockResolvedValue(mockInsight);

      chain.addMiddleware(middleware);
      await chain.executeGenerateInsight(
        mockParams,
        mockOptions,
        { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
        operation
      );

      const snapshot = logger.getSnapshot();
      expect(snapshot.events[0].metadata).toMatchObject({
        params: mockParams,
        options: mockOptions,
      });
    });

    it('supports custom error types', async () => {
      const middleware = new TelemetryMiddleware({
        logger,
        errorTypes: {
          custom_error: /custom error occurred/i,
        },
      });
      const error = new Error('Custom error occurred');
      const operation = jest.fn().mockRejectedValue(error);

      chain.addMiddleware(middleware);
      await expect(chain.executeGenerateInsight(
        mockParams,
        mockOptions,
        { operation: 'generateInsight', startTime: Date.now(), attempts: 0 },
        operation
      )).rejects.toThrow(error);

      const snapshot = logger.getSnapshot();
      expect(snapshot.events[0].error?.type).toBe('custom_error');
    });
  });

  describe('InMemoryTelemetryLogger', () => {
    it('respects maxEvents limit', () => {
      const logger = new InMemoryTelemetryLogger({ maxEvents: 2 });
      
      logger.logEvent({
        timestamp: 1,
        duration: 100,
        operation: 'generateInsight',
        provider: 'test',
        status: 'success',
        type: 'insight_generation',
      });

      logger.logEvent({
        timestamp: 2,
        duration: 100,
        operation: 'generateInsight',
        provider: 'test',
        status: 'success',
        type: 'insight_generation',
      });

      logger.logEvent({
        timestamp: 3,
        duration: 100,
        operation: 'generateInsight',
        provider: 'test',
        status: 'success',
        type: 'insight_generation',
      });

      const snapshot = logger.getSnapshot();
      expect(snapshot.events).toHaveLength(2);
      expect(snapshot.events[0].timestamp).toBe(2);
      expect(snapshot.events[1].timestamp).toBe(3);
    });

    it('calculates metrics correctly', () => {
      logger.logEvent({
        timestamp: 1,
        duration: 100,
        operation: 'generateInsight',
        provider: 'provider1',
        status: 'success',
        type: 'insight_generation',
      });

      logger.logEvent({
        timestamp: 2,
        duration: 200,
        operation: 'generateInsight',
        provider: 'provider2',
        status: 'error',
        type: 'insight_generation',
        error: {
          type: 'timeout',
          message: 'Operation timed out',
        },
      });

      const snapshot = logger.getSnapshot();
      expect(snapshot.metrics).toMatchObject({
        totalEvents: 2,
        successCount: 1,
        errorCount: 1,
        avgDuration: 150,
        providerStats: {
          provider1: { totalCalls: 1 },
          provider2: { totalCalls: 1 },
        },
      });
    });

    it('filters events by time range', () => {
      const now = Date.now();
      
      logger.logEvent({
        timestamp: now - 2000, // 2 seconds ago
        duration: 100,
        operation: 'generateInsight',
        provider: 'test',
        status: 'success',
        type: 'insight_generation',
      });

      logger.logEvent({
        timestamp: now - 1000, // 1 second ago
        duration: 100,
        operation: 'generateInsight',
        provider: 'test',
        status: 'success',
        type: 'insight_generation',
      });

      const snapshot = logger.getSnapshot({
        start: new Date(now - 1500), // 1.5 seconds ago
        end: new Date(now),
      });

      expect(snapshot.events).toHaveLength(1);
      expect(snapshot.events[0].timestamp).toBe(now - 1000);
    });
  });
}); 