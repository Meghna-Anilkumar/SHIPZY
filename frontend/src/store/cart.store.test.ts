import { beforeEach, describe, expect, it } from "vitest";
import { useCartStore } from "./cart.store";

describe("cart store", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("adds and updates quantity correctly", () => {
    const state = useCartStore.getState();
    state.addToCart({
      id: "1",
      name: "Pizza",
      description: "Classic",
      price: 300,
      image: "pizza.jpg"
    });
    state.addToCart({
      id: "1",
      name: "Pizza",
      description: "Classic",
      price: 300,
      image: "pizza.jpg"
    });

    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it("decrements quantity and removes when quantity reaches zero", () => {
    const state = useCartStore.getState();
    state.addToCart({
      id: "1",
      name: "Pizza",
      description: "Classic",
      price: 300,
      image: "pizza.jpg"
    });

    state.decrementQty("1");
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("clears the cart", () => {
    const state = useCartStore.getState();
    state.addToCart({
      id: "1",
      name: "Pizza",
      description: "Classic",
      price: 300,
      image: "pizza.jpg"
    });
    state.clearCart();

    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
