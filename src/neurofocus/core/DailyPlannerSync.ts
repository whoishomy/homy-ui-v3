import { EventEmitter } from 'events';
import { reminderAgent } from './ReminderAgent';
import type { FocusTask, EmotionalResponse } from './types';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description: string;
  colorId?: string; // Google Calendar color ID
}

export class DailyPlannerSync extends EventEmitter {
  private readonly CALENDAR_COLORS = {
    exploring: '1', // Lavender
    learning: '2', // Sage
    practice: '3', // Grape
    review: '4', // Flamingo
    break: '5', // Banana
    celebration: '6', // Tangerine
  } as const;

  private readonly TIME_BLOCKS = {
    morning: { start: '09:00', end: '12:00' },
    afternoon: { start: '14:00', end: '17:00' },
    evening: { start: '17:00', end: '19:00' },
  } as const;

  constructor() {
    super();
    this.initializeSync();
  }

  private async initializeSync() {
    // Listen for emotional state changes to adapt schedule
    reminderAgent.on('emotion:changed', this.adaptSchedule);
  }

  public async scheduleTask(task: FocusTask, preferredTime?: string): Promise<CalendarEvent> {
    const timeSlot = await this.findOptimalTimeSlot(task, preferredTime);
    const event = await this.createCalendarEvent(task, timeSlot);

    // Schedule reminder
    await reminderAgent.scheduleReminder(task.title, new Date(timeSlot.start));

    return event;
  }

  private async findOptimalTimeSlot(
    task: FocusTask,
    preferredTime?: string
  ): Promise<{ start: string; end: string }> {
    if (preferredTime) {
      return this.validateAndAdjustTimeSlot(preferredTime, task);
    }

    // Find best time based on emotional patterns and task type
    const emotionalState = await this.getCurrentEmotionalState();
    return this.suggestTimeBasedOnState(emotionalState);
  }

  private async validateAndAdjustTimeSlot(
    preferredTime: string,
    task: FocusTask
  ): Promise<{ start: string; end: string }> {
    const requestedHour = new Date(preferredTime).getHours();

    // Adjust if too early or late
    if (requestedHour < 8) {
      return {
        start: `${new Date().toDateString()} 09:00`,
        end: `${new Date().toDateString()} 10:00`,
      };
    }

    if (requestedHour > 20) {
      return {
        start: `${new Date().toDateString()} 17:00`,
        end: `${new Date().toDateString()} 18:00`,
      };
    }

    // Default 1-hour slot if time is acceptable
    return {
      start: preferredTime,
      end: new Date(new Date(preferredTime).getTime() + 60 * 60 * 1000).toISOString(),
    };
  }

  private async createCalendarEvent(
    task: FocusTask,
    timeSlot: { start: string; end: string }
  ): Promise<CalendarEvent> {
    const event: CalendarEvent = {
      id: crypto.randomUUID(),
      title: `🎯 ${task.title}`,
      start: timeSlot.start,
      end: timeSlot.end,
      description: this.generateEventDescription(task),
      colorId: this.determineEventColor(task),
    };

    // TODO: Implement actual calendar API integration
    this.emit('calendar:event:created', event);
    return event;
  }

  private generateEventDescription(task: FocusTask): string {
    return `
🌱 Odak Seansı

📝 ${task.description}

⏱️ Süre: ${this.formatDuration(task)}
🎯 Zorluk: ${this.formatDifficulty(task.difficulty)}

💫 Hatırlatıcı:
- Acele yok
- Küçük adımlarla ilerle
- Ben hep yanındayım!

#NeuroFocusCoach
    `.trim();
  }

  private formatDuration(task: FocusTask): string {
    const duration = task.steps.reduce((total, step) => {
      const minutes = parseInt(step.duration.split(' ')[0]);
      return total + (isNaN(minutes) ? 0 : minutes);
    }, 0);

    return duration < 60
      ? `${duration} dakika`
      : `${Math.floor(duration / 60)} saat ${duration % 60} dakika`;
  }

  private formatDifficulty(level: number): string {
    return '⭐'.repeat(level);
  }

  private determineEventColor(task: FocusTask): string {
    if (task.steps.length <= 2) return this.CALENDAR_COLORS.exploring;
    if (task.difficulty <= 2) return this.CALENDAR_COLORS.practice;
    if (task.difficulty <= 4) return this.CALENDAR_COLORS.learning;
    return this.CALENDAR_COLORS.review;
  }

  private async getCurrentEmotionalState(): Promise<EmotionalResponse['type']> {
    // TODO: Integrate with NeuroFocusEngine
    return 'exploring';
  }

  private async suggestTimeBasedOnState(
    emotionalState: EmotionalResponse['type']
  ): Promise<{ start: string; end: string }> {
    const now = new Date();
    const today = now.toDateString();

    switch (emotionalState) {
      case 'tired':
        // Suggest afternoon slot for more energy
        return {
          start: `${today} ${this.TIME_BLOCKS.afternoon.start}`,
          end: `${today} ${this.TIME_BLOCKS.afternoon.end}`,
        };

      case 'overwhelmed':
        // Suggest morning slot for fresh mind
        return {
          start: `${today} ${this.TIME_BLOCKS.morning.start}`,
          end: `${today} ${this.TIME_BLOCKS.morning.end}`,
        };

      case 'determined':
        // Use current time for immediate start
        const startTime = now.toISOString();
        const endTime = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
        return { start: startTime, end: endTime };

      default:
        // Default to next available morning slot
        return {
          start: `${today} ${this.TIME_BLOCKS.morning.start}`,
          end: `${today} ${this.TIME_BLOCKS.morning.end}`,
        };
    }
  }

  private async adaptSchedule(newState: EmotionalResponse) {
    if (newState.type === 'tired' || newState.type === 'overwhelmed') {
      // Automatically postpone upcoming tasks by 1 hour
      this.emit('schedule:adapted', {
        message: 'Biraz dinlenmeye ihtiyacın var gibi. Planı uyarlıyorum... 🌱',
        adjustment: 'postpone',
        duration: 60, // minutes
      });
    }
  }
}

export const dailyPlannerSync = new DailyPlannerSync();
