import { EventEmitter } from 'events';
import type {
  NeuroFocusConfig,
  NeuroFocusState,
  NeuroFocusEvent,
  NeuroFocusMemory,
  FocusTask,
  EmotionalResponse,
  TaskBreakdown,
} from './types';
import { mergeStrategy } from '../engine/mergeStrategy';
import type { InsightData } from '../engine/mergeStrategy';

const DEFAULT_CONFIG: NeuroFocusConfig = {
  emotionalSupportEnabled: true,
  insightGenerationEnabled: true,
  adaptiveLearningEnabled: true,
  timeWindowMs: 24 * 60 * 60 * 1000, // 24 hours
  emotionalThreshold: 0.7,
  maxInsightsPerTask: 5,
};

class NeuroFocusEngine extends EventEmitter {
  private config: NeuroFocusConfig;
  private state: NeuroFocusState;
  private memory: NeuroFocusMemory[];

  constructor(config: Partial<NeuroFocusConfig> = {}) {
    super();
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.state = {
      insights: [],
      progress: 0,
    };
    this.memory = [];
  }

  public startFocusJourney(taskTitle: string): void {
    const task: FocusTask = {
      id: `task-${Date.now()}`,
      title: taskTitle,
      description: 'Focus journey started',
      steps: this.generateInitialSteps(taskTitle),
      duration: '25 minutes',
      difficulty: 'medium',
      tags: ['focus', 'learning'],
    };

    this.state.currentTask = task;
    this.state.startTime = new Date().toISOString();
    this.state.progress = 0;

    this.emit('journey:starting', {
      taskId: task.id,
      firstStep: task.steps[0],
      timestamp: this.state.startTime,
    });
  }

  private generateInitialSteps(taskTitle: string): TaskBreakdown[] {
    return [
      {
        step: 'Hazırlık',
        support: 'Rahat bir pozisyon al ve derin bir nefes al.',
        duration: '2 minutes',
      },
      {
        step: `"${taskTitle}" üzerine odaklan`,
        support: 'Dikkatini dağıtabilecek şeyleri uzaklaştır.',
        duration: '20 minutes',
      },
      {
        step: 'Değerlendirme',
        support: 'Ne öğrendin? Nasıl hissettin?',
        duration: '3 minutes',
      },
    ];
  }

  public writeMemory(memory: NeuroFocusMemory): void {
    this.memory.push(memory);

    if (memory.insight) {
      this.processNewInsight(memory.insight);
    }

    if (memory.emotion) {
      this.processEmotionalResponse(memory.emotion);
    }

    if (memory.progress !== undefined) {
      this.updateProgress(memory.progress);
    }
  }

  private processNewInsight(insight: InsightData): void {
    // Add the new insight to the state
    this.state.insights = mergeStrategy.mergeInsights([...this.state.insights, insight]);

    // Emit the updated insights
    this.emit('insights:updated', this.state.insights);

    // Generate adaptive recommendations if enabled
    if (this.config.adaptiveLearningEnabled) {
      this.generateAdaptiveRecommendations();
    }
  }

  private processEmotionalResponse(emotion: EmotionalResponse['type']): void {
    if (!this.config.emotionalSupportEnabled) return;

    // Update emotional state
    this.state.emotionalState = {
      type: emotion,
      intensity: 1,
      timestamp: new Date().toISOString(),
    };

    // Generate emotional support insight if threshold is met
    if (this.shouldGenerateEmotionalSupport()) {
      this.generateEmotionalSupportInsight();
    }

    this.emit('state:changed', this.state);
  }

  private shouldGenerateEmotionalSupport(): boolean {
    if (!this.state.emotionalState) return false;

    const emotionalStates = this.memory
      .filter((m) => m.emotion)
      .map((m) => m.emotion)
      .slice(-3);

    // Check if the same emotion persists
    return emotionalStates.length >= 2 && emotionalStates.every((e) => e === emotionalStates[0]);
  }

  private generateEmotionalSupportInsight(): void {
    if (!this.state.emotionalState || !this.state.currentTask) return;

    const supportInsight: InsightData = {
      id: `support-${Date.now()}`,
      source: 'system',
      timestamp: new Date().toISOString(),
      content: {
        title: 'Duygusal Destek',
        description: `${this.state.emotionalState.type} durumunda olduğunu fark ettim. Birlikte ilerleyelim.`,
        type: 'note',
      },
      metadata: {
        emotionalContext: {
          type: this.state.emotionalState.type,
          intensity: this.state.emotionalState.intensity,
        },
        tags: ['emotional-support', this.state.emotionalState.type],
        relatedTasks: [this.state.currentTask.id],
      },
    };

    this.processNewInsight(supportInsight);
  }

