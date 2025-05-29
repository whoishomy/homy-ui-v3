import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { erenMemoryStore, ErenProgress, ErenSnapshot } from '../store/erenMemoryStore';

interface TimelineEvent {
  id: string;
  date: string;
  type: 'breakthrough' | 'emotional-snapshot' | 'support';
  title: string;
  description: string;
  emotionalContext?: string;
}

export const ErenJourneyVisualizer: React.FC = () => {
  const [progress, setProgress] = useState<ErenProgress | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  useEffect(() => {
    // Listen for real-time updates
    const handleProgressUpdate = async (event: CustomEvent) => {
      const dailyProgress = await erenMemoryStore.getDailyProgress();

      // Transform progress data into timeline events
      const events: TimelineEvent[] = [
        ...(progress?.breakthroughs.map((b) => ({
          id: b.date,
          date: b.date,
          type: 'breakthrough' as const,
          title: 'Önemli İlerleme! 🌟',
          description: b.description,
          emotionalContext: b.emotionalImpact,
        })) || []),
        ...(progress?.dailyEmotionalJourney.map((j) => ({
          id: j.timestamp,
          date: j.timestamp,
          type: 'emotional-snapshot' as const,
          title: `Duygusal Durum: ${j.emotionalState.type}`,
          description: j.supportMessage || '',
          emotionalContext: j.emotionalState.type,
        })) || []),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setTimelineEvents(events);
    };

    window.addEventListener('eren-progress' as any, handleProgressUpdate);
    return () => {
      window.removeEventListener('eren-progress' as any, handleProgressUpdate);
    };
  }, [progress]);

  const renderTimelineEvent = (event: TimelineEvent) => {
    const isSelected = selectedEvent?.id === event.id;

    return (
      <motion.div
        key={event.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`
          relative p-4 border-l-4 cursor-pointer
          ${event.type === 'breakthrough' ? 'border-green-500 bg-green-50' : ''}
          ${event.type === 'emotional-snapshot' ? 'border-blue-500 bg-blue-50' : ''}
          ${event.type === 'support' ? 'border-purple-500 bg-purple-50' : ''}
          ${isSelected ? 'shadow-lg scale-102' : ''}
          transition-all duration-200
        `}
        onClick={() => setSelectedEvent(isSelected ? null : event)}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {new Date(event.date).toLocaleTimeString('tr-TR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          <h4 className="font-medium text-gray-900">{event.title}</h4>
        </div>

        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 text-sm text-gray-600"
            >
              <p>{event.description}</p>
              {event.emotionalContext && (
                <p className="mt-2 italic">Duygusal Bağlam: {event.emotionalContext}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const renderEmotionalProgress = () => {
    if (!progress) return null;

    const emotionalTransitions = progress.dailyEmotionalJourney
      .map((snapshot, index, array) => {
        if (index === 0) return null;
        const prev = array[index - 1].emotionalState.type;
        const curr = snapshot.emotionalState.type;

        if (
          (prev === 'overwhelmed' && curr === 'determined') ||
          (prev === 'frustrated' && curr === 'curious')
        ) {
          return (
            <motion.div
              key={snapshot.timestamp}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 text-green-600 bg-green-100 px-3 py-1 rounded-full"
            >
              <span>🎯</span>
              <span className="text-sm">
                {prev} → {curr}
              </span>
            </motion.div>
          );
        }
        return null;
      })
      .filter(Boolean);

    return <div className="flex flex-wrap gap-2 mt-4">{emotionalTransitions}</div>;
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Eren'in Gelişim Yolculuğu</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Bugün {timelineEvents.length} gelişme kaydedildi
          </span>
        </div>
      </div>

      {renderEmotionalProgress()}

      <div className="space-y-4 mt-6">{timelineEvents.map(renderTimelineEvent)}</div>

      {timelineEvents.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Henüz bir gelişme kaydedilmedi.</p>
          <p className="mt-2 text-sm">
            Eren'in ilk adımını atmaya hazır olduğunda burada görünecek! 🌱
          </p>
        </div>
      )}
    </Card>
  );
};
