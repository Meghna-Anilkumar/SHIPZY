import { Router } from "express";
import type { OrderController } from "../controllers/order.controller";

export const createOrderRoutes = (orderController: OrderController): Router => {
  const router = Router();
  router.get("/", orderController.getOrders);
  router.get("/:id", orderController.getOrderById);
  router.post("/", orderController.createOrder);
  router.patch("/:id/status", orderController.updateOrderStatus);
  router.delete("/:id", orderController.deleteOrder);
  return router;
};
