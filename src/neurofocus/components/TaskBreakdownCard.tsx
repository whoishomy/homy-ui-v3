import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { neuroFocusEngine } from '../core/NeuroFocusEngine';
import type { TaskBreakdown, EmotionalResponse, FocusTask } from '../core/types';

interface TaskBreakdownCardProps {
  task: FocusTask;
  onEmotionChange: (emotion: EmotionalResponse) => void;
  onTaskComplete: (taskId: string) => void;
}

export const TaskBreakdownCard: React.FC<TaskBreakdownCardProps> = ({
  task,
  onEmotionChange,
  onTaskComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [emotion, setEmotion] = useState<EmotionalResponse['type']>('exploring');

  useEffect(() => {
    const handleStepComplete = () => {
      if (currentStep < task.steps.length - 1) {
        celebrateProgress();
        setTimeout(() => {
          setCurrentStep((prev) => prev + 1);
          setShowCelebration(false);
        }, 2000);
      } else {
        onTaskComplete(task.id);
      }
    };

    neuroFocusEngine.on('step:complete', handleStepComplete);
    return () => {
      neuroFocusEngine.off('step:complete', handleStepComplete);
    };
  }, [currentStep, task.id, onTaskComplete]);

  const celebrateProgress = () => {
    setShowCelebration(true);
    const audio = new Audio('/sounds/success.mp3');
    audio.play().catch(console.error);
  };

  const handleEmotionSelect = (type: EmotionalResponse['type']) => {
    const response: EmotionalResponse = {
      type,
      intensity: 1,
      timestamp: new Date().toISOString(),
    };
    setEmotion(type);
    onEmotionChange(response);
  };

  const getEmotionEmoji = (type: EmotionalResponse['type']) => {
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
    return emojis[type];
  };

  return (
    <div className="task-breakdown-card">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="task-header"
      >
        <h2>{task.title}</h2>
        <p className="task-description">{task.description}</p>
      </motion.div>

      <div className="step-progress">
        {task.steps.map((_, index) => (
          <motion.div
            key={index}
            className={`progress-dot ${index === currentStep ? 'active' : ''} ${
              index < currentStep ? 'completed' : ''
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="step-content"
        >
          <h3>Adım {currentStep + 1}</h3>
          <p className="step-instruction">{task.steps[currentStep].step}</p>
          <p className="step-support">{task.steps[currentStep].support}</p>
          <div className="step-duration">{task.steps[currentStep].duration}</div>
        </motion.div>
      </AnimatePresence>

      <div className="emotion-selector">
        <p>Nasıl hissediyorsun?</p>
        <div className="emotion-buttons">
          {['curious', 'determined', 'tired', 'overwhelmed'].map((type) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`emotion-button ${emotion === type ? 'active' : ''}`}
              onClick={() => handleEmotionSelect(type as EmotionalResponse['type'])}
            >
              {getEmotionEmoji(type as EmotionalResponse['type'])}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="celebration"
          >
            <span role="img" aria-label="celebration">
              🎉
            </span>
            <p>Harika ilerliyorsun!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .task-breakdown-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          margin: 20px auto;
          font-family: 'Comic Sans MS', cursive;
        }

        .task-header {
          text-align: center;
          margin-bottom: 24px;
        }

        h2 {
          color: #6b4423;
          font-size: 24px;
          margin: 0;
        }

        .task-description {
          color: #8d6e63;
          font-size: 16px;
          margin: 8px 0 0;
        }

        .step-progress {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin: 20px 0;
        }

        .progress-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #e0e0e0;
          transition: all 0.3s ease;
        }

        .progress-dot.active {
          background: #ff9800;
          transform: scale(1.2);
        }

        .progress-dot.completed {
          background: #4caf50;
        }

        .step-content {
          background: #fff8e1;
          border-radius: 16px;
          padding: 20px;
          margin: 20px 0;
        }

        h3 {
          color: #6b4423;
          font-size: 18px;
          margin: 0 0 12px;
        }

        .step-instruction {
          color: #5d4037;
          font-size: 16px;
          margin: 0 0 8px;
        }

        .step-support {
          color: #8d6e63;
          font-style: italic;
          font-size: 14px;
          margin: 0 0 12px;
        }

        .step-duration {
          color: #a1887f;
          font-size: 12px;
        }

        .emotion-selector {
          text-align: center;
          margin-top: 24px;
        }

        .emotion-selector p {
          color: #6b4423;
          margin: 0 0 12px;
        }

        .emotion-buttons {
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .emotion-button {
          background: none;
          border: 2px solid #e0e0e0;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          font-size: 24px;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .emotion-button:hover {
          border-color: #ff9800;
        }

        .emotion-button.active {
          border-color: #ff9800;
          background: #fff8e1;
        }

        .celebration {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255, 255, 255, 0.95);
          padding: 24px;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          z-index: 1000;
        }

        .celebration span {
          font-size: 48px;
          display: block;
          margin-bottom: 12px;
        }

        .celebration p {
          color: #6b4423;
          font-size: 18px;
          margin: 0;
        }
      `}</style>
    </div>
  );
};
