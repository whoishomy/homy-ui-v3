export type PracticeMode = 'pitch' | 'daily' | 'explain';

export interface PracticeFeedback {
  suggestions: string[];
  corrections: {
    original: string;
    improved: string;
    explanation: string;
  }[];
  metrics: {
    fluency: number;
    vocabulary: number;
    grammar: number;
    pronunciation?: number;
    technicalAccuracy?: number;
    pitchEffectiveness?: number;
  };
}

export interface PracticeSession {
  id: string;
  mode: PracticeMode;
  startedAt: string;
  endedAt?: string;
  messages: {
    id: string;
    content: string;
    type: 'user' | 'assistant';
    timestamp: string;
    feedback?: PracticeFeedback;
  }[];
  context?: {
    topic?: string;
    audience?: string;
    complexity?: 'basic' | 'intermediate' | 'advanced';
  };
}

export interface PracticeExport {
  type: 'slides' | 'script' | 'notes';
  format: 'markdown' | 'pdf' | 'figma';
  includeMetrics: boolean;
  includeFeedback: boolean;
  customizations?: {
    template?: string;
    style?: string;
    sections?: string[];
  };
}

export interface SimulatedPersona {
  name: string;
  role: string;
  company: string;
  interests: string[];
  expertise: string[];
  communicationStyle: 'formal' | 'casual' | 'technical';
  questions: string[];
}
