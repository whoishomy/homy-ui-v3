import { HealthGoalTracker } from '@/components/health/HealthGoalTracker';
import { TimelineView } from '@/components/health/TimelineView';

export default function HealthPage() {
  return (
    <div className="container py-6">
      <div className="space-y-8">
        <HealthGoalTracker />
        <TimelineView />
      </div>
    </div>
  );
} 