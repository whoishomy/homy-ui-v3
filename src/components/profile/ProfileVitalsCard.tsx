'use client';

import { VitalMetric } from './VitalMetric';
import { VitalTrendIndicator } from './VitalTrend';
import { Card } from '@mui/material';
import { useState } from 'react';
import type { VitalTrend } from '@/types/vitals';

export const ProfileVitalsCard = () => {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-4 gap-4">
        <div className="space-y-1">
          <VitalMetric label="Nabız" value="72" unit="bpm" />
          <VitalTrendIndicator trend="stable" />
        </div>
        <div className="space-y-1">
          <VitalMetric label="Tansiyon" value="120/80" />
          <VitalTrendIndicator trend="falling" />
        </div>
        <div className="space-y-1">
          <VitalMetric label="Oksijen" value="97" unit="%" />
          <VitalTrendIndicator trend="rising" />
        </div>
        <div className="space-y-1">
          <VitalMetric label="Sıcaklık" value="36.6" unit="°C" />
          <VitalTrendIndicator trend="stable" />
        </div>
      </div>
    </Card>
  );
};
