import React from 'react';
import { CarePlan } from '@/cases/tayfun/care-plan';
import { Insight } from '@/cases/tayfun/insights';

interface CarePlanBuilderProps {
  defaultPlan: CarePlan;
  insights: Insight[];
}

export function CarePlanBuilder({ defaultPlan, insights }: CarePlanBuilderProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Önerilen Bakım Planı
        </h2>
        <div className="space-y-4">
          {defaultPlan.recommendations.map((recommendation, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {recommendation.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">{recommendation.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Öncelik: {recommendation.priority}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Takip: {recommendation.followUpIn}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          İlgili İçgörüler
        </h2>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {insight.title}
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    insight.severity === 'high'
                      ? 'bg-red-100 text-red-800'
                      : insight.severity === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {insight.severity.charAt(0).toUpperCase() + insight.severity.slice(1)}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
