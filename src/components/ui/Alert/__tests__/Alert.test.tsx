import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Alert } from '../Alert';
import { ThemeProvider } from '@emotion/react';
import { lightTheme } from '@/styles/theme';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

describe('Alert Component', () => {
  const renderWithTheme = (component: React.ReactNode) => {
    return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
  };

  it('renders with default props', () => {
    renderWithTheme(<Alert data-testid="alert" />);
    const alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute('role', 'alert');
  });

  it('renders title and description correctly', () => {
    renderWithTheme(
      <Alert title="Test Title" description="Test Description" data-testid="alert" />
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders with different variants', () => {
    const variants = ['info', 'success', 'warning', 'error'] as const;
    const icons = {
      info: <Info />,
      success: <CheckCircle />,
      warning: <AlertTriangle />,
      error: <XCircle />,
    };

    variants.forEach((variant) => {
      const { rerender } = renderWithTheme(
        <Alert
          variant={variant}
          title={`${variant} Alert`}
          icon={icons[variant]}
          data-testid={`alert-${variant}`}
        />
      );

      const alert = screen.getByTestId(`alert-${variant}`);
      expect(alert).toBeInTheDocument();
      expect(screen.getByText(`${variant} Alert`)).toBeInTheDocument();

      rerender(
        <ThemeProvider theme={lightTheme}>
          <Alert
            variant={variant}
            title={`${variant} Alert`}
            icon={icons[variant]}
            data-testid={`alert-${variant}`}
          />
        </ThemeProvider>
      );
    });
  });

  it('handles dismissible state correctly', () => {
    const handleDismiss = jest.fn();
    renderWithTheme(
      <Alert dismissible onDismiss={handleDismiss} title="Dismissible Alert" data-testid="alert" />
    );

    const dismissButton = screen.getByRole('button', { name: /dismiss alert/i });
    expect(dismissButton).toBeInTheDocument();

    fireEvent.click(dismissButton);
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    renderWithTheme(<Alert ref={ref} title="Ref Alert" data-testid="alert" />);
    expect(ref.current).toBeTruthy();
    expect(ref.current).toEqual(screen.getByTestId('alert'));
  });

  it('applies custom className', () => {
    const customClass = 'custom-alert';
    renderWithTheme(<Alert className={customClass} title="Custom Alert" data-testid="alert" />);
    expect(screen.getByTestId('alert')).toHaveClass(customClass);
  });

  it('handles keyboard interaction for dismiss button', () => {
    const handleDismiss = jest.fn();
    renderWithTheme(
      <Alert dismissible onDismiss={handleDismiss} title="Keyboard Alert" data-testid="alert" />
    );

    const dismissButton = screen.getByRole('button', { name: /dismiss alert/i });
    dismissButton.focus();
    fireEvent.keyDown(dismissButton, { key: 'Enter' });
    expect(handleDismiss).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(dismissButton, { key: ' ' });
    expect(handleDismiss).toHaveBeenCalledTimes(2);
  });

  it('renders custom icon correctly', () => {
    const CustomIcon = () => <span data-testid="custom-icon">🎉</span>;
    renderWithTheme(<Alert icon={<CustomIcon />} title="Custom Icon Alert" data-testid="alert" />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});
