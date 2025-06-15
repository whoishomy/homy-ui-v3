import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { InsightOverlay } from '../components/InsightOverlay';
import { InMemoryTelemetryService } from '@/services/telemetry/TelemetryService';
import type { TelemetrySnapshot } from '@/services/telemetry/InsightTelemetry';
import type { Insight } from '@/cases/tayfun/insights';

const telemetryService = new InMemoryTelemetryService();

// Add some sample data
const initializeSampleData = async () => {
  await telemetryService.reset();

  // OpenAI insights
  await telemetryService.recordInsight({
    provider: 'openai',
    duration: 200,
    success: true,
    cached: false,
    cost: 0.02,
  });
  await telemetryService.recordInsight({
    provider: 'openai',
    duration: 50,
    success: true,
    cached: true,
    cost: 0,
  });
  await telemetryService.recordInsight({
    provider: 'openai',
    duration: 300,
    success: false,
    cached: false,
    cost: 0,
    error: {
      type: 'rate_limit',
      message: 'Too many requests',
    },
  });

  // Anthropic insights
  await telemetryService.recordInsight({
    provider: 'anthropic',
    duration: 250,
    success: true,
    cached: false,
    cost: 0.03,
  });
  await telemetryService.recordInsight({
    provider: 'anthropic',
    duration: 150,
    success: true,
    cached: true,
    cost: 0,
  });
  await telemetryService.recordInsight({
    provider: 'anthropic',
    duration: 400,
    success: false,
    cached: false,
    cost: 0,
    error: {
      type: 'validation',
      message: 'Invalid prompt format',
    },
  });
};

const transformSnapshotToInsights = (snapshot: TelemetrySnapshot): Insight[] => {
  const insights: Insight[] = [];

  // Add insights based on success rate
  if (snapshot.insights.successRate < 0.9) {
    insights.push({
      id: 'success-rate',
      title: 'Düşük Başarı Oranı',
      description: `Başarı oranı ${(snapshot.insights.successRate * 100).toFixed(
        1
      )}% seviyesinde. İyileştirme gerekli.`,
      severity: 'high',
      category: 'performance',
      date: new Date(),
    });
  }

  // Add insights based on cache hit rate
  if (snapshot.insights.cacheHitRate < 0.5) {
    insights.push({
      id: 'cache-rate',
      title: 'Düşük Önbellek Kullanımı',
      description: `Önbellek kullanım oranı ${(snapshot.insights.cacheHitRate * 100).toFixed(
        1
      )}%. Optimizasyon önerilir.`,
      severity: 'medium',
      category: 'performance',
      date: new Date(),
    });
  }

  // Add insights based on average duration
  if (snapshot.insights.averageDuration > 200) {
    insights.push({
      id: 'latency',
      title: 'Yüksek Gecikme Süresi',
      description: `Ortalama yanıt süresi ${snapshot.insights.averageDuration.toFixed(
        0
      )}ms. Performans iyileştirmesi gerekli.`,
      severity: 'medium',
      category: 'performance',
      date: new Date(),
    });
  }

  return insights;
};

export const InsightOverlayExample: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    const loadData = async () => {
      await initializeSampleData();
      const snapshot = await telemetryService.getSnapshot();
      setInsights(transformSnapshotToInsights(snapshot));
    };
    loadData();
  }, []);

  if (insights.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)} variant="outline" className="mb-4">
        Telemetri Göstergesini Aç
      </Button>

      {isOpen && <InsightOverlay insights={insights} onClose={() => setIsOpen(false)} />}
    </div>
  );
};
