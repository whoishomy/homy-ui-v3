import { z } from 'zod';

// Agent configuration schema
const AgentConfigSchema = z.object({
  name: z.string(),
  domain: z.enum(['lab', 'vitals', 'triage', 'insights']),
  description: z.string(),
  triggers: z.array(z.enum(['manual', 'scheduled', 'event-based'])),
  schedule: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  memoryKeys: z.array(z.string()),
  outputFormat: z.object({
    type: z.enum(['insight', 'alert', 'recommendation', 'data']),
    schema: z.any(),
  }),
});

// Agent template structure
const AGENT_TEMPLATE = `import { AgentContext, AgentOutput } from '../types';
import { fetchMemoryData, updateMemory } from '../memory';
import { triggerPrompt } from '../prompt-engine';

export interface AGENT_NAMEConfig {
  // Agent-specific configuration
}

export const AGENT_NAMEAgent = async (context: AgentContext): Promise<AgentOutput> => {
  try {
    // 1. Fetch required data
    const memoryData = await fetchMemoryData(context.memoryKeys);
    
    // 2. Process data and make decisions
    const analysis = await processData(memoryData);
    
    // 3. Generate insights or take actions
    if (analysis.requiresAction) {
      await triggerPrompt('DOMAIN-action-prompt', {
        data: analysis,
        context
      });
    }

    // 4. Update memory
    await updateMemory({
      key: 'AGENT_NAME-latest',
      value: analysis,
      metadata: {
        timestamp: new Date().toISOString(),
        agent: 'AGENT_NAME'
      }
    });

    return {
      success: true,
      data: analysis,
      actions: analysis.actions
    };
  } catch (error) {
    console.error('AGENT_NAME agent error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Helper functions
const processData = async (data: any) => {
  // Implement agent-specific logic here
  return {
    requiresAction: false,
    actions: []
  };
};`;

// PromptPack template structure
const PROMPTPACK_TEMPLATE = `import { z } from 'zod';
import { definePromptPack } from '../prompt-engine';

const AGENT_NAMEInputSchema = z.object({
  // Define input schema
});

const AGENT_NAMEOutputSchema = z.object({
  // Define output schema
});

export const AGENT_NAMEPromptPack = definePromptPack({
  name: 'AGENT_NAME',
  description: 'DESCRIPTION',
  version: '1.0.0',
  input: AGENT_NAMEInputSchema,
  output: AGENT_NAMEOutputSchema,
  prompts: [
    {
      role: 'system',
      content: \`You are the AGENT_NAME agent responsible for DESCRIPTION.
Your task is to analyze the provided data and generate insights/actions.

Guidelines:
1. Focus on DOMAIN-specific patterns and anomalies
2. Consider historical context from memory
3. Generate clear, actionable insights
4. Maintain consistency with other agents\`
    },
    {
      role: 'user',
      content: 'Analyze the following data and provide insights: {{data}}'
    }
  ],
  examples: [
    // Add example interactions
  ]
});`;

// Memory configuration template
const MEMORY_CONFIG = {
  keys: ['AGENT_NAME-latest', 'AGENT_NAME-history'],
  schema: {
    latest: {
      type: 'object',
      properties: {
        timestamp: { type: 'string', format: 'date-time' },
        data: { type: 'object' },
        analysis: { type: 'object' },
        actions: { type: 'array' },
      },
    },
    history: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          timestamp: { type: 'string', format: 'date-time' },
          type: { type: 'string' },
          data: { type: 'object' },
        },
      },
    },
  },
};

// Agent Generator PromptPack
export const AgentGeneratorPromptPack = definePromptPack({
  name: 'agent-generator',
  description: 'Generates new agent implementations and their corresponding promptpacks',
  version: '1.0.0',
  input: z.object({
    agentName: z.string(),
    domain: z.enum(['lab', 'vitals', 'triage', 'insights']),
    description: z.string(),
    config: AgentConfigSchema.optional(),
  }),
  output: z.object({
    agentFile: z.string(),
    promptPackFile: z.string(),
    memoryConfig: z.any(),
    setupInstructions: z.array(z.string()),
  }),
  prompts: [
    {
      role: 'system',
      content: `You are the Agent Generator, responsible for creating new agent implementations and their corresponding promptpacks.

Your task is to:
1. Generate a fully functional agent implementation
2. Create a corresponding promptpack
3. Configure memory structure
4. Provide setup instructions

Follow these guidelines:
- Ensure type safety and error handling
- Implement proper memory management
- Create clear and maintainable code
- Consider integration with existing agents
- Follow project coding standards`,
    },
    {
      role: 'user',
      content: `Generate a new agent with the following specifications:
Name: {{agentName}}
Domain: {{domain}}
Description: {{description}}
Configuration: {{config}}`,
    },
  ],
  examples: [
    {
      input: {
        agentName: 'lab-stability-observer',
        domain: 'lab',
        description: 'Monitors lab result stability and detects significant changes',
      },
      output: {
        agentFile: AGENT_TEMPLATE.replace(/AGENT_NAME/g, 'LabStabilityObserver').replace(
          /DOMAIN/g,
          'lab'
        ),
        promptPackFile: PROMPTPACK_TEMPLATE.replace(/AGENT_NAME/g, 'LabStabilityObserver')
          .replace(/DESCRIPTION/g, 'Monitors lab result stability and detects significant changes')
          .replace(/DOMAIN/g, 'lab'),
        memoryConfig: MEMORY_CONFIG,
        setupInstructions: [
          '1. Add agent to src/agents/lab/',
          '2. Add promptpack to src/promptpacks/',
          '3. Configure memory schema',
          '4. Add to agent registry',
        ],
      },
    },
  ],
});
