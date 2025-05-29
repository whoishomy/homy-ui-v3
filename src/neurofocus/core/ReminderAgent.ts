import { EventEmitter } from 'events';
import type { Reminder, ReminderPreference, NotificationStyle } from './types';

export class ReminderAgent extends EventEmitter {
  private readonly REMINDER_STYLES: Record<NotificationStyle, string> = {
    gentle: '🌱',
    encouraging: '💫',
    celebrating: '🎉',
    energizing: '⚡️',
  };

  private preferences: ReminderPreference = {
    notifyBefore: 10, // minutes
    allowPostpone: true,
    notificationStyle: 'gentle',
    quietHours: {
      start: '22:00',
      end: '08:00',
    },
  };

  constructor() {
    super();
    this.initializeReminderSystem();
  }

  private initializeReminderSystem() {
    this.on('reminder:scheduled', this.prepareNotification);
    this.on('reminder:triggered', this.sendNotification);
    this.on('reminder:postponed', this.handlePostponement);
  }

  public async scheduleReminder(task: string, scheduledTime: Date): Promise<Reminder> {
    const reminder: Reminder = {
      id: crypto.randomUUID(),
      task,
      scheduledTime: scheduledTime.toISOString(),
      status: 'scheduled',
      attempts: 0,
      emotionalContext: await this.getEmotionalContext(),
      notificationStyle: this.determineNotificationStyle(),
    };

    this.emit('reminder:scheduled', reminder);
    return reminder;
  }

  private async prepareNotification(reminder: Reminder) {
    const scheduledTime = new Date(reminder.scheduledTime);
    const now = new Date();
    const timeUntilTask = scheduledTime.getTime() - now.getTime();

    if (timeUntilTask > 0) {
      // Schedule early reminder
      setTimeout(
        () => {
          this.sendEarlyReminder(reminder);
        },
        timeUntilTask - this.preferences.notifyBefore * 60 * 1000
      );

      // Schedule main reminder
      setTimeout(() => {
        this.emit('reminder:triggered', reminder);
      }, timeUntilTask);
    }
  }

  private async sendEarlyReminder(reminder: Reminder) {
    const message = this.generateEarlyReminderMessage(reminder);

    this.emit('notification:early', {
      title: '🌱 Az Sonra Başlıyoruz!',
      message,
      actions: ['Hazırım!', 'Biraz Erteleyebilir miyiz?'],
    });
  }

  private async sendNotification(reminder: Reminder) {
    if (this.isInQuietHours()) {
      this.postponeToActiveHours(reminder);
      return;
    }

    const message = this.generateReminderMessage(reminder);
    const icon = this.REMINDER_STYLES[reminder.notificationStyle];

    this.emit('notification:send', {
      title: `${icon} ${reminder.task}`,
      message,
      actions: ['Başlayalım!', '10 Dakika Sonra', 'Bugün Başka Zaman'],
    });
  }

  private async handlePostponement(reminder: Reminder, duration: number) {
    reminder.attempts += 1;
    reminder.status = 'postponed';

    const newTime = new Date(Date.now() + duration * 60 * 1000);
    reminder.scheduledTime = newTime.toISOString();

    this.emit('reminder:rescheduled', {
      ...reminder,
      message: this.generatePostponementMessage(reminder),
    });
  }

  private generateEarlyReminderMessage(reminder: Reminder): string {
    const messages = [
      '10 dakika sonra seninleyim! Hazırlanmak ister misin? 🌱',
      'Az sonra küçük bir maceraya çıkıyoruz! 🎯',
      'Birazdan birlikte çalışacağız! Heyecanlı mısın? ✨',
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }

  private generateReminderMessage(reminder: Reminder): string {
    const baseMessages = {
      gentle: [
        'Hazır olduğunda başlayabiliriz. Acele yok! 🌱',
        'Seninle çalışmak için buradayım. Ne dersin? 🤝',
        'Küçük bir adımla başlayalım mı? 🍃',
      ],
      encouraging: [
        'Dün harika iş çıkardın! Bugün de yapabilirsin! 💫',
        'Yeni başarılara hazır mısın? Hadi başlayalım! ⭐️',
        'Bu görevi birlikte halledeceğiz! 🌟',
      ],
      celebrating: [
        'Yeni bir başarı hikayesi yazmaya hazır mısın? 🎉',
        'Bugün kendini şaşırtabilirsin! Deneyelim mi? 🎯',
        'Seninle gurur duyuyorum! Hadi devam edelim! 🏆',
      ],
      energizing: [
        'Enerjin yüksek! Tam zamanı! ⚡️',
        'Bugün harika şeyler başaracaksın! 💪',
        'Hazırsan başlıyoruz! 🚀',
      ],
    };

    const messages = baseMessages[reminder.notificationStyle];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  private generatePostponementMessage(reminder: Reminder): string {
    const messages = [
      'Anlıyorum, biraz daha zamana ihtiyacın var. Ben buradayım! 🫂',
      'Sorun değil! Hazır olduğunda tekrar geleceğim. 🌱',
      'Dinlenmek de önemli! Sonra tekrar deneriz. 💫',
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }

  private async getEmotionalContext(): Promise<string> {
    // TODO: Integrate with NeuroFocusEngine to get current emotional state
    return 'exploring';
  }

  private determineNotificationStyle(): NotificationStyle {
    const hour = new Date().getHours();

    if (hour < 10) return 'gentle';
    if (hour < 14) return 'energizing';
    if (hour < 18) return 'encouraging';
    return 'gentle';
  }

  private isInQuietHours(): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    const [quietStart] = this.preferences.quietHours.start.split(':').map(Number);
    const [quietEnd] = this.preferences.quietHours.end.split(':').map(Number);

    return currentHour >= quietStart || currentHour < quietEnd;
  }

  private async postponeToActiveHours(reminder: Reminder) {
    const [activeHour] = this.preferences.quietHours.end.split(':').map(Number);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(activeHour, 0, 0, 0);

    reminder.scheduledTime = tomorrow.toISOString();
    this.emit('reminder:postponed', reminder, 'quiet-hours');
  }
}

export const reminderAgent = new ReminderAgent();
