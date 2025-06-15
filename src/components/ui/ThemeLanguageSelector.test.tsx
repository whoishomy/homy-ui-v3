import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ThemeLanguageSelector } from './ThemeLanguageSelector';

expect.extend(toHaveNoViolations);

const mockProps = {
  currentLanguage: 'tr',
  onLanguageChange: jest.fn(),
};

describe('ThemeLanguageSelector Accessibility', () => {
  beforeEach(() => {
    mockProps.onLanguageChange.mockClear();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ThemeLanguageSelector {...mockProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe('Keyboard Navigation', () => {
    it('opens dropdown and selects option with keyboard', async () => {
      const user = userEvent.setup();
      render(<ThemeLanguageSelector {...mockProps} />);

      // Open dropdown
      const languageButton = screen.getByRole('button', { name: /select language/i });
      await user.tab();
      await user.tab(); // Tab to language button
      await user.keyboard('[Enter]');

      // Navigate and select
      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeVisible();

      const options = screen.getAllByRole('option');
      await user.keyboard('[ArrowDown]');
      expect(options[1]).toHaveFocus();

      await user.keyboard('[Enter]');
      expect(mockProps.onLanguageChange).toHaveBeenCalledWith('en');
      expect(listbox).not.toBeInTheDocument();
    });

    it('closes dropdown on Escape key', async () => {
      const user = userEvent.setup();
      render(<ThemeLanguageSelector {...mockProps} />);

      const languageButton = screen.getByRole('button', { name: /select language/i });
      await user.click(languageButton);
      expect(screen.getByRole('listbox')).toBeVisible();

      await user.keyboard('[Escape]');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('navigates options with arrow keys', async () => {
      const user = userEvent.setup();
      render(<ThemeLanguageSelector {...mockProps} />);

      const languageButton = screen.getByRole('button', { name: /select language/i });
      await user.click(languageButton);

      const options = screen.getAllByRole('option');

      await user.keyboard('[ArrowDown]');
      expect(options[1]).toHaveFocus();

      await user.keyboard('[ArrowUp]');
      expect(options[0]).toHaveFocus();
    });
  });

  describe('Mouse Interaction', () => {
    it('closes dropdown on outside click', async () => {
      const user = userEvent.setup();
      render(
        <>
          <ThemeLanguageSelector {...mockProps} />
          <div data-testid="outside">Outside Element</div>
        </>
      );

      const languageButton = screen.getByRole('button', { name: /select language/i });
      await user.click(languageButton);
      expect(screen.getByRole('listbox')).toBeVisible();

      await user.click(screen.getByTestId('outside'));
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Focus Management', () => {
    it('is focusable via Tab key', async () => {
      const user = userEvent.setup();
      render(<ThemeLanguageSelector {...mockProps} />);

      await user.tab(); // Theme button
      expect(screen.getByRole('button', { name: /tema/i })).toHaveFocus();

      await user.tab(); // Language button
      expect(screen.getByRole('button', { name: /select language/i })).toHaveFocus();
    });

    it('maintains focus order in dropdown', async () => {
      const user = userEvent.setup();
      render(<ThemeLanguageSelector {...mockProps} />);

      const languageButton = screen.getByRole('button', { name: /select language/i });
      await user.click(languageButton);

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);

      await user.tab();
      expect(options[0]).toHaveFocus();
    });
  });

  describe('ARIA Attributes', () => {
    it('has correct ARIA attributes when closed', () => {
      render(<ThemeLanguageSelector {...mockProps} />);

      const languageButton = screen.getByRole('button', { name: /select language/i });
      expect(languageButton).toHaveAttribute('aria-haspopup', 'listbox');
      expect(languageButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('has correct ARIA attributes when open', async () => {
      const user = userEvent.setup();
      render(<ThemeLanguageSelector {...mockProps} />);

      const languageButton = screen.getByRole('button', { name: /select language/i });
      await user.click(languageButton);

      expect(languageButton).toHaveAttribute('aria-expanded', 'true');
      expect(languageButton).toHaveAttribute('aria-controls', 'language-listbox');

      const listbox = screen.getByRole('listbox');
      expect(listbox).toHaveAttribute('id', 'language-listbox');

      const selectedOption = screen.getByRole('option', { selected: true });
      expect(selectedOption).toHaveAttribute('aria-selected', 'true');
    });
  });
});
