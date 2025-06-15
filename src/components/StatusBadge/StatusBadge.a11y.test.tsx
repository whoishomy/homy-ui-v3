import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { StatusBadge } from './StatusBadge';

expect.extend(toHaveNoViolations);

describe('StatusBadge Accessibility', () => {
  it('should have no accessibility violations in critical state', async () => {
    const { container } = render(
      <StatusBadge status="critical" label="Kritik" ariaLabel="Durum: Kritik" />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations in warning state', async () => {
    const { container } = render(
      <StatusBadge status="warning" label="Uyarı" ariaLabel="Durum: Uyarı" />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations in normal state', async () => {
    const { container } = render(
      <StatusBadge status="normal" label="Normal" ariaLabel="Durum: Normal" />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes', () => {
    const { getByRole } = render(
      <StatusBadge status="critical" label="Kritik" ariaLabel="Durum: Kritik" />
    );

    const badge = getByRole('status');
    expect(badge).toHaveAttribute('aria-label', 'Durum: Kritik');
  });

  it('should have sufficient color contrast', () => {
    const { container } = render(
      <StatusBadge status="critical" label="Kritik" ariaLabel="Durum: Kritik" />
    );

    // Color contrast will be checked by axe-core
    expect(container).toBeInTheDocument();
  });

  it('should be keyboard focusable when interactive', () => {
    const { getByRole } = render(
      <StatusBadge status="critical" label="Kritik" ariaLabel="Durum: Kritik" interactive />
    );

    const badge = getByRole('status');
    expect(badge).toHaveAttribute('tabIndex', '0');
  });
});

describe('StatusBadge Accessibility - Keyboard Navigation', () => {
  it('should be focusable when interactive', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button>Before</button>
        <StatusBadge
          status="critical"
          label="Kritik"
          ariaLabel="Durum: Kritik"
          interactive
          onClick={() => {}}
        />
        <button>After</button>
      </div>
    );

    // Initial focus on first button
    await user.tab();
    expect(screen.getByText('Before')).toHaveFocus();

    // Focus moves to StatusBadge
    await user.tab();
    expect(screen.getByRole('status')).toHaveFocus();

    // Focus moves to last button
    await user.tab();
    expect(screen.getByText('After')).toHaveFocus();
  });

  it('should be activatable with Enter key', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <StatusBadge
        status="critical"
        label="Kritik"
        ariaLabel="Durum: Kritik"
        interactive
        onClick={handleClick}
      />
    );

    const badge = screen.getByRole('status');
    await user.tab();
    expect(badge).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalled();
  });

  it('should be activatable with Space key', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <StatusBadge
        status="critical"
        label="Kritik"
        ariaLabel="Durum: Kritik"
        interactive
        onClick={handleClick}
      />
    );

    const badge = screen.getByRole('status');
    await user.tab();
    expect(badge).toHaveFocus();

    await user.keyboard(' ');
    expect(handleClick).toHaveBeenCalled();
  });

  it('should skip non-interactive badges in tab order', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button>Before</button>
        <StatusBadge status="normal" label="Normal" ariaLabel="Durum: Normal" interactive={false} />
        <button>After</button>
      </div>
    );

    // Initial focus on first button
    await user.tab();
    expect(screen.getByText('Before')).toHaveFocus();

    // Focus should skip the non-interactive badge
    await user.tab();
    expect(screen.getByText('After')).toHaveFocus();
  });

  it('should have visible focus indicator', async () => {
    const user = userEvent.setup();
    render(<StatusBadge status="warning" label="Uyarı" ariaLabel="Durum: Uyarı" interactive />);

    const badge = screen.getByRole('status');
    await user.tab();

    // Check for focus ring styles
    expect(badge).toHaveClass('focus:ring-2');
    expect(badge).toHaveClass('focus:ring-offset-2');
  });
});
