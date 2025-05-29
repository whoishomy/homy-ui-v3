import fs from 'fs/promises';
import path from 'path';
import { updateTestDocumentation } from '../src/utils/test-documentation';

async function main() {
  try {
    // Read screenshot data
    const screenshotLogPath = path.join(process.cwd(), 'memory', 'screenshot-log.json');
    const screenshotData = JSON.parse(await fs.readFile(screenshotLogPath, 'utf-8'));

    // Update documentation
    await updateTestDocumentation(screenshotData);

    console.log('✅ Test documentation updated successfully');
  } catch (error) {
    console.error('❌ Failed to update test documentation:', error);
    process.exit(1);
  }
}

main();
