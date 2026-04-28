import type { IOrderService } from "./order.service";
import type { OrderStatus } from "../types/order.types";

export class OrderStatusSimulatorService {
  private readonly statusFlow: OrderStatus[] = [
    "Order Received",
    "Preparing",
    "Out for Delivery",
    "Delivered"
  ];

  constructor(private readonly orderService: IOrderService) {}

  start(orderId: string): void {
    let step = 1;
    const interval = setInterval(() => {
      void (async () => {
      if (step >= this.statusFlow.length) {
        clearInterval(interval);
        return;
      }
      const updated = await this.orderService.updateOrderStatus(orderId, this.statusFlow[step]);
      step += 1;
      if (!updated || updated.status === "Delivered") {
        clearInterval(interval);
      }
      })();
    }, 5000);
  }
}
