'use client';

import React, { FC, useRef, useEffect } from 'react';
import { StatusTrendCard } from './StatusTrendCard';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';
import type { TelemetrySnapshot } from '@/services/telemetry/InsightTelemetry';
import { InsightBubble } from './InsightBubble';
import { InsightCategory } from '@/types/analytics';
import { useInsightCategoryDisplay } from '@/hooks/useInsightCategoryDisplay';
import { useTranslation } from 'next-i18next';

interface InsightOverlayProps {
  snapshot: TelemetrySnapshot;
  onClose: () => void;
  className?: string;
}

export const InsightOverlay: FC<InsightOverlayProps> = ({ snapshot, onClose, className }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation('analytics');
  const { getDisplay } = useInsightCategoryDisplay();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  const handleVitalRecommendation = () => {
    console.log('Vital recommendation:', 'Detaylı sağlık önerileri burada gösterilecek.');
  };

  const handleActivityRecommendation = () => {
    console.log('Activity recommendation:', 'Detaylı aktivite önerileri burada gösterilecek.');
  };

  const handleSleepRecommendation = () => {
    console.log('Sleep recommendation:', 'Detaylı uyku önerileri burada gösterilecek.');
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center ${className || ''}`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {t('insights.title', 'İçgörü Telemetrisi')}
          </h2>
          <Button
            ref={closeButtonRef}
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label={t('common.close', 'Kapat')}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <span className="sr-only">{t('common.close', 'Kapat')}</span>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {getDisplay(InsightCategory.HEALTH)}
            </h3>
            <StatusTrendCard
              title="Kan Basıncı"
              score={snapshot.health.vitals.bloodPressure}
              type="warning"
              formatValue={(v) => `${v} mmHg`}
              trendLabel="son ölçüm"
              onActionClick={handleVitalRecommendation}
              actionable
            />
            <InsightBubble
              message="Kan basıncınız yüksek seyrediyor. Düzenli ölçüm almaya devam edin."
              type="warning"
              priority="high"
              category={InsightCategory.HEALTH}
              className="mt-2"
            />
            <StatusTrendCard
              title="Nabız"
              score={snapshot.health.vitals.heartRate}
              type="success"
              formatValue={(v) => `${v} bpm`}
              trendLabel="şu an"
              onActionClick={handleVitalRecommendation}
              actionable
            />
            <InsightBubble
              message="Nabız değerleriniz ideal aralıkta seyrediyor."
              type="success"
              priority="low"
              category={InsightCategory.HEALTH}
              className="mt-2"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {getDisplay(InsightCategory.PHYSICAL)}
            </h3>
            <StatusTrendCard
              title="Adım Sayısı"
              score={snapshot.health.activity.steps}
              type="warning"
              formatValue={(v) => v.toLocaleString()}
              trendLabel="bugün"
              onActionClick={handleActivityRecommendation}
              actionable
            />
            <InsightBubble
              message="Günlük adım hedefinizin altındasınız. Biraz yürüyüş yapmanızı öneririm."
              type="warning"
              priority="medium"
              category={InsightCategory.PHYSICAL}
              className="mt-2"
            />
            <StatusTrendCard
              title="Aktif Dakika"
              score={snapshot.health.activity.activeMinutes}
              type="success"
              formatValue={(v) => `${v} dk`}
              trendLabel="bugün"
              onActionClick={handleActivityRecommendation}
              actionable
            />
            <InsightBubble
              message="Aktif dakika hedefinizi aştınız. Harika gidiyorsunuz!"
              type="success"
              priority="low"
              category={InsightCategory.PHYSICAL}
              className="mt-2"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {getDisplay(InsightCategory.SLEEP)}
            </h3>
            <StatusTrendCard
              title="Uyku Süresi"
              score={snapshot.health.sleep.sleepDuration}
              type="error"
              formatValue={(v) => `${v} saat`}
              trendLabel="dün gece"
              onActionClick={handleSleepRecommendation}
              actionable
            />
            <InsightBubble
              message="Uyku süreniz önerilen 7-9 saat aralığının altında. Uyku düzeninizi iyileştirmenizi öneririm."
              type="critical"
              priority="high"
              category={InsightCategory.SLEEP}
              className="mt-2"
            />
            <StatusTrendCard
              title="Uyku Kalitesi"
              score={snapshot.health.sleep.sleepScore}
              type="success"
              formatValue={(v) => `%${v}`}
              trendLabel="dün gece"
              onActionClick={handleSleepRecommendation}
              actionable
            />
            <InsightBubble
              message="Uyku kaliteniz iyi seviyede. Bu şekilde devam edin."
              type="success"
              priority="low"
              category={InsightCategory.SLEEP}
              className="mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
