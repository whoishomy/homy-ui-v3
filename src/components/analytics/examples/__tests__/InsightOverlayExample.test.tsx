import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { InsightOverlayExample } from '../InsightOverlayExample';

describe('InsightOverlayExample', () => {
  it('renders loading state initially', () => {
    render(<InsightOverlayExample />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders button after loading', async () => {
    render(<InsightOverlayExample />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Telemetri Göstergesini Aç' })).toBeInTheDocument();
    });
  });

  it('opens overlay when button is clicked', async () => {
    const user = userEvent.setup();
    render(<InsightOverlayExample />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Telemetri Göstergesini Aç' })).toBeInTheDocument();
    });

    const button = screen.getByRole('button', { name: 'Telemetri Göstergesini Aç' });
    await user.click(button);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('İçgörü Telemetrisi')).toBeInTheDocument();
  });

  it('closes overlay when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<InsightOverlayExample />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Telemetri Göstergesini Aç' })).toBeInTheDocument();
    });

    const openButton = screen.getByRole('button', { name: 'Telemetri Göstergesini Aç' });
    await user.click(openButton);

    const closeButton = screen.getByRole('button', { name: 'Kapat' });
    await user.click(closeButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('displays sample data correctly', async () => {
    render(<InsightOverlayExample />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Telemetri Göstergesini Aç' })).toBeInTheDocument();
    });

    const button = screen.getByRole('button', { name: 'Telemetri Göstergesini Aç' });
    await userEvent.click(button);

    // Check total metrics
    expect(screen.getByText('6')).toBeInTheDocument(); // Total insights
    expect(screen.getByText('%33.3')).toBeInTheDocument(); // Cache hit rate (2/6)
    expect(screen.getByText('%66.7')).toBeInTheDocument(); // Success rate (4/6)
    expect(screen.getByText('225ms')).toBeInTheDocument(); // Average duration

    // Check costs
    expect(screen.getByText('$0.050')).toBeInTheDocument(); // Total cost
    expect(screen.getByText('$0.0083')).toBeInTheDocument(); // Average cost per insight

    // Check provider metrics
    expect(screen.getByText('openai Maliyeti')).toBeInTheDocument();
    expect(screen.getByText('$0.020')).toBeInTheDocument();
    expect(screen.getByText('anthropic Maliyeti')).toBeInTheDocument();
    expect(screen.getByText('$0.030')).toBeInTheDocument();

    // Check error metrics
    expect(screen.getByText('2')).toBeInTheDocument(); // Total errors
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<InsightOverlayExample />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Telemetri Göstergesini Aç' })).toBeInTheDocument();
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
