import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/interfaces/api.interface";
import type { MenuItem } from "@/interfaces/menu.interface";

export class MenuService {
  static async getMenu(): Promise<MenuItem[]> {
    const response = await apiClient.get<ApiResponse<MenuItem[]>>("/menu");
    return response.data.data;
  }
}
