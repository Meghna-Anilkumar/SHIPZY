import { describe, expect, it } from "vitest";
import type { IMenuRepository, IOrderRepository } from "../repositories/interfaces";
import type { MenuItem } from "../types/menu.types";
import type { Order, OrderStatus } from "../types/order.types";
import { OrderService } from "../services/order.service";

class FakeMenuRepository implements IMenuRepository {
  constructor(private readonly items: MenuItem[]) {}

  async getAll(): Promise<MenuItem[]> {
    return this.items;
  }

  async getById(id: string): Promise<MenuItem | undefined> {
    return this.items.find((item) => item.id === id);
  }
}

class FakeOrderRepository implements IOrderRepository {
  private orders: Order[] = [];

  async create(order: Omit<Order, "id">): Promise<Order> {
    const created: Order = {
      ...order,
      id: `${this.orders.length + 1}`
    };
    this.orders.push(created);
    return created;
  }

  async getAll(): Promise<Order[]> {
    return this.orders;
  }

  async getById(id: string): Promise<Order | undefined> {
    return this.orders.find((order) => order.id === id);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order | undefined> {
    const order = this.orders.find((entry) => entry.id === id);
    if (!order) {
      return undefined;
    }
    order.status = status;
    return order;
  }

  async deleteById(id: string): Promise<boolean> {
    const before = this.orders.length;
    this.orders = this.orders.filter((order) => order.id !== id);
    return this.orders.length < before;
  }
}

describe("OrderService", () => {
  it("creates a valid order and computes total", async () => {
    const menuRepository = new FakeMenuRepository([
      { id: "pizza", name: "Pizza", description: "Cheese", price: 300, image: "pizza.jpg" }
    ]);
    const orderRepository = new FakeOrderRepository();
    const service = new OrderService(orderRepository, menuRepository);

    const order = await service.createOrder({
      items: [{ menuItemId: "pizza", quantity: 2 }],
      deliveryDetails: {
        name: "Rahul",
        address: "Main Street 123",
        phoneNumber: "9876543210"
      }
    });

    expect(order.totalAmount).toBe(600);
    expect(order.status).toBe("Order Received");
    expect(order.items).toHaveLength(1);
  });

  it("rejects invalid input", async () => {
    const service = new OrderService(
      new FakeOrderRepository(),
      new FakeMenuRepository([{ id: "1", name: "Burger", description: "desc", price: 100, image: "img" }])
    );

    await expect(
      service.createOrder({
        items: [],
        deliveryDetails: {
          name: "A",
          address: "x",
          phoneNumber: "123"
        }
      })
    ).rejects.toBeDefined();
  });

  it("updates order status", async () => {
    const service = new OrderService(
      new FakeOrderRepository(),
      new FakeMenuRepository([{ id: "1", name: "Burger", description: "desc", price: 100, image: "img" }])
    );

    const created = await service.createOrder({
      items: [{ menuItemId: "1", quantity: 1 }],
      deliveryDetails: {
        name: "Ankit",
        address: "Road 4, City",
        phoneNumber: "9876543210"
      }
    });

    const updated = await service.updateOrderStatus(created.id, "Preparing");
    expect(updated?.status).toBe("Preparing");
  });

  it("deletes an existing order", async () => {
    const service = new OrderService(
      new FakeOrderRepository(),
      new FakeMenuRepository([{ id: "1", name: "Burger", description: "desc", price: 100, image: "img" }])
    );

    const created = await service.createOrder({
      items: [{ menuItemId: "1", quantity: 1 }],
      deliveryDetails: {
        name: "Ankit",
        address: "Road 4, City",
        phoneNumber: "9876543210"
      }
    });

    const deleted = await service.deleteOrder(created.id);
    expect(deleted).toBe(true);
    const missing = await service.getOrderById(created.id);
    expect(missing).toBeUndefined();
  });
});
