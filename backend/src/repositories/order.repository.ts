import type { IOrderRepository } from "./interfaces";
import type { Order, OrderStatus } from "../types/order.types";
import { OrderModel } from "../types/order.model";

export class MongoOrderRepository implements IOrderRepository {
  private mapToOrder(doc: any): Order {
    return {
      id: doc._id.toString(),
      items: doc.items,
      deliveryDetails: {
        name: doc.deliveryDetails.name,
        address: doc.deliveryDetails.address,
        phoneNumber: doc.deliveryDetails.phoneNumber
      },
      totalAmount: doc.totalAmount,
      status: doc.status,
      createdAt: doc.createdAt.toISOString()
    };
  }

  async create(order: Omit<Order, "id">): Promise<Order> {
    const created = await OrderModel.create({
      items: order.items,
      deliveryDetails: order.deliveryDetails,
      totalAmount: order.totalAmount,
      status: order.status
    });
    return this.mapToOrder(created);
  }

  async getAll(): Promise<Order[]> {
    const docs = await OrderModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((doc) => this.mapToOrder(doc));
  }

  async getById(id: string): Promise<Order | undefined> {
    const doc = await OrderModel.findById(id).lean();
    if (!doc) {
      return undefined;
    }

    return this.mapToOrder(doc);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order | undefined> {
    const updated = await OrderModel.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!updated) {
      return undefined;
    }
    return this.mapToOrder(updated);
  }

  async deleteById(id: string): Promise<boolean> {
    const deleted = await OrderModel.findByIdAndDelete(id).lean();
    return Boolean(deleted);
  }
}
