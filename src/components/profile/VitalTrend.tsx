import type { VitalTrend } from '@/types/vitals';

interface Props {
  trend: VitalTrend;
}

export const VitalTrendIndicator = ({ trend }: Props) => {
  const trends = {
    rising: '▲',
    falling: '▼',
    stable: '■',
  };

  return <div className="text-xs text-gray-400">{trends[trend]}</div>;
};
