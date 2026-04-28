import { useMemo, useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/common/pagination";
import { LoadingState } from "@/components/common/loading-state";
import { ErrorState } from "@/components/common/error-state";
import { StatusBadge } from "@/components/common/status-badge";
import { useOrdersQuery } from "@/hooks/use-orders-query";
import type { Order } from "@/types/order";

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

interface OrdersTableProps {
  onViewOrder: (order: Order) => void;
}

export const OrdersTable = ({ onViewOrder }: OrdersTableProps) => {
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "shipped" | "delivered" | "cancelled">("all");
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useOrdersQuery();

  const filteredOrders = useMemo(() => {
    const orders = data ?? [];
    return orders.filter((order) => {
      const matchesFilter = statusFilter === "all" ? true : statusToFilter(order.status) === statusFilter;
      const normalizedQuery = query.trim().toLowerCase();
      const matchesQuery =
        normalizedQuery.length === 0 ||
        order.id.toLowerCase().includes(normalizedQuery) ||
        order.deliveryDetails.name.toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [data, query, statusFilter]);

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
    <Card className="border-[#e7d5c4] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
      <CardHeader className="gap-3 md:flex-row md:items-center md:justify-between">
        <CardTitle className="text-[#2b1d15]">Order History</CardTitle>
        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Order ID or customer"
            className="md:w-72"
          />
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
      <CardContent className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#e5c8ad] bg-[#fff7ef] p-6 text-center">
            <p className="text-lg font-semibold text-[#7a4a1f]">No matching orders yet</p>
            <p className="mt-1 text-sm text-[#9e6f44]">Try changing filters or place a fresh order from the menu.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-[#f0dfce]">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-[#fff3e8] text-left text-[#7a4a1f]">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Items</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.rows.map((order) => (
                    <tr key={order.id} className="border-t border-[#f5e8db] transition hover:bg-[#fffbf7]">
                      <td className="px-4 py-3 font-medium text-[#2b1d15]">{order.id.slice(-8)}</td>
                      <td className="px-4 py-3 text-[#6f4b2a]">{order.deliveryDetails.name}</td>
                      <td className="px-4 py-3 text-[#6f4b2a]">{order.items.length}</td>
                      <td className="px-4 py-3 text-[#2b1d15]">Rs. {order.totalAmount}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="outline" size="sm" onClick={() => onViewOrder(order)}>
                          <Eye size={14} /> View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={currentPage} totalPages={paginatedData.totalPages} onPageChange={setCurrentPage} />
          </>
        )}
      </CardContent>
    </Card>
  );
};
