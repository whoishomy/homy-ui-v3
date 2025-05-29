import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LabResultCard } from "@/components/lab/LabResultCard";

const mockData = [
  { date: "2025-05-01", value: 85 },
  { date: "2025-05-08", value: 88 },
  { date: "2025-05-15", value: 90 },
];

describe("LabResultCard", () => {
  it("renders title and description", () => {
    render(
      <LabResultCard
        title="HbA1c"
        description="Son 3 aylık ortalama şeker düzeyini gösterir."
        unit="%"
        data={mockData}
      />
    );

    expect(screen.getByText(/HbA1c/i)).toBeInTheDocument();
    expect(screen.getByText(/Son 3 aylık ortalama/i)).toBeInTheDocument();
  });

  it("displays latest value with unit", () => {
    render(
      <LabResultCard
        title="HbA1c"
        description="Ortalama glikoz"
        unit="%"
        data={mockData}
      />
    );

    expect(screen.getByText("90 %")).toBeInTheDocument();
  });

  it("includes trend chart", () => {
    const { container } = render(
      <LabResultCard
        title="HbA1c"
        description="Ortalama glikoz"
        unit="%"
        data={mockData}
      />
    );

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("handles empty data gracefully", () => {
    render(
      <LabResultCard
        title="HbA1c"
        description="Ortalama glikoz"
        unit="%"
        data={[]}
      />
    );

    expect(screen.getByText("Veri bulunamadı")).toBeInTheDocument();
  });
}); 