import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { vi } from 'vitest';
import { InsightOverlay } from '../components/InsightOverlay';
import type { TelemetrySnapshot } from '@/services/telemetry/InsightTelemetry';

expect.extend(toHaveNoViolations);

// Mock AI config
vi.mock('@/config/ai-config', () => ({
  initializeAIEngine: () => ({
    generateInsightForPersona: vi.fn().mockResolvedValue({
      content: 'Mocked AI insight response',
      metadata: { confidence: 0.9 },
    }),
    getMetrics: vi.fn().mockReturnValue({
      totalGenerated: 1000,
      averageDuration: 250,
      successRate: 0.92,
      cacheHitRate: 0.85,
      byProvider: {
        openai: {
          total: 800,
          averageDuration: 220,
          successRate: 0.95,
          cacheHitRate: 0.88,
        },
        anthropic: {
          total: 200,
          averageDuration: 300,
          successRate: 0.9,
          cacheHitRate: 0.82,
        },
      },
    }),
  }),
}));

// Mock useUser hook
vi.mock('@/hooks/useUser', () => ({
  useUser: () => ({
    user: {
      id: 'test-user',
      language: 'tr',
      healthStatus: 'active',
    },
  }),
}));

// Mock console.log
const mockConsoleLog = vi.spyOn(console, 'log');

