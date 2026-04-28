export type DeliveryDetails = {
  name: string;
  address: string;
  phoneNumber: string;
};

export type CartItemPayload = {
  menuItemId: string;
  quantity: number;
};

export type OrderItem = {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type Order = {
  id: string;
  items: OrderItem[];
  deliveryDetails: DeliveryDetails;
  totalAmount: number;
  status: import("@/types/order").OrderStatus;
  createdAt: string;
};

export type CreateOrderRequest = {
  items: CartItemPayload[];
  deliveryDetails: DeliveryDetails;
};
