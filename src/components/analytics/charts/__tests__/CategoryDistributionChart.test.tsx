import { render, screen } from '@testing-library/react';
import { CategoryDistributionChart } from '../CategoryDistributionChart';
import type { TimelineEvent } from '@/types/timeline';

// Mock Recharts to avoid SVG rendering issues in tests
const mockRecharts = {
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Pie: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Cell: () => null,
  Tooltip: () => null,
  Legend: () => null,
};

jest.mock('recharts', () => mockRecharts);

describe('CategoryDistributionChart', () => {
  const now = new Date();
  const mockEvents: TimelineEvent[] = [
    {
      id: '1',
      title: 'Health Task 1',
      category: 'health',
      date: now,
      status: 'completed',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '2',
      title: 'Health Task 2',
      category: 'health',
      date: now,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '3',
      title: 'Exercise Task',
      category: 'exercise',
      date: now,
      status: 'completed',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '4',
      title: 'Medication Task',
      category: 'medication',
      date: now,
      status: 'completed',
      createdAt: now,
      updatedAt: now,
    },
  ];

  it('renders without crashing', () => {
    render(<CategoryDistributionChart events={mockEvents} />);
    expect(screen.getByRole('graphics-document')).toBeInTheDocument();
  });

  it('displays correct number of categories', () => {
    const { container } = render(<CategoryDistributionChart events={mockEvents} />);
    const cells = container.querySelectorAll('Cell');
    expect(cells).toHaveLength(3); // health, exercise, medication
  });

  it('handles empty events array', () => {
    render(<CategoryDistributionChart events={[]} />);
    expect(screen.getByRole('graphics-document')).toBeInTheDocument();
  });

  it('calculates category distribution correctly', () => {
    const { container } = render(<CategoryDistributionChart events={mockEvents} />);
    const chartData = JSON.parse(container.dataset.chartData || '[]');
    
    const healthCategory = chartData.find((item: any) => item.name === 'health');
    expect(healthCategory).toBeTruthy();
    expect(healthCategory.value).toBe(2); // 2 health tasks
    expect(healthCategory.completed).toBe(1); // 1 completed health task
    expect(healthCategory.completionRate).toBe(50); // 50% completion rate
  });

  it('applies custom className', () => {
    const { container } = render(
      <CategoryDistributionChart events={mockEvents} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('uses correct colors for categories', () => {
    const { container } = render(<CategoryDistributionChart events={mockEvents} />);
    const cells = container.querySelectorAll('Cell');
    
    const healthCell = Array.from(cells).find(
      (cell) => cell.getAttribute('fill') === '#10b981'
    );
    const exerciseCell = Array.from(cells).find(
      (cell) => cell.getAttribute('fill') === '#f59e0b'
    );
    const medicationCell = Array.from(cells).find(
      (cell) => cell.getAttribute('fill') === '#6366f1'
    );

    expect(healthCell).toBeTruthy();
    expect(exerciseCell).toBeTruthy();
    expect(medicationCell).toBeTruthy();
  });
}); 