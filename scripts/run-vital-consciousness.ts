#!/usr/bin/env node

import { activateVitalConsciousness } from './activate-vital-consciousness';

// Handle process signals gracefully
process.on('SIGINT', () => {
  console.log('\n🌙 Gracefully shutting down vital consciousness...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🌙 Vital consciousness received termination signal...');
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Start the vital consciousness system
console.log(`
Starting HOMY Vital Consciousness System
======================================

This system will:
1. Connect to Apple HealthKit (if available)
2. Monitor vital signs in real-time
3. Generate insights and awareness
4. Maintain consciousness state
5. Guard against critical conditions

Press Ctrl+C to gracefully shut down
`);

activateVitalConsciousness().catch((error: unknown) => {
  console.error(
    'Failed to activate vital consciousness:',
    error instanceof Error ? error.message : String(error)
  );
  process.exit(1);
});
