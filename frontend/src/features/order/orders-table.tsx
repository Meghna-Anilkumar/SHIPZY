import { useMemo, useState } from "react";
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
    <section className="animate-section-fade space-y-4">
      <Card className="border-[#e7d5c4] bg-white/85 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-sm">
        <CardHeader className="gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-[#2b1d15]">Your Orders</CardTitle>
          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as typeof statusFilter);
                setCurrentPage(1);
              }}
              className="h-10 rounded-md border border-[#d8bca3] bg-white px-3 text-sm text-[#2b1d15] outline-none focus:border-[#f28705]"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </CardHeader>
      </Card>

      {filteredOrders.length === 0 ? (
        <Card className="border-dashed border-[#e5c8ad] bg-[#fff7ef]/90 text-center">
          <CardContent className="p-8">
            <p className="text-lg font-semibold text-[#7a4a1f]">No orders in this status yet</p>
            <p className="mt-1 text-sm text-[#9e6f44]">Place your next meal from the menu and it will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {paginatedData.rows.map((order) => (
              <Card key={order.id} className="border-[#ecd9c7] bg-white/90 transition hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="space-y-3 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#2b1d15]">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </p>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase text-[#9b6b3f]">Items</p>
                      <p className="text-sm text-[#5f3b20]">
                        {order.items[0]?.name ?? "Meal"} {order.items.length > 1 ? `+${order.items.length - 1} more` : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-[#9b6b3f]">Total</p>
                      <p className="text-sm font-semibold text-[#2b1d15]">Rs. {order.totalAmount}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-[#9b6b3f]">Delivery Address</p>
                      <p className="line-clamp-2 text-sm text-[#5f3b20]">{order.deliveryDetails.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={paginatedData.totalPages} onPageChange={setCurrentPage} />
        </>
      )}
    </section>
  );
};
