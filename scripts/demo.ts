import { generateDemoAssets } from './generate-demo-assets';
import { recordDemo } from './record-demo';

async function runDemo() {
  console.log('🚀 Starting HOMY.MARS Demo Pipeline');
  console.log('=================================\n');

  try {
    // Step 1: Generate Assets
    console.log('Step 1: Generating Demo Assets');
    await generateDemoAssets();
    console.log('✅ Assets generated successfully\n');

    // Step 2: Record Demo
    console.log('Step 2: Recording Demo Video');
    await recordDemo();
    console.log('✅ Demo recorded successfully\n');

    console.log('🎉 Demo pipeline completed successfully!');
    console.log('Please check the recording in your CleanShot library.');
  } catch (error) {
    console.error('❌ Error running demo pipeline:', error);
    process.exit(1);
  }
}

// Run the demo pipeline
runDemo().catch(console.error);
