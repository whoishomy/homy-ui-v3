import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { progressManager } from '../core/ProgressManager';
import type { Achievement, DailyReflection } from '../core/types';

interface SuccessTimelineProps {
  onAchievementClick?: (achievement: Achievement) => void;
}

export const SuccessTimeline: React.FC<SuccessTimelineProps> = ({ onAchievementClick }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [reflection, setReflection] = useState<DailyReflection | null>(null);
  const [streakCount, setStreakCount] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    loadTodaysProgress();
    subscribeToProgressUpdates();

    return () => {
      // Cleanup subscriptions
      progressManager.removeAllListeners('achievement:recorded');
      progressManager.removeAllListeners('reflection:created');
    };
  }, []);

  const loadTodaysProgress = async () => {
    const todaysAchievements = await progressManager.getTodaysAchievements();
    setAchievements(todaysAchievements);

    const snapshot = await progressManager.getProgressSnapshot();
    setStreakCount(snapshot.streaks.current);
  };

  const subscribeToProgressUpdates = () => {
    progressManager.on('achievement:recorded', ({ achievement, streaks }) => {
      setAchievements((prev) => [...prev, achievement]);
      setStreakCount(streaks.current);
      triggerCelebrationAnimation();
    });

    progressManager.on('reflection:created', (newReflection) => {
      setReflection(newReflection);
    });
  };

  const triggerCelebrationAnimation = async () => {
    await controls.start({
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0],
      transition: { duration: 0.5 },
    });
  };

  const achievementVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    }),
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojis = {
      exploring: '🔍',
      frustrated: '😓',
      overwhelmed: '😰',
      discouraged: '😔',
      tired: '😴',
      proud: '🌟',
      curious: '🤔',
      determined: '💪',
    };
    return emojis[emotion as keyof typeof emojis] || '✨';
  };

  return (
    <div className="success-timeline" role="region" aria-label="Başarı Haritası">
      <motion.div
        className="timeline-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="timeline-title">✨ Bugünkü Yolculuğun</h3>
        {streakCount > 0 && (
          <motion.div className="streak-counter" animate={controls}>
            {streakCount} Gün Üst Üste! 🔥
          </motion.div>
        )}
      </motion.div>

      <div className="timeline-container">
        <AnimatePresence mode="popLayout">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              variants={achievementVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              custom={index}
              className="achievement-card"
              onClick={() => onAchievementClick?.(achievement)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="achievement-icon">{getEmotionEmoji(achievement.emotionalState)}</div>

              <div className="achievement-content">
                <motion.div
                  className="achievement-progress"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(achievement.steps.completed / achievement.steps.total) * 100}%`,
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />

                <p className="achievement-title">
                  {achievement.steps.completed}/{achievement.steps.total} Adım Tamamlandı!
                </p>

                <time className="achievement-time">
                  {new Date(achievement.timestamp).toLocaleTimeString('tr-TR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </div>

              <motion.div
                className="achievement-sparkle"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                ✨
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {reflection && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="daily-reflection"
        >
          <p className="reflection-message">{reflection.message}</p>
          <div className="reflection-emotion">
            Bugün çoğunlukla {getEmotionEmoji(reflection.dominantEmotion)}
          </div>
        </motion.div>
      )}

      <style jsx>{`
        .success-timeline {
          background: linear-gradient(135deg, #fff8e1 0%, #fff 100%);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          max-width: 400px;
          margin: 20px auto;
          font-family: 'Comic Sans MS', cursive;
        }

        .timeline-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .timeline-title {
          color: #6b4423;
          font-size: 24px;
          margin: 0;
        }

        .streak-counter {
          background: #ff9800;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          display: inline-block;
          margin-top: 12px;
          font-weight: bold;
        }

        .timeline-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .achievement-card {
          background: white;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .achievement-icon {
          font-size: 24px;
          min-width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff8e1;
          border-radius: 50%;
          z-index: 2;
        }

        .achievement-content {
          flex: 1;
          position: relative;
          z-index: 2;
        }

        .achievement-progress {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: rgba(255, 152, 0, 0.1);
          border-radius: 8px;
          z-index: 1;
        }

        .achievement-title {
          color: #6b4423;
          margin: 0;
          font-size: 16px;
          font-weight: bold;
        }

        .achievement-time {
          color: #a1887f;
          font-size: 12px;
          display: block;
          margin-top: 4px;
        }

        .achievement-sparkle {
          position: absolute;
          top: -10px;
          right: -10px;
          font-size: 24px;
          transform-origin: center;
        }

        .daily-reflection {
          text-align: center;
          margin-top: 24px;
          padding: 16px;
          background: #fff8e1;
          border-radius: 12px;
          color: #6b4423;
        }

        .reflection-message {
          font-size: 16px;
          margin: 0 0 8px;
        }

        .reflection-emotion {
          font-size: 14px;
          color: #a1887f;
        }
      `}</style>
    </div>
  );
};
