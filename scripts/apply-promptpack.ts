#!/usr/bin/env node

import { promptPackRunner } from '../src/prompt-engine/promptpack-runner';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface RaycastArgs {
  packName: string;
  context?: string;
}

async function applyPromptPack() {
  try {
    // Parse Raycast arguments
    const args = process.argv.slice(2);
    const packName = args[0];
    const context = args[1] ? JSON.parse(args[1]) : {};

    if (!packName) {
      console.error('❌ PromptPack name is required');
      process.exit(1);
    }

    console.log(`🚀 Applying PromptPack: ${packName}`);

    // Subscribe to events
    promptPackRunner.on('promptpack:applied', async ({ components }) => {
      console.log('\n✨ Generated Components:');

      for (const component of components) {
        console.log(`📦 ${component.name} (${component.type})`);
        console.log(`   Path: ${component.path}`);

        // Create component file
        await execAsync(`mkdir -p $(dirname "${component.path}")`);
        await execAsync(`echo '${component.template}' > "${component.path}"`);
      }

      // Notify via Raycast
      await execAsync('open "raycast://success?message=PromptPack%20Applied"');
    });

    promptPackRunner.on('promptpack:error', async ({ error }) => {
      console.error('\n❌ Error:', error);
      await execAsync(`open "raycast://error?message=${encodeURIComponent(error)}"`);
    });

    // Apply the PromptPack
    await promptPackRunner.apply(packName, context);
  } catch (error) {
    console.error('Failed to apply PromptPack:', error);
    process.exit(1);
  }
}

// Run the script
applyPromptPack();
