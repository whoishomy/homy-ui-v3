import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ThemeProvider } from '@emotion/react';
import { Header } from '../Header';
import { lightTheme } from '@/themes/light';

expect.extend(toHaveNoViolations);

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={lightTheme}>{ui}</ThemeProvider>);
};

describe('Header', () => {
  it('renders without crashing', () => {
    renderWithTheme(<Header>Test Content</Header>);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    renderWithTheme(
      <Header>
        <div data-testid="test-child">Child Content</div>
      </Header>
    );
    expect(screen.getByTestId('test-child')).toHaveTextContent('Child Content');
  });

  it('applies blur effect by default', () => {
    const { container } = renderWithTheme(<Header>Content</Header>);
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveStyle('backdrop-filter: blur(10px)');
  });

  it('can disable blur effect', () => {
    const { container } = renderWithTheme(<Header hasBlur={false}>Content</Header>);
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveStyle('backdrop-filter: none');
  });

  it('is sticky positioned', () => {
    const { container } = renderWithTheme(<Header>Content</Header>);
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveStyle('position: sticky');
    expect(header).toHaveStyle('top: 0');
  });

  it('has correct z-index for overlay content', () => {
    const { container } = renderWithTheme(<Header>Content</Header>);
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveStyle('z-index: 10');
  });

  it('passes custom className to container', () => {
    const { container } = renderWithTheme(<Header className="custom-class">Content</Header>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('supports animation variants', () => {
    const variants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };
    const { container } = renderWithTheme(<Header variants={variants}>Content</Header>);
    expect(container.firstChild).toHaveAttribute('data-framer-motion');
  });

  it('has no accessibility violations', async () => {
    const { container } = renderWithTheme(
      <Header>
        <h1>Page Title</h1>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/settings">Settings</a>
        </nav>
      </Header>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe('Responsive Behavior', () => {
    it('maintains layout on different screen sizes', () => {
      const { container } = renderWithTheme(
        <Header>
          <div>Left Content</div>
          <div>Right Content</div>
        </Header>
      );

      // Test at mobile width
      window.innerWidth = 375;
      window.dispatchEvent(new Event('resize'));
      expect(container.firstChild).toBeVisible();

      // Test at tablet width
      window.innerWidth = 768;
      window.dispatchEvent(new Event('resize'));
      expect(container.firstChild).toBeVisible();

      // Test at desktop width
      window.innerWidth = 1280;
      window.dispatchEvent(new Event('resize'));
      expect(container.firstChild).toBeVisible();
    });
  });

  describe('Theme Integration', () => {
    it('applies theme-based styles correctly', () => {
      const { container } = renderWithTheme(<Header>Content</Header>);
      const header = container.firstChild as HTMLElement;

      // Check border color from theme
      expect(header).toHaveStyle(`border-bottom: 1px solid ${lightTheme.tokens.colors.border}`);

      // Check background color from theme
      expect(header).toHaveStyle(`background: ${lightTheme.tokens.colors.surface}`);
    });
  });
});
