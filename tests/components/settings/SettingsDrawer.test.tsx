import { describe, it, expect, jest, beforeEach  } from '@jest/globals';
import { render, screen, fireEvent } from "@testing-library/react";
import { SettingsDrawer } from "@/components/settings/SettingsDrawer";

const mockSettings = {
  theme: "light" as const,
  language: "tr",
  notificationsEnabled: true
};

const mockLanguages = [
  { code: "tr", name: "Türkçe" },
  { code: "en", name: "English" }
];

describe("SettingsDrawer", () => {
  const mockOnClose = jest.fn();
  const mockOnSettingsChange = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnSettingsChange.mockClear();
  });

  describe("Rendering", () => {
    it("renders all sections when open", () => {
      render(
        <SettingsDrawer
          isOpen={true}
          onClose={mockOnClose}
          settings={mockSettings}
          onSettingsChange={mockOnSettingsChange}
          availableLanguages={mockLanguages}
        />
      );

      // Check section headings
      expect(screen.getByText("Tema")).toBeInTheDocument();
      expect(screen.getByText("Dil")).toBeInTheDocument();
      expect(screen.getByText("Bildirimler")).toBeInTheDocument();
    });

    it("shows current theme selection", () => {
      render(
        <SettingsDrawer
          isOpen={true}
          onClose={mockOnClose}
          settings={mockSettings}
          onSettingsChange={mockOnSettingsChange}
          availableLanguages={mockLanguages}
        />
      );

      const lightThemeRadio = screen.getByLabelText("Açık");
      expect(lightThemeRadio).toBeChecked();
    });

    it("shows current language selection", () => {
      render(
        <SettingsDrawer
          isOpen={true}
          onClose={mockOnClose}
          settings={mockSettings}
          onSettingsChange={mockOnSettingsChange}
          availableLanguages={mockLanguages}
        />
      );

      const languageSelect = screen.getByRole("combobox");
      expect(languageSelect).toHaveValue("tr");
    });

    it("shows notification toggle state", () => {
      render(
        <SettingsDrawer
          isOpen={true}
          onClose={mockOnClose}
          settings={mockSettings}
          onSettingsChange={mockOnSettingsChange}
          availableLanguages={mockLanguages}
        />
      );

      const toggle = screen.getByRole("switch");
      expect(toggle).toBeChecked();
    });
  });

  describe("Interactions", () => {
    it("calls onClose when close button is clicked", () => {
      render(
        <SettingsDrawer
          isOpen={true}
          onClose={mockOnClose}
          settings={mockSettings}
          onSettingsChange={mockOnSettingsChange}
          availableLanguages={mockLanguages}
        />
      );

      fireEvent.click(screen.getByLabelText("Kapat"));
      expect(mockOnClose).toHaveBeenCalled();
    });

    it("updates theme setting", () => {
      render(
        <SettingsDrawer
          isOpen={true}
          onClose={mockOnClose}
          settings={mockSettings}
          onSettingsChange={mockOnSettingsChange}
          availableLanguages={mockLanguages}
        />
      );

      fireEvent.click(screen.getByLabelText("Koyu"));
      expect(mockOnSettingsChange).toHaveBeenCalledWith({
        ...mockSettings,
        theme: "dark"
      });
    });

    it("updates language setting", () => {
      render(
        <SettingsDrawer
          isOpen={true}
          onClose={mockOnClose}
          settings={mockSettings}
          onSettingsChange={mockOnSettingsChange}
          availableLanguages={mockLanguages}
        />
      );

      fireEvent.change(screen.getByRole("combobox"), { target: { value: "en" } });
      expect(mockOnSettingsChange).toHaveBeenCalledWith({
        ...mockSettings,
        language: "en"
      });
    });

    it("updates notification setting", () => {
      render(
        <SettingsDrawer
          isOpen={true}
          onClose={mockOnClose}
          settings={mockSettings}
          onSettingsChange={mockOnSettingsChange}
          availableLanguages={mockLanguages}
        />
      );

      fireEvent.click(screen.getByRole("switch"));
      expect(mockOnSettingsChange).toHaveBeenCalledWith({
        ...mockSettings,
        notificationsEnabled: false
      });
    });
  });

  describe("Accessibility", () => {
    it("has correct ARIA attributes", () => {
      render(
        <SettingsDrawer
          isOpen={true}
          onClose={mockOnClose}
          settings={mockSettings}
          onSettingsChange={mockOnSettingsChange}
          availableLanguages={mockLanguages}
        />
      );

      expect(screen.getByRole("dialog")).toHaveAttribute("aria-labelledby", "settings-title");
    });

    it("provides descriptive labels for all controls", () => {
      render(
        <SettingsDrawer
          isOpen={true}
          onClose={mockOnClose}
          settings={mockSettings}
          onSettingsChange={mockOnSettingsChange}
          availableLanguages={mockLanguages}
        />
      );

      expect(screen.getByLabelText("Kapat")).toBeInTheDocument();
      expect(screen.getByLabelText("Açık")).toBeInTheDocument();
      expect(screen.getByLabelText("Koyu")).toBeInTheDocument();
      expect(screen.getByLabelText("Sistem")).toBeInTheDocument();
      expect(screen.getByRole("switch")).toHaveAccessibleName("Bildirimleri kapat");
    });
  });
}); 