import type { MenuItem } from "../types/menu.types";
import type { IMenuRepository } from "./interfaces";

import { MenuModel } from "../types/menu.model";

export class MongoMenuRepository implements IMenuRepository {
  async getAll(): Promise<MenuItem[]> {
    const docs = await MenuModel.find().lean();
    return docs.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      price: doc.price,
      image: doc.image
    }));
  }

  async getById(id: string): Promise<MenuItem | undefined> {
    const doc = await MenuModel.findById(id).lean();
    if (!doc) {
      return undefined;
    }

    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      price: doc.price,
      image: doc.image
    };
  }
}
