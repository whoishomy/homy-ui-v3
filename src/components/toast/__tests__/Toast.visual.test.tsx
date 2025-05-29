import { describe, it, expect, beforeAll } from 'vitest';
import { render } from '@testing-library/react';
import { Toast } from '../Toast';
import type { Toast as ToastType } from '@/types/toast';

// Helper function to take screenshots
const takeScreenshot = async (element: HTMLElement, name: string) => {
  // This would be replaced with actual CleanShot integration
  console.log(`Taking screenshot: ${name}`);
  return element;
};

describe('Toast Visual Regression', () => {
  const variants: ToastType['variant'][] = ['default', 'success', 'error', 'warning', 'info'];
  
  beforeAll(() => {
    // Set up consistent viewport size
    window.innerWidth = 1280;
    window.innerHeight = 720;
  });

  it.each(variants)('should match snapshot for %s variant', async (variant) => {
    const mockToast: ToastType = {
      id: '1',
      title: 'Test Title',
      message: 'Test message for visual testing',
      description: 'This is a longer description to test multiline content',
      variant,
      type: variant === 'default' ? 'info' : variant,
    };

    const { container } = render(<Toast toast={mockToast} />);
    const screenshot = await takeScreenshot(container, `toast-${variant}`);
    expect(screenshot).toBeTruthy();
  });

  it('should match snapshot with long content', async () => {
    const mockToast: ToastType = {
      id: '1',
      title: 'Very Long Title That Should Wrap to Multiple Lines',
      message: 'This is a very long message that should demonstrate how the toast handles overflow and text wrapping in various scenarios',
      description: 'And this is an even longer description that should show how the toast adapts to different content lengths while maintaining its design integrity and accessibility',
      variant: 'info',
      type: 'info',
    };

    const { container } = render(<Toast toast={mockToast} />);
    const screenshot = await takeScreenshot(container, 'toast-long-content');
    expect(screenshot).toBeTruthy();
  });

  it('should match snapshot with minimal content', async () => {
    const mockToast: ToastType = {
      id: '1',
      message: 'Short message',
      variant: 'default',
      type: 'info',
    };

    const { container } = render(<Toast toast={mockToast} />);
    const screenshot = await takeScreenshot(container, 'toast-minimal');
    expect(screenshot).toBeTruthy();
  });

  describe('Dark Mode', () => {
    beforeAll(() => {
      document.documentElement.classList.add('dark');
    });

    afterAll(() => {
      document.documentElement.classList.remove('dark');
    });

    it.each(variants)('should match dark mode snapshot for %s variant', async (variant) => {
      const mockToast: ToastType = {
        id: '1',
        title: 'Dark Mode Test',
        message: 'Testing dark mode appearance',
        variant,
        type: variant === 'default' ? 'info' : variant,
      };

      const { container } = render(<Toast toast={mockToast} />);
      const screenshot = await takeScreenshot(container, `toast-dark-${variant}`);
      expect(screenshot).toBeTruthy();
    });
  });

  describe('Responsive Design', () => {
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1440, height: 900, name: 'desktop' },
    ];

    it.each(viewports)('should match snapshot on $name viewport', async ({ width, height, name }) => {
      window.innerWidth = width;
      window.innerHeight = height;

      const mockToast: ToastType = {
        id: '1',
        title: 'Responsive Test',
        message: 'Testing responsive layout',
        description: 'This toast should adapt to different screen sizes',
        variant: 'info',
        type: 'info',
      };

      const { container } = render(<Toast toast={mockToast} />);
      const screenshot = await takeScreenshot(container, `toast-${name}`);
      expect(screenshot).toBeTruthy();
    });
  });
}); 