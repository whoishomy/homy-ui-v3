'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '../ui/badge';

type InsightProps = {
  titleKey: string;
  descriptionKey: string;
  type: 'risk' | 'trend' | 'note';
};

export default function InsightBubble({ titleKey, descriptionKey, type }: InsightProps) {
  const t = useTranslations();

  return (
    <div
      className="rounded-xl p-4 bg-white shadow-md border border-gray-100"
      role="article"
      aria-label={t(titleKey)}
    >
      <div className="flex items-center gap-2 mb-1">
        <Badge variant="outline">{t(`insights.types.${type}`)}</Badge>
        <h4 className="text-sm font-semibold text-gray-700">{t(titleKey)}</h4>
      </div>
      <p className="text-gray-600 text-sm">{t(descriptionKey)}</p>
    </div>
  );
}
