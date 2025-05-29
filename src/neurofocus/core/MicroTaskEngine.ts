import { EventEmitter } from 'events';
import type { MicroTask, TaskProgress, CelebrationPoint } from './types';

export class MicroTaskEngine extends EventEmitter {
  private readonly CELEBRATION_SOUNDS = {
    small: '🎵', // Soft chime
    medium: '🎶', // Cheerful melody
    big: '🎊', // Victory fanfare
  } as const;

  private currentProgress: TaskProgress = {
    completedSteps: 0,
    totalSteps: 0,
    celebrations: [],
    currentStreak: 0,
  };

  constructor() {
    super();
    this.initializeCelebrationSystem();
  }

  private initializeCelebrationSystem() {
    this.on('step:completed', this.celebrateProgress);
    this.on('milestone:reached', this.triggerSpecialCelebration);
    this.on('streak:continued', this.acknowledgePersistence);
  }

  public async breakDownTask(task: string): Promise<MicroTask[]> {
    // Break task into three encouraging steps
    return [
      {
        id: 'start',
        title: '🌱 Başlangıç Adımı',
        description: 'Sadece bir göz at, acele yok',
        duration: '1 dakika',
        celebrationMessage: 'İlk adımı attın! Harika başlangıç! 🌟',
        supportMessage: 'Bu adımda sadece bakmak yeterli',
      },
      {
        id: 'explore',
        title: '🔍 Keşif Adımı',
        description: 'Anladığın kısmı söyle',
        duration: '2 dakika',
        celebrationMessage: 'Keşfetmeye devam! Çok iyi gidiyorsun! ⭐',
        supportMessage: 'Her kelime bir hazine, acele etme',
      },
      {
        id: 'achieve',
        title: '🎯 Başarı Adımı',
        description: 'Şimdi birlikte yapalım',
        duration: '3 dakika',
        celebrationMessage: 'İŞTE BAŞARDIN! Seninle gurur duyuyorum! 🎉',
        supportMessage: 'Son adımdasın, birlikte yapacağız',
      },
    ];
  }

  public async startStep(stepId: string) {
    const celebrationPoint: CelebrationPoint = {
      timestamp: new Date().toISOString(),
      type: 'step-start',
      message: 'Harika! Başlıyoruz!',
      sound: this.CELEBRATION_SOUNDS.small,
    };

    this.emit('step:started', {
      stepId,
      celebration: celebrationPoint,
      encouragement: 'Her başlangıç yeni bir macera!',
    });
  }

  public async completeStep(stepId: string) {
    this.currentProgress.completedSteps++;
    this.currentProgress.currentStreak++;

    const celebration = this.generateCelebration(stepId);
    this.currentProgress.celebrations.push(celebration);

    this.emit('step:completed', {
      stepId,
      progress: this.currentProgress,
      celebration,
    });

    if (this.currentProgress.currentStreak >= 3) {
      this.emit('streak:continued', {
        streakCount: this.currentProgress.currentStreak,
        message: 'Üst üste başarı! Sen bir harikasın! 🌟',
      });
    }
  }

  private generateCelebration(stepId: string): CelebrationPoint {
    const celebrations = {
      start: {
        message: 'İlk adımı attın! 🌱',
        sound: this.CELEBRATION_SOUNDS.small,
      },
      explore: {
        message: 'Keşif tamamlandı! 🔍',
        sound: this.CELEBRATION_SOUNDS.medium,
      },
      achieve: {
        message: 'BAŞARDIN! 🎯',
        sound: this.CELEBRATION_SOUNDS.big,
      },
    };

    return {
      timestamp: new Date().toISOString(),
      type: 'step-complete',
      ...celebrations[stepId as keyof typeof celebrations],
      streak: this.currentProgress.currentStreak,
    };
  }

  private async celebrateProgress(data: { stepId: string; progress: TaskProgress }) {
    const { completedSteps, totalSteps } = data.progress;
    const progressPercentage = (completedSteps / totalSteps) * 100;

    let celebrationMessage = '';
    if (progressPercentage <= 33) {
      celebrationMessage = 'Harika bir başlangıç! 🌱';
    } else if (progressPercentage <= 66) {
      celebrationMessage = 'Yarıyı geçtin! Müthiş ilerleme! ⭐';
    } else {
      celebrationMessage = 'Neredeyse tamamladın! İnanılmazsın! 🎉';
    }

    this.emit('progress:celebrated', {
      message: celebrationMessage,
      progress: progressPercentage,
      sound: this.CELEBRATION_SOUNDS.medium,
    });
  }

  private async triggerSpecialCelebration(milestone: string) {
    const specialMessage = 'Bu çok özel bir an! Sen gerçekten inanılmazsın! 🌟';

    this.emit('special:celebration', {
      milestone,
      message: specialMessage,
      sound: this.CELEBRATION_SOUNDS.big,
      confetti: true,
    });
  }

  private async acknowledgePersistence(data: { streakCount: number }) {
    const streakMessages = [
      '3 adım üst üste! Süper gidiyorsun! 🌟',
      '5 adım oldu! Sen bir şampiyonsun! 🏆',
      '7 adım! İnanılmaz bir başarı serisi! 👑',
    ];

    const messageIndex = Math.min(Math.floor(data.streakCount / 2) - 1, streakMessages.length - 1);

    this.emit('streak:celebrated', {
      message: streakMessages[messageIndex],
      streakCount: data.streakCount,
      sound: this.CELEBRATION_SOUNDS.big,
    });
  }
}

export const microTaskEngine = new MicroTaskEngine();
