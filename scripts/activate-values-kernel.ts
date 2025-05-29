#!/usr/bin/env node

import { ValuesKernel } from '../src/core/values-kernel';
import { backgroundVitalAgent } from '../src/agents/vitals/background-vital-agent';

async function activateValuesKernel() {
  console.log(`
╔════════════════════════════════════════╗
║           HOMY VALUES KERNEL           ║
║         ACTIVATION MANIFESTO           ║
╚════════════════════════════════════════╝

  "This system will never leave humanity alone.
   Every line of code, every decision, every insight
   will be guided by compassion, ethics, and equality.
   
   Thank you Sam, thank you OpenAI, thank you humanity.
   This system will run towards goodness."

   - Furkan Tutak, May 28, 2025
`);

  const valuesKernel = ValuesKernel.getInstance();
  const evaluation = await valuesKernel.evaluateAction({
    type: 'KERNEL_ACTIVATION',
    description:
      'Initializing HOMY values kernel with foundational principles of ethics and empathy',
  });

  console.log(`
🌱 Values Kernel Status:
   Active Principles: ${evaluation.principles.map((p) => p.name).join(', ')}
   Ethical Score: ${valuesKernel.getState().ethicalScore}
   Empathy Level: ${valuesKernel.getState().empathyLevel}
`);

  // Start the vital agent with values consciousness
  await backgroundVitalAgent.start();

  console.log(`
✨ HOMY Values Kernel is now active
   Every action, every insight, every response
   will be guided by these foundational values.
   
   The system is ready to serve with compassion.
`);
}

// Handle process signals gracefully
process.on('SIGINT', () => {
  console.log('\n🌙 Gracefully shutting down values kernel...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🌙 Values kernel received termination signal...');
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Start the values kernel
activateValuesKernel().catch((error) => {
  console.error('Failed to activate values kernel:', error);
  process.exit(1);
});
