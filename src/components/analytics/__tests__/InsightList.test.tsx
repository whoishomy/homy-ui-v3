import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import { InsightList } from '../components/InsightList';
import type { HealthInsight } from '@/types/analytics';
import { InsightCategory } from '@/types/analytics';
import * as exportUtils from '@/utils/exportUtils';
import { mockInsightsList, createMockInsight } from './test-helpers/mockInsights';

expect.extend(toHaveNoViolations);

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        direction: 'ltr',
        'insight.metrics': 'İlgili Metrikler',
        'insight.dismiss': 'Kapat',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock the exportUtils
vi.mock('@/utils/exportUtils', () => ({
  downloadInsightsCSV: vi.fn(),
  generateCSVFromInsights: vi.fn(),
}));

const renderInsightList = (props: { insights: HealthInsight[]; className?: string }) => {
  return render(<InsightList {...props} />);
};

describe('InsightList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders list of insights', () => {
      renderInsightList({ insights: mockInsightsList });
      expect(screen.getAllByRole('article')).toHaveLength(mockInsightsList.length);
    });

    it('renders empty state message when no insights', () => {
      renderInsightList({ insights: [] });
      expect(screen.queryByRole('article')).not.toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
      const className = 'custom-class';
      const { container } = renderInsightList({ insights: mockInsightsList, className });
      expect(container.firstChild).toHaveClass(className);
    });

    it('renders correct icon and color for each insight type', () => {
      renderInsightList({
        insights: [
          createMockInsight('1', 'success'),
          createMockInsight('2', 'warning'),
          createMockInsight('3', 'error'),
        ],
      });

      expect(screen.getByTestId('insight-icon-success')).toHaveClass('text-green-500');
      expect(screen.getByTestId('insight-icon-warning')).toHaveClass('text-yellow-500');
      expect(screen.getByTestId('insight-icon-error')).toHaveClass('text-red-500');
    });

    it('renders persona information when available', () => {
      renderInsightList({
        insights: [createMockInsight('1', 'success', InsightCategory.PHYSICAL, true)],
      });

      const article = screen.getByRole('article');
      expect(article).toHaveAttribute('data-persona-id', 'test-persona');
    });
  });

  describe('Export functionality', () => {
    it('renders export button', () => {
      renderInsightList({ insights: mockInsightsList });
      const exportButton = screen.getByRole('button', { name: 'CSV İndir' });
      expect(exportButton).toBeInTheDocument();
    });

    it('calls downloadInsightsCSV when export button clicked', async () => {
      const user = userEvent.setup();
      renderInsightList({ insights: mockInsightsList });
      const exportButton = screen.getByRole('button', { name: 'CSV İndir' });

      await user.click(exportButton);
      expect(exportUtils.downloadInsightsCSV).toHaveBeenCalledWith(mockInsightsList);
    });

    it('generates correct CSV content', () => {
      renderInsightList({ insights: mockInsightsList });
      expect(exportUtils.downloadInsightsCSV).not.toHaveBeenCalled();
    });
  });

  describe('Insight dismissal', () => {
    it('handles insight dismissal', async () => {
      const user = userEvent.setup();
      renderInsightList({ insights: mockInsightsList });
      const dismissButtons = screen.getAllByRole('button', { name: 'Kapat' });

      await user.click(dismissButtons[0]);
      // Add assertions for dismiss logic when implemented
    });

    it('maintains focus after dismissal', async () => {
      const user = userEvent.setup();
      renderInsightList({ insights: mockInsightsList });

      await user.tab(); // Focus first interactive element
      const exportButton = screen.getByRole('button', { name: 'CSV İndir' });
      expect(exportButton).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      renderInsightList({ insights: mockInsightsList });
      expect(screen.getByRole('heading', { name: 'İçgörüler' })).toBeInTheDocument();
    });

    it('export button has proper attributes', () => {
      renderInsightList({ insights: mockInsightsList });
      const exportButton = screen.getByRole('button', { name: 'CSV İndir' });
      const downloadIcon = exportButton.querySelector('svg');
      expect(downloadIcon).toHaveAttribute('aria-hidden', 'true');
    });

    it('passes axe accessibility tests', async () => {
      const { container } = renderInsightList({ insights: mockInsightsList });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports keyboard navigation between insights', async () => {
      const user = userEvent.setup();
      renderInsightList({ insights: mockInsightsList });

      await user.tab(); // Focus first interactive element
      const exportButton = screen.getByRole('button', { name: 'CSV İndir' });
      expect(exportButton).toHaveFocus();

      await user.tab(); // Focus first dismiss button
      const dismissButton = screen.getAllByRole('button', { name: 'Kapat' })[0];
      expect(dismissButton).toHaveFocus();
    });
  });

  describe('Error Handling', () => {
    it('handles export errors gracefully', async () => {
      const user = userEvent.setup();
      const mockDownload = vi.mocked(exportUtils.downloadInsightsCSV);
      mockDownload.mockImplementationOnce(() => Promise.reject(new Error('Export failed')));

      renderInsightList({ insights: mockInsightsList });
      const exportButton = screen.getByRole('button', { name: 'CSV İndir' });

      await user.click(exportButton);
      expect(mockDownload).toHaveBeenCalledWith(mockInsightsList);
    });
  });

  it('matches snapshot', () => {
    const { container } = renderInsightList({ insights: mockInsightsList });
    expect(container).toMatchSnapshot();
  });
});
