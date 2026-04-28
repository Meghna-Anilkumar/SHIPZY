export type OrderStatus = "Order Received" | "Preparing" | "Out for Delivery" | "Delivered";

export interface CartItemInput {
  menuItemId: string;
  quantity: number;
}

export interface DeliveryDetails {
  name: string;
  address: string;
  phoneNumber: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  deliveryDetails: DeliveryDetails;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface CreateOrderInput {
  items: CartItemInput[];
  deliveryDetails: DeliveryDetails;
}
