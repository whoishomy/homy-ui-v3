import { fetchMemoryData, MemoryData } from '../src/memory';
import type { VitalSigns, VitalInsight } from '../src/types/vitals';

interface VitalRecord extends MemoryData {
  value: {
    vitals: VitalSigns;
    insights: VitalInsight[];
  };
}

async function replayVitals() {
  try {
    console.log('📼 Loading vital signs records...');

    // Fetch all vital records
    const memoryData = await fetchMemoryData(['background-vitals-latest']);
    const records = memoryData['background-vitals-latest'] as VitalRecord[];

    if (!records || records.length === 0) {
      console.log('❌ No vital signs records found');
      return;
    }

    console.log(`✅ Found ${records.length} records\n`);
    console.log('⏯️  Starting replay...\n');

    // Sort records by timestamp
    const sortedRecords = records.sort(
      (a, b) => new Date(a.metadata.timestamp).getTime() - new Date(b.metadata.timestamp).getTime()
    );

    // Replay each record
    for (const record of sortedRecords) {
      const { vitals, insights } = record.value;
      const time = new Date(record.metadata.timestamp).toLocaleTimeString();

      // Display vitals
      console.log(`⏰ Time: ${time}`);
      console.log(`❤️  HR: ${vitals.heartRate} (${vitals.heartRateStatus})`);
      console.log(`🩺 BP: ${vitals.systolicBP}/${vitals.diastolicBP} (${vitals.bpStatus})`);
      console.log(`🌡️  Temp: ${vitals.temperature}°C (${vitals.temperatureStatus})`);
      console.log(`🫁 RR: ${vitals.respiratoryRate} (${vitals.respiratoryStatus})`);

      // Display insights if any
      if (insights && insights.length > 0) {
        console.log('\n🚨 Clinical Insights:');
        insights.forEach((insight, index) => {
          console.log(`${index + 1}. ${insight.description}`);
          if (insight.suggestedActions) {
            console.log('   Actions:', insight.suggestedActions.join(', '));
          }
        });
      }

      console.log('\n---\n');

      // Wait before showing next record
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log('✨ Replay complete');
    process.exit(0);
  } catch (error) {
    console.error('Replay error:', error);
    process.exit(1);
  }
}

// Run replay
replayVitals();
