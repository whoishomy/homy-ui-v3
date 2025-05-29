import { program } from 'commander';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { triggerPrompt } from '../prompt-engine';

const validateInput = (agentName: string, domain: string) => {
  const domainEnum = z.enum(['lab', 'vitals', 'triage', 'insights']);
  const nameRegex = /^[a-z-]+$/;

  if (!nameRegex.test(agentName)) {
    throw new Error('Agent name must be lowercase with hyphens only');
  }

  try {
    domainEnum.parse(domain);
  } catch {
    throw new Error('Invalid domain. Must be one of: lab, vitals, triage, insights');
  }
};

const writeFile = async (filePath: string, content: string) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, 'utf-8');
  console.log(`Created ${filePath}`);
};

const generateAgent = async (agentName: string, domain: string, description: string) => {
  try {
    validateInput(agentName, domain);

    // Generate agent files using the promptpack
    const result = await triggerPrompt('agent-generator', {
      agentName,
      domain,
      description,
    });

    if (!result.success) {
      throw new Error(`Agent generation failed: ${result.error}`);
    }

    // Write agent file
    const agentPath = path.join(process.cwd(), 'src', 'agents', domain, `${agentName}.agent.ts`);
    await writeFile(agentPath, result.data.agentFile);

    // Write promptpack file
    const promptPackPath = path.join(process.cwd(), 'src', 'promptpacks', `${agentName}.prompt.ts`);
    await writeFile(promptPackPath, result.data.promptPackFile);

    // Update memory configuration
    const memoryConfigPath = path.join(process.cwd(), 'src', 'config', 'memory.json');
    const memoryConfig = JSON.parse(await fs.readFile(memoryConfigPath, 'utf-8'));
    memoryConfig.agents[agentName] = result.data.memoryConfig;
    await fs.writeFile(memoryConfigPath, JSON.stringify(memoryConfig, null, 2));

    console.log('\nSetup Instructions:');
    result.data.setupInstructions.forEach((instruction: string) => {
      console.log(instruction);
    });

    console.log('\n✨ Agent generated successfully!');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error generating agent:', error.message);
      process.exit(1);
    }
    console.error('Unknown error occurred');
    process.exit(1);
  }
};

program
  .name('generate-agent')
  .description('Generate a new agent and its corresponding promptpack')
  .argument('<name>', 'Agent name (lowercase with hyphens)')
  .argument('<domain>', 'Domain (lab, vitals, triage, insights)')
  .argument('[description]', 'Agent description')
  .action((name: string, domain: string, description: string = '') => {
    generateAgent(name, domain, description);
  });

program.parse();
