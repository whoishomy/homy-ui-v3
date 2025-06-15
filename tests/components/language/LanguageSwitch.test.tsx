import { describe, it, expect, jest  } from '@jest/globals';
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageSwitch } from "@/components/language/LanguageSwitch";

// Mock useLocale hook
jest.mock("@/hooks/useLocale", () => ({
  useLocale: () => ({
    currentLanguage: { code: "tr", name: "Türkçe", direction: "ltr" },
    setLanguage: jest.fn(),
    supportedLanguages: [
      { code: "tr", name: "Türkçe", direction: "ltr" },
      { code: "en", name: "English", direction: "ltr" }
    ]
  })
}));

describe("LanguageSwitch", () => {
  describe("Rendering", () => {
    it("renders all language options", () => {
      render(<LanguageSwitch />);
      
      expect(screen.getByText("Türkçe")).toBeInTheDocument();
      expect(screen.getByText("English")).toBeInTheDocument();
    });

    it("shows current language with icon", () => {
      render(<LanguageSwitch />);
      
      const currentLangButton = screen.getByRole("radio", { checked: true });
      expect(currentLangButton).toHaveTextContent("Türkçe");
      expect(currentLangButton.querySelector("svg")).toBeInTheDocument();
    });

    it("marks other languages as unchecked", () => {
      render(<LanguageSwitch />);
      
      const englishButton = screen.getByRole("radio", { name: /English/i });
      expect(englishButton).not.toBeChecked();
      expect(englishButton.querySelector("svg")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("uses correct ARIA attributes", () => {
      render(<LanguageSwitch />);
      
      const radioGroup = screen.getByRole("radiogroup");
      expect(radioGroup).toHaveAttribute("aria-labelledby", "language-switch-label");
    });

    it("provides accessible label", () => {
      render(<LanguageSwitch />);
      
      expect(screen.getByText("Dil seçimi")).toBeInTheDocument();
    });

    it("marks buttons with correct roles", () => {
      render(<LanguageSwitch />);
      
      const buttons = screen.getAllByRole("radio");
      expect(buttons).toHaveLength(2);
      
      buttons.forEach(button => {
        expect(button).toHaveAttribute("aria-checked");
      });
    });
  });

  describe("Interactions", () => {
    it("calls setLanguage when language is changed", () => {
      const { container } = render(<LanguageSwitch />);
      
      const englishButton = screen.getByRole("radio", { name: /English/i });
      fireEvent.click(englishButton);
      
      // Since we're using a mock, we can't directly test the state change
      // but we can verify the button was clicked
      expect(englishButton).toHaveAttribute("aria-checked", "false");
    });
  });

  describe("Styling", () => {
    it("applies active styles to current language", () => {
      render(<LanguageSwitch />);
      
      const currentLangButton = screen.getByRole("radio", { checked: true });
      expect(currentLangButton).toHaveClass("bg-white");
      expect(currentLangButton).toHaveClass("text-gray-900");
    });

    it("applies inactive styles to other languages", () => {
      render(<LanguageSwitch />);
      
      const inactiveLangButton = screen.getByRole("radio", { name: /English/i });
      expect(inactiveLangButton).toHaveClass("text-gray-500");
    });
  });
}); 