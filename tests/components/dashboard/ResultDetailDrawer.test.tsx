import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ResultDetailDrawer } from "@/components/dashboard/ResultDetailDrawer";

// Mock DataTrendChart component
vi.mock("@/components/charts/DataTrendChart", () => ({
  DataTrendChart: ({ title, data, valueUnit }: any) => (
    <div data-testid="trend-chart">
      <div>{title}</div>
      <div>
        {data.map((point: any) => (
          <span key={point.date}>{point.value}{valueUnit}</span>
        ))}
      </div>
    </div>
  )
}));

const mockResult = {
  id: "r1",
  title: "HbA1c",
  description: "Glikozillenmiş hemoglobin",
  unit: "%",
  trend: "down" as const,
  data: [
    { date: "2025-05-01", value: 6.1 },
    { date: "2025-05-28", value: 5.4 }
  ],
  referenceRange: {
    min: 4.0,
    max: 5.7
  }
};

describe("ResultDetailDrawer", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  describe("Rendering", () => {
    it("renders nothing when result is undefined", () => {
      const { container } = render(
        <ResultDetailDrawer isOpen={true} onClose={mockOnClose} />
      );
      expect(container).toBeEmptyDOMElement();
    });

    it("renders all sections when result is provided", () => {
      render(
        <ResultDetailDrawer
          result={mockResult}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      // Header
      expect(screen.getByText("HbA1c")).toBeInTheDocument();
      expect(screen.getByText("Glikozillenmiş hemoglobin")).toBeInTheDocument();

      // Latest Value
      expect(screen.getByText("5.4")).toBeInTheDocument();
      expect(screen.getByText("%")).toBeInTheDocument();

      // Reference Range
      expect(screen.getByText("Referans Aralığı")).toBeInTheDocument();
      expect(screen.getByText("4.0 %")).toBeInTheDocument();
      expect(screen.getByText("5.7 %")).toBeInTheDocument();

      // Trend Chart
      expect(screen.getByTestId("trend-chart")).toBeInTheDocument();

      // Historical Data
      expect(screen.getByText("Geçmiş Ölçümler")).toBeInTheDocument();
      expect(screen.getByText("6.1 %")).toBeInTheDocument();
    });

    it("shows out of range warning when value exceeds reference range", () => {
      const outOfRangeResult = {
        ...mockResult,
        data: [
          { date: "2025-05-01", value: 6.1 },
          { date: "2025-05-28", value: 6.8 }
        ]
      };

      render(
        <ResultDetailDrawer
          result={outOfRangeResult}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("Son ölçüm referans aralığı dışında")).toBeInTheDocument();
      expect(screen.getByLabelText("Referans aralığı dışında")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("calls onClose when close button is clicked", () => {
      render(
        <ResultDetailDrawer
          result={mockResult}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByLabelText("Kapat");
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it("calls onClose when clicking overlay", () => {
      render(
        <ResultDetailDrawer
          result={mockResult}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const overlay = screen.getByRole("dialog").parentElement;
      fireEvent.click(overlay!);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("uses correct ARIA attributes", () => {
      render(
        <ResultDetailDrawer
          result={mockResult}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-labelledby", "drawer-title");

      const closeButton = screen.getByLabelText("Kapat");
      expect(closeButton).toHaveAttribute("aria-label", "Kapat");
    });

    it("provides alert role for out of range warning", () => {
      const outOfRangeResult = {
        ...mockResult,
        data: [
          { date: "2025-05-01", value: 6.1 },
          { date: "2025-05-28", value: 6.8 }
        ]
      };

      render(
        <ResultDetailDrawer
          result={outOfRangeResult}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("Son ölçüm referans aralığı dışında");
    });
  });

  describe("Date Formatting", () => {
    it("formats dates in Turkish locale", () => {
      render(
        <ResultDetailDrawer
          result={mockResult}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      // Note: This test might need adjustment based on the actual locale formatting
      expect(screen.getByText(/28 Mayıs 2025/)).toBeInTheDocument();
      expect(screen.getByText(/1 Mayıs 2025/)).toBeInTheDocument();
    });
  });

  describe("Trend Icons", () => {
    it("shows correct trend icon", () => {
      const trends = ["up", "down", "stable"] as const;
      
      trends.forEach(trend => {
        const result = { ...mockResult, trend };
        const { rerender } = render(
          <ResultDetailDrawer
            result={result}
            isOpen={true}
            onClose={mockOnClose}
          />
        );

        const expectedColor = {
          up: "text-green-500",
          down: "text-red-500",
          stable: "text-blue-500"
        }[trend];

        const icon = screen.getByTestId("trend-icon");
        expect(icon).toHaveClass(expectedColor);

        rerender(<div />); // Clean up before next iteration
      });
    });
  });

  describe("Dark Mode", () => {
    it("applies dark mode classes", () => {
      render(
        <ResultDetailDrawer
          result={mockResult}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const drawer = screen.getByRole("dialog");
      expect(drawer).toHaveClass("dark:bg-gray-900");

      const title = screen.getByText("HbA1c");
      expect(title).toHaveClass("dark:text-white");
    });
  });
}); 