import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotificationFeed } from '../NotificationFeed';
import { mockFormat } from '@/test/mocks/dateMock';
import '../../../test/mocks/resizeObserverMock';

// Mock date-fns
jest.mock('date-fns', () => ({
  format: jest
    .fn()
    .mockImplementation((date, format, options) => mockFormat(date, format, options)),
}));

// Mock date-fns/locale
jest.mock('date-fns/locale', () => ({
  tr: {},
}));

// Mock data
const mockNotifications = [
  {
    id: '1',
    title: 'Yeni Laboratuvar Sonucu',
    message: 'Hemoglobin testi sonucunuz hazır.',
    timestamp: '2024-03-15T10:00:00Z',
    read: false,
    type: 'info' as const,
  },
  {
    id: '2',
    title: 'AI Önerisi',
    message: 'Son 3 test sonucunuzda iyileşme trendi gözlemlendi.',
    timestamp: '2024-03-15T09:30:00Z',
    read: true,
    type: 'insight' as const,
    insight: {
      confidence: 0.95,
      sourceData: ['lab-history', 'trend-analysis'],
    },
  },
];

describe('NotificationFeed Integration Tests', () => {
  const defaultProps = {
    isOpen: true,
    onCloseAction: jest.fn(),
    notifications: mockNotifications,
    onMarkAsReadAction: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders notification feed correctly', () => {
    render(<NotificationFeed {...defaultProps} />);

    // Check title
    expect(screen.getByText('Bildirimler')).toBeInTheDocument();

    // Check notifications
    mockNotifications.forEach((notification) => {
      expect(screen.getByText(notification.title)).toBeInTheDocument();
      expect(screen.getByText(notification.message)).toBeInTheDocument();
    });

    // Check icons
    expect(screen.getByTestId('info-icon')).toBeInTheDocument();
    expect(screen.getByTestId('insight-icon')).toBeInTheDocument();
  });

  it('shows empty state when no notifications', () => {
    render(<NotificationFeed {...defaultProps} notifications={[]} />);
    expect(screen.getByText('Henüz bildirim bulunmuyor')).toBeInTheDocument();
  });

  it('handles close action', () => {
    render(<NotificationFeed {...defaultProps} />);

    const closeButton = screen.getByRole('button', { name: /kapat/i });
    fireEvent.click(closeButton);

    expect(defaultProps.onCloseAction).toHaveBeenCalled();
  });

  it('applies correct styling for unread notifications', () => {
    render(<NotificationFeed {...defaultProps} />);

    const unreadTitle = screen.getByText(mockNotifications[0].title);
    const readTitle = screen.getByText(mockNotifications[1].title);

    expect(unreadTitle).toHaveClass('font-semibold');
    expect(readTitle).not.toHaveClass('font-semibold');
  });

  it('renders AI insight notifications with correct icon and metadata', () => {
    render(<NotificationFeed {...defaultProps} />);

    const insightNotification = mockNotifications[1];
    expect(screen.getByTestId('insight-icon')).toBeInTheDocument();
    expect(screen.getByText(insightNotification.title)).toBeInTheDocument();
    expect(screen.getByText(insightNotification.message)).toBeInTheDocument();

    // Check insight metadata
    expect(screen.getByText('Güven: %95')).toBeInTheDocument();
    expect(screen.getByText(/lab-history, trend-analysis/)).toBeInTheDocument();
  });
});
