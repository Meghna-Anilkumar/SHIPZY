import type { OrderStatus } from "@/types/order";

type ExtendedStatus = OrderStatus | "Cancelled" | "Pending" | "Shipped";

const STATUS_CLASS: Record<ExtendedStatus, string> = {
  Pending: "bg-amber-100 text-amber-800 border-amber-200",
  Shipped: "bg-sky-100 text-sky-800 border-sky-200",
  Delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Cancelled: "bg-rose-100 text-rose-800 border-rose-200",
  "Order Received": "bg-amber-100 text-amber-800 border-amber-200",
  Preparing: "bg-orange-100 text-orange-800 border-orange-200",
  "Out for Delivery": "bg-sky-100 text-sky-800 border-sky-200"
};

const STATUS_LABEL: Record<ExtendedStatus, string> = {
  Pending: "Pending",
  Shipped: "Shipped",
  Delivered: "Delivered",
  Cancelled: "Cancelled",
  "Order Received": "Pending",
  Preparing: "Preparing",
  "Out for Delivery": "Shipped"
};

export const StatusBadge = ({ status }: { status: ExtendedStatus }) => (
  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_CLASS[status]}`}>
    {STATUS_LABEL[status]}
  </span>
);
