import React, { useState, useEffect } from 'react';
import { FocusInsightDashboard } from './components/FocusInsightDashboard';
import { TaskBreakdownCard } from './components/TaskBreakdownCard';
import { neuroFocusEngine } from './core/NeuroFocusEngine';
import { progressManager } from './core/ProgressManager';
import type { EmotionalResponse, FocusTask } from './core/types';

export const App: React.FC = () => {
  const [currentTask, setCurrentTask] = useState<FocusTask | null>(null);

  useEffect(() => {
    // Load initial task
    const initialTask: FocusTask = {
      id: 'task-1',
      title: 'Matematik Problemini Çözelim',
      description: 'Bu problemi birlikte, adım adım çözeceğiz. Her adımda yanındayım!',
      difficulty: 2,
      steps: [
        {
          step: 'Problemi sessizce oku',
          duration: '1 dakika',
          support: 'Acele etmene gerek yok, sadece tanış',
        },
        {
          step: 'Önemli bilgileri yuvarlak içine al',
          duration: '2 dakika',
          support: 'Hangi sayıları kullanacağız?',
        },
        {
          step: 'Ne bulmamız gerekiyor?',
          duration: '1 dakika',
          support: 'Soruyu kendi cümlelerinle anlat',
        },
      ],
      emotionalSupport: [
        'Her adımda yanındayım!',
        'İstediğin kadar deneyebilirsin',
        'Birlikte başaracağız!',
      ],
      adaptiveHints: [
        'Sayıları daha küçük tutarak deneyelim',
        'Bir çizim yapalım mı?',
        'Benzer bir örnek çözelim',
      ],
    };

    setCurrentTask(initialTask);
  }, []);

  const handleEmotionChange = async (emotion: EmotionalResponse) => {
    await progressManager.recordEmotionalState(emotion);
  };

  const handleTaskComplete = async (taskId: string) => {
    if (currentTask) {
      await progressManager.recordAchievement(currentTask, {
        completedSteps: currentTask.steps.length,
        totalSteps: currentTask.steps.length,
        celebrations: [],
        currentStreak: 1,
      });
    }
    // Here you would typically load the next task
    // For MVP, we'll just show a completion message
    setCurrentTask(null);
  };

  return (
    <div className="app-container">
      <FocusInsightDashboard />

      {currentTask ? (
        <TaskBreakdownCard
          task={currentTask}
          onEmotionChange={handleEmotionChange}
          onTaskComplete={handleTaskComplete}
        />
      ) : (
        <div className="completion-message">
          <h2>🌟 Harika İş Başardın!</h2>
          <p>Bugünkü çalışmamızı tamamladık. Seninle gurur duyuyorum!</p>
        </div>
      )}

      <style jsx>{`
        .app-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .completion-message {
          background: white;
          border-radius: 20px;
          padding: 32px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          margin: 20px auto;
          max-width: 500px;
        }

        .completion-message h2 {
          color: #6b4423;
          font-size: 28px;
          margin: 0 0 16px;
          font-family: 'Comic Sans MS', cursive;
        }

        .completion-message p {
          color: #8d6e63;
          font-size: 18px;
          margin: 0;
        }

        @media (max-width: 768px) {
          .app-container {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};
