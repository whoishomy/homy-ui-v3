import { exec } from 'child_process';
import { promisify } from 'util';
import { createSimulator, SAMPLE_ANOMALY_PATTERNS } from '../src/simulation/vital-signs-simulator';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

const execAsync = promisify(exec);

// Export the asset generation function
export async function generateDemoAssets() {
  console.log('🎬 Generating Mars Oxygen Crisis Demo Assets');
  console.log('------------------------------------------\n');

  // Create directories
  const baseDir = 'docs/screenshots/devday2025/homy-mars';
  const dirs = ['telemetry', 'quantum', 'protocol', 'astronaut'];

  for (const dir of dirs) {
    await mkdir(join(baseDir, dir), { recursive: true });
  }

  // Create simulator
  const simulator = createSimulator({
    duration: 90, // 90 seconds
    interval: 5, // 5 second updates
    anomalyPatterns: [...SAMPLE_ANOMALY_PATTERNS.MARS_OXYGEN_CRISIS],
    baselineVitals: {
      oxygenSaturation: 98,
      heartRate: 75,
      respiratoryRate: 16,
    },
  });

  // Generate telemetry data
  console.log('📊 Generating telemetry data...');
  const telemetryData = [];
  for (const vitals of simulator.simulate()) {
    telemetryData.push(vitals);

    // Save critical events
    if (vitals.oxygenStatus === 'critical') {
      await writeFile(
        join(baseDir, 'telemetry', `critical-event-${telemetryData.length}.json`),
        JSON.stringify(vitals, null, 2)
      );
    }
  }

  // Generate QLLM visualization
  console.log('🧬 Generating QLLM visualization...');
  const qllmData = {
    quantumCircuit: {
      gates: [
        { type: 'H', qubit: 0 },
        { type: 'CNOT', control: 0, target: 1 },
        { type: 'RY', qubit: 1, angle: Math.PI / 4 },
      ],
      measurements: [
        { qubit: 0, basis: 'Z' },
        { qubit: 1, basis: 'X' },
      ],
    },
    analysis: {
      entanglement: 0.85,
      coherence: 0.92,
      reliability: 0.95,
    },
  };

  await writeFile(
    join(baseDir, 'quantum', 'qllm-analysis.json'),
    JSON.stringify(qllmData, null, 2)
  );

  // Generate protocol
  console.log('📋 Generating emergency protocol...');
  const protocol = {
    id: 'MARS-OXY-001',
    type: 'EMERGENCY_PROTOCOL',
    priority: 'IMMEDIATE',
    timestamp: new Date().toISOString(),
    title: 'Mars Habitat Oxygen Crisis Response',
    actions: [
      {
        id: 'ACT-001',
        type: 'OXYGEN_SUPPORT',
        description: 'Increase O2 flow rate',
        parameters: {
          flowRate: '5L/min',
          duration: '10min',
          method: 'assisted',
        },
        priority: 1,
      },
      {
        id: 'ACT-002',
        type: 'SYSTEM_BACKUP',
        description: 'Activate backup oxygen system',
        parameters: {
          system: 'BACKUP-A',
          mode: 'emergency',
        },
        priority: 2,
      },
      {
        id: 'ACT-003',
        type: 'MONITORING',
        description: 'Continuous SpO2 monitoring',
        parameters: {
          interval: '30s',
          threshold: '94%',
          alert: 'immediate',
        },
        priority: 3,
      },
    ],
    validation: {
      qllmConfidence: 0.95,
      regulatoryCompliance: true,
      marsProtocolVersion: '2.1.0',
    },
  };

  await writeFile(
    join(baseDir, 'protocol', 'emergency-protocol.json'),
    JSON.stringify(protocol, null, 2)
  );

  // Generate astronaut interface
  console.log('👨‍🚀 Generating astronaut interface data...');
  const astronautInterface = {
    alert: {
      type: 'PROTOCOL_DEPLOYMENT',
      status: 'ACCEPTED',
      timestamp: new Date().toISOString(),
      message: 'Emergency oxygen protocol deployed successfully.',
      acknowledgment: {
        by: 'EREN-8',
        time: new Date().toISOString(),
        status: 'EXECUTING',
      },
    },
    vitals: {
      current: telemetryData[telemetryData.length - 1],
      trend: 'IMPROVING',
      nextCheck: new Date(Date.now() + 30000).toISOString(),
    },
    systemStatus: {
      primaryO2: 'ACTIVE',
      backupO2: 'STANDBY',
      monitoring: 'ENHANCED',
      qllm: 'ONLINE',
    },
  };

  await writeFile(
    join(baseDir, 'astronaut', 'interface-state.json'),
    JSON.stringify(astronautInterface, null, 2)
  );

  console.log('\n✨ Demo assets generated successfully!');
  console.log('📁 Assets location:', baseDir);
}

// Run the asset generation
generateDemoAssets().catch(console.error);
