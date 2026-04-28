import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CheckoutForm } from "./checkout-form";

describe("CheckoutForm", () => {
  it("shows validation errors for invalid input", async () => {
    const onSubmit = vi.fn();

    render(<CheckoutForm onSubmit={onSubmit} isSubmitting={false} />);
    fireEvent.click(screen.getByRole("button", { name: /place order/i }));

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/address must be at least 5 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/phone number must be 10 digits/i)).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
