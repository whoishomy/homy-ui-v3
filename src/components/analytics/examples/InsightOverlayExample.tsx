import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { InsightOverlay } from '../components/InsightOverlay';
import { InMemoryTelemetryService } from '@/services/telemetry/TelemetryService';
import type { TelemetrySnapshot } from '@/services/telemetry/InsightTelemetry';

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

export const InsightOverlayExample: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [snapshot, setSnapshot] = useState<TelemetrySnapshot | null>(null);

  useEffect(() => {
    const loadData = async () => {
      await initializeSampleData();
      const data = await telemetryService.getSnapshot();
      setSnapshot(data);
    };
    loadData();
  }, []);

  if (!snapshot) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)} variant="outline" className="mb-4">
        Telemetri Göstergesini Aç
      </Button>

      {isOpen && <InsightOverlay snapshot={snapshot} onClose={() => setIsOpen(false)} />}
    </div>
  );
};
