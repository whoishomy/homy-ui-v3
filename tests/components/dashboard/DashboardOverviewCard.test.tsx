import { describe, it, expect  } from '@jest/globals';
import { render, screen } from "@testing-library/react";
import { DashboardOverviewCard } from "@/components/dashboard/DashboardOverviewCard";

const mockMetrics = [
  {
    id: "1",
    name: "Nabız",
    value: 72,
    unit: "bpm",
    trend: "stable" as const,
    lastUpdated: "5 dakika önce"
  },
  {
    id: "2",
    name: "Tansiyon",
    value: 120,
    unit: "mmHg",
    trend: "up" as const,
    lastUpdated: "10 dakika önce"
  }
];

describe("DashboardOverviewCard", () => {
  describe("Health Score Display", () => {
    it("renders health score with correct color for good score", () => {
      render(
        <DashboardOverviewCard 
          healthScore={85} 
          metrics={mockMetrics}
        />
      );
      
      const score = screen.getByText("85");
      expect(score).toHaveClass("text-green-500");
    });

    it("renders health score with warning color for moderate score", () => {
      render(
        <DashboardOverviewCard 
          healthScore={65} 
          metrics={mockMetrics}
        />
      );
      
      const score = screen.getByText("65");
      expect(score).toHaveClass("text-yellow-500");
    });

    it("renders health score with danger color for low score", () => {
      render(
        <DashboardOverviewCard 
          healthScore={45} 
          metrics={mockMetrics}
        />
      );
      
      const score = screen.getByText("45");
      expect(score).toHaveClass("text-red-500");
    });
  });

  describe("Metrics Display", () => {
    it("renders all metrics with correct information", () => {
      render(
        <DashboardOverviewCard 
          healthScore={85} 
          metrics={mockMetrics}
        />
      );
      
      expect(screen.getByText("Nabız")).toBeInTheDocument();
      expect(screen.getByText("72")).toBeInTheDocument();
      expect(screen.getByText("bpm")).toBeInTheDocument();
      
      expect(screen.getByText("Tansiyon")).toBeInTheDocument();
      expect(screen.getByText("120")).toBeInTheDocument();
      expect(screen.getByText("mmHg")).toBeInTheDocument();
    });

    it("shows correct trend indicators", () => {
      render(
        <DashboardOverviewCard 
          healthScore={85} 
          metrics={mockMetrics}
        />
      );
      
      const metricItems = screen.getAllByRole("listitem");
      
      // Stable trend
      expect(metricItems[0]).toHaveTextContent("Nabız");
      expect(metricItems[0].querySelector("svg")).toHaveClass("text-blue-600");
      
      // Up trend
      expect(metricItems[1]).toHaveTextContent("Tansiyon");
      expect(metricItems[1].querySelector("svg")).toHaveClass("text-green-600");
    });

    it("displays last updated timestamps", () => {
      render(
        <DashboardOverviewCard 
          healthScore={85} 
          metrics={mockMetrics}
        />
      );
      
      expect(screen.getByText("5 dakika önce")).toBeInTheDocument();
      expect(screen.getByText("10 dakika önce")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("uses semantic list structure for metrics", () => {
      render(
        <DashboardOverviewCard 
          healthScore={85} 
          metrics={mockMetrics}
        />
      );
      
      const list = screen.getByRole("list");
      expect(list).toHaveAttribute("aria-label", "Sağlık metrikleri");
      
      const items = screen.getAllByRole("listitem");
      expect(items).toHaveLength(2);
    });

    it("provides timestamp information", () => {
      render(
        <DashboardOverviewCard 
          healthScore={85} 
          metrics={mockMetrics}
        />
      );
      
      const timestamp = screen.getByText("Güncel");
      expect(timestamp.tagName).toBe("TIME");
      expect(timestamp).toHaveAttribute("dateTime");
    });
  });
}); 