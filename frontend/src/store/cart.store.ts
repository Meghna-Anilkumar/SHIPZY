import { create } from "zustand";
import type { MenuItem } from "@/interfaces/menu.interface";

export type CartItem = MenuItem & {
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addToCart: (item: MenuItem) => void;
  incrementQty: (itemId: string) => void;
  decrementQty: (itemId: string) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addToCart: (item) =>
    set((state) => {
      const existing = state.items.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return {
          items: state.items.map((cartItem) =>
            cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
          )
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),
  incrementQty: (itemId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    })),
  decrementQty: (itemId) =>
    set((state) => ({
      items: state.items
        .map((item) => (item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    })),
  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId)
    })),
  clearCart: () => set({ items: [] })
}));
