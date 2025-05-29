import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SettingsPage from "@/app/settings/page";

vi.mock("@/components/settings/ThemeLanguageSelector", () => ({
  ThemeLanguageSelector: () => <div data-testid="theme-language-selector">Theme Language Selector</div>
}));

vi.mock("@/components/settings/UserProfileForm", () => ({
  UserProfileForm: () => <div data-testid="user-profile-form">User Profile Form</div>
}));

describe("SettingsPage", () => {
  it("renders the page with all required components", () => {
    render(<SettingsPage />);

    // Verify page structure
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /ayarlar/i, level: 1 })).toBeInTheDocument();
    
    // Verify sections
    expect(screen.getByRole("heading", { name: /uygulama tercihleri/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /profil bilgileri/i })).toBeInTheDocument();

    // Verify components are rendered
    expect(screen.getByTestId("theme-language-selector")).toBeInTheDocument();
    expect(screen.getByTestId("user-profile-form")).toBeInTheDocument();
  });

  it("maintains proper heading hierarchy", () => {
    render(<SettingsPage />);
    
    const headings = screen.getAllByRole("heading");
    expect(headings).toHaveLength(3);
    
    expect(headings[0]).toHaveAttribute("id", "settings-title");
    expect(headings[1]).toHaveAttribute("id", "preferences-title");
    expect(headings[2]).toHaveAttribute("id", "profile-title");
  });

  it("has proper aria-labelledby relationships", () => {
    render(<SettingsPage />);
    
    expect(screen.getByRole("main")).toHaveAttribute("aria-labelledby", "settings-title");
    
    const sections = screen.getAllByRole("region");
    expect(sections[0]).toHaveAttribute("aria-labelledby", "preferences-title");
    expect(sections[1]).toHaveAttribute("aria-labelledby", "profile-title");
  });
}); 