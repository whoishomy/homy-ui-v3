import { program } from 'commander';
import { agentRunner } from '../agent-runner';
import { fetchMemoryData } from '../memory';

const startAgentRunner = async () => {
  try {
    // Load agent configurations
    const memoryData = await fetchMemoryData(['agent-registry']);
    const registry = memoryData['agent-registry']?.[0]?.value || {};

    console.log('\n🤖 Agent Runner System\n');
    console.log('Loading agents from registry...\n');

    // Register and start agents
    Object.entries(registry).forEach(([name, config]: [string, any]) => {
      console.log(`📦 Registering agent: ${name}`);
      agentRunner.registerAgent(name, config);

      if (config.enabled && config.schedule) {
        console.log(`⏰ Scheduled: ${config.schedule}`);
      }
    });

    // Subscribe to events
    agentRunner.on('statusUpdate', (status) => {
      console.log(`\n📊 Agent Status Update: ${status.name}`);
      console.log(`Status: ${status.status}`);
      if (status.lastRun) console.log(`Last Run: ${status.lastRun}`);
      if (status.nextRun) console.log(`Next Run: ${status.nextRun}`);
      if (status.error) console.log(`Error: ${status.error}`);
    });

    agentRunner.on('agentComplete', ({ name, result }) => {
      console.log(`\n✅ Agent Complete: ${name}`);
      console.log('Result:', result);
    });

    agentRunner.on('agentError', ({ name, error }) => {
      console.log(`\n❌ Agent Error: ${name}`);
      console.log('Error:', error);
    });

    console.log('\n🚀 Agent Runner System Started\n');

    // Keep the process running
    process.stdin.resume();

    // Handle graceful shutdown
    const shutdown = () => {
      console.log('\n🛑 Shutting down Agent Runner System...');
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Failed to start Agent Runner:', error);
    process.exit(1);
  }
};

program
  .name('start-agent-runner')
  .description('Start the Agent Runner system')
  .action(startAgentRunner);

program.parse();
