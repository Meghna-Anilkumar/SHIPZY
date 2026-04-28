import { useQuery } from "@tanstack/react-query";
import { MenuService } from "@/services/menu.service";

export const useMenuQuery = () =>
  useQuery({
    queryKey: ["menu"],
    queryFn: MenuService.getMenu
  });
