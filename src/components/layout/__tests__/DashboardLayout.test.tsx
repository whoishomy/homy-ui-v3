import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { defaultTheme } from '@/types/TrademarkTheme';
import { DashboardLayout } from '../DashboardLayout';

// Mock components
const Header = () => <div data-testid="header">Header Content</div>;
const Sidebar = () => <div data-testid="sidebar">Sidebar Content</div>;
const Content = () => <div data-testid="content">Main Content</div>;

// Wrap component with theme provider
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={defaultTheme}>{ui}</ThemeProvider>);
};

describe('DashboardLayout', () => {
  it('renders all sections when provided', () => {
    renderWithTheme(
      <DashboardLayout header={<Header />} sidebar={<Sidebar />}>
        <Content />
      </DashboardLayout>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('renders without header when not provided', () => {
    renderWithTheme(
      <DashboardLayout sidebar={<Sidebar />}>
        <Content />
      </DashboardLayout>
    );

    expect(screen.queryByTestId('header')).not.toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('renders without sidebar when not provided', () => {
    renderWithTheme(
      <DashboardLayout header={<Header />}>
        <Content />
      </DashboardLayout>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('applies correct classes when sidebar is collapsed', () => {
    const { container } = renderWithTheme(
      <DashboardLayout header={<Header />} sidebar={<Sidebar />} isSidebarCollapsed>
        <Content />
      </DashboardLayout>
    );

    const sidebar = container.querySelector('[data-testid="sidebar"]')?.parentElement;
    expect(sidebar).toHaveStyle({ width: '80px' });
  });

  it('renders with custom className', () => {
    const { container } = renderWithTheme(
      <DashboardLayout className="custom-class">
        <Content />
      </DashboardLayout>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  // Test responsive behavior
  it('adjusts layout for mobile screens', () => {
    // Mock window.matchMedia
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === '(max-width: 768px)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    const { container } = renderWithTheme(
      <DashboardLayout header={<Header />} sidebar={<Sidebar />}>
        <Content />
      </DashboardLayout>
    );

    const sidebar = container.querySelector('[data-testid="sidebar"]')?.parentElement;
    expect(sidebar).toHaveStyle({ width: '100%' });
  });

  // Test animation presence
  it('includes animation variants', () => {
    const { container } = renderWithTheme(
      <DashboardLayout>
        <Content />
      </DashboardLayout>
    );

    const root = container.firstChild;
    expect(root).toHaveAttribute('data-motion', 'visible');
  });

  // Test accessibility
  it('has correct ARIA roles', () => {
    renderWithTheme(
      <DashboardLayout header={<Header />} sidebar={<Sidebar />}>
        <Content />
      </DashboardLayout>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getByRole('complementary')).toBeInTheDocument(); // sidebar
    expect(screen.getByRole('main')).toBeInTheDocument(); // main content
  });
});
