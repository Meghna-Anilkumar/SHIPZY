import { StatusBadge } from "@/components/common/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrderStatusQuery } from "@/hooks/use-order-status-query";
import type { OrderStatus } from "@/types/order";

type OrderTrackerProps = {
  orderId: string | null;
};

const STATUS_FLOW: OrderStatus[] = ["Order Received", "Preparing", "Out for Delivery", "Delivered"];

const STATUS_STYLES: Record<OrderStatus, string> = {
  "Order Received": "bg-amber-100 text-amber-700 border-amber-200",
  Preparing: "bg-orange-100 text-orange-700 border-orange-200",
  "Out for Delivery": "bg-sky-100 text-sky-700 border-sky-200",
  Delivered: "bg-emerald-100 text-emerald-700 border-emerald-200"
};

export const OrderTracker = ({ orderId }: OrderTrackerProps) => {
  const { data } = useOrderStatusQuery(orderId);

  if (!orderId || !data) {
    return null;
  }

  const currentStep = STATUS_FLOW.indexOf(data.status);
  const progress = ((currentStep + 1) / STATUS_FLOW.length) * 100;

  return (
    <Card className="overflow-hidden border-[#e7d5c4] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
      <CardHeader>
        <CardTitle>Order Tracking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-[#7a5a3f]">Order ID: {data.id}</p>
        <div className="rounded-lg border bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-wide text-[#7a5a3f]">Current status</p>
          <div className="mt-2">
            <StatusBadge status={data.status} />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-[#f28705] transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {STATUS_FLOW.map((status, idx) => {
              const isComplete = idx <= currentStep;
              return (
                <p
                  key={status}
                  className={`rounded-md border px-2 py-1 text-center text-xs ${
                    isComplete ? STATUS_STYLES[status] : "border-slate-200 bg-white text-slate-500"
                  }`}
                >
                  {status}
                </p>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
