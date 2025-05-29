import { NeuroFocusMemory, EmotionalResponse, TaskBreakdown } from '../core/types';

export interface ErenSnapshot {
  timestamp: string;
  emotionalState: EmotionalResponse;
  achievement?: {
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    completionTime: number;
  };
  supportMessage?: string;
}

export interface ErenProgress {
  dailyEmotionalJourney: ErenSnapshot[];
  completedTasks: number;
  totalFocusTime: number;
  breakthroughs: Array<{
    date: string;
    description: string;
    emotionalImpact: string;
  }>;
  supportHistory: Array<{
    trigger: string;
    response: string;
    effectiveness: number;
  }>;
}

export class ErenMemoryStore {
  private memories: NeuroFocusMemory[] = [];
  private progress: ErenProgress = {
    dailyEmotionalJourney: [],
    completedTasks: 0,
    totalFocusTime: 0,
    breakthroughs: [],
    supportHistory: [],
  };

  async recordEmotionalSnapshot(
    emotion: EmotionalResponse,
    context?: { taskId: string; supportMessage?: string }
  ): Promise<void> {
    const snapshot: ErenSnapshot = {
      timestamp: new Date().toISOString(),
      emotionalState: emotion,
      supportMessage: context?.supportMessage,
    };

    this.progress.dailyEmotionalJourney.push(snapshot);

    // Emit real-time event for UI updates
    this.emitProgressUpdate('emotional-snapshot', snapshot);
  }

  async recordBreakthrough(description: string, emotionalImpact: string): Promise<void> {
    const breakthrough = {
      date: new Date().toISOString(),
      description,
      emotionalImpact,
    };

    this.progress.breakthroughs.push(breakthrough);
    this.emitProgressUpdate('breakthrough', breakthrough);
  }

  async recordSupportInteraction(
    trigger: string,
    response: string,
    effectiveness: number
  ): Promise<void> {
    const interaction = {
      trigger,
      response,
      effectiveness,
    };

    this.progress.supportHistory.push(interaction);
    this.emitProgressUpdate('support-interaction', interaction);
  }

  async getDailyProgress(): Promise<{
    dominantEmotion: string;
    improvements: string[];
    supportEffectiveness: number;
  }> {
    const today = new Date().toISOString().split('T')[0];
    const todaySnapshots = this.progress.dailyEmotionalJourney.filter((snapshot) =>
      snapshot.timestamp.startsWith(today)
    );

    // Analyze emotional journey
    const emotions = todaySnapshots.map((s) => s.emotionalState.type);
    const dominantEmotion = this.findDominantEmotion(emotions);

    // Calculate support effectiveness
    const todaySupport = this.progress.supportHistory.filter((s) => s.trigger.startsWith(today));
    const avgEffectiveness =
      todaySupport.reduce((sum, s) => sum + s.effectiveness, 0) / (todaySupport.length || 1);

    return {
      dominantEmotion,
      improvements: this.identifyImprovements(todaySnapshots),
      supportEffectiveness: avgEffectiveness,
    };
  }

  private findDominantEmotion(emotions: string[]): string {
    const counts = emotions.reduce(
      (acc, emotion) => {
        acc[emotion] = (acc[emotion] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';
  }

  private identifyImprovements(snapshots: ErenSnapshot[]): string[] {
    const improvements: string[] = [];

    // Analyze emotional transitions
    for (let i = 1; i < snapshots.length; i++) {
      const prev = snapshots[i - 1].emotionalState.type;
      const curr = snapshots[i].emotionalState.type;

      if (
        (prev === 'overwhelmed' && curr === 'determined') ||
        (prev === 'frustrated' && curr === 'curious') ||
        (prev === 'tired' && curr === 'exploring')
      ) {
        improvements.push(
          `Duygusal geçiş: ${prev} durumundan ${curr} durumuna ilerleme kaydedildi.`
        );
      }
    }

    return improvements;
  }

  private emitProgressUpdate(type: string, data: any): void {
    // Event emitter implementation for real-time updates
    window.dispatchEvent(
      new CustomEvent('eren-progress', {
        detail: { type, data },
      })
    );
  }
}

// Export singleton instance
export const erenMemoryStore = new ErenMemoryStore();
