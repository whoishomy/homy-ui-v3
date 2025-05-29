import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Toast } from "@/components/toast/Toast";
import { type Toast as ToastType } from "@/store/toast/toastStore";

// Mock useToast hook
vi.mock("@/hooks/useToast", () => ({
  useToast: () => ({
    dismiss: vi.fn(),
  }),
}));

describe("Toast", () => {
  const mockToast: ToastType = {
    id: "test-1",
    message: "Test message",
    type: "info",
    duration: 5000,
    createdAt: Date.now(),
  };

  describe("Rendering", () => {
    it("renders toast with correct message and type", () => {
      render(<Toast toast={mockToast} />);
      
      expect(screen.getByText("Test message")).toBeInTheDocument();
      expect(screen.getByRole("alert")).toHaveClass("bg-blue-50");
    });

    it("renders dismiss button with accessibility features", () => {
      render(<Toast toast={mockToast} />);
      
      const dismissButton = screen.getByRole("button");
      expect(dismissButton).toBeInTheDocument();
      expect(screen.getByText("Dismiss toast")).toBeInTheDocument();
    });

    it("renders progress bar for non-zero duration toasts", () => {
      render(<Toast toast={mockToast} />);
      
      expect(screen.getByRole("alert").querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    });

    it("does not render progress bar for zero duration toasts", () => {
      const persistentToast = { ...mockToast, duration: 0 };
      render(<Toast toast={persistentToast} />);
      
      const progressBar = screen.getByRole("alert").querySelector('[aria-hidden="true"]');
      expect(progressBar).not.toHaveStyle({ transition: expect.any(String) });
    });
  });

  describe("Type-based Styling", () => {
    it.each([
      ["info", "bg-blue-50"],
      ["success", "bg-green-50"],
      ["warning", "bg-yellow-50"],
      ["error", "bg-red-50"],
    ])("applies correct styling for %s type", (type, expectedClass) => {
      const toast = { ...mockToast, type: type as ToastType["type"] };
      render(<Toast toast={toast} />);
      
      expect(screen.getByRole("alert")).toHaveClass(expectedClass);
    });
  });

  describe("Accessibility", () => {
    it("has correct ARIA attributes", () => {
      render(<Toast toast={mockToast} />);
      
      const alert = screen.getByRole("alert");
      expect(alert).toHaveAttribute("aria-live", "polite");
    });

    it("marks decorative elements as aria-hidden", () => {
      render(<Toast toast={mockToast} />);
      
      const decorativeElements = screen.getAllByLabelText("", { selector: '[aria-hidden="true"]' });
      expect(decorativeElements.length).toBeGreaterThan(0);
    });
  });

  describe("Interactions", () => {
    it("calls dismiss when close button is clicked", () => {
      const { dismiss } = vi.mocked(require("@/hooks/useToast").useToast());
      render(<Toast toast={mockToast} />);
      
      fireEvent.click(screen.getByRole("button"));
      expect(dismiss).toHaveBeenCalledWith(mockToast.id);
    });
  });
}); 