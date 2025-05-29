import { exec } from 'child_process';
import { promisify } from 'util';
import { createSimulator } from '../src/simulation/vital-signs-simulator';

const execAsync = promisify(exec);

interface MarsVitalSigns {
  timestamp: string;
  oxygenSaturation: number;
  heartRate: number;
  respiratoryRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  status: {
    oxygenStatus: 'normal' | 'warning' | 'critical';
    heartRateStatus: 'normal' | 'warning' | 'critical';
    respiratoryStatus: 'normal' | 'warning' | 'critical';
    bpStatus: 'normal' | 'warning' | 'critical';
  };
}

const MARS_OXYGEN_CRISIS_PATTERN = {
  duration: 90, // 90 seconds for demo
  interval: 5, // 5 second updates
  anomalyPatterns: [
    {
      type: 'gradual-decline',
      vital: 'oxygenSaturation',
      startTime: 0,
      duration: 30,
      magnitude: -0.15, // 15% decline
    },
    {
      type: 'compensatory-response',
      vital: 'heartRate',
      startTime: 15,
      duration: 45,
      magnitude: 0.2, // 20% increase
    },
    {
      type: 'compensatory-response',
      vital: 'respiratoryRate',
      startTime: 20,
      duration: 40,
      magnitude: 0.3, // 30% increase
    },
    {
      type: 'recovery',
      vital: 'oxygenSaturation',
      startTime: 60,
      duration: 30,
      magnitude: 0.1, // 10% improvement
    },
  ],
};

async function simulateMarsOxygenCrisis() {
  console.log('🚀 Initializing Mars Oxygen Crisis Simulation');
  console.log('--------------------------------------------\n');

  // Create simulator
  const simulator = createSimulator({
    ...MARS_OXYGEN_CRISIS_PATTERN,
    baselineVitals: {
      oxygenSaturation: 98, // Starting at 98%
      heartRate: 75,
      respiratoryRate: 16,
      bloodPressure: {
        systolic: 120,
        diastolic: 80,
      },
    },
  });

  // Start CleanShot recording
  await execAsync('open "cleanshot://record-screen"');
  await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for recording to start

  console.log('📊 Starting Vital Signs Simulation');
  console.log('Pattern: Mars Oxygen Crisis\n');

  // Run simulation
  for (const vitals of simulator.simulate()) {
    // Process and display vitals
    console.log(`\n⏰ Time: ${new Date(vitals.timestamp).toLocaleTimeString()}`);
    console.log(`🫁 O2 Sat: ${vitals.oxygenSaturation}% (${vitals.status.oxygenStatus})`);
    console.log(`❤️  HR: ${vitals.heartRate} (${vitals.status.heartRateStatus})`);
    console.log(`🫁 RR: ${vitals.respiratoryRate} (${vitals.status.respiratoryStatus})`);
    console.log(
      `🩺 BP: ${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic} (${vitals.status.bpStatus})`
    );

    // Add QLLM analysis simulation
    if (vitals.status.oxygenStatus === 'critical') {
      console.log('\n🧬 QLLM Analysis:');
      console.log('- Analyzing biometric patterns');
      console.log('- Quantum circuit optimization in progress');
      console.log('- Generating emergency protocol');
    }

    // Add protocol generation
    if (vitals.status.oxygenStatus === 'critical' && vitals.oxygenSaturation < 90) {
      console.log('\n📋 Protocol Generated:');
      console.log(
        JSON.stringify(
          {
            type: 'OXYGEN_SUPPORT',
            priority: 'IMMEDIATE',
            actions: [
              'Increase O2 Flow: 5L/min',
              'Activate Backup System',
              'Monitor SpO2 Continuous',
            ],
            timestamp: new Date().toISOString(),
          },
          null,
          2
        )
      );
    }

    // Add recovery confirmation
    if (vitals.status.oxygenStatus === 'normal' && vitals.oxygenSaturation > 95) {
      console.log('\n✅ Recovery Confirmed:');
      console.log('- Oxygen levels stabilizing');
      console.log('- Vital signs returning to normal range');
      console.log('- Protocol execution successful');
    }

    // Dramatic pause for visualization
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Stop CleanShot recording
  await execAsync('open "cleanshot://stop-recording"');

  console.log('\n✨ Simulation Complete');
  console.log('🎥 Recording saved to Desktop');
  process.exit(0);
}

// Run simulation
simulateMarsOxygenCrisis().catch(console.error);
