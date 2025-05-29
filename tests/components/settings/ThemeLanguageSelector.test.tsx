import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeLanguageSelector } from "@/components/settings/ThemeLanguageSelector";
import { ThemeProvider } from "@/theme/contexts/ThemeContext";

const renderWithTheme = (props: {
  currentLanguage: string;
  onLanguageChange: (code: string) => void;
}) => {
  return render(
    <ThemeProvider>
      <ThemeLanguageSelector {...props} />
    </ThemeProvider>
  );
};

describe("ThemeLanguageSelector", () => {
  it("renders theme toggle and language selector", () => {
    const mockOnChange = vi.fn();
    renderWithTheme({ currentLanguage: "tr", onLanguageChange: mockOnChange });

    expect(screen.getByLabelText(/temayı/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dil seçimi/i)).toBeInTheDocument();
  });

  it("shows current language flag", () => {
    const mockOnChange = vi.fn();
    renderWithTheme({ currentLanguage: "tr", onLanguageChange: mockOnChange });

    expect(screen.getByText("🇹🇷")).toBeInTheDocument();
  });

  it("toggles theme on button click", async () => {
    const mockOnChange = vi.fn();
    renderWithTheme({ currentLanguage: "tr", onLanguageChange: mockOnChange });

    const themeButton = screen.getByLabelText(/temayı/i);
    await userEvent.click(themeButton);

    expect(document.documentElement.className).toBe("dark");
  });

  it("calls onLanguageChange when selecting a language", async () => {
    const mockOnChange = vi.fn();
    renderWithTheme({ currentLanguage: "tr", onLanguageChange: mockOnChange });

    const languageButton = screen.getByLabelText(/dil seçimi/i);
    await userEvent.hover(languageButton);

    const englishOption = screen.getByText(/english/i);
    await userEvent.click(englishOption);

    expect(mockOnChange).toHaveBeenCalledWith("en");
  });

  it("shows all available languages in dropdown", async () => {
    const mockOnChange = vi.fn();
    renderWithTheme({ currentLanguage: "tr", onLanguageChange: mockOnChange });

    const languageButton = screen.getByLabelText(/dil seçimi/i);
    await userEvent.hover(languageButton);

    expect(screen.getByText("Türkçe")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Deutsch")).toBeInTheDocument();
  });
}); 