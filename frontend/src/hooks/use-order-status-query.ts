import { useQuery } from "@tanstack/react-query";
import { OrderService } from "@/services/order.service";

export const useOrderStatusQuery = (orderId: string | null) =>
  useQuery({
    queryKey: ["order-status", orderId],
    queryFn: () => OrderService.getOrderById(orderId as string),
    enabled: Boolean(orderId),
    refetchInterval: (query) => {
      const currentStatus = query.state.data?.status;
      return currentStatus && currentStatus !== "Delivered" ? 5000 : false;
    }
  });
