import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LabResultsPanel } from "@/components/dashboard/LabResultsPanel";
import type { LabResult } from "@/components/dashboard/LabResultsPanel";

// Mock LabResultCard component
vi.mock("@/components/lab/LabResultCard", () => ({
  LabResultCard: ({ title, description, unit, data }: any) => (
    <div data-testid="lab-result-card">
      <div>{title}</div>
      <div>{data[data.length - 1]?.value} {unit}</div>
      <div>{description}</div>
    </div>
  )
}));

const mockResults: LabResult[] = [
  {
    id: "r1",
    title: "HbA1c",
    description: "Glikozillenmiş hemoglobin",
    unit: "%",
    data: [
      { date: "2025-05-01", value: 6.1 },
      { date: "2025-05-28", value: 5.4 }
    ],
    trend: "down" as const,
    referenceRange: {
      min: 4.0,
      max: 5.7
    }
  },
  {
    id: "r2",
    title: "Glukoz",
    description: "Açlık kan şekeri",
    unit: "mg/dL",
    data: [
      { date: "2025-05-15", value: 92 },
      { date: "2025-05-29", value: 95 }
    ],
    trend: "up" as const,
    referenceRange: {
      min: 70,
      max: 100
    }
  }
];

describe("LabResultsPanel", () => {
  describe("Rendering", () => {
    it("renders all lab results in chronological order", () => {
      render(<LabResultsPanel results={mockResults} />);
      
      const cards = screen.getAllByTestId("lab-result-card");
      expect(cards).toHaveLength(2);
      
      // Most recent result should be first
      const firstCard = cards[0];
      expect(firstCard).toHaveTextContent("Glukoz");
      expect(firstCard).toHaveTextContent("95 mg/dL");
      expect(firstCard).toHaveTextContent("Açlık kan şekeri");
      
      const secondCard = cards[1];
      expect(secondCard).toHaveTextContent("HbA1c");
      expect(secondCard).toHaveTextContent("5.4 %");
      expect(secondCard).toHaveTextContent("Glikozillenmiş hemoglobin");
    });

    it("shows empty state when no results are available", () => {
      render(<LabResultsPanel results={[]} />);
      
      expect(screen.getByText(/Hiç laboratuvar sonucu bulunamadı/i)).toBeInTheDocument();
      expect(screen.getByText(/Yeni sonuçlar eklendiğinde/i)).toBeInTheDocument();
    });

    it("displays total result count", () => {
      render(<LabResultsPanel results={mockResults} />);
      
      expect(screen.getByText("2 sonuç")).toBeInTheDocument();
      expect(screen.getByLabelText("Toplam 2 sonuç")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("uses correct ARIA roles and labels", () => {
      render(<LabResultsPanel results={mockResults} />);
      
      const region = screen.getByRole("region");
      expect(region).toHaveAttribute("aria-labelledby", "lab-results-heading");
      
      const list = screen.getByRole("list");
      expect(list).toHaveAttribute("aria-label", "Laboratuvar sonuçları listesi");
      
      const items = screen.getAllByRole("listitem");
      expect(items).toHaveLength(2);
    });

    it("provides descriptive labels for screen readers", () => {
      render(<LabResultsPanel results={mockResults} />);
      
      expect(screen.getByLabelText("Laboratuvar sonuçları listesi")).toBeInTheDocument();
      expect(screen.getByLabelText("Toplam 2 sonuç")).toBeInTheDocument();
    });
  });

  describe("Layout", () => {
    it("applies responsive grid classes", () => {
      render(<LabResultsPanel results={mockResults} />);
      
      const grid = screen.getByRole("list");
      expect(grid).toHaveClass("grid", "sm:grid-cols-1", "md:grid-cols-2");
    });

    it("maintains scrollable container with max height", () => {
      render(<LabResultsPanel results={mockResults} />);
      
      const container = screen.getByRole("list");
      expect(container).toHaveClass("max-h-[60vh]", "overflow-y-auto");
    });

    it("applies dark mode classes correctly", () => {
      render(<LabResultsPanel results={mockResults} />);
      
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("text-gray-900", "dark:text-white");
    });
  });

  describe("Data Handling", () => {
    it("sorts results by date in descending order", () => {
      render(<LabResultsPanel results={mockResults} />);
      
      const cards = screen.getAllByTestId("lab-result-card");
      expect(cards[0]).toHaveTextContent("Glukoz"); // Most recent (May 29)
      expect(cards[1]).toHaveTextContent("HbA1c"); // Older (May 28)
    });

    it("handles missing data points gracefully", () => {
      const resultsWithEmptyData: LabResult[] = [
        {
          ...mockResults[0],
          data: [],
          trend: "stable" as const // Empty data should be considered stable
        }
      ];

      render(<LabResultsPanel results={resultsWithEmptyData} />);
      
      const card = screen.getByTestId("lab-result-card");
      expect(card).toHaveTextContent("HbA1c");
      expect(card).not.toHaveTextContent("undefined");
    });
  });
}); 