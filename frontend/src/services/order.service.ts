import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/interfaces/api.interface";
import type { CreateOrderRequest, Order } from "@/interfaces/order.interface";
import type { OrderStatus } from "@/types/order";

export class OrderService {
  static async getOrders(): Promise<Order[]> {
    const response = await apiClient.get<ApiResponse<Order[]>>("/orders");
    return response.data.data;
  }

  static async createOrder(payload: CreateOrderRequest): Promise<Order> {
    const response = await apiClient.post<ApiResponse<Order>>("/orders", payload);
    return response.data.data;
  }

  static async getOrderById(orderId: string): Promise<Order> {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return response.data.data;
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const response = await apiClient.patch<ApiResponse<Order>>(`/orders/${orderId}/status`, { status });
    return response.data.data;
  }
}
