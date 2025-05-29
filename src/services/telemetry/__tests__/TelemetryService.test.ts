import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryTelemetryService } from '../TelemetryService';

describe('InMemoryTelemetryService', () => {
  let service: InMemoryTelemetryService;

  beforeEach(() => {
    service = new InMemoryTelemetryService();
  });

  describe('recordInsight', () => {
    it('records a successful insight', async () => {
      await service.recordInsight({
        provider: 'openai',
        duration: 250,
        success: true,
        cached: false,
        cost: 0.02,
      });

      const snapshot = await service.getSnapshot();
      expect(snapshot.insights.totalGenerated).toBe(1);
      expect(snapshot.insights.successRate).toBe(1);
      expect(snapshot.insights.cacheHitRate).toBe(0);
      expect(snapshot.insights.averageDuration).toBe(250);
      expect(snapshot.costs.total).toBe(0.02);
    });

    it('records a cached insight', async () => {
      await service.recordInsight({
        provider: 'openai',
        duration: 50,
        success: true,
        cached: true,
        cost: 0,
      });

      const snapshot = await service.getSnapshot();
      expect(snapshot.insights.cacheHitRate).toBe(1);
      expect(snapshot.costs.total).toBe(0);
    });

    it('records a failed insight', async () => {
      await service.recordInsight({
        provider: 'openai',
        duration: 300,
        success: false,
        cached: false,
        cost: 0,
        error: {
          type: 'rate_limit',
          message: 'Too many requests',
        },
      });

      const snapshot = await service.getSnapshot();
      expect(snapshot.insights.successRate).toBe(0);
      expect(snapshot.errors.totalErrors).toBe(1);
      expect(snapshot.errors.byType.rate_limit).toBe(1);
    });
  });

  describe('getSnapshot', () => {
    beforeEach(async () => {
      // Add some test data
      await service.recordInsight({
        provider: 'openai',
        duration: 200,
        success: true,
        cached: false,
        cost: 0.02,
      });
      await service.recordInsight({
        provider: 'openai',
        duration: 50,
        success: true,
        cached: true,
        cost: 0,
      });
      await service.recordInsight({
        provider: 'anthropic',
        duration: 300,
        success: false,
        cached: false,
        cost: 0,
        error: {
          type: 'rate_limit',
          message: 'Too many requests',
        },
      });
      await service.recordInsight({
        provider: 'anthropic',
        duration: 250,
        success: true,
        cached: false,
        cost: 0.03,
      });
    });

    it('calculates correct totals', async () => {
      const snapshot = await service.getSnapshot();
      expect(snapshot.insights.totalGenerated).toBe(4);
      expect(snapshot.costs.total).toBe(0.05);
      expect(snapshot.errors.totalErrors).toBe(1);
    });

    it('calculates correct rates', async () => {
      const snapshot = await service.getSnapshot();
      expect(snapshot.insights.successRate).toBe(0.75); // 3/4
      expect(snapshot.insights.cacheHitRate).toBe(0.25); // 1/4
      expect(snapshot.insights.averageDuration).toBe(200); // (200 + 50 + 300 + 250) / 4
    });

    it('groups metrics by provider', async () => {
      const snapshot = await service.getSnapshot();

      // OpenAI
      expect(snapshot.insights.byProvider.openai.total).toBe(2);
      expect(snapshot.insights.byProvider.openai.successRate).toBe(1);
      expect(snapshot.insights.byProvider.openai.cacheHitRate).toBe(0.5);
      expect(snapshot.insights.byProvider.openai.averageDuration).toBe(125);
      expect(snapshot.costs.byProvider.openai).toBe(0.02);
      expect(snapshot.errors.byProvider.openai).toBeUndefined();

      // Anthropic
      expect(snapshot.insights.byProvider.anthropic.total).toBe(2);
      expect(snapshot.insights.byProvider.anthropic.successRate).toBe(0.5);
      expect(snapshot.insights.byProvider.anthropic.cacheHitRate).toBe(0);
      expect(snapshot.insights.byProvider.anthropic.averageDuration).toBe(275);
      expect(snapshot.costs.byProvider.anthropic).toBe(0.03);
      expect(snapshot.errors.byProvider.anthropic).toBe(1);
    });

    it('groups errors by type', async () => {
      const snapshot = await service.getSnapshot();
      expect(snapshot.errors.byType.rate_limit).toBe(1);
    });
  });

  describe('reset', () => {
    it('clears all recorded insights', async () => {
      await service.recordInsight({
        provider: 'openai',
        duration: 200,
        success: true,
        cached: false,
        cost: 0.02,
      });

      await service.reset();

      const snapshot = await service.getSnapshot();
      expect(snapshot.insights.totalGenerated).toBe(0);
      expect(snapshot.costs.total).toBe(0);
      expect(snapshot.errors.totalErrors).toBe(0);
    });
  });
});
