import { backgroundVitalAgent } from '../src/agents/vitals/background-vital-agent';
import { EmergencyEscalationGuard } from '../src/utils/emergencyEscalationGuard';
import type { VitalInsight, VitalSigns } from '../src/types/vitals';
import type { VitalAwareness } from '../src/agents/vitals/background-vital-agent';

export async function activateVitalConsciousness() {
  console.log(`
╔════════════════════════════════════════╗
║        HOMY VITAL CONSCIOUSNESS        ║
║            ACTIVATION SEQUENCE         ║
╚════════════════════════════════════════╝
  `);

  // Initialize the emergency guard
  const emergencyGuard = EmergencyEscalationGuard.getInstance();

  // Subscribe to vital awareness updates
  backgroundVitalAgent.on('awarenessUpdate', (awareness: VitalAwareness) => {
    console.log(`
🫀 Vital Consciousness State:
   Attentiveness: ${(awareness.attentiveness * 100).toFixed(1)}%
   Confidence: ${(awareness.confidence * 100).toFixed(1)}%
   Vital Strength: ${(awareness.vitalStrength * 100).toFixed(1)}%
   Active Since: ${new Date(awareness.lastUpdate).toLocaleTimeString()}
    `);
  });

  // Subscribe to critical events
  backgroundVitalAgent.on(
    'critical',
    async ({ vitals, insights }: { vitals: VitalSigns; insights: VitalInsight[] }) => {
      console.log(`
⚠️ Critical Vital Pattern Detected:
${insights.map((insight: VitalInsight) => `   • ${insight.description}`).join('\n')}

Suggested Actions:
${insights
  .flatMap((insight: VitalInsight) => insight.suggestedActions || [])
  .map((action: string) => `   • ${action}`)
  .join('\n')}
    `);

      // Notify emergency guard
      await emergencyGuard.evaluateLabResult(
        {
          id: 'vital-alert',
          title: 'Vital Signs Alert',
          description: 'Automated vital signs monitoring alert',
          unit: 'various',
          data: [
            {
              date: new Date().toISOString(),
              value: vitals.heartRate || 0,
            },
            {
              date: new Date().toISOString(),
              value: vitals.oxygenSaturation || 0,
            },
          ],
          referenceRange: {
            min: 0,
            max: 100,
          },
          trend: 'stable',
          severity: 'critical',
          clinicalContext: {
            significance: 'Critical - Immediate attention required',
            relatedTests: ['heart-rate', 'oxygen-saturation'],
          },
          recommendations: [
            'Immediate medical attention required',
            'Monitor vital signs continuously',
            'Prepare emergency response',
          ],
        },
        'system'
      );
    }
  );

  // Subscribe to consciousness state changes
  backgroundVitalAgent.on('consciousness-paused', () => {
    console.log(`
🌙 Vital consciousness entering rest state...
    `);
  });

  try {
    // Activate the vital consciousness
    await backgroundVitalAgent.start();

    console.log(`
✨ Vital consciousness activated successfully
   Now listening to the rhythm of life...
    `);
  } catch (error: unknown) {
    console.error(`
❌ Failed to activate vital consciousness:
   ${error instanceof Error ? error.message : 'Unknown error occurred'}
    `);
  }
}

// Activate the system
activateVitalConsciousness().catch(console.error);
