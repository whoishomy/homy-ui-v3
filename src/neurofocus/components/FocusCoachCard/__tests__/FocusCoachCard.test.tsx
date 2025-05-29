import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import { FocusCoachCard } from '../FocusCoachCard';
import { EmotionalResponse } from '../../../core/types';

const mockTask = {
  id: 'task-1',
  title: 'Matematik ödevini tamamla',
  steps: ['Soruları oku', 'Çözümleri yaz', 'Kontrol et'],
  duration: 15,
};

const mockOnEmotionChange = jest.fn();
const mockOnHelpClick = jest.fn();

describe('FocusCoachCard - Eren Mode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task content correctly', () => {
    render(
      <FocusCoachCard
        currentTask={mockTask}
        onEmotionChange={mockOnEmotionChange}
        onHelpClick={mockOnHelpClick}
      />
    );

    expect(screen.getByText('Matematik ödevini tamamla')).toBeInTheDocument();
    expect(screen.getByText('Soruları oku')).toBeInTheDocument();
    expect(screen.getByText('15 dakika')).toBeInTheDocument();
  });

  it('triggers emotion change when emotion buttons are clicked', async () => {
    render(<FocusCoachCard currentTask={mockTask} onEmotionChange={mockOnEmotionChange} />);

    const happyButton = screen.getByRole('button', { name: /mutlu/i });
    fireEvent.click(happyButton);

    await waitFor(() => {
      expect(mockOnEmotionChange).toHaveBeenCalledWith('motivation');
    });
  });

  it('shows support message when help is clicked', async () => {
    render(<FocusCoachCard currentTask={mockTask} onHelpClick={mockOnHelpClick} />);

    const helpButton = screen.getByRole('button', { name: /yardım/i });
    fireEvent.click(helpButton);

    await waitFor(() => {
      expect(mockOnHelpClick).toHaveBeenCalled();
      expect(screen.getByText(/nasıl yardımcı olabilirim/i)).toBeInTheDocument();
    });
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <FocusCoachCard
        currentTask={mockTask}
        onEmotionChange={mockOnEmotionChange}
        onHelpClick={mockOnHelpClick}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('matches snapshot', () => {
    const { container } = render(
      <FocusCoachCard
        currentTask={mockTask}
        onEmotionChange={mockOnEmotionChange}
        onHelpClick={mockOnHelpClick}
      />
    );

    expect(container).toMatchSnapshot();
  });

  it('shows progress timeline when task is completed', async () => {
    render(
      <FocusCoachCard
        currentTask={mockTask}
        isCompleted={true}
        onEmotionChange={mockOnEmotionChange}
      />
    );

    expect(screen.getByTestId('success-timeline')).toBeInTheDocument();
    expect(screen.getByText(/tebrikler/i)).toBeInTheDocument();
  });

  it('handles emotional response with appropriate feedback', async () => {
    render(<FocusCoachCard currentTask={mockTask} onEmotionChange={mockOnEmotionChange} />);

    // Test different emotional responses
    const emotions: EmotionalResponse[] = ['neutral', 'concern', 'relief', 'motivation'];

    for (const emotion of emotions) {
      const button = screen.getByTestId(`emotion-${emotion}`);
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockOnEmotionChange).toHaveBeenCalledWith(emotion);
        expect(screen.getByTestId('emotional-feedback')).toHaveTextContent(
          emotion === 'concern'
            ? /yardımcı olabilirim/i
            : emotion === 'motivation'
              ? /harika gidiyorsun/i
              : emotion === 'relief'
                ? /çok iyi/i
                : /devam et/i
        );
      });
    }
  });
});
