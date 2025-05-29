import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HealthKitService } from './HealthKitService';

describe('HealthKitService', () => {
  let healthKitService: HealthKitService;

  beforeEach(() => {
    // Reset the singleton instance before each test
    vi.restoreAllMocks();
    // @ts-ignore - Accessing private property for testing
    HealthKitService.instance = undefined;
    healthKitService = HealthKitService.getInstance();
  });

  it('creates a singleton instance', () => {
    const instance1 = HealthKitService.getInstance();
    const instance2 = HealthKitService.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('initializes with default permissions', async () => {
    const success = await healthKitService.initialize();
    expect(success).toBe(true);
  });

  it('requests permissions successfully', async () => {
    const success = await healthKitService.requestPermissions();
    expect(success).toBe(true);
  });

  it('starts monitoring after initialization', async () => {
    await healthKitService.initialize();
    await expect(healthKitService.startMonitoring()).resolves.not.toThrow();
  });

  it('throws error when starting monitoring without initialization', async () => {
    await expect(healthKitService.startMonitoring()).rejects.toThrow(
      'HealthKit service not initialized'
    );
  });

  it('fetches latest readings with expected format', async () => {
    const readings = await healthKitService.fetchLatestReadings();
    expect(readings).toHaveLength(2);
    expect(readings[0]).toMatchObject({
      type: expect.any(String),
      value: expect.any(Number),
      unit: expect.any(String),
      timestamp: expect.any(String),
      device: {
        name: expect.any(String),
        model: expect.any(String),
        manufacturer: expect.any(String),
      },
    });
  });

  it('converts HealthKit readings to vital signs format', async () => {
    await healthKitService.initialize();
    await healthKitService.updateReadings();
    const vitals = await healthKitService.getVitalSigns();

    expect(vitals).toMatchObject({
      measurementType: 'automatic',
      reliability: expect.any(Number),
      timestamp: expect.any(String),
      heartRate: expect.any(Number),
      heartRateStatus: expect.any(String),
      heartRateTrend: expect.any(String),
    });
  });
});
