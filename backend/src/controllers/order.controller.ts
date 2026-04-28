import type { Request, Response } from "express";
import { ZodError } from "zod";
import { MESSAGES } from "../constants/messages";
import { HTTP_STATUS } from "../constants/httpStatus";
import type { OrderStatus } from "../types/order.types";
import type { IOrderService } from "../services/order.service";
import { OrderStatusSimulatorService } from "../services/order-status-simulator.service";

const ALLOWED_STATUSES: OrderStatus[] = ["Order Received", "Preparing", "Out for Delivery", "Delivered"];

export class OrderController {
  constructor(
    private readonly orderService: IOrderService,
    private readonly statusSimulator: OrderStatusSimulatorService
  ) {}

  createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const order = await this.orderService.createOrder(req.body);
      this.statusSimulator.start(order.id);
      res.status(HTTP_STATUS.CREATED).json({
        message: MESSAGES.ORDER_PLACED,
        data: order
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: MESSAGES.INVALID_INPUT,
          errors: error.issues
        });
        return;
      }

      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: error instanceof Error ? error.message : MESSAGES.INVALID_INPUT
      });
    }
  };

  getOrders = async (_req: Request, res: Response): Promise<void> => {
    const orders = await this.orderService.getAllOrders();
    res.status(HTTP_STATUS.OK).json({
      message: MESSAGES.ORDER_FETCHED,
      data: orders
    });
  };

  getOrderById = async (req: Request, res: Response): Promise<void> => {
    const orderId = String(req.params.id);
    const order = await this.orderService.getOrderById(orderId);
    if (!order) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.ORDER_NOT_FOUND });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      message: MESSAGES.ORDER_FETCHED,
      data: order
    });
  };

  updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    const { status } = req.body as { status?: OrderStatus };
    if (!status || !ALLOWED_STATUSES.includes(status)) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.INVALID_INPUT });
      return;
    }

    const orderId = String(req.params.id);
    const order = await this.orderService.updateOrderStatus(orderId, status);
    if (!order) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.ORDER_NOT_FOUND });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      message: MESSAGES.ORDER_UPDATED,
      data: order
    });
  };

  deleteOrder = async (req: Request, res: Response): Promise<void> => {
    const orderId = String(req.params.id);
    const deleted = await this.orderService.deleteOrder(orderId);
    if (!deleted) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.ORDER_NOT_FOUND });
      return;
    }

    res.status(HTTP_STATUS.OK).json({ message: MESSAGES.ORDER_DELETED });
  };
}
