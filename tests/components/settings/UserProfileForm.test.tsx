import { describe, it, expect, jest  } from '@jest/globals';
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserProfileForm } from "@/components/settings/UserProfileForm";

describe("UserProfileForm", () => {
  const mockInitialData = {
    name: "Test User",
    email: "test@example.com"
  };

  it("renders form with initial data", () => {
    render(<UserProfileForm initialData={mockInitialData} />);

    expect(screen.getByLabelText(/ad/i)).toHaveValue("Test User");
    expect(screen.getByLabelText(/e-posta/i)).toHaveValue("test@example.com");
    expect(screen.getByLabelText(/yeni şifre/i)).toHaveValue("");
  });

  it("updates input values on change", async () => {
    const user = userEvent.setup();
    render(<UserProfileForm initialData={mockInitialData} />);

    const nameInput = screen.getByLabelText(/ad/i);
    await user.clear(nameInput);
    await user.type(nameInput, "New Name");
    expect(nameInput).toHaveValue("New Name");

    const emailInput = screen.getByLabelText(/e-posta/i);
    await user.clear(emailInput);
    await user.type(emailInput, "new@example.com");
    expect(emailInput).toHaveValue("new@example.com");
  });

  it("calls onSubmit with form data", async () => {
    const mockOnSubmit = jest.fn();
    const user = userEvent.setup();
    
    render(
      <UserProfileForm 
        initialData={mockInitialData} 
        onSubmit={mockOnSubmit} 
      />
    );

    const submitButton = screen.getByRole("button", { name: /güncelle/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@example.com",
      password: undefined
    });
  });

  it("shows loading state during submission", async () => {
    const mockOnSubmit = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    const user = userEvent.setup();
    
    render(
      <UserProfileForm 
        initialData={mockInitialData} 
        onSubmit={mockOnSubmit} 
      />
    );

    const submitButton = screen.getByRole("button", { name: /güncelle/i });
    await user.click(submitButton);

    expect(screen.getByText(/güncelleniyor/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByText(/güncelle/i)).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("validates required fields", async () => {
    const user = userEvent.setup();
    render(<UserProfileForm initialData={mockInitialData} />);

    const nameInput = screen.getByLabelText(/ad/i);
    await user.clear(nameInput);
    
    const emailInput = screen.getByLabelText(/e-posta/i);
    await user.clear(emailInput);

    expect(nameInput).toBeInvalid();
    expect(emailInput).toBeInvalid();
  });

  it("validates email format", async () => {
    const user = userEvent.setup();
    render(<UserProfileForm initialData={mockInitialData} />);

    const emailInput = screen.getByLabelText(/e-posta/i);
    await user.clear(emailInput);
    await user.type(emailInput, "invalid-email");

    expect(emailInput).toBeInvalid();

    await user.clear(emailInput);
    await user.type(emailInput, "valid@example.com");
    expect(emailInput).toBeValid();
  });
}); 