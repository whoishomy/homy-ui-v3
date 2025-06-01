import { LenaEngine } from '../src/lena/core/LenaEngine.js';
import { getConfig } from '../src/lena/config/lena.config.js';
import dotenv from 'dotenv';

function printBanner() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║             LENA STARTUP              ║');
  console.log('║        Notion Integration Agent       ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('  ');
}

function printStatus(message: string, success: boolean = true) {
  const icon = success ? '✅' : '❌';
  console.log(`${icon} ${message}`);
}

async function startLena() {
  try {
    printBanner();

    // Load environment variables
    dotenv.config({ path: '.env.lena' });
    const config = getConfig();
    printStatus('Configuration loaded');

    // Initialize LENA
    const lena = LenaEngine.getInstance(config);
    await lena.initialize();
    printStatus('LENA initialized');

    // Start auto-sync if enabled
    if (config.enableAutoSync) {
      printStatus('Auto-sync enabled');
      await lena.sync();
      printStatus('Initial sync completed');
    }

    // Handle process termination
    process.on('SIGINT', async () => {
      printStatus('Shutting down LENA...', false);
      lena.stop();
      process.exit(0);
    });

    printStatus('LENA is ready');
    console.log('\nPress Ctrl+C to stop LENA');
  } catch (error) {
    printStatus(`Failed to start LENA: ${error}`, false);
    process.exit(1);
  }
}

startLena();
