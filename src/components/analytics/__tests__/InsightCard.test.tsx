import { render, screen } from '@testing-library/react';
import { InsightCard } from '../components';
import type { HealthInsight } from '@/types/analytics';
import { InsightCategory } from '@/types/analytics';
import { userEvent } from '@testing-library/user-event';
import { jest  } from '@jest/globals';
import { analyticsService } from '@/services/analyticsService';

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue: string }) => {
      const translations: Record<string, string> = {
        'direction': 'ltr',
        'insight.metrics': 'İlgili Metrikler',
        'insight.dismiss': 'Kapat',
        'insight.details': 'Detaylar',
        'insight.action.view': 'Görüntüle'
      };
      return translations[key] || options?.defaultValue || `[missing]: ${key}`;
    },
  }),
}));

// Mock analytics service
jest.mock('@/services/analyticsService', () => ({
  analyticsService: {
    track: jest.fn(),
  },
}));

describe('InsightCard', () => {
  const mockDismiss = jest.fn();
  const mockAction = jest.fn();

  const createMockInsight = (type: 'success' | 'warning' | 'error', category: InsightCategory): HealthInsight => ({
    id: `test-${type}-${category}`,
    type,
    category,
    message: `Test ${type} message for ${category}`,
    date: new Date('2024-05-25T13:49:11.487Z'),
    relatedMetrics: ['Metric 1', 'Metric 2'],
    action: {
      type: 'suggestion',
      message: 'Test action',
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should have proper accessibility attributes', () => {
    const insight = createMockInsight('success', InsightCategory.PHYSICAL);
    render(<InsightCard insight={insight} onDismiss={mockDismiss} />);
    
    // Check ARIA attributes
    expect(screen.getByRole('article')).toHaveAttribute('aria-label');
    expect(screen.getByRole('button', { name: /kapat/i })).toHaveAttribute('aria-label');
    expect(screen.getByTestId(`insight-icon-${insight.type}`)).toHaveAttribute('aria-hidden', 'true');
  });

  it('should have proper tab navigation', () => {
    const insight = createMockInsight('success', InsightCategory.PHYSICAL);
    const { container } = render(<InsightCard insight={insight} onDismiss={mockDismiss} />);
    
    console.log('DOM:', container.innerHTML);
    
    const dismissButton = screen.getByRole('button', { name: 'kapat' });
    console.log('Dismiss Button:', dismissButton.outerHTML);
    
    const actionButton = screen.getByRole('button', { name: 'Test action' });
    console.log('Action Button:', actionButton.outerHTML);
    
    expect(dismissButton).toHaveAttribute('tabIndex', '0');
    expect(actionButton).toHaveAttribute('tabIndex', '0');
  });

  it('should have proper ARIA labels', () => {
    const insight = createMockInsight('warning', InsightCategory.NUTRITION);
    render(<InsightCard insight={insight} onDismiss={mockDismiss} />);
    
    const article = screen.getByRole('article');
    const dismissButton = screen.getByRole('button', { name: 'kapat' });
    const actionButton = screen.getByRole('button', { name: insight.action?.message });
    const icon = screen.getByTestId(`insight-icon-${insight.type}`);
    
    expect(article).toHaveAttribute('aria-label', insight.message);
    expect(dismissButton).toHaveAttribute('aria-label', 'kapat');
    expect(actionButton).toHaveAttribute('aria-label', insight.action?.message);
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('should maintain color contrast ratios', () => {
    const insight = createMockInsight('warning', InsightCategory.SLEEP);
    render(<InsightCard insight={insight} onDismiss={mockDismiss} />);
    const message = screen.getByText(/test warning message/i);
    const styles = window.getComputedStyle(message);
    expect(styles.color).toBe('rgb(17, 24, 39)'); // text-gray-900
    expect(styles.backgroundColor).toBe('rgb(255, 255, 255)'); // white
  });

  // Keyboard Interaction Tests
  describe('keyboard interactions', () => {
    it('closes on Escape key', async () => {
      const user = userEvent.setup();
      const insight = createMockInsight('success', InsightCategory.PHYSICAL);
      render(<InsightCard insight={insight} onDismiss={mockDismiss} />);
      
      await user.keyboard('{Escape}');
      expect(mockDismiss).toHaveBeenCalledWith(insight.id);
    });

    it('triggers action on Enter key when action button is focused', async () => {
      const user = userEvent.setup();
      const insight = createMockInsight('success', InsightCategory.PHYSICAL);
      render(<InsightCard insight={insight} onDismiss={mockDismiss} onAction={mockAction} />);
      
      const actionButton = screen.getByRole('button', { name: insight.action?.message });
      actionButton.focus();
      await user.keyboard('{Enter}');
      
      expect(mockAction).toHaveBeenCalled();
    });
  });

  // RTL Support Tests
  describe('RTL support', () => {
    it('renders correctly in RTL mode', () => {
      const insight = createMockInsight('success', InsightCategory.PHYSICAL);
      render(<InsightCard insight={insight} onDismiss={mockDismiss} />);
      const container = screen.getByRole('article');
      expect(container).toHaveAttribute('dir', 'rtl');
    });
  });

  // Analytics Integration Tests
  describe('analytics tracking', () => {
    it('tracks view event on mount', () => {
      const insight = createMockInsight('success', InsightCategory.PHYSICAL);
      render(<InsightCard insight={insight} onDismiss={mockDismiss} />);
      
      expect(analyticsService.track).toHaveBeenCalledWith('insight_viewed', {
        insightId: insight.id,
        type: insight.type,
        category: insight.category,
      });
    });

    it('tracks action event on button click', async () => {
      const user = userEvent.setup();
      const insight = createMockInsight('success', InsightCategory.PHYSICAL);
      render(<InsightCard insight={insight} onDismiss={mockDismiss} onAction={mockAction} />);
      
      const actionButton = screen.getByRole('button', { name: insight.action?.message });
      await user.click(actionButton);
      
      expect(analyticsService.track).toHaveBeenCalledWith('insight_action_clicked', {
        insightId: insight.id,
        type: insight.type,
        category: insight.category,
      });
    });

    it('tracks dismiss event on close', async () => {
      const user = userEvent.setup();
      const insight = createMockInsight('success', InsightCategory.PHYSICAL);
      render(<InsightCard insight={insight} onDismiss={mockDismiss} />);
      
      const dismissButton = screen.getByRole('button', { name: 'kapat' });
      await user.click(dismissButton);
      
      expect(analyticsService.track).toHaveBeenCalledWith('insight_dismissed', {
        insightId: insight.id,
        type: insight.type,
        category: insight.category,
      });
    });
  });

  // Variant Tests
  describe('insight variants', () => {
    const categories = [
      InsightCategory.PHYSICAL,
      InsightCategory.MENTAL,
      InsightCategory.NUTRITION,
      InsightCategory.SLEEP,
      InsightCategory.SOCIAL
    ] as const;
    const types = ['success', 'warning', 'error'] as const;

    test.each(categories)('renders %s category correctly', (category) => {
      const insight = createMockInsight('success', category);
      render(<InsightCard insight={insight} onDismiss={mockDismiss} />);
      expect(screen.getByText(new RegExp(`Test success message for ${category}`, 'i'))).toBeInTheDocument();
    });

    test.each(types)('applies correct styling for %s type', (type) => {
      const insight = createMockInsight(type, InsightCategory.PHYSICAL);
      render(<InsightCard insight={insight} onDismiss={mockDismiss} />);
      
      const icon = screen.getByTestId(`insight-icon-${type}`);
      const styles = window.getComputedStyle(icon);
      
      const colorMap = {
        success: 'rgb(34, 197, 94)', // text-green-500
        warning: 'rgb(234, 179, 8)',  // text-yellow-500
        error: 'rgb(239, 68, 68)',    // text-red-500
      } as const;
      
      expect(styles.color).toBe(colorMap[type]);
    });
  });
}); 