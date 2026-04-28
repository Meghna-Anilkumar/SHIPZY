import { Schema, model } from "mongoose";

const orderItemSchema = new Schema(
  {
    menuItemId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    lineTotal: { type: Number, required: true }
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    items: { type: [orderItemSchema], required: true },
    deliveryDetails: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      phoneNumber: { type: String, required: true }
    },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Order Received", "Preparing", "Out for Delivery", "Delivered"],
      required: true
    }
  },
  { timestamps: true }
);

export const OrderModel = model("Order", orderSchema);
