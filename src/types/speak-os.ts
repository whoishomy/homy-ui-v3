export type PracticeMode = 'conversation' | 'pitch' | 'technical';

export interface SpeakFeedback {
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
    feedback?: SpeakFeedback;
  }[];
  context?: {
    topic?: string;
    audience?: string;
    complexity?: 'basic' | 'intermediate' | 'advanced';
  };
}

export interface VoiceRecording {
  id: string;
  url: string;
  duration: number;
  timestamp: string;
  transcription?: string;
}

export interface PracticeStats {
  totalSessions: number;
  totalDuration: number;
  modeStats: Record<
    PracticeMode,
    {
      sessionsCount: number;
      averageDuration: number;
      averageMetrics: SpeakFeedback['metrics'];
    }
  >;
  recentImprovements: {
    category: keyof SpeakFeedback['metrics'];
    change: number;
    timestamp: string;
  }[];
}

export interface ExportFormat {
  type: 'slides' | 'readme' | 'prompts';
  includeMetrics: boolean;
  includeFeedback: boolean;
  customizations?: {
    template?: string;
    style?: string;
    sections?: string[];
  };
}
