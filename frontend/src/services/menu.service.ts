import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type { MenuItem } from "@/types/menu";

export class MenuService {
  static async getMenu(): Promise<MenuItem[]> {
    const response = await apiClient.get<ApiResponse<MenuItem[]>>("/menu");
    return response.data.data;
  }
}
