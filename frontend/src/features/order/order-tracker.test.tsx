import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderTracker } from "./order-tracker";

vi.mock("@/hooks/use-order-status-query", () => ({
  useOrderStatusQuery: vi.fn()
}));

import { useOrderStatusQuery } from "@/hooks/use-order-status-query";

const mockedUseOrderStatusQuery = vi.mocked(useOrderStatusQuery);

describe("OrderTracker", () => {
  it("renders status progression when order is available", () => {
    mockedUseOrderStatusQuery.mockReturnValue({
      data: {
        id: "order-1",
        items: [],
        deliveryDetails: { name: "Rahul", address: "Street 22", phoneNumber: "9876543210" },
        totalAmount: 450,
        status: "Preparing",
        createdAt: new Date().toISOString()
      }
    } as unknown as ReturnType<typeof useOrderStatusQuery>);

    render(<OrderTracker orderId="order-1" />);

    expect(screen.getByText(/Order ID: order-1/i)).toBeInTheDocument();
    expect(screen.getAllByText("Preparing")).toHaveLength(2);
    expect(screen.getByText("Out for Delivery")).toBeInTheDocument();
  });

  it("returns null when no order id is set", () => {
    mockedUseOrderStatusQuery.mockReturnValue({ data: undefined } as ReturnType<typeof useOrderStatusQuery>);
    const { container } = render(<OrderTracker orderId={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
