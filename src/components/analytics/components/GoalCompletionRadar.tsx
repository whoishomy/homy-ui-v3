import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { HealthCategory } from '@/types/analytics';

interface GoalCompletionRadarProps {
  data: {
    category: keyof typeof HealthCategory;
    completion: number;
    target: number;
  }[];
}

export const GoalCompletionRadar: React.FC<GoalCompletionRadarProps> = ({
  data,
}) => {
  const formattedData = data.map((item) => ({
    category: HealthCategory[item.category],
    completion: item.completion,
    target: item.target,
  }));

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={formattedData}>
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: '#6B7280', fontSize: 10 }}
          />
          <Radar
            name="Tamamlama"
            dataKey="completion"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.6}
          />
          <Radar
            name="Hedef"
            dataKey="target"
            stroke="#6B7280"
            fill="#6B7280"
            fillOpacity={0.3}
          />
          <Legend
            wrapperStyle={{
              paddingTop: '2rem',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}; 