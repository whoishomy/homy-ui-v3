import React from 'react';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { AnalyticsSummary } from '@/types/analytics';

interface HealthTrendCardsProps {
  summary: AnalyticsSummary | null;
}

export const HealthTrendCards: React.FC<HealthTrendCardsProps> = ({ summary }) => {
  if (!summary) return null;

  const overallTrend = summary.trends[summary.trends.length - 1]?.value || 0;
  const previousTrend = summary.trends[summary.trends.length - 2]?.value || 0;
  const trendDiff = overallTrend - previousTrend;
  const trendPercentage = ((trendDiff / previousTrend) * 100).toFixed(1);

  const cards = [
    {
      title: 'Genel Sağlık Skoru',
      value: `${Math.round(overallTrend)}%`,
      trend: {
        value: trendPercentage,
        direction: trendDiff >= 0 ? 'up' : 'down',
      },
      icon: Activity,
    },
    {
      title: 'Ortalama Uyum',
      value: `${Math.round(summary.adherence.overall)}%`,
      trend: {
        value: '0.0',
        direction: 'up',
      },
      icon: TrendingUp,
    },
    {
      title: 'Hedef Tamamlama',
      value: `${Math.round(
        summary.goalCompletion.reduce((acc, curr) => acc + curr.completion, 0) /
          summary.goalCompletion.length
      )}%`,
      trend: {
        value: '0.0',
        direction: 'up',
      },
      icon: TrendingDown,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isPositive = card.trend.direction === 'up';

        return (
          <div
            key={card.title}
            className="bg-white rounded-lg shadow p-6 flex items-start space-x-4"
          >
            <div
              className={`p-3 rounded-full ${
                isPositive ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              <Icon
                className={`w-6 h-6 ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
              <div className="mt-1 flex items-center">
                {card.trend.direction === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={`ml-1 text-sm font-medium ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {card.trend.value}%
                </span>
                <span className="ml-1 text-sm text-gray-500">
                  geçen haftaya göre
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}; 