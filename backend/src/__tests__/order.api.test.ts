import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../app";
import type { IMenuRepository, IOrderRepository } from "../repositories/interfaces";
import type { MenuItem } from "../types/menu.types";
import type { Order, OrderStatus } from "../types/order.types";

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
      id: `order-${this.orders.length + 1}`
    };
    this.orders.unshift(created);
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

const buildTestApp = () => {
  const menuRepository = new FakeMenuRepository([
    {
      id: "pizza-1",
      name: "Margherita Pizza",
      description: "Fresh mozzarella and basil",
      price: 399,
      image: "https://images.example.com/pizza.jpg"
    }
  ]);
  const orderRepository = new FakeOrderRepository();

  return createApp({ menuRepository, orderRepository });
};

describe("Order API", () => {
  it("supports create/read/update/delete order operations", async () => {
    const app = buildTestApp();

    const createResponse = await request(app).post("/api/orders").send({
      items: [{ menuItemId: "pizza-1", quantity: 2 }],
      deliveryDetails: {
        name: "Aman Patel",
        address: "221B Baker Street",
        phoneNumber: "9876543210"
      }
    });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.data.totalAmount).toBe(798);
    expect(createResponse.body.data.status).toBe("Order Received");
    const orderId = String(createResponse.body.data.id);

    const getByIdResponse = await request(app).get(`/api/orders/${orderId}`);
    expect(getByIdResponse.status).toBe(200);
    expect(getByIdResponse.body.data.id).toBe(orderId);

    const updateStatusResponse = await request(app).patch(`/api/orders/${orderId}/status`).send({
      status: "Preparing"
    });
    expect(updateStatusResponse.status).toBe(200);
    expect(updateStatusResponse.body.data.status).toBe("Preparing");

    const deleteResponse = await request(app).delete(`/api/orders/${orderId}`);
    expect(deleteResponse.status).toBe(200);

    const getAfterDeleteResponse = await request(app).get(`/api/orders/${orderId}`);
    expect(getAfterDeleteResponse.status).toBe(404);
  });

  it("validates order payload and status updates", async () => {
    const app = buildTestApp();

    const invalidCreateResponse = await request(app).post("/api/orders").send({
      items: [],
      deliveryDetails: {
        name: "A",
        address: "x",
        phoneNumber: "1234"
      }
    });
    expect(invalidCreateResponse.status).toBe(400);

    const created = await request(app).post("/api/orders").send({
      items: [{ menuItemId: "pizza-1", quantity: 1 }],
      deliveryDetails: {
        name: "Riya Sharma",
        address: "Sector 9, Park Avenue",
        phoneNumber: "9876543210"
      }
    });

    const invalidStatusResponse = await request(app)
      .patch(`/api/orders/${created.body.data.id}/status`)
      .send({ status: "Unknown Status" });
    expect(invalidStatusResponse.status).toBe(400);
  });
});
