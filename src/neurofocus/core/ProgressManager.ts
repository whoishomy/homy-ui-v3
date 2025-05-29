import { EventEmitter } from 'events';
import type { EmotionalResponse, FocusTask, TaskProgress } from './types';

interface ProgressSnapshot {
  achievements: Achievement[];
  emotionalJourney: EmotionalJourneyData;
  streaks: StreakData;
  dailyReflections: DailyReflection[];
}

interface Achievement {
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

interface EmotionalJourneyData {
  exploring: number;
  frustrated: number;
  overwhelmed: number;
  discouraged: number;
  tired: number;
  proud: number;
  curious: number;
  determined: number;
}

interface StreakData {
  current: number;
  best: number;
  lastUpdated: string;
}

interface DailyReflection {
  date: string;
  achievements: number;
  dominantEmotion: EmotionalResponse['type'];
  message: string;
}

export class ProgressManager extends EventEmitter {
  private progressData: ProgressSnapshot = {
    achievements: [],
    emotionalJourney: {
      exploring: 0,
      frustrated: 0,
      overwhelmed: 0,
      discouraged: 0,
      tired: 0,
      proud: 0,
      curious: 0,
      determined: 0,
    },
    streaks: {
      current: 0,
      best: 0,
      lastUpdated: new Date().toISOString(),
    },
    dailyReflections: [],
  };

  constructor() {
    super();
    this.initializeProgressTracking();
  }

  private async initializeProgressTracking() {
    try {
      await this.loadProgress();
      this.startAutoSave();
    } catch (error) {
      console.error('Progress initialization failed:', error);
      // Continue with default empty state
    }
  }

  public async recordAchievement(task: FocusTask, progress: TaskProgress): Promise<void> {
    const achievement: Achievement = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      taskId: task.id,
      emotionalState: await this.getCurrentEmotionalState(),
      duration: this.calculateTaskDuration(task),
      steps: {
        completed: progress.completedSteps,
        total: progress.totalSteps,
      },
    };

    this.progressData.achievements.push(achievement);
    await this.updateStreaks();
    await this.saveProgress();

    this.emit('achievement:recorded', {
      achievement,
      streaks: this.progressData.streaks,
    });
  }

  public async recordEmotionalState(emotion: EmotionalResponse): Promise<void> {
    this.progressData.emotionalJourney[emotion.type]++;
    await this.saveProgress();

    this.emit('emotion:recorded', {
      emotion,
      journey: this.progressData.emotionalJourney,
    });
  }

  public async createDailyReflection(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const todaysAchievements = this.progressData.achievements.filter((a) =>
      a.timestamp.startsWith(today)
    );

    const reflection: DailyReflection = {
      date: today,
      achievements: todaysAchievements.length,
      dominantEmotion: this.calculateDominantEmotion(),
      message: this.generateReflectionMessage(todaysAchievements.length),
    };

    this.progressData.dailyReflections.push(reflection);
    await this.saveProgress();

    this.emit('reflection:created', reflection);
  }

  public async getProgressSnapshot(): Promise<ProgressSnapshot> {
    return this.progressData;
  }

  public async getTodaysAchievements(): Promise<Achievement[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.progressData.achievements.filter((a) => a.timestamp.startsWith(today));
  }

  private async updateStreaks(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const lastUpdate = new Date(this.progressData.streaks.lastUpdated).toISOString().split('T')[0];

    if (today === lastUpdate) {
      // Already updated today, just increment
      this.progressData.streaks.current++;
    } else if (this.isConsecutiveDay(lastUpdate, today)) {
      // Yesterday's streak continues
      this.progressData.streaks.current++;
    } else {
      // Streak broken, start new
      this.progressData.streaks.current = 1;
    }

    // Update best streak if current is higher
    if (this.progressData.streaks.current > this.progressData.streaks.best) {
      this.progressData.streaks.best = this.progressData.streaks.current;
    }

    this.progressData.streaks.lastUpdated = today;
  }

  private isConsecutiveDay(lastUpdate: string, today: string): boolean {
    const last = new Date(lastUpdate);
    const current = new Date(today);
    const diffTime = Math.abs(current.getTime() - last.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  }

  private calculateDominantEmotion(): EmotionalResponse['type'] {
    const emotions = Object.entries(this.progressData.emotionalJourney);
    return emotions.reduce(
      (max, [emotion, count]) =>
        count > (this.progressData.emotionalJourney[max as keyof EmotionalJourneyData] || 0)
          ? (emotion as EmotionalResponse['type'])
          : max,
      'exploring'
    );
  }

  private generateReflectionMessage(achievementCount: number): string {
    if (achievementCount === 0) {
      return 'Yarın yeni bir gün! Birlikte deneyelim! 🌱';
    }

    const messages = [
      'Bugün harika işler başardın! Her adımın değerli! ⭐️',
      `${achievementCount} başarı! Sen gerçekten inanılmazsın! 🌟`,
      'Seninle gurur duyuyorum! Yarın daha da iyisi için buradayım! 🎉',
    ];

    return messages[Math.min(achievementCount - 1, messages.length - 1)];
  }

  private calculateTaskDuration(task: FocusTask): number {
    return task.steps.reduce((total, step) => {
      const minutes = parseInt(step.duration.split(' ')[0]);
      return total + (isNaN(minutes) ? 0 : minutes);
    }, 0);
  }

  private async getCurrentEmotionalState(): Promise<EmotionalResponse['type']> {
    // TODO: Integrate with NeuroFocusEngine
    return 'exploring';
  }

  private async loadProgress(): Promise<void> {
    try {
      const response = await fetch('/api/progress');
      const data = await response.json();
      this.progressData = data;
    } catch (error) {
      console.error('Failed to load progress:', error);
      throw error;
    }
  }

  private async saveProgress(): Promise<void> {
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.progressData),
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
      throw error;
    }
  }

  private startAutoSave(): void {
    // Auto-save every 5 minutes
    setInterval(() => this.saveProgress(), 5 * 60 * 1000);
  }
}

export const progressManager = new ProgressManager();
