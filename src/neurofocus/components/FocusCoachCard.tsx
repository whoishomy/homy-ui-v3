import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { erenMemoryStore, ErenSnapshot } from '../store/erenMemoryStore';
import { EmotionalResponse } from '../core/types';

interface FocusCoachCardProps {
  currentTask?: string;
  onEmotionChange?: (emotion: EmotionalResponse) => void;
}

export const FocusCoachCard: React.FC<FocusCoachCardProps> = ({ currentTask, onEmotionChange }) => {
  const [currentSnapshot, setCurrentSnapshot] = useState<ErenSnapshot | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Listen for Eren's progress updates
    const handleProgressUpdate = (event: CustomEvent) => {
      const { type, data } = event.detail;

      if (type === 'emotional-snapshot') {
        setCurrentSnapshot(data);
      } else if (type === 'breakthrough') {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    };

    window.addEventListener('eren-progress' as any, handleProgressUpdate);
    return () => {
      window.removeEventListener('eren-progress' as any, handleProgressUpdate);
    };
  }, []);

  const renderEmotionalSupport = () => {
    if (!currentSnapshot) return null;

    const { emotionalState } = currentSnapshot;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant={emotionalState.type === 'determined' ? 'success' : 'default'}>
            {emotionalState.type}
          </Badge>
          <span className="text-sm text-gray-600">
            {new Date(currentSnapshot.timestamp).toLocaleTimeString('tr-TR')}
          </span>
        </div>

        <p className="text-lg font-medium">
          {emotionalState.type === 'overwhelmed' &&
            'Eren, adım adım ilerleyelim. Her küçük başarı değerli! 🌱'}
          {emotionalState.type === 'frustrated' &&
            'Bazen takılmak normaldir. Birlikte çözüm bulacağız! 💪'}
          {emotionalState.type === 'determined' &&
            'Harika gidiyorsun Eren! Bu motivasyonunu takdir ediyorum! ⭐'}
          {emotionalState.type === 'curious' &&
            'Merakın en büyük süper gücün! Keşfetmeye devam et! 🔍'}
          {emotionalState.type === 'tired' &&
            'Kısa bir mola vermek ister misin? Dinlenmek de başarının bir parçası! 🌿'}
        </p>

        {currentSnapshot.supportMessage && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">{currentSnapshot.supportMessage}</p>
          </div>
        )}
      </div>
    );
  };

  const renderCelebration = () => {
    return (
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-blue-500/20 backdrop-blur-sm rounded-lg"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: 3, duration: 0.5 }}
              className="text-4xl"
            >
              🌟
            </motion.div>
            <p className="text-xl font-bold text-blue-800 ml-4">Harika bir gelişme kaydedildi!</p>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <Card className="relative overflow-hidden p-6 bg-gradient-to-br from-blue-50 to-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-blue-900">Eren'in Koçu</h3>
        {currentTask && (
          <Badge variant="outline" className="text-sm">
            {currentTask}
          </Badge>
        )}
      </div>

      {renderEmotionalSupport()}
      {renderCelebration()}

      <div className="mt-6 grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            const emotion: EmotionalResponse = {
              type: 'determined',
              intensity: 0.8,
              timestamp: new Date().toISOString(),
            };
            erenMemoryStore.recordEmotionalSnapshot(emotion);
            onEmotionChange?.(emotion);
          }}
          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
        >
          Yapabilirim! 💪
        </button>
        <button
          onClick={() => {
            const emotion: EmotionalResponse = {
              type: 'overwhelmed',
              intensity: 0.6,
              timestamp: new Date().toISOString(),
            };
            erenMemoryStore.recordEmotionalSnapshot(emotion);
            onEmotionChange?.(emotion);
          }}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          Yardım İstiyorum 🤝
        </button>
      </div>
    </Card>
  );
};
