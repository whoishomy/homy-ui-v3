import { z } from 'zod';
import { defaultTrademarkKit } from './trademark-visual-kit.prompt';

export const LabResultUpgradeSchema = z.object({
  version: z.literal('2.0.0'),
  components: z.object({
    LabResultCard: z.object({
      features: z.array(z.string()),
      accessibility: z.array(z.string()),
      visualization: z.object({
        charts: z.array(z.string()),
        interactions: z.array(z.string()),
      }),
    }),
    LabResultsPanel: z.object({
      features: z.array(z.string()),
      layout: z.object({
        grid: z.string(),
        spacing: z.string(),
      }),
      filters: z.array(z.string()),
    }),
    ResultDetailDrawer: z.object({
      sections: z.array(z.string()),
      features: z.array(z.string()),
    }),
  }),
  aiIntegration: z.object({
    insights: z.array(z.string()),
    recommendations: z.array(z.string()),
  }),
});

export const labResultUpgrade = {
  version: '2.0.0',
  components: {
    LabResultCard: {
      features: [
        'AI-powered trend analysis',
        'Smart reference range indicators',
        'Historical comparison',
        'Contextual tooltips',
        'Unit conversion support',
      ],
      accessibility: [
        'High contrast mode',
        'Screen reader optimizations',
        'Keyboard navigation enhancements',
        'ARIA live regions for updates',
      ],
      visualization: {
        charts: [
          'Sparkline trend',
          'Range indicator',
          'Deviation markers',
          'Critical threshold lines',
        ],
        interactions: [
          'Zoom on hover',
          'Click for details',
          'Touch-friendly controls',
          'Gesture support',
        ],
      },
    },
    LabResultsPanel: {
      features: [
        'Advanced filtering',
        'Smart grouping',
        'Batch comparison',
        'Export capabilities',
        'Print optimization',
      ],
      layout: {
        grid: 'responsive-grid',
        spacing: defaultTrademarkKit.visualIdentity.spacing.grid,
      },
      filters: [
        'Date range',
        'Test type',
        'Abnormality',
        'Trend direction',
        'Clinical significance',
      ],
    },
    ResultDetailDrawer: {
      sections: [
        'Summary',
        'Trend Analysis',
        'Clinical Context',
        'Reference Information',
        'Related Tests',
        'Action Items',
      ],
      features: [
        'AI insights',
        'Doctor notes integration',
        'Patient-friendly explanations',
        'Custom annotations',
        'Share functionality',
      ],
    },
  },
  aiIntegration: {
    insights: [
      'Trend pattern recognition',
      'Correlation analysis',
      'Risk assessment',
      'Treatment response evaluation',
    ],
    recommendations: [
      'Follow-up scheduling',
      'Lifestyle modifications',
      'Test frequency adjustment',
      'Clinical decision support',
    ],
  },
} as const;

export type LabResultUpgrade = z.infer<typeof LabResultUpgradeSchema>;

export function validateUpgrade(config: unknown): LabResultUpgrade {
  return LabResultUpgradeSchema.parse(config);
}

// Component templates
export const componentTemplates = {
  LabResultCard: `
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrademarkStyle } from '@/hooks/useTrademarkStyle';
import { getTrademarkName } from '@/utils/trademark';
import { TrendChart, RangeIndicator, AIInsights } from '@/components/charts';
import type { LabResult } from '@/types';

interface Props {
  result: LabResult;
  showDetails?: boolean;
  onAction?: (action: string) => void;
}

export const LabResultCard: React.FC<Props> = ({ result, showDetails, onAction }) => {
  const containerRef = useTrademarkStyle<HTMLDivElement>();
  
  return (
    <motion.div
      ref={containerRef}
      className="lab-result-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="article"
      aria-label={getTrademarkName('Lab Result Card')}
    >
      {/* Component implementation */}
    </motion.div>
  );
};`,

  LabResultsPanel: `
import React from 'react';
import { useTrademarkStyle } from '@/hooks/useTrademarkStyle';
import { getTrademarkName } from '@/utils/trademark';
import { LabResultCard, FilterBar, ExportTools } from '@/components/lab';
import type { LabResult, FilterOptions } from '@/types';

interface Props {
  results: LabResult[];
  filters?: FilterOptions;
  onFilterChange?: (filters: FilterOptions) => void;
}

export const LabResultsPanel: React.FC<Props> = ({ results, filters, onFilterChange }) => {
  const containerRef = useTrademarkStyle<HTMLDivElement>();

  return (
    <section
      ref={containerRef}
      className="lab-results-panel"
      role="region"
      aria-label={getTrademarkName('Lab Results Panel')}
    >
      {/* Component implementation */}
    </section>
  );
};`,

  ResultDetailDrawer: `
import React from 'react';
import { motion } from 'framer-motion';
import { useTrademarkStyle } from '@/hooks/useTrademarkStyle';
import { getTrademarkName } from '@/utils/trademark';
import { DetailView, ActionPanel, ShareTools } from '@/components/lab';
import type { LabResult, DetailOptions } from '@/types';

interface Props {
  result: LabResult;
  isOpen: boolean;
  onClose: () => void;
  options?: DetailOptions;
}

export const ResultDetailDrawer: React.FC<Props> = ({ result, isOpen, onClose, options }) => {
  const containerRef = useTrademarkStyle<HTMLDivElement>();

  return (
    <motion.div
      ref={containerRef}
      className="result-detail-drawer"
      role="dialog"
      aria-label={getTrademarkName('Result Detail View')}
    >
      {/* Component implementation */}
    </motion.div>
  );
};`,
};
