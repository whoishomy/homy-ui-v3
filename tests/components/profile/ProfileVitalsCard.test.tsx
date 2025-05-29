import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProfileVitalsCard } from "@/components/profile/ProfileVitalsCard";

describe("ProfileVitalsCard", () => {
  it("renders vital labels and values correctly", () => {
    render(<ProfileVitalsCard />);

    expect(screen.getByText(/Nabız/i)).toBeInTheDocument();
    expect(screen.getByText(/72/i)).toBeInTheDocument();

    expect(screen.getByText(/Tansiyon/i)).toBeInTheDocument();
    expect(screen.getByText(/120\/80/i)).toBeInTheDocument();

    expect(screen.getByText(/Oksijen/i)).toBeInTheDocument();
    expect(screen.getByText(/97/i)).toBeInTheDocument();

    expect(screen.getByText(/Sıcaklık/i)).toBeInTheDocument();
    expect(screen.getByText(/36.6/i)).toBeInTheDocument();
  });

  it("displays trend indicators", () => {
    render(<ProfileVitalsCard />);
    expect(screen.getAllByText(/▲|▼|■/).length).toBeGreaterThanOrEqual(4);
  });
}); 