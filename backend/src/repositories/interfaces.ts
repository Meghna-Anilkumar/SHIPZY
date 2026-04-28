import type { MenuItem } from "../types/menu.types";
import type { Order, OrderStatus } from "../types/order.types";

export interface IMenuRepository {
  getAll(): Promise<MenuItem[]>;
  getById(id: string): Promise<MenuItem | undefined>;
}

export interface IOrderRepository {
  create(order: Omit<Order, "id">): Promise<Order>;
  getAll(): Promise<Order[]>;
  getById(id: string): Promise<Order | undefined>;
  updateStatus(id: string, status: OrderStatus): Promise<Order | undefined>;
  deleteById(id: string): Promise<boolean>;
}
