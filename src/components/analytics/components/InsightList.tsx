import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { HealthInsight, InsightCategory } from '@/types/analytics';
import { InsightCard } from './InsightCard';
import { downloadInsightsCSV } from '@/utils/exportUtils';
import { Button } from '@/components/ui/button';
import { getInsightCategoryOptions } from '@/utils/insightCategory';

interface InsightListProps {
  insights: HealthInsight[];
  className?: string;
}

export const InsightList: React.FC<InsightListProps> = ({ insights, className }) => {
  const [selectedCategory, setSelectedCategory] = useState<InsightCategory | 'all'>('all');
  const categoryOptions = getInsightCategoryOptions();

  const filteredInsights =
    selectedCategory === 'all'
      ? insights
      : insights.filter((insight) => insight.category === selectedCategory);

  const handleExport = async () => {
    try {
      await downloadInsightsCSV(insights);
    } catch (error) {
      // Error handling will be implemented later
      console.error('Failed to export insights:', error);
    }
  };

  const handleDismiss = (id: string) => {
    // Handle dismiss logic if needed
  };

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">İçgörüler</h2>
        <div className="flex items-center gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as InsightCategory | 'all')}
            className="rounded-md border border-gray-300 text-sm"
          >
            <option value="all">Tüm Kategoriler</option>
            {categoryOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            CSV İndir
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredInsights.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {selectedCategory === 'all'
              ? 'Henüz içgörü bulunmuyor'
              : 'Bu kategoride içgörü bulunmuyor'}
          </div>
        ) : (
          filteredInsights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} onDismiss={handleDismiss} />
          ))
        )}
      </div>
    </div>
  );
};
