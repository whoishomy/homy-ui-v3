import React from 'react';
import { HealthInsight } from '@/types/analytics';
import {
  AlertTriangle,
  CheckCircle,
  Info,
  ArrowRight,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

const INSIGHT_TYPES = ['info', 'success', 'warning', 'error'] as const;
type InsightType = (typeof INSIGHT_TYPES)[number];

interface InsightsSummaryProps {
  insights: HealthInsight[];
}

const INSIGHT_ICONS = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertTriangle,
  info: Info,
} as const satisfies Record<InsightType, React.FC>;

const INSIGHT_COLORS = {
  success: 'text-green-500 bg-green-50',
  warning: 'text-yellow-500 bg-yellow-50',
  error: 'text-red-500 bg-red-50',
  info: 'text-blue-500 bg-blue-50',
} as const satisfies Record<InsightType, string>;

export const InsightsSummary: React.FC<InsightsSummaryProps> = ({ insights }) => {
  return (
    <div className="space-y-4">
      {insights.length === 0 ? (
        <div className="text-center py-8">
          <Info className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Henüz içgörü bulunmuyor</p>
        </div>
      ) : (
        insights.map((insight) => {
          const Icon = INSIGHT_ICONS[insight.type];
          const colorClass = INSIGHT_COLORS[insight.type];

          return (
            <div
              key={insight.id}
              className="bg-white rounded-lg border p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{insight.message}</p>
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <span>{insight.category}</span>
                    <span className="mx-2">•</span>
                    <span>
                      {new Intl.DateTimeFormat('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                      }).format(new Date(insight.date))}
                    </span>
                  </div>

                  {/* İlgili Metrikler */}
                  {insight.relatedMetrics && insight.relatedMetrics.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-xs font-medium text-gray-700 mb-1">İlgili Metrikler</h4>
                      <div className="flex flex-wrap gap-2">
                        {insight.relatedMetrics.map((metric) => (
                          <span
                            key={metric}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {metric}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Önerilen Aksiyon */}
                  {insight.action && (
                    <div className="mt-3">
                      <button
                        type="button"
                        className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700"
                      >
                        {insight.action.message}
                        <ArrowRight className="ml-1 w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Trend Göstergeleri */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-sm font-medium text-green-700">İyileşen Alanlar</span>
          </div>
          <ul className="mt-2 space-y-1">
            {insights
              .filter((i) => i.type === 'success')
              .slice(0, 2)
              .map((i) => (
                <li key={i.id} className="text-sm text-green-600">
                  {i.category}
                </li>
              ))}
          </ul>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingDown className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-sm font-medium text-yellow-700">Dikkat Edilmesi Gerekenler</span>
          </div>
          <ul className="mt-2 space-y-1">
            {insights
              .filter((i) => i.type === 'warning')
              .slice(0, 2)
              .map((i) => (
                <li key={i.id} className="text-sm text-yellow-600">
                  {i.category}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
