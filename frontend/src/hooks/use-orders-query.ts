import { useQuery } from "@tanstack/react-query";
import { OrderService } from "@/services/order.service";

export const useOrdersQuery = () =>
  useQuery({
    queryKey: ["orders"],
    queryFn: OrderService.getOrders,
    refetchInterval: 5000
  });
