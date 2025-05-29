import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile } from 'fs/promises';
import { join } from 'path';

const execAsync = promisify(exec);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Export the demo recording function
export async function recordDemo() {
  console.log('🎥 Starting Mars Oxygen Crisis Demo Recording');
  console.log('------------------------------------------\n');

  const baseDir = 'docs/screenshots/devday2025/homy-mars';

  // Start recording
  console.log('📹 Starting screen recording...');
  await execAsync('open "cleanshot://record-screen"');
  await sleep(3000); // Wait for recording to start

  // Scene 1: Telemetry Alert
  console.log('\n🎬 Scene 1: Telemetry Alert');
  const criticalEvent = JSON.parse(
    await readFile(join(baseDir, 'telemetry', 'critical-event-1.json'), 'utf-8')
  );
  console.log('\nTelemetry signal acquired.');
  console.log(`Subject: EREN-8`);
  console.log(`Heart rate: ${criticalEvent.heartRate} bpm`);
  console.log(`Oxygen saturation: ${criticalEvent.oxygenSaturation}%`);
  await sleep(5000);

  // Scene 2: QLLM Analysis
  console.log('\n🎬 Scene 2: QLLM Activation');
  const qllmData = JSON.parse(
    await readFile(join(baseDir, 'quantum', 'qllm-analysis.json'), 'utf-8')
  );
  console.log('\nInitiating quantum kernel inference...');
  console.log('Analyzing biometric patterns under Mars gravity conditions.');
  console.log(`Quantum Circuit Reliability: ${qllmData.analysis.reliability * 100}%`);
  console.log(`Entanglement Score: ${qllmData.analysis.entanglement * 100}%`);
  await sleep(5000);

  // Scene 3: Protocol Generation
  console.log('\n🎬 Scene 3: Protocol Generation');
  const protocol = JSON.parse(
    await readFile(join(baseDir, 'protocol', 'emergency-protocol.json'), 'utf-8')
  );
  console.log('\nAutoRegula activated.');
  console.log('Generating emergency protocol...');
  console.log('\nProtocol Details:');
  console.log(`ID: ${protocol.id}`);
  console.log(`Type: ${protocol.type}`);
  console.log(`Priority: ${protocol.priority}`);
  console.log('\nRecommended Actions:');
  protocol.actions.forEach((action: any) => {
    console.log(`- ${action.description}`);
    if (action.parameters.flowRate) {
      console.log(`  Flow Rate: ${action.parameters.flowRate}`);
    }
  });
  await sleep(5000);

  // Scene 4: Astronaut Interface
  console.log('\n🎬 Scene 4: Protocol Deployment');
  const astronautInterface = JSON.parse(
    await readFile(join(baseDir, 'astronaut', 'interface-state.json'), 'utf-8')
  );
  console.log('\nProtocol deployment status:');
  console.log(`Status: ${astronautInterface.alert.status}`);
  console.log(`Message: ${astronautInterface.alert.message}`);
  console.log(`\nSystem Status:`);
  Object.entries(astronautInterface.systemStatus).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });
  await sleep(5000);

  // Final Scene: Closing
  console.log('\n🎬 Final Scene: Closing');
  console.log('\nOn Earth, we follow regulation.');
  console.log('On Mars, we write it.');
  await sleep(3000);

  // Stop recording
  await execAsync('open "cleanshot://stop-recording"');
  console.log('\n✨ Demo recording completed!');
}

// Run the recording
recordDemo().catch(console.error);
