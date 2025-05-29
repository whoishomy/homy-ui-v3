import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTrendChart } from "@/components/charts/DataTrendChart";

const mockData = [
  { date: "2025-05-01", value: 85 },
  { date: "2025-05-08", value: 88 },
  { date: "2025-05-15", value: 90 },
];

describe("DataTrendChart", () => {
  it("renders the chart title", () => {
    render(
      <DataTrendChart
        title="HbA1c Seviyesi"
        data={mockData}
        valueUnit="%"
        valueLabel="HbA1c"
      />
    );

    expect(screen.getByText(/HbA1c Seviyesi/i)).toBeInTheDocument();
  });

  it("renders svg elements (line chart)", () => {
    const { container } = render(
      <DataTrendChart
        title="HbA1c Seviyesi"
        data={mockData}
        valueUnit="%"
        valueLabel="HbA1c"
      />
    );

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("displays correct number of x-axis labels", () => {
    render(
      <DataTrendChart
        title="HbA1c Seviyesi"
        data={mockData}
        valueUnit="%"
        valueLabel="HbA1c"
      />
    );

    expect(screen.getAllByText(/2025-05/i).length).toBeGreaterThanOrEqual(3);
  });

  it("shows min and max values", () => {
    render(
      <DataTrendChart
        title="HbA1c Seviyesi"
        data={mockData}
        valueUnit="%"
        valueLabel="HbA1c"
      />
    );

    // En düşük ve en yüksek değerlerin gösterildiğini kontrol et
    expect(screen.getByText(/85/)).toBeInTheDocument();
    expect(screen.getByText(/90/)).toBeInTheDocument();
  });

  it("handles empty data state", () => {
    render(
      <DataTrendChart
        title="HbA1c Seviyesi"
        data={[]}
        valueUnit="%"
        valueLabel="HbA1c"
      />
    );

    expect(screen.getByText("Veri bulunamadı")).toBeInTheDocument();
  });

  it("shows tooltip on hover", async () => {
    const user = userEvent.setup();
    render(
      <DataTrendChart
        title="D Vitamini"
        data={mockData}
        valueUnit="ng/mL"
        valueLabel="D Vitamini"
      />
    );

    // Tooltip trigger alanına hover
    const dataPoint = screen.getByRole("button", { name: /data-point/i });
    await user.hover(dataPoint);

    // Tooltip içeriği kontrol
    expect(screen.getByText(/2025-05-01/i)).toBeInTheDocument();
    expect(screen.getByText(/85 ng\/mL/i)).toBeInTheDocument();
  });

  it("renders responsive container", () => {
    const { container } = render(
      <DataTrendChart
        title="Responsive Test"
        data={mockData}
        valueUnit="unit"
        valueLabel="label"
      />
    );

    expect(container.querySelector(".recharts-responsive-container")).toBeInTheDocument();
  });
}); 