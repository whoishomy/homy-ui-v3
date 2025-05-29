'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import InsightBubble from './InsightBubble';
import { insights } from '@/data/sample-insights';
import { Loader2 } from 'lucide-react';

interface InsightOverlayProps {
  loading?: boolean;
}

export default function InsightOverlay({ loading }: InsightOverlayProps) {
  const t = useTranslations('insights');

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center" aria-label={t('overlay.loading')}>
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!insights.length) {
    return (
      <div className="p-4 text-center text-gray-500" aria-label={t('overlay.empty_state')}>
        {t('overlay.empty_state')}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3" role="region" aria-label={t('overlay.aria_label')}>
      {insights.map((insight, index) => (
        <InsightBubble key={index} {...insight} />
      ))}
    </div>
  );
}
