import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/common/pagination";
import { LoadingState } from "@/components/common/loading-state";
import { ErrorState } from "@/components/common/error-state";
import { StatusBadge } from "@/components/common/status-badge";
import { useOrdersQuery } from "@/hooks/use-orders-query";
import type { Order } from "@/interfaces/order.interface";

const PAGE_SIZE = 5;

const statusToFilter = (status: Order["status"]): "all" | "pending" | "shipped" | "delivered" | "cancelled" => {
  if (status === "Delivered") {
    return "delivered";
  }
  if (status === "Out for Delivery") {
    return "shipped";
  }
  return "pending";
};

export const OrdersTable = () => {
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "shipped" | "delivered" | "cancelled">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useOrdersQuery();

  const filteredOrders = useMemo(() => {
    const orders = data ?? [];
    return orders.filter((order) => (statusFilter === "all" ? true : statusToFilter(order.status) === statusFilter));
  }, [data, statusFilter]);

  const paginatedData = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
    const start = (currentPage - 1) * PAGE_SIZE;
    return {
      rows: filteredOrders.slice(start, start + PAGE_SIZE),
      totalPages
    };
  }, [currentPage, filteredOrders]);

  if (isLoading) {
    return <LoadingState label="Loading your order history..." />;
  }

  if (isError) {
    return <ErrorState message={error.message} onRetry={() => void refetch()} />;
  }

  return (
    <section className="animate-section-fade mx-auto max-w-3xl space-y-4">
      <Card className="bg-white/85 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-sm">
        <CardHeader className="gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-[#2b1d15]">Your Orders</CardTitle>
          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
            <div className="relative">
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as typeof statusFilter);
                setCurrentPage(1);
              }}
              className="h-10 appearance-none rounded-full bg-[#fff4e6] px-4 pr-10 text-sm font-medium italic text-[#5f3b20] shadow-sm outline-none"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8b5b31]" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {filteredOrders.length === 0 ? (
        <Card className="bg-[#fff7ef]/90 text-center">
          <CardContent className="p-8">
            <p className="text-lg font-semibold text-[#7a4a1f]">No orders in this status yet</p>
            <p className="mt-1 text-sm text-[#9e6f44]">Place your next meal from the menu and it will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedData.rows.map((order) => (
              <div key={order.id} className="space-y-2">
                <Card className="overflow-hidden bg-[#fffaf4] shadow-[0_8px_24px_rgba(66,36,12,0.08)] transition hover:-translate-y-0.5 hover:shadow-md">
                  <CardContent className="space-y-3 p-0">
                    <div className="flex flex-wrap items-center justify-between border-b border-dashed border-[#e7d2bd] bg-[#fff1e3] px-4 py-3">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-[#9b6b3f]">Shipzy e-bill</p>
                        <p className="text-sm font-semibold text-[#2b1d15]">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })}{" "}
                          ·{" "}
                          {new Date(order.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="space-y-2 px-4 pb-4">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.menuItemId} className="flex items-center justify-between text-sm text-[#5f3b20]">
                          <p>
                            {item.name} x {item.quantity}
                          </p>
                          <p>Rs. {item.lineTotal}</p>
                        </div>
                      ))}
                      {order.items.length > 3 ? (
                        <p className="text-xs text-[#9b6b3f]">+{order.items.length - 3} more items in this bill</p>
                      ) : null}
                      <div className="my-2 border-t border-dashed border-[#e7d2bd]" />
                      <div className="flex items-center justify-between">
                        <p className="text-xs uppercase text-[#9b6b3f]">Delivery Address</p>
                        <p className="text-xs uppercase text-[#9b6b3f]">Total Paid</p>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <p className="max-w-[70%] text-sm text-[#5f3b20]">{order.deliveryDetails.address}</p>
                        <p className="text-base font-bold text-[#2b1d15]">Rs. {order.totalAmount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={paginatedData.totalPages} onPageChange={setCurrentPage} />
        </>
      )}
    </section>
  );
};
