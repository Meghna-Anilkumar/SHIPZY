import { describe, expect, it } from "vitest";
import { MenuService } from "../services/menu.service";
import type { IMenuRepository } from "../repositories/interfaces";
import type { MenuItem } from "../types/menu.types";

class FakeMenuRepository implements IMenuRepository {
  constructor(private readonly items: MenuItem[]) {}

  async getAll(): Promise<MenuItem[]> {
    return this.items;
  }

  async getById(id: string): Promise<MenuItem | undefined> {
    return this.items.find((item) => item.id === id);
  }
}

describe("MenuService", () => {
  it("returns all menu items", async () => {
    const service = new MenuService(
      new FakeMenuRepository([
        { id: "1", name: "Pizza", description: "Classic", price: 300, image: "pizza.jpg" }
      ])
    );

    const menu = await service.getMenu();
    expect(menu).toHaveLength(1);
    expect(menu[0].name).toBe("Pizza");
  });
});
