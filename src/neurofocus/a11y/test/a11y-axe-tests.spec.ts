import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { FocusInsightDashboard } from '../../components/FocusInsightDashboard';
import { TaskBreakdownCard } from '../../components/TaskBreakdownCard';
import { App } from '../../App';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('FocusInsightDashboard should have no accessibility violations', async () => {
    const { container } = render(<FocusInsightDashboard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('TaskBreakdownCard should have no accessibility violations', async () => {
    const mockTask = {
      id: 'test-task',
      title: 'Test Task',
      description: 'A test task for accessibility testing',
      difficulty: 1,
      steps: [
        {
          step: 'Step 1',
          duration: '1 minute',
          support: 'Test support',
        },
      ],
      emotionalSupport: ['Test support'],
      adaptiveHints: ['Test hint'],
    };

    const { container } = render(
      <TaskBreakdownCard
        task={mockTask}
        onEmotionChange={() => {}}
        onTaskComplete={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Full app should have no accessibility violations', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe('Color Contrast Tests', () => {
    it('should meet WCAG 2.1 AA contrast requirements for all emotional states', () => {
      const { getContrastRatio } = require('../color-contrast');
      const { emotionalColorPalettes } = require('../color-contrast');

      Object.entries(emotionalColorPalettes).forEach(([emotion, palette]) => {
        // Test text contrast
        const textContrast = getContrastRatio(palette.background, palette.text);
        expect(textContrast).toBeGreaterThanOrEqual(4.5);

        // Test primary button contrast
        const primaryContrast = getContrastRatio(palette.primary, palette.contrast.normal);
        expect(primaryContrast).toBeGreaterThanOrEqual(4.5);
      });
    });
  });

  describe('Keyboard Navigation Tests', () => {
    it('should trap focus in modal dialogs', () => {
      const { createFocusTrap } = require('../keyboard-navigation');
      const dialog = document.createElement('div');
      const button1 = document.createElement('button');
      const button2 = document.createElement('button');
      
      dialog.appendChild(button1);
      dialog.appendChild(button2);
      document.body.appendChild(dialog);

      const cleanup = createFocusTrap(dialog);
      
      // Simulate tab navigation
      button1.focus();
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      dialog.dispatchEvent(tabEvent);
      
      expect(document.activeElement).toBe(button2);

      cleanup?.();
      document.body.removeChild(dialog);
    });
  });

  describe('Screen Reader Announcements', () => {
    it('should create and remove announcement elements', () => {
      const { announceToScreenReader } = require('../keyboard-navigation');
      const message = 'Test announcement';
      
      announceToScreenReader(message);
      
      const announcement = document.querySelector('[role="status"]');
      expect(announcement).toBeTruthy();
      expect(announcement?.textContent).toBe(message);
      
      // Wait for cleanup
      return new Promise(resolve => {
        setTimeout(() => {
          expect(document.querySelector('[role="status"]')).toBeFalsy();
          resolve(true);
        }, 1000);
      });
    });
  });
});

// Custom matchers for accessibility testing
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R;
    }
  }
} 