import { useEffect, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/common/pagination";
import { LoadingState } from "@/components/common/loading-state";
import { ErrorState } from "@/components/common/error-state";
import { useMenuQuery } from "@/hooks/use-menu-query";
import { useCartStore } from "@/store/cart.store";

const PAGE_SIZE = 6;

interface MenuListProps {
  searchQuery: string;
  onItemAdded?: (itemName: string) => void;
}

export const MenuList = ({ searchQuery, onItemAdded }: MenuListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [addedItemId, setAddedItemId] = useState<string | null>(null);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);
  const addToCart = useCartStore((state) => state.addToCart);
  const { data, isLoading, isError, error, refetch } = useMenuQuery();

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!data) {
      return [];
    }
    if (!query) {
      return data;
    }

    return data.filter(
      (item) => item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
    );
  }, [data, searchQuery]);

  const paginatedData = useMemo(() => {
    const items = filteredItems;
    const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
    const start = (currentPage - 1) * PAGE_SIZE;
    return {
      items: items.slice(start, start + PAGE_SIZE),
      totalPages
    };
  }, [currentPage, filteredItems]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (!addedItemId) {
      return;
    }
    const timeout = window.setTimeout(() => setAddedItemId(null), 900);
    return () => window.clearTimeout(timeout);
  }, [addedItemId]);

  useEffect(() => {
    if (!addedMessage) {
      return;
    }
    const timeout = window.setTimeout(() => setAddedMessage(null), 1600);
    return () => window.clearTimeout(timeout);
  }, [addedMessage]);

  if (isLoading) {
    return <LoadingState label="Fetching menu..." />;
  }

  if (isError) {
    return <ErrorState message={error.message} onRetry={() => void refetch()} />;
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-slate-600">No menu items available right now.</CardContent>
      </Card>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <Card className="border-[#e5c8ad] bg-[#fff8f1]">
        <CardContent className="p-6 text-center text-[#8a5a2e]">
          No dishes found for that search. Try another flavor keyword.
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="space-y-4">
      {addedMessage ? (
        <div className="animate-slide-up-fade inline-flex items-center gap-2 rounded-full border border-[#e5c8ad] bg-[#fff8ef] px-4 py-2 text-sm font-medium text-[#7a4a1f] shadow-sm">
          <CheckCircle2 size={16} className="text-[#f28705]" /> {addedMessage}
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {paginatedData.items.map((item) => (
          <Card
            key={item.id}
            className="group animate-card-enter overflow-hidden border-[#e8d2bc] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(53,28,11,0.15)]"
          >
            <div className="overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-[#2b1d15]">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm text-[#7a5a3f]">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-[#5a3318]">Rs. {item.price}</span>
                <Button
                  onClick={() => {
                    addToCart(item);
                    setAddedItemId(item.id);
                    setAddedMessage(`${item.name} added to cart`);
                    onItemAdded?.(item.name);
                  }}
                  className={addedItemId === item.id ? "animate-subtle-pop" : ""}
                >
                  {addedItemId === item.id ? "Added" : "Add"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={paginatedData.totalPages}
        onPageChange={setCurrentPage}
      />
    </section>
  );
};
