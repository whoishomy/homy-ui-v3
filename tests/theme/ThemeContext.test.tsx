import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggleButton } from "@/components/theme/ThemeToggleButton";
import { ThemeProvider } from "@/theme/contexts/ThemeContext";

const renderWithProvider = () =>
  render(
    <ThemeProvider>
      <ThemeToggleButton />
    </ThemeProvider>
  );

describe("ThemeContext", () => {
  it("should render with light theme by default", () => {
    renderWithProvider();
    expect(document.documentElement.className).toBe("light");
  });

  it("should toggle theme on button click", async () => {
    renderWithProvider();
    const button = screen.getByRole("button", { name: /tema değiştir/i });

    await userEvent.click(button);
    expect(document.documentElement.className).toBe("dark");

    await userEvent.click(button);
    expect(document.documentElement.className).toBe("light");
  });
}); 