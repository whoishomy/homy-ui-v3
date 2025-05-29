import type { InsightData } from '../engine/mergeStrategy';

export interface FocusState {
  emotionalLevel: 'ready' | 'challenged' | 'overwhelmed' | 'recovering';
  focusIntensity: number;
  lastSuccess: string | null;
  adaptivePath: string[];
}

export interface TaskBreakdown {
  step: string;
  support: string;
  duration: string;
  emotionalSupport?: string;
}

export type EmotionalResponseType =
  | 'exploring'
  | 'anxious'
  | 'hopeful'
  | 'determined'
  | 'uncertain'
  | 'confident';

export interface EmotionalResponse {
  type: EmotionalResponseType;
  intensity: number;
  timestamp: string;
  context?: Record<string, any>;
}

export interface FocusTask {
  id: string;
  title: string;
  description: string;
  steps: TaskBreakdown[];
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  emotionalContext?: EmotionalResponse;
}

export interface EmpatheticResponse {
  acknowledgment: string;
  support: string;
  nextStep: string;
  encouragement: string;
}

export interface EmotionalContext {
  currentEmotion: EmotionalResponse;
  historicalPattern?: EmotionalResponse[];
  environmentalFactors?: Record<string, any>;
  socialContext?: Record<string, any>;
}

export interface FocusJourney {
  childId: string;
  startTime: string;
  currentTask: FocusTask;
  emotionalPath: EmotionalResponse[];
  successes: string[];
  adaptations: string[];
}

export interface NeuroFocusConfig {
  emotionalSupportEnabled: boolean;
  insightGenerationEnabled: boolean;
  adaptiveLearningEnabled: boolean;
  timeWindowMs: number;
  emotionalThreshold: number;
  maxInsightsPerTask: number;
}

// Emotional Support Constants
export const EmotionalSupportLevels = {
  GENTLE: 'gentle',
  ENCOURAGING: 'encouraging',
  CELEBRATORY: 'celebratory',
  UNDERSTANDING: 'understanding',
} as const;

export const FocusStages = {
  PREPARATION: 'preparation',
  ENGAGEMENT: 'engagement',
  CHALLENGE: 'challenge',
  RECOVERY: 'recovery',
  CELEBRATION: 'celebration',
} as const;

export type EmotionalSupportLevel =
  (typeof EmotionalSupportLevels)[keyof typeof EmotionalSupportLevels];
export type FocusStage = (typeof FocusStages)[keyof typeof FocusStages];

export interface EmotionalSupportMessage {
  message: string;
  support: string;
  actions?: string[];
}

export const EmotionalSupportMessages: Record<EmotionalResponseType, EmotionalSupportMessage> = {
  exploring: {
    message: 'Merak etmen çok güzel! Bu öğrenme yolculuğunda sana yardımcı olacağım.',
    support: 'Adım adım ilerleyeceğiz. Her yeni bilgi, yeni bir keşif fırsatı.',
    actions: ['Soru sor', 'Örnek iste', 'Daha fazla bilgi al'],
  },
  anxious: {
    message: 'Zorlandığını anlıyorum. Bu çok normal ve geçici bir durum.',
    support: 'Biraz ara verelim mi? Ya da başka bir yaklaşım deneyelim.',
    actions: ['Mola ver', 'Yardım iste', 'Strateji değiştir'],
  },
  hopeful: {
    message: 'Bazen her şey fazla gelebilir. Şu an yanındayım.',
    support: 'Küçük parçalara bölelim. Bir seferde bir adım.',
    actions: ['Nefes al', 'Basitleştir', 'Önceliklendir'],
  },
  determined: {
    message: 'Bu kararlılık çok değerli. Hedefine ulaşacaksın!',
    support: 'Yanındayım. Adım adım ilerleyelim.',
    actions: ['Plan yap', 'Hedef belirle', 'Takip et'],
  },
  uncertain: {
    message: 'Motivasyonun düşük olabilir, ama bu yolculukta yalnız değilsin.',
    support: 'Şimdiye kadar başardıklarına bir bakalım. İyi gidiyorsun!',
    actions: ['Başarıları hatırla', 'Hedefi küçült', 'Destek al'],
  },
  confident: {
    message: 'Harika ilerliyorsun! Bu gururu hak ettin.',
    support: 'Bu başarını kutlayalım. Yolun açık olsun!',
    actions: ['Kutla', 'Paylaş', 'Hedef belirle'],
  },
};

export interface MicroTask {
  id: string;
  title: string;
  description: string;
  duration: string;
  celebrationMessage: string;
  supportMessage: string;
}

export interface TaskProgress {
  completedSteps: number;
  totalSteps: number;
  celebrations: CelebrationPoint[];
  currentStreak: number;
}

export interface CelebrationPoint {
  timestamp: string;
  type: 'step-start' | 'step-complete';
  message: string;
  sound: string;
  streak?: number;
}

export type NotificationStyle = 'gentle' | 'encouraging' | 'celebrating' | 'energizing';

export interface Reminder {
  id: string;
  task: string;
  scheduledTime: string;
  status: 'scheduled' | 'active' | 'completed' | 'postponed';
  attempts: number;
  emotionalContext: string;
  notificationStyle: NotificationStyle;
}

export interface ReminderPreference {
  notifyBefore: number;
  allowPostpone: boolean;
  notificationStyle: NotificationStyle;
  quietHours: {
    start: string;
    end: string;
  };
}

export interface Achievement {
  id: string;
  timestamp: string;
  taskId: string;
  emotionalState: EmotionalResponse['type'];
  duration: number;
  steps: {
    completed: number;
    total: number;
  };
}

export interface DailyReflection {
  date: string;
  achievements: number;
  dominantEmotion: EmotionalResponse['type'];
  message: string;
}

export interface EmotionalJourneyData {
  exploring: number;
  anxious: number;
  hopeful: number;
  determined: number;
  uncertain: number;
  confident: number;
}

export interface NeuroFocusMemory {
  type: 'emotion_log' | 'task_progress' | 'insight';
  taskId: string;
  timestamp: string;
  emotion?: EmotionalResponseType;
  progress?: number;
  insight?: InsightData;
}

export interface NeuroFocusState {
  currentTask?: FocusTask;
  currentStep?: TaskBreakdown;
  emotionalState?: EmotionalResponse;
  insights: InsightData[];
  progress: number;
  startTime?: string;
  endTime?: string;
}

export type NeuroFocusEvent =
  | 'journey:starting'
  | 'journey:progress'
  | 'journey:complete'
  | 'emotion:expressed'
  | 'insights:updated'
  | 'state:changed';