describe('InsightOverlay', () => {
  const mockOnClose = vi.fn();

  const mockSnapshot: TelemetrySnapshot = {
    health: {
      vitals: {
        bloodPressure: 120,
        heartRate: 72,
        bloodOxygen: 98,
      },
      activity: {
        steps: 8000,
        activeMinutes: 45,
        caloriesBurned: 2200,
      },
      sleep: {
        sleepDuration: 6.5,
        sleepScore: 85,
        deepSleep: 2.1,
      },
      nutrition: {
        calorieIntake: 2100,
        waterIntake: 1.5,
        proteinIntake: 80,
      },
    },
    insights: {
      totalGenerated: 1000,
      averageDuration: 250,
      successRate: 0.92,
      cacheHitRate: 0.85,
      byProvider: {
        openai: {
          total: 800,
          averageDuration: 220,
          successRate: 0.95,
          cacheHitRate: 0.88,
        },
        anthropic: {
          total: 200,
          averageDuration: 300,
          successRate: 0.9,
          cacheHitRate: 0.82,
        },
      },
    },
    costs: {
      total: 50,
      byProvider: {
        openai: 40,
        anthropic: 10,
      },
      averagePerInsight: 0.05,
    },
    errors: {
      totalErrors: 50,
      byProvider: {
        openai: 30,
        anthropic: 20,
      },
      byType: {
        timeout: 20,
        validation: 30,
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockConsoleLog.mockClear();
    mockOnClose.mockClear();
  });

  describe('Rendering', () => {
    it('renders all section headings', () => {
      render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);

      expect(screen.getByText('Yaşamsal Metrikler')).toBeInTheDocument();
      expect(screen.getByText('Aktivite Metrikleri')).toBeInTheDocument();
      expect(screen.getByText('Uyku Metrikleri')).toBeInTheDocument();
    });

    it('renders vital metrics cards', () => {
      render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);

      expect(screen.getByText('Kan Basıncı')).toBeInTheDocument();
      expect(screen.getByText('120 mmHg')).toBeInTheDocument();
      expect(screen.getByText('Nabız')).toBeInTheDocument();
      expect(screen.getByText('72 bpm')).toBeInTheDocument();
    });

    it('renders activity metrics cards', () => {
      render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);

      expect(screen.getByText('Adım Sayısı')).toBeInTheDocument();
      expect(screen.getByText('8,000')).toBeInTheDocument();
      expect(screen.getByText('Aktif Dakika')).toBeInTheDocument();
      expect(screen.getByText('45 dk')).toBeInTheDocument();
    });

    it('renders sleep metrics cards', () => {
      render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);

      expect(screen.getByText('Uyku Süresi')).toBeInTheDocument();
      expect(screen.getByText('6.5 saat')).toBeInTheDocument();
      expect(screen.getByText('Uyku Kalitesi')).toBeInTheDocument();
      expect(screen.getByText('%85')).toBeInTheDocument();
    });

    it('renders AI recommendations', () => {
      render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);

      expect(screen.getByText(/Kan basıncınız yüksek seyrediyor/)).toBeInTheDocument();
      expect(screen.getByText(/Nabız değerleriniz ideal aralıkta/)).toBeInTheDocument();
      expect(screen.getByText(/Günlük adım hedefinizin altındasınız/)).toBeInTheDocument();
      expect(screen.getByText(/Aktif dakika hedefinizi aştınız/)).toBeInTheDocument();
      expect(
        screen.getByText(/Uyku süreniz önerilen 7-9 saat aralığının altında/)
      ).toBeInTheDocument();
      expect(screen.getByText(/Uyku kaliteniz iyi seviyede/)).toBeInTheDocument();
    });

    it('renders all metric cards', () => {
      render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);

      // Main metrics
      expect(screen.getByText('Toplam İçgörü')).toBeInTheDocument();
      expect(screen.getByText('1.000')).toBeInTheDocument();

      expect(screen.getByText('Önbellek Oranı')).toBeInTheDocument();
      expect(screen.getByText('%85.0')).toBeInTheDocument();

      expect(screen.getByText('Başarı Oranı')).toBeInTheDocument();
      expect(screen.getByText('%92.0')).toBeInTheDocument();

      expect(screen.getByText('Ortalama Süre')).toBeInTheDocument();
      expect(screen.getByText('250ms')).toBeInTheDocument();

      expect(screen.getByText('Toplam Maliyet')).toBeInTheDocument();
      expect(screen.getByText('$50.000')).toBeInTheDocument();

      expect(screen.getByText('İçgörü Başına Maliyet')).toBeInTheDocument();
      expect(screen.getByText('$0.05')).toBeInTheDocument();
    });

    it('renders provider costs', () => {
      render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);

      expect(screen.getByText('Sağlayıcı Maliyetleri')).toBeInTheDocument();
      expect(screen.getByText('openai Maliyeti')).toBeInTheDocument();
      expect(screen.getByText('$40.000')).toBeInTheDocument();
      expect(screen.getByText('anthropic Maliyeti')).toBeInTheDocument();
      expect(screen.getByText('$10.000')).toBeInTheDocument();
    });

    it('renders error metrics', () => {
      render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);

      expect(screen.getByText('Hata Metrikleri')).toBeInTheDocument();
      expect(screen.getByText('Toplam Hata')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('Hata Oranı')).toBeInTheDocument();
      expect(screen.getByText('%5.0')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Interactions', () => {
    it('calls onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /kapat/i });
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when Escape key is pressed', async () => {
      const user = userEvent.setup();
      render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);

      await user.keyboard('{Escape}');
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('logs recommendations when action buttons are clicked', async () => {
      const user = userEvent.setup();
      render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);

      // Click vital recommendation
      const vitalRecommendation = screen.getAllByText(/Detaylı/)[0];
      await user.click(vitalRecommendation);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'Vital recommendation:',
        'Detaylı sağlık önerileri burada gösterilecek.'
      );

      // Click activity recommendation
      const activityRecommendation = screen.getAllByText(/Detaylı/)[1];
      await user.click(activityRecommendation);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'Activity recommendation:',
        'Detaylı aktivite önerileri burada gösterilecek.'
      );

      // Click sleep recommendation
      const sleepRecommendation = screen.getAllByText(/Detaylı/)[2];
      await user.click(sleepRecommendation);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'Sleep recommendation:',
        'Detaylı uyku önerileri burada gösterilecek.'
      );
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('focuses close button on mount', () => {
      render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);
      const closeButton = screen.getByRole('button', { name: /kapat/i });
      expect(closeButton).toHaveFocus();
    });

    it('has proper ARIA labels', () => {
      render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);

      expect(screen.getByRole('button', { name: /kapat/i })).toHaveAttribute('aria-label', 'Kapat');
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('İçgörü Telemetrisi');
    });

    it('maintains proper heading hierarchy', () => {
      render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);

      const mainHeading = screen.getByRole('heading', { level: 2 });
      const subHeadings = screen.getAllByRole('heading', { level: 3 });

      expect(mainHeading).toBeInTheDocument();
      expect(subHeadings).toHaveLength(3);
    });
  });

  describe('Dark Mode', () => {
    it('applies dark mode classes correctly', () => {
      render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);

      const overlay = screen.getByRole('dialog', { hidden: true });
      expect(overlay.querySelector('.dark\\:bg-gray-800')).toBeInTheDocument();
      expect(overlay.querySelector('.dark\\:text-gray-100')).toBeInTheDocument();
    });
  });

  describe('Responsive Layout', () => {
    it('adjusts grid layout based on viewport', () => {
      const { container } = render(
        <InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />
      );

      const mainGrid = container.querySelector('.grid');
      expect(mainGrid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
    });
  });

  it('renders all sections with correct metrics', () => {
    render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);

    // Check section headings
    expect(screen.getByText('Yaşamsal Metrikler')).toBeInTheDocument();
    expect(screen.getByText('Aktivite Metrikleri')).toBeInTheDocument();
    expect(screen.getByText('Uyku Metrikleri')).toBeInTheDocument();
    expect(screen.getByText('Beslenme Metrikleri')).toBeInTheDocument();
  });

  it('shows AI recommendations for concerning metrics', () => {
    render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);

    // Check blood pressure recommendation
    expect(screen.getByText(/Kan basıncınız yüksek seyrediyor/)).toBeInTheDocument();

    // Check heart rate recommendation
    expect(screen.getByText(/Dinlenim nabzınız yüksek/)).toBeInTheDocument();

    // Check oxygen level recommendation
    expect(screen.getByText(/Oksijen seviyeniz düşük/)).toBeInTheDocument();

    // Check steps recommendation
    expect(screen.getByText(/Günlük adım hedefinizin altındasınız/)).toBeInTheDocument();
  });

  it('applies correct priority styling to recommendations', () => {
    render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);

    // Blood pressure should have medium priority
    const bloodPressureCard =
      screen.getByText(/Kan basıncınız yüksek/).parentElement?.parentElement;
    expect(bloodPressureCard).toHaveClass('bg-yellow-50');

    // Heart rate should have medium priority
    const heartRateCard = screen.getByText(/Dinlenim nabzınız yüksek/).parentElement?.parentElement;
    expect(heartRateCard).toHaveClass('bg-yellow-50');
  });

  it('shows action buttons for actionable recommendations', async () => {
    const user = userEvent.setup();
    render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);

    const actionButtons = screen.getAllByText('Önerileri Gör');
    expect(actionButtons.length).toBeGreaterThan(0);

    // Click first action button
    await user.click(actionButtons[0]);
    // Verify console log (temporary until AI provider implementation)
    expect(mockConsoleLog).toHaveBeenCalledWith(
      'Vital recommendation:',
      expect.objectContaining({
        content: 'Mocked AI insight response',
        metadata: { confidence: 0.9 },
      })
    );
  });

  it('maintains accessibility with AI recommendations', async () => {
    const { container } = render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();

    // Check ARIA labels
    const recommendationButtons = screen.getAllByText('Önerileri Gör');
    recommendationButtons.forEach((button) => {
      expect(button).toHaveAttribute('aria-label');
    });
  });

  it('handles metric thresholds correctly', () => {
    const customSnapshot = {
      ...mockSnapshot,
      health: {
        ...mockSnapshot.health,
        vitals: {
          ...mockSnapshot.health.vitals,
          bloodPressure: 145,
        },
      },
    };

    render(<InsightOverlay snapshot={customSnapshot} onClose={mockOnClose} />);

    // Check high priority styling
    const bloodPressureCard =
      screen.getByText(/Kan basıncınız yüksek/).parentElement?.parentElement;
    expect(bloodPressureCard).toHaveClass('bg-red-50');
  });

  describe('Render Tests', () => {
    it('renders all health metric sections', () => {
      render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);

      // Check section headings
      expect(screen.getByText('Yaşamsal Metrikler')).toBeInTheDocument();
      expect(screen.getByText('Aktivite Metrikleri')).toBeInTheDocument();
      expect(screen.getByText('Uyku Metrikleri')).toBeInTheDocument();
    });

    it('renders all StatusTrendCards with correct data', () => {
      render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);

      // Check vital signs cards
      expect(screen.getByText('Kan Basıncı')).toBeInTheDocument();
      expect(screen.getByText('120 mmHg')).toBeInTheDocument();
      expect(screen.getByText('Nabız')).toBeInTheDocument();
      expect(screen.getByText('72 bpm')).toBeInTheDocument();

      // Check activity cards
      expect(screen.getByText('Adım Sayısı')).toBeInTheDocument();
      expect(screen.getByText('8,000')).toBeInTheDocument();
      expect(screen.getByText('Aktif Dakika')).toBeInTheDocument();
      expect(screen.getByText('45 dk')).toBeInTheDocument();

      // Check sleep cards
      expect(screen.getByText('Uyku Süresi')).toBeInTheDocument();
      expect(screen.getByText('6.5 saat')).toBeInTheDocument();
      expect(screen.getByText('Uyku Kalitesi')).toBeInTheDocument();
      expect(screen.getByText('%85')).toBeInTheDocument();
    });
  });

  describe('AI Recommendation Tests', () => {
    it('shows AI recommendations for each metric', () => {
      render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);

      // Check vital signs recommendations
      expect(screen.getByText(/Kan basıncınız yüksek seyrediyor/)).toBeInTheDocument();
      expect(screen.getByText(/Nabız değerleriniz ideal aralıkta/)).toBeInTheDocument();

      // Check activity recommendations
      expect(screen.getByText(/Günlük adım hedefinizin altındasınız/)).toBeInTheDocument();
      expect(screen.getByText(/Aktif dakika hedefinizi aştınız/)).toBeInTheDocument();

      // Check sleep recommendations
      expect(
        screen.getByText(/Uyku süreniz önerilen 7-9 saat aralığının altında/)
      ).toBeInTheDocument();
      expect(screen.getByText(/Uyku kaliteniz iyi seviyede/)).toBeInTheDocument();
    });

    it('applies correct priority styling to recommendations', () => {
      render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);

      // Blood pressure should have high priority
      const bloodPressureCard =
        screen.getByText(/Kan basıncınız yüksek/).parentElement?.parentElement;
      expect(bloodPressureCard).toHaveClass('bg-red-50');

      // Steps should have medium priority
      const stepsCard = screen.getByText(/Günlük adım hedefinizin altındasınız/).parentElement
        ?.parentElement;
      expect(stepsCard).toHaveClass('bg-yellow-50');

      // Heart rate should have low priority
      const heartRateCard =
        screen.getByText(/Nabız değerleriniz ideal/).parentElement?.parentElement;
      expect(heartRateCard).toHaveClass('bg-gray-50');
    });
  });

  describe('Accessibility Tests', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('uses correct ARIA labels', () => {
      render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);

      // Check status cards
      const statusCards = screen.getAllByRole('status');
      statusCards.forEach((card) => {
        expect(card).toHaveAttribute('aria-label');
      });

      // Check close button
      const closeButton = screen.getByRole('button', { name: /kapat/i });
      expect(closeButton).toHaveAttribute('aria-label', 'Kapat');
    });

    it('supports keyboard navigation', async () => {
      render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);

      // Check if all action buttons are focusable
      const actionButtons = screen.getAllByRole('button');
      actionButtons.forEach((button) => {
        button.focus();
        expect(button).toHaveFocus();
      });

      // Check if Escape key closes the overlay
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Interaction Tests', () => {
    it('calls onClose when close button is clicked', () => {
      render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /kapat/i });
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('handles recommendation button clicks', async () => {
      render(<InsightOverlay snapshot={mockSnapshot} onClose={mockOnClose} />);

      const recommendationButtons = screen.getAllByRole('button', { name: /önerileri gör/i });
      fireEvent.click(recommendationButtons[0]);

      await waitFor(() => {
        expect(mockConsoleLog).toHaveBeenCalledWith('Vital recommendation:', expect.any(String));
      });
    });
  });
});
