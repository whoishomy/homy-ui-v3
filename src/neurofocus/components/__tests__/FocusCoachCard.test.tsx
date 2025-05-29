import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { FocusCoachCard } from '../FocusCoachCard';
import { erenMemoryStore } from '../../store/erenMemoryStore';

// Mock the erenMemoryStore
jest.mock('../../store/erenMemoryStore', () => ({
  erenMemoryStore: {
    recordEmotionalSnapshot: jest.fn(),
  },
}));

describe('FocusCoachCard', () => {
  const mockOnEmotionChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { container } = render(
      <FocusCoachCard currentTask="Test Task" onEmotionChange={mockOnEmotionChange} />
    );
    expect(container).toMatchSnapshot();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <FocusCoachCard currentTask="Test Task" onEmotionChange={mockOnEmotionChange} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('displays task title', () => {
    render(<FocusCoachCard currentTask="Test Task" onEmotionChange={mockOnEmotionChange} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText("Eren'in Koçu")).toBeInTheDocument();
  });

  it('handles determined emotion button click', async () => {
    const user = userEvent.setup();

    render(<FocusCoachCard currentTask="Test Task" onEmotionChange={mockOnEmotionChange} />);

    const determinedButton = screen.getByText('Yapabilirim! 💪');
    await user.click(determinedButton);

    expect(mockOnEmotionChange).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'determined',
        intensity: 0.8,
      })
    );
    expect(erenMemoryStore.recordEmotionalSnapshot).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'determined',
        intensity: 0.8,
      })
    );
  });

  it('handles overwhelmed emotion button click', async () => {
    const user = userEvent.setup();

    render(<FocusCoachCard currentTask="Test Task" onEmotionChange={mockOnEmotionChange} />);

    const helpButton = screen.getByText('Yardım İstiyorum 🤝');
    await user.click(helpButton);

    expect(mockOnEmotionChange).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'overwhelmed',
        intensity: 0.6,
      })
    );
    expect(erenMemoryStore.recordEmotionalSnapshot).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'overwhelmed',
        intensity: 0.6,
      })
    );
  });

  describe('Visual Regression Tests', () => {
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1440, height: 900, name: 'desktop' },
    ];

    viewports.forEach((viewport) => {
      it(`matches snapshot at ${viewport.name} viewport`, async () => {
        Object.defineProperty(window, 'innerWidth', { value: viewport.width });
        Object.defineProperty(window, 'innerHeight', { value: viewport.height });

        const { container } = render(
          <FocusCoachCard currentTask="Test Task" onEmotionChange={mockOnEmotionChange} />
        );

        // Wait for any animations or state updates to complete
        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
        });

        expect(container).toMatchSnapshot(`FocusCoachCard-${viewport.name}`);
      });
    });
  });
});
