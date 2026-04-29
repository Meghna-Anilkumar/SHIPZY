import express from "express";
import cors from "cors";
import { MongoMenuRepository } from "./repositories/menu.repository";
import { MongoOrderRepository } from "./repositories/order.repository";
import { MenuService } from "./services/menu.service";
import { OrderService } from "./services/order.service";
import { OrderStatusSimulatorService } from "./services/order-status-simulator.service";
import { MenuController } from "./controllers/menu.controller";
import { OrderController } from "./controllers/order.controller";
import { createMenuRoutes } from "./routes/menu.routes";
import { createOrderRoutes } from "./routes/order.routes";
import { HTTP_STATUS } from "./constants/httpStatus";
import type { IMenuRepository, IOrderRepository } from "./repositories/interfaces";
import dotenv from "dotenv";
dotenv.config();

interface AppDependencies {
  menuRepository?: IMenuRepository;
  orderRepository?: IOrderRepository;
}

export const createApp = (dependencies: AppDependencies = {}) => {
  const app = express();
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    })
  );
  app.use(express.json());

  const menuRepository = dependencies.menuRepository ?? new MongoMenuRepository();
  const orderRepository = dependencies.orderRepository ?? new MongoOrderRepository();

  const menuService = new MenuService(menuRepository);
  const orderService = new OrderService(orderRepository, menuRepository);
  const orderStatusSimulator = new OrderStatusSimulatorService(orderService);

  const menuController = new MenuController(menuService);
  const orderController = new OrderController(orderService, orderStatusSimulator);

  app.use("/api/menu", createMenuRoutes(menuController));
  app.use("/api/orders", createOrderRoutes(orderController));
  app.get("/api/health", (_req, res) => {
    res.status(HTTP_STATUS.OK).json({ message: "Server is running" });
  });

  return app;
};
