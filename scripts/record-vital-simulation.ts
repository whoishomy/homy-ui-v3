import { exec } from 'child_process';
import { promisify } from 'util';
import { agentRunner } from '../src/agent-runner';
import { createSimulator, SAMPLE_ANOMALY_PATTERNS } from '../src/simulation/vital-signs-simulator';
import type { AgentOutput } from '../src/types/agent';

const execAsync = promisify(exec);

const recordSimulation = async () => {
  try {
    console.log('🎥 Preparing to record vital signs simulation demo...');

    // Start CleanShot recording
    await execAsync('open "cleanshot://record-screen"');
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for recording to start

    console.log('\n🏥 Homy v3 - Vital Signs Monitoring Demo');
    console.log('----------------------------------------\n');

    // Create simulator with sepsis pattern
    const simulator = createSimulator({
      duration: 300, // 5 minutes for demo
      interval: 15, // 15 seconds
      anomalyPatterns: [
        ...SAMPLE_ANOMALY_PATTERNS.SEPSIS_PATTERN,
        {
          type: 'spike',
          vital: 'heartRate',
          startTime: 120, // At 2 minutes
          duration: 30, // For 30 seconds
          magnitude: 0.5, // 50% spike
        },
      ],
    });

    // Initialize agent system
    console.log('🤖 Initializing Agent System...');
    await agentRunner.runAgent('vital-signs-monitor');
    console.log('✅ Agent system ready\n');

    // Run and record simulation
    console.log('📊 Starting Vital Signs Simulation');
    console.log('Pattern: Sepsis with Cardiac Event\n');

    let eventCount = 0;
    for (const vitals of simulator.simulate()) {
      // Process vitals
      const result = await agentRunner.runAgent('vital-signs-monitor', {
        data: { vitals },
      });

      // Log simulation state
      console.log(`\n⏰ Time: ${new Date(vitals.timestamp).toLocaleTimeString()}`);
      console.log(`❤️  HR: ${vitals.heartRate} (${vitals.heartRateStatus})`);
      console.log(`🩺 BP: ${vitals.systolicBP}/${vitals.diastolicBP} (${vitals.bpStatus})`);
      console.log(`🌡️  Temp: ${vitals.temperature}°C (${vitals.temperatureStatus})`);
      console.log(`🫁 RR: ${vitals.respiratoryRate} (${vitals.respiratoryStatus})`);

      // Log clinical insights
      const insights = result.data?.insights;
      if (insights && insights.length > 0) {
        console.log('\n🚨 Clinical Insights:');
        insights.forEach((insight) => {
          eventCount++;
          console.log(`${eventCount}. ${insight.description}`);
          if (insight.suggestedActions) {
            console.log('   Actions:', insight.suggestedActions.join(', '));
          }
        });
      }

      // Dramatic pause for visualization
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log('\n✨ Simulation Complete');
    console.log(`Total Clinical Events: ${eventCount}`);

    // Stop CleanShot recording
    await execAsync('open "cleanshot://stop-recording"');

    console.log('\n🎥 Recording saved to Desktop');
    process.exit(0);
  } catch (error) {
    console.error('Recording error:', error);
    process.exit(1);
  }
};

// Handle cleanup
process.on('SIGINT', async () => {
  try {
    await execAsync('open "cleanshot://stop-recording"');
  } catch (error) {
    console.error('Failed to stop recording:', error);
  }
  process.exit(0);
});

// Run recording
recordSimulation();