  private generateAdaptiveRecommendations(): void {
    if (!this.state.currentTask) return;

    // Analyze recent memory and insights to generate recommendations
    const recentMemory = this.memory.slice(-10);
    const emotionalTrend = this.analyzeEmotionalTrend(recentMemory);
    const progressRate = this.calculateProgressRate();

    if (emotionalTrend === 'negative' || progressRate < 0.3) {
      const adaptiveInsight: InsightData = {
        id: `adaptive-${Date.now()}`,
        source: 'ai',
        timestamp: new Date().toISOString(),
        content: {
          title: 'Öğrenme Stratejisi Önerisi',
          description: this.generateAdaptiveStrategy(emotionalTrend, progressRate),
          type: 'note',
        },
        metadata: {
          tags: ['adaptive-learning', 'strategy'],
          relatedTasks: [this.state.currentTask.id],
        },
      };

      this.processNewInsight(adaptiveInsight);
    }
  }

  private analyzeEmotionalTrend(
    recentMemory: NeuroFocusMemory[]
  ): 'positive' | 'neutral' | 'negative' {
    const negativeEmotions = ['frustrated', 'overwhelmed', 'discouraged', 'tired'];
    const positiveEmotions = ['proud', 'curious', 'determined', 'exploring'];

    const emotions = recentMemory
      .filter((m) => m.emotion)
      .map((m) => m.emotion as EmotionalResponse['type']);

    if (emotions.length === 0) return 'neutral';

    const negativeCount = emotions.filter((e) => negativeEmotions.includes(e)).length;
    const positiveCount = emotions.filter((e) => positiveEmotions.includes(e)).length;

    if (negativeCount > positiveCount) return 'negative';
    if (positiveCount > negativeCount) return 'positive';
    return 'neutral';
  }

  private calculateProgressRate(): number {
    if (!this.state.startTime) return 0;

    const startTime = new Date(this.state.startTime).getTime();
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    const expectedDuration = 25 * 60 * 1000; // 25 minutes in milliseconds

    return Math.min(elapsedTime / expectedDuration, 1);
  }

  private generateAdaptiveStrategy(
    emotionalTrend: 'positive' | 'neutral' | 'negative',
    progressRate: number
  ): string {
    if (emotionalTrend === 'negative' && progressRate < 0.3) {
      return 'Görünüşe göre zorlanıyorsun. Daha küçük parçalara bölerek ilerlemeni öneriyorum.';
    }

    if (emotionalTrend === 'negative') {
      return 'Biraz mola vermek ve farklı bir yaklaşım denemek ister misin?';
    }

    if (progressRate < 0.3) {
      return 'İlerlemen yavaş görünüyor. Belki farklı bir öğrenme tekniği deneyebiliriz.';
    }

    return 'Şu anki stratejin iyi görünüyor. Aynı şekilde devam et!';
  }

  public updateProgress(progress: number): void {
    this.state.progress = Math.min(Math.max(progress, 0), 1);

    if (this.state.progress >= 1) {
      this.completeFocusJourney();
    }

    this.emit('journey:progress', {
      progress: this.state.progress,
      timestamp: new Date().toISOString(),
    });
  }

  private completeFocusJourney(): void {
    this.state.endTime = new Date().toISOString();

    this.emit('journey:complete', {
      taskId: this.state.currentTask?.id,
      duration: this.calculateJourneyDuration(),
      insights: this.state.insights,
      emotionalJourney: this.summarizeEmotionalJourney(),
    });
  }

  private calculateJourneyDuration(): string {
    if (!this.state.startTime || !this.state.endTime) return '0 minutes';

    const start = new Date(this.state.startTime).getTime();
    const end = new Date(this.state.endTime).getTime();
    const durationMinutes = Math.round((end - start) / (60 * 1000));

    return `${durationMinutes} minutes`;
  }

  private summarizeEmotionalJourney(): Record<EmotionalResponse['type'], number> {
    const summary: Partial<Record<EmotionalResponse['type'], number>> = {};

    this.memory
      .filter((m) => m.emotion)
      .forEach((m) => {
        if (m.emotion) {
          summary[m.emotion] = (summary[m.emotion] || 0) + 1;
        }
      });

    return summary as Record<EmotionalResponse['type'], number>;
  }
}

// Export singleton instance
export const neuroFocusEngine = new NeuroFocusEngine();
