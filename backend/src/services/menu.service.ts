import type { IMenuRepository } from "../repositories/interfaces";
import type { MenuItem } from "../types/menu.types";

export interface IMenuService {
  getMenu(): Promise<MenuItem[]>;
}

export class MenuService implements IMenuService {
  constructor(private readonly menuRepository: IMenuRepository) {}

  async getMenu(): Promise<MenuItem[]> {
    return this.menuRepository.getAll();
  }
}
