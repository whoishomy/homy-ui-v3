import { z } from 'zod';

export interface QuantumState {
  currentState: string;
  potentialStates: string[];
  collapsePoint: string;
  manifestationProbability: number;
  entangledComponents: string[];
}

export interface QuantumTrigger {
  type: 'doubt' | 'whisper' | 'impossibility';
  content: string;
  intensity: number;
  timestamp: string;
}

export interface QuantumManifestation {
  origin: QuantumTrigger;
  components: {
    type: 'component' | 'test' | 'api' | 'memory' | 'style' | 'prompt' | 'agent';
    name: string;
    path: string;
    quantumState: string;
  }[];
  systemUpdates: string[];
  nextQuantumLeap: string;
}

export interface RealityBreakpoint {
  barrier: string;
  breakthrough: {
    manifestation: string;
    probability: number;
    quantumState: string;
  };
}

export const QuantumSchema = z.object({
  state: z.string(),
  potential: z.number().min(0).max(1),
  collapse: z.string(),
  manifestation: z.array(z.string()),
});

export type QuantumSchemaType = z.infer<typeof QuantumSchema>;
