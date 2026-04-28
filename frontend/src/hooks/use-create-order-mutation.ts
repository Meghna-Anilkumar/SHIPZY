import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderService } from "@/services/order.service";

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: OrderService.createOrder,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
      void queryClient.invalidateQueries({ queryKey: ["order-status"] });
    }
  });
};
