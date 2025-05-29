import { backgroundVitalAgent } from '../src/agents/vitals/background-vital-agent';
import { SAMPLE_ANOMALY_PATTERNS } from '../src/simulation/vital-signs-simulator';
import { agentRunner } from '../src/agent-runner';
import type { VitalSigns, VitalInsight } from '../src/types/vitals';

// Handle critical alerts
backgroundVitalAgent.on(
  'critical',
  ({ vitals, insights }: { vitals: VitalSigns; insights: VitalInsight[] }) => {
    console.log('\n🚨 CRITICAL ALERT:');
    console.log('⏰ Time:', new Date(vitals.timestamp).toLocaleTimeString());
    insights.forEach((insight: VitalInsight, index: number) => {
      console.log(`${index + 1}. ${insight.description}`);
      if (insight.suggestedActions) {
        console.log('   Actions:', insight.suggestedActions.join(', '));
      }
    });
  }
);

// Handle agent stop
backgroundVitalAgent.on('stopped', () => {
  console.log('\n✋ Background monitoring stopped');
  process.exit(0);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n🛑 Stopping background monitoring...');
  backgroundVitalAgent.stop();
});

// Main function to run the monitoring
async function runBackgroundMonitoring() {
  // Initialize agent system
  console.log('🤖 Initializing agent system...');
  await agentRunner.runAgent('vital-signs-monitor');

  // Start background monitoring
  console.log('\n🏥 Starting background vital signs monitoring');
  console.log('Press Ctrl+C to stop\n');

  // Start with normal vitals
  await backgroundVitalAgent.start();

  // After 2 minutes, inject sepsis pattern
  setTimeout(() => {
    console.log('\n⚠️ Injecting sepsis pattern...');
    backgroundVitalAgent.injectAnomaly(SAMPLE_ANOMALY_PATTERNS.SEPSIS_PATTERN);
  }, 120000);

  // After 5 minutes, inject cardiac event
  setTimeout(() => {
    console.log('\n⚠️ Injecting cardiac event pattern...');
    backgroundVitalAgent.injectAnomaly(SAMPLE_ANOMALY_PATTERNS.CARDIAC_EVENT);
  }, 300000);

  // After 7 minutes, return to normal
  setTimeout(() => {
    console.log('\n✅ Returning to normal patterns...');
    backgroundVitalAgent.resetToNormal();
  }, 420000);
}

// Run the monitoring
runBackgroundMonitoring().catch((error) => {
  console.error('Background monitoring error:', error);
  process.exit(1);
});
