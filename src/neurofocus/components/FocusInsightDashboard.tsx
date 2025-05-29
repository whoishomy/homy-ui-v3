import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { progressManager } from '../core/ProgressManager';
import type {
  Achievement,
  EmotionalResponse,
  DailyReflection,
  EmotionalJourneyData,
} from '../core/types';

interface InsightData {
  dominantEmotion: EmotionalResponse['type'];
  bestTimeOfDay: string;
  completionRate: number;
  streakDays: number;
  todaysAchievements: Achievement[];
  reflection: DailyReflection | null;
}

export const FocusInsightDashboard: React.FC = () => {
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInsights();
    subscribeToUpdates();

    return () => {
      progressManager.removeAllListeners('achievement:recorded');
      progressManager.removeAllListeners('emotion:recorded');
    };
  }, []);

  const loadInsights = async () => {
    setIsLoading(true);
    try {
      const snapshot = await progressManager.getProgressSnapshot();
      const todaysAchievements = await progressManager.getTodaysAchievements();

      setInsights({
        dominantEmotion: calculateDominantEmotion(snapshot.emotionalJourney),
        bestTimeOfDay: calculateBestTimeOfDay(todaysAchievements),
        completionRate: calculateCompletionRate(todaysAchievements),
        streakDays: snapshot.streaks.current,
        todaysAchievements,
        reflection: snapshot.dailyReflections[snapshot.dailyReflections.length - 1] || null,
      });
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToUpdates = () => {
    progressManager.on('achievement:recorded', () => loadInsights());
    progressManager.on('emotion:recorded', () => loadInsights());
  };

  const calculateDominantEmotion = (journey: EmotionalJourneyData): EmotionalResponse['type'] => {
    const emotions = Object.entries(journey) as [EmotionalResponse['type'], number][];
    return emotions.reduce(
      (max, [emotion, count]) =>
        count > (journey[max as keyof EmotionalJourneyData] || 0) ? emotion : max,
      'exploring' as EmotionalResponse['type']
    );
  };

  const calculateBestTimeOfDay = (achievements: Achievement[]): string => {
    if (achievements.length === 0) return 'Henüz veri yok';

    const times = achievements.map((a) => new Date(a.timestamp).getHours());
    const morning = times.filter((h) => h >= 8 && h < 12).length;
    const afternoon = times.filter((h) => h >= 12 && h < 17).length;
    const evening = times.filter((h) => h >= 17 && h < 22).length;

    if (morning >= afternoon && morning >= evening) return 'Sabah';
    if (afternoon >= morning && afternoon >= evening) return 'Öğleden Sonra';
    return 'Akşam';
  };

  const calculateCompletionRate = (achievements: Achievement[]): number => {
    if (achievements.length === 0) return 0;

    const completed = achievements.reduce((sum, a) => sum + a.steps.completed, 0);
    const total = achievements.reduce((sum, a) => sum + a.steps.total, 0);
    return (completed / total) * 100;
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="loading-spinner"
        >
          🌱
        </motion.div>
        <p>Başarılarını Topluyorum...</p>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="focus-insight-dashboard">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="insight-header"
      >
        <h2>✨ Bugünkü Yolculuğun</h2>
        {insights.streakDays > 0 && (
          <div className="streak-badge">{insights.streakDays} Gün Üst Üste! 🔥</div>
        )}
      </motion.div>

      <div className="insight-grid">
        <AnimatePresence mode="wait">
          <motion.div
            key="emotion-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="insight-card emotion-card"
          >
            <h3>Bugünkü Duygu Durumun</h3>
            <div className="emotion-display">
              {getEmotionEmoji(insights.dominantEmotion)}
              <p>{getEmotionMessage(insights.dominantEmotion)}</p>
            </div>
          </motion.div>

          <motion.div
            key="time-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="insight-card time-card"
          >
            <h3>En Verimli Zamanın</h3>
            <div className="time-display">
              {getTimeEmoji(insights.bestTimeOfDay)}
              <p>{insights.bestTimeOfDay}</p>
            </div>
          </motion.div>

          <motion.div
            key="progress-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="insight-card progress-card"
          >
            <h3>Görev Tamamlama</h3>
            <div className="progress-display">
              <motion.div
                className="progress-bar"
                initial={{ width: 0 }}
                animate={{ width: `${insights.completionRate}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
              <p>{Math.round(insights.completionRate)}%</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {insights.reflection && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="daily-reflection"
        >
          <p className="reflection-message">{insights.reflection.message}</p>
        </motion.div>
      )}

      <style jsx>{`
        .focus-insight-dashboard {
          background: linear-gradient(135deg, #fff8e1 0%, #fff 100%);
          border-radius: 20px;
          padding: 24px;
          max-width: 800px;
          margin: 20px auto;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .insight-header {
          text-align: center;
          margin-bottom: 24px;
        }

        h2 {
          color: #6b4423;
          font-size: 28px;
          margin: 0;
          font-family: 'Comic Sans MS', cursive;
        }

        .streak-badge {
          background: #ff9800;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          display: inline-block;
          margin-top: 12px;
          font-weight: bold;
        }

        .insight-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin: 24px 0;
        }

        .insight-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
        }

        h3 {
          color: #6b4423;
          font-size: 18px;
          margin: 0 0 16px;
          font-family: 'Comic Sans MS', cursive;
        }

        .emotion-display,
        .time-display {
          font-size: 32px;
          margin: 12px 0;
        }

        .emotion-display p,
        .time-display p {
          font-size: 16px;
          color: #6b4423;
          margin: 8px 0 0;
        }

        .progress-display {
          position: relative;
          height: 24px;
          background: #f5f5f5;
          border-radius: 12px;
          overflow: hidden;
          margin: 16px 0;
        }

        .progress-bar {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(90deg, #ffd54f 0%, #ffb300 100%);
          border-radius: 12px;
        }

        .progress-display p {
          position: relative;
          z-index: 1;
          color: #6b4423;
          font-weight: bold;
          margin: 4px 0 0;
        }

        .daily-reflection {
          text-align: center;
          background: #fff8e1;
          border-radius: 12px;
          padding: 16px;
          margin-top: 24px;
        }

        .reflection-message {
          color: #6b4423;
          font-size: 16px;
          margin: 0;
          font-style: italic;
        }

        .loading-container {
          text-align: center;
          padding: 40px;
        }

        .loading-spinner {
          font-size: 32px;
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  );
};

const getEmotionEmoji = (emotion: EmotionalResponse['type']): string => {
  const emojis: Record<EmotionalResponse['type'], string> = {
    exploring: '🔍',
    frustrated: '😓',
    overwhelmed: '😰',
    discouraged: '😔',
    tired: '😴',
    proud: '🌟',
    curious: '🤔',
    determined: '💪',
  };
  return emojis[emotion];
};

const getEmotionMessage = (emotion: EmotionalResponse['type']): string => {
  const messages: Record<EmotionalResponse['type'], string> = {
    exploring: 'Keşfetmeye devam!',
    frustrated: 'Biraz mola verelim mi?',
    overwhelmed: 'Adım adım ilerleyelim',
    discouraged: 'Ben yanındayım!',
    tired: 'Dinlenmek de başarıdır',
    proud: 'Seninle gurur duyuyorum!',
    curious: 'Harika sorular soruyorsun!',
    determined: 'Bu azim bambaşka!',
  };
  return messages[emotion];
};

const getTimeEmoji = (time: string): string => {
  switch (time) {
    case 'Sabah':
      return '🌅';
    case 'Öğleden Sonra':
      return '☀️';
    case 'Akşam':
      return '🌆';
    default:
      return '⏰';
  }
};
