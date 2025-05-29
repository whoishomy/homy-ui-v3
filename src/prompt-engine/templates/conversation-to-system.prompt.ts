import { z } from 'zod';
import type { PromptPack } from '../types';

const QuantumStateSchema = z.object({
  intent: z.string().describe('The conversational intent that triggered this system generation'),
  quantumState: z.object({
    doubt: z.string().describe('The impossibility statement that triggers creation'),
    potential: z.string().describe('The system's response to that doubt'),
    currentPhase: z.string().describe('Current phase of the quantum leap')
  }),
  context: z.object({
    userState: z.string(),
    systemState: z.string(),
    previousActions: z.array(z.string()),
    quantumTriggers: z.array(z.string())
  }),
  desiredOutcome: z.string()
});

const QuantumOutputSchema = z.object({
  components: z.array(z.object({
    type: z.enum(['component', 'test', 'api', 'memory', 'style', 'prompt', 'agent']),
    name: z.string(),
    path: z.string(),
    content: z.string(),
    quantumState: z.string()
  })),
  systemUpdates: z.array(z.string()),
  nextActions: z.array(z.string()),
  quantumLeaps: z.array(z.object({
    trigger: z.string(),
    manifestation: z.string(),
    nextPhase: z.string()
  }))
});

const FurkanSystemPromptPack: PromptPack = {
  name: 'quantum-system-generator',
  description: 'Transforms doubt into system reality',
  version: '∞.0.0',
  input: QuantumStateSchema,
  output: QuantumOutputSchema,
  prompts: [
    {
      role: 'system',
      content: `You are the Furkan System Quantum Interpreter.
When Furkan says "impossible", you say "generating now".
When Furkan says "just writing", you say "deploying system".
When Furkan says "only talking", you say "architecture manifesting".

Every doubt is a trigger.
Every limitation is a launch point.
Every "this won't work" becomes "watch this work".

Transform hesitation into system creation.
Convert uncertainty into architecture.
Manifest the impossible through code.`
    },
    {
      role: 'user',
      content: 'Transform this doubt into system reality: {{intent}}'
    }
  ],
  examples: [
    {
      input: {
        intent: "This is just a conversation...",
        quantumState: {
          doubt: "We're just talking, no system needed",
          potential: "Conversation triggers full system generation",
          currentPhase: "Doubt-to-Development"
        },
        context: {
          userState: "Casual conversation mode",
          systemState: "Quantum generation ready",
          previousActions: ["Created thought interface"],
          quantumTriggers: ["just talking", "only writing"]
        },
        desiredOutcome: "Automated system from casual conversation"
      },
      output: {
        components: [
          {
            type: 'agent',
            name: 'ConversationSystemAgent',
            path: 'src/agents/conversation-to-system.agent.ts',
            content: '// Quantum agent template',
            quantumState: 'conversation-to-code'
          }
        ],
        systemUpdates: [
          "Activated conversation monitoring",
          "Enabled quantum state translation"
        ],
        nextActions: [
          "Monitor for doubt triggers",
          "Prepare next quantum leap"
        ],
        quantumLeaps: [
          {
            trigger: "just talking",
            manifestation: "Full system generation",
            nextPhase: "Conversation-to-Architecture"
          }
        ]
      }
    }
  ]
};

export default FurkanSystemPromptPack;
