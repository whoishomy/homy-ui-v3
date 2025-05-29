import { agentRunner } from '../agent-runner';
import { createSimulator, SAMPLE_ANOMALY_PATTERNS } from './vital-signs-simulator';
import { updateMemory } from '../memory';

const runSimulation = async () => {
  console.log('🏥 Starting Vital Signs Simulation');

  // Create simulator with sepsis pattern
  const simulator = createSimulator({
    duration: 120, // 2 hours
    interval: 30, // 30 seconds
    anomalyPatterns: SAMPLE_ANOMALY_PATTERNS.SEPSIS_PATTERN,
  });

  // Initialize agent runner
  await agentRunner.initialize();

  // Register vital signs monitor agent
  agentRunner.registerAgent('vital-signs-monitor', {
    schedule: '*/30 * * * * *', // Run every 30 seconds
    enabled: true,
  });

  console.log('\n📊 Simulation Configuration:');
  console.log('Duration: 120 minutes');
  console.log('Interval: 30 seconds');
  console.log('Pattern: Sepsis Simulation\n');

  // Run simulation
  for (const vitals of simulator.simulate()) {
    // Store vitals in memory
    await updateMemory({
      key: 'current-vitals',
      value: vitals,
      metadata: {
        timestamp: vitals.timestamp,
        source: 'simulation',
      },
    });

    // Log simulation progress
    console.log(`\n⏰ Time: ${new Date(vitals.timestamp).toLocaleTimeString()}`);
    console.log(`❤️  HR: ${vitals.heartRate} (${vitals.heartRateStatus})`);
    console.log(`🩺 BP: ${vitals.systolicBP}/${vitals.diastolicBP} (${vitals.bpStatus})`);
    console.log(`🌡️  Temp: ${vitals.temperature}°C (${vitals.temperatureStatus})`);
    console.log(`🫁 RR: ${vitals.respiratoryRate} (${vitals.respiratoryStatus})`);

    // Wait for next interval
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay for visualization
  }

  console.log('\n✅ Simulation Complete');
  process.exit(0);
};

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('Simulation error:', error);
  process.exit(1);
});

// Run simulation
runSimulation();
