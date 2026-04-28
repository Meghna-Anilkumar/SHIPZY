import { Schema, model } from "mongoose";

const menuSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

export const MenuModel = model("Menu", menuSchema);
