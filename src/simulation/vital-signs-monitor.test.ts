import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSimulator, SAMPLE_ANOMALY_PATTERNS } from './vital-signs-simulator';
import { agentRunner } from '../agent-runner';
import { fetchMemoryData } from '../memory';

describe('Vital Signs Monitoring System', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers();
  });

  describe('Vital Signs Simulator', () => {
    it('generates normal vital signs within expected ranges', () => {
      const simulator = createSimulator({
        duration: 10,
        interval: 60,
      });

      const vitals = simulator.generateVitals();

      expect(vitals.heartRate).toBeGreaterThan(60);
      expect(vitals.heartRate).toBeLessThan(100);
      expect(vitals.systolicBP).toBeGreaterThan(90);
      expect(vitals.systolicBP).toBeLessThan(140);
      expect(vitals.temperature).toBeGreaterThan(36);
      expect(vitals.temperature).toBeLessThan(37.5);
      expect(vitals.respiratoryRate).toBeGreaterThan(12);
      expect(vitals.respiratoryRate).toBeLessThan(20);
    });

    it('correctly applies sepsis pattern anomalies', () => {
      const simulator = createSimulator({
        duration: 120,
        interval: 30,
        anomalyPatterns: SAMPLE_ANOMALY_PATTERNS.SEPSIS_PATTERN,
      });

      // Advance time to when anomalies should be active
      vi.advanceTimersByTime(45 * 60 * 1000); // 45 minutes

      const vitals = simulator.generateVitals();

      // Verify sepsis pattern effects
      expect(vitals.heartRate).toBeGreaterThan(90); // Increased heart rate
      expect(vitals.temperature).toBeGreaterThan(37.5); // Elevated temperature
      expect(vitals.systolicBP).toBeLessThan(100); // Decreased blood pressure
    });

    it('generates correct vital status indicators', () => {
      const simulator = createSimulator({
        duration: 10,
        interval: 60,
        anomalyPatterns: [
          {
            type: 'spike',
            vital: 'heartRate',
            startTime: 0,
            duration: 10,
            magnitude: 0.8, // 80% increase
          },
        ],
      });

      const vitals = simulator.generateVitals();

      // Heart rate should be critical due to spike
      expect(vitals.heartRateStatus).toBe('critical');

      // Other vitals should be normal
      expect(vitals.bpStatus).toBe('normal');
      expect(vitals.temperatureStatus).toBe('normal');
      expect(vitals.respiratoryStatus).toBe('normal');
    });
  });

  describe('Vital Signs Monitoring Agent', () => {
    it('detects and alerts on critical vitals', async () => {
      // Create simulator with critical pattern
      const simulator = createSimulator({
        duration: 10,
        interval: 30,
        anomalyPatterns: SAMPLE_ANOMALY_PATTERNS.CARDIAC_EVENT,
      });

      // Mock memory system
      const mockMemory = vi.fn();
      vi.spyOn(agentRunner, 'runAgent');

      // Run simulation for one interval
      const vitals = simulator.generateVitals();
      await agentRunner.runAgent('vital-signs-monitor', {
        data: { vitals },
      });

      // Verify agent response
      expect(agentRunner.runAgent).toHaveBeenCalledWith('vital-signs-monitor', expect.any(Object));

      // Check memory for alerts
      const memoryData = await fetchMemoryData(['vital-signs-monitor-latest']);
      const latestData = memoryData['vital-signs-monitor-latest']?.[0];

      expect(latestData).toBeDefined();
      expect(latestData.value.insights).toContainEqual(
        expect.objectContaining({
          type: 'alert',
          severity: 3,
        })
      );
    });

    it('maintains monitoring history', async () => {
      const simulator = createSimulator({
        duration: 30,
        interval: 10,
      });

      const vitalsArray = Array.from(simulator.simulate());

      // Process multiple vital readings
      for (const vitals of vitalsArray) {
        await agentRunner.runAgent('vital-signs-monitor', {
          data: { vitals },
        });
      }

      // Verify history in memory
      const memoryData = await fetchMemoryData(['vital-signs-monitor-history']);
      const history = memoryData['vital-signs-monitor-history'];

      expect(history).toHaveLength(vitalsArray.length);
      expect(history[0].timestamp).toBeLessThan(history[1].timestamp);
    });
  });
});
