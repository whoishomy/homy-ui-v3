import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResultFilterBar } from "@/components/dashboard/ResultFilterBar";

describe("ResultFilterBar", () => {
  const mockOnFilterChange = vi.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  describe("Rendering", () => {
    it("renders all filter controls", () => {
      render(<ResultFilterBar onFilterChange={mockOnFilterChange} />);

      // Test type select
      expect(screen.getByLabelText("Test tipi seçin")).toBeInTheDocument();
      expect(screen.getByText("Tümü")).toBeInTheDocument();
      expect(screen.getByText("HbA1c")).toBeInTheDocument();
      expect(screen.getByText("Glukoz")).toBeInTheDocument();

      // Date range inputs
      expect(screen.getByLabelText("Başlangıç tarihi")).toBeInTheDocument();
      expect(screen.getByLabelText("Bitiş tarihi")).toBeInTheDocument();

      // Trend buttons
      expect(screen.getByLabelText("Yükselen trend filtresi")).toBeInTheDocument();
      expect(screen.getByLabelText("Stabil trend filtresi")).toBeInTheDocument();
      expect(screen.getByLabelText("Düşen trend filtresi")).toBeInTheDocument();
    });

    it("applies dark mode classes correctly", () => {
      render(<ResultFilterBar onFilterChange={mockOnFilterChange} />);

      const container = screen.getByRole("search").parentElement;
      expect(container).toHaveClass("dark:bg-gray-800", "dark:border-gray-700");
    });
  });

  describe("Test Type Filter", () => {
    it("calls onFilterChange with selected test type", async () => {
      render(<ResultFilterBar onFilterChange={mockOnFilterChange} />);

      const select = screen.getByLabelText("Test tipi seçin");
      await userEvent.selectOptions(select, "hba1c");

      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({ testType: "hba1c" })
      );
    });

    it("clears test type filter when selecting 'Tümü'", async () => {
      render(<ResultFilterBar onFilterChange={mockOnFilterChange} />);

      const select = screen.getByLabelText("Test tipi seçin");
      await userEvent.selectOptions(select, "");

      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({ testType: undefined })
      );
    });
  });

  describe("Date Range Filter", () => {
    it("calls onFilterChange with selected date range", async () => {
      render(<ResultFilterBar onFilterChange={mockOnFilterChange} />);

      const fromDate = screen.getByLabelText("Başlangıç tarihi");
      const toDate = screen.getByLabelText("Bitiş tarihi");

      await userEvent.type(fromDate, "2024-01-01");
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          dateRange: expect.objectContaining({ from: "2024-01-01" })
        })
      );

      await userEvent.type(toDate, "2024-12-31");
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          dateRange: expect.objectContaining({
            from: "2024-01-01",
            to: "2024-12-31"
          })
        })
      );
    });

    it("prevents selecting end date before start date", () => {
      render(<ResultFilterBar onFilterChange={mockOnFilterChange} />);

      const fromDate = screen.getByLabelText("Başlangıç tarihi");
      const toDate = screen.getByLabelText("Bitiş tarihi");

      fireEvent.change(fromDate, { target: { value: "2024-06-15" } });
      expect(toDate).toHaveAttribute("min", "2024-06-15");
    });
  });

  describe("Trend Filter", () => {
    it("toggles trend filters on click", async () => {
      render(<ResultFilterBar onFilterChange={mockOnFilterChange} />);

      const upButton = screen.getByLabelText("Yükselen trend filtresi");
      const stableButton = screen.getByLabelText("Stabil trend filtresi");
      const downButton = screen.getByLabelText("Düşen trend filtresi");

      // Click up trend
      await userEvent.click(upButton);
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({ trend: "up" })
      );
      expect(upButton).toHaveAttribute("aria-pressed", "true");

      // Click again to deselect
      await userEvent.click(upButton);
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({ trend: undefined })
      );
      expect(upButton).toHaveAttribute("aria-pressed", "false");

      // Test other trends
      await userEvent.click(stableButton);
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({ trend: "stable" })
      );

      await userEvent.click(downButton);
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({ trend: "down" })
      );
    });

    it("applies correct styles to selected trend button", async () => {
      render(<ResultFilterBar onFilterChange={mockOnFilterChange} />);

      const upButton = screen.getByLabelText("Yükselen trend filtresi");
      await userEvent.click(upButton);

      expect(upButton).toHaveClass("bg-green-100", "text-green-700");
    });
  });

  describe("Accessibility", () => {
    it("uses semantic HTML structure", () => {
      render(<ResultFilterBar onFilterChange={mockOnFilterChange} />);

      expect(screen.getByRole("search")).toBeInTheDocument();
      expect(screen.getByRole("group", { name: "Trend filtreleri" })).toBeInTheDocument();
    });

    it("provides proper ARIA labels", () => {
      render(<ResultFilterBar onFilterChange={mockOnFilterChange} />);

      expect(screen.getByRole("search")).toHaveAttribute(
        "aria-label",
        "Sonuç filtreleme formu"
      );

      const trendButtons = screen.getAllByRole("button");
      trendButtons.forEach(button => {
        expect(button).toHaveAttribute("aria-label");
        expect(button).toHaveAttribute("aria-pressed");
      });
    });

    it("uses fieldset and legend for grouped controls", () => {
      render(<ResultFilterBar onFilterChange={mockOnFilterChange} />);

      const fieldsets = screen.getAllByRole("group");
      expect(fieldsets).toHaveLength(2); // Date range and trend filters

      const legends = screen.getAllByText(/(Tarih Aralığı|Trend)/);
      expect(legends).toHaveLength(2);
    });
  });

  describe("Edge Cases", () => {
    it("handles empty date range values", async () => {
      render(<ResultFilterBar onFilterChange={mockOnFilterChange} />);

      const fromDate = screen.getByLabelText("Başlangıç tarihi");
      await userEvent.clear(fromDate);

      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          dateRange: expect.objectContaining({ from: "" })
        })
      );
    });

    it("maintains filter state when toggling multiple times", async () => {
      render(<ResultFilterBar onFilterChange={mockOnFilterChange} />);

      const upButton = screen.getByLabelText("Yükselen trend filtresi");
      
      await userEvent.click(upButton);
      await userEvent.click(upButton);
      await userEvent.click(upButton);

      const calls = mockOnFilterChange.mock.calls;
      expect(calls[0][0].trend).toBe("up");
      expect(calls[1][0].trend).toBe(undefined);
      expect(calls[2][0].trend).toBe("up");
    });
  });
}); 