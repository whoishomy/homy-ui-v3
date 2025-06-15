import { render, screen } from '@testing-library/react';
import { HealthScoreTrendChart } from '../HealthScoreTrendChart';
import type { TimelineEvent } from '@/types/timeline';
import { subDays } from 'date-fns';

// Mock Recharts to avoid SVG rendering issues in tests
const mockRecharts = {
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
};

jest.mock('recharts', () => mockRecharts);

// Mock ResizeObserver since it's not available in jsdom
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('HealthScoreTrendChart', () => {
  const generateMockEvents = (days: number): TimelineEvent[] => {
    return Array.from({ length: days }).map((_, index) => {
      const date = subDays(new Date(), index);
      return {
        id: `event-${index}`,
        title: `Test Event ${index}`,
        description: 'Test Description',
        category: 'health',
        date,
        status: index % 2 === 0 ? 'completed' : 'pending',
        duration: 30,
        createdAt: date,
        updatedAt: date,
      };
    });
  };

  it('renders without crashing', () => {
    const events = generateMockEvents(7);
    render(<HealthScoreTrendChart events={events} />);
    expect(screen.getByRole('graphics-document')).toBeInTheDocument();
  });

  it('displays correct number of data points', () => {
    const events = generateMockEvents(7);
    const { container } = render(<HealthScoreTrendChart events={events} />);
    const lines = container.querySelectorAll('Line');
    expect(lines).toHaveLength(2); // Health Score and Completion Rate lines
  });

  it('handles empty events array', () => {
    render(<HealthScoreTrendChart events={[]} />);
    expect(screen.getByRole('graphics-document')).toBeInTheDocument();
  });

  it('calculates health scores correctly', () => {
    const now = new Date();
    const events = [
      {
        id: 'test-1',
        title: 'Test Event',
        category: 'health',
        date: now,
        status: 'completed',
        duration: 30,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'test-2',
        title: 'Test Event 2',
        category: 'exercise',
        date: now,
        status: 'completed',
        duration: 30,
        createdAt: now,
        updatedAt: now,
      },
    ] as TimelineEvent[];

    const { container } = render(<HealthScoreTrendChart events={events} />);
    const chartData = JSON.parse(container.dataset.chartData || '[]');

    // 100% completion rate (2/2)
    // 40% task count score (2/5 tasks)
    // 50% category diversity (2/4 categories)
    // Expected score: (100 * 0.4) + (40 * 0.3) + (50 * 0.3) = 66
    expect(chartData[6].score).toBe(66); // Today's score (last data point)
  });

  it('applies custom className', () => {
    const events = generateMockEvents(7);
    const { container } = render(
      <HealthScoreTrendChart events={events} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders with default props', () => {
    render(<HealthScoreTrendChart />);
    expect(screen.getByLabelText('Health score trend chart')).toBeInTheDocument();
    expect(screen.getByText('Health Score Trend')).toBeInTheDocument();
  });

  it('renders with custom data', () => {
    const mockData = [
      { date: '2024-05-20', score: 85 },
      { date: '2024-05-21', score: 83 },
      { date: '2024-05-22', score: 87 },
    ];
    render(<HealthScoreTrendChart data={mockData} />);
    expect(screen.getByLabelText('Health score trend chart')).toBeInTheDocument();
  });

  it('renders with weekly view mode', () => {
    const mockData = [
      { date: '2024-05-20', score: 85 },
      { date: '2024-05-21', score: 83 },
      { date: '2024-05-22', score: 87 },
    ];
    render(<HealthScoreTrendChart data={mockData} viewMode="weekly" />);
    expect(screen.getByLabelText('Health score trend chart')).toBeInTheDocument();
  });

  it('renders with custom height', () => {
    const mockData = [
      { date: '2024-05-20', score: 85 },
      { date: '2024-05-21', score: 83 },
      { date: '2024-05-22', score: 87 },
    ];
    const customHeight = 400;
    render(<HealthScoreTrendChart data={mockData} height={customHeight} />);
    const container = screen.getByLabelText('Health score trend chart');
    expect(container).toBeInTheDocument();
  });
});
