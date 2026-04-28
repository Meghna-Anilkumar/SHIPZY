import { z } from "zod";
import type { IMenuRepository, IOrderRepository } from "../repositories/interfaces";
import type { CreateOrderInput, Order, OrderItem, OrderStatus } from "../types/order.types";

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      menuItemId: z.string().min(1),
      quantity: z.number().int().positive()
    })
  ).min(1),
  deliveryDetails: z.object({
    name: z.string().min(2),
    address: z.string().min(5),
    phoneNumber: z.string().regex(/^[0-9]{10}$/)
  })
});

export interface IOrderService {
  createOrder(input: CreateOrderInput): Promise<Order>;
  getAllOrders(): Promise<Order[]>;
  getOrderById(orderId: string): Promise<Order | undefined>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | undefined>;
  deleteOrder(orderId: string): Promise<boolean>;
}

export class OrderService implements IOrderService {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly menuRepository: IMenuRepository
  ) {}

  async createOrder(input: CreateOrderInput): Promise<Order> {
    const validated = createOrderSchema.parse(input);

    const orderItems: OrderItem[] = [];
    for (const item of validated.items) {
      const menuItem = await this.menuRepository.getById(item.menuItemId);
      if (!menuItem) {
        throw new Error(`Menu item ${item.menuItemId} not found`);
      }
      orderItems.push({
        menuItemId: menuItem.id,
        name: menuItem.name,
        quantity: item.quantity,
        unitPrice: menuItem.price,
        lineTotal: menuItem.price * item.quantity
      });
    }

    const totalAmount = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const order: Omit<Order, "id"> = {
      items: orderItems,
      deliveryDetails: validated.deliveryDetails,
      totalAmount,
      status: "Order Received",
      createdAt: new Date().toISOString()
    };

    return this.orderRepository.create(order);
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.getAll();
  }

  async getOrderById(orderId: string): Promise<Order | undefined> {
    return this.orderRepository.getById(orderId);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | undefined> {
    return this.orderRepository.updateStatus(orderId, status);
  }

  async deleteOrder(orderId: string): Promise<boolean> {
    return this.orderRepository.deleteById(orderId);
  }
}
