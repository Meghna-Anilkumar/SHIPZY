import { useEffect, useMemo, useState } from "react";
import { Bell, PackageCheck, ShoppingCart, Soup, Truck, UserRound } from "lucide-react";
import { CommonModal } from "@/components/common/common-modal";
import { MenuList } from "@/features/menu/menu-list";
import { CartSummary } from "@/features/cart/cart-summary";
import { CheckoutForm } from "@/features/order/checkout-form";
import { OrderTracker } from "@/features/order/order-tracker";
import { OrdersTable } from "@/features/order/orders-table";
import { StatusBadge } from "@/components/common/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/store/cart.store";
import { useCreateOrderMutation } from "@/hooks/use-create-order-mutation";
import { useOrdersQuery } from "@/hooks/use-orders-query";
import { LoadingState } from "@/components/common/loading-state";
import type { CheckoutFormValues } from "@/validations/checkout.schema";
import type { Order } from "@/types/order";

const App = () => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeSection, setActiveSection] = useState<"menu" | "orders">("menu");
  const [cartPulse, setCartPulse] = useState(false);
  const { items, clearCart } = useCartStore();
  const createOrderMutation = useCreateOrderMutation();
  const { data: orders, isLoading: ordersLoading } = useOrdersQuery();

  const canCheckout = items.length > 0;
  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const cartTotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const pendingCount = useMemo(
    () => (orders ?? []).filter((order) => order.status !== "Delivered").length,
    [orders]
  );
  const deliveredCount = useMemo(
    () => (orders ?? []).filter((order) => order.status === "Delivered").length,
    [orders]
  );
  const cartPayload = useMemo(
    () =>
      items.map((item) => ({
        menuItemId: item.id,
        quantity: item.quantity
      })),
    [items]
  );

  const handleCheckout = async (values: CheckoutFormValues) => {
    const order = await createOrderMutation.mutateAsync({
      items: cartPayload,
      deliveryDetails: values
    });
    clearCart();
    setCheckoutOpen(false);
    setCartOpen(false);
    setActiveOrderId(order.id);
  };

  useEffect(() => {
    if (!cartPulse) {
      return;
    }
    const timeout = window.setTimeout(() => setCartPulse(false), 700);
    return () => window.clearTimeout(timeout);
  }, [cartPulse]);

  return (
    <main className="min-h-screen bg-[#f9efe6]">
      <div className="mx-auto flex max-w-[1500px] gap-6 p-4 lg:p-6">
        <aside className="hidden w-72 shrink-0 rounded-2xl border border-[#2b1d15]/10 bg-[#2b1d15] p-5 text-white shadow-2xl lg:block">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f28705] text-white">
              <Truck size={20} />
            </div>
            <div>
              <p className="text-xl font-bold tracking-wide">Shipzy</p>
              <p className="text-xs text-[#d7bca6]">Food delivery made delightful</p>
            </div>
          </div>
          <nav className="mt-8 space-y-2">
            <button
              onClick={() => setActiveSection("menu")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold transition ${
                activeSection === "menu" ? "bg-[#f28705] text-white" : "text-[#f2dfcf] hover:bg-[#3c2a1e]"
              }`}
            >
              <Soup size={18} /> Browse Food
            </button>
            <button
              onClick={() => setActiveSection("orders")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold transition ${
                activeSection === "orders" ? "bg-[#f28705] text-white" : "text-[#f2dfcf] hover:bg-[#3c2a1e]"
              }`}
            >
              <PackageCheck size={18} /> My Orders
            </button>
            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[#f2dfcf] transition hover:bg-[#3c2a1e]">
              <UserRound size={18} /> My Profile
            </button>
          </nav>
          <div className="mt-8 rounded-xl border border-[#5a4434] bg-[#35261b] p-4">
            <p className="text-sm text-[#e8d2c0]">Late-night cravings?</p>
            <p className="mt-1 text-lg font-semibold">Serve faster with Shipzy.</p>
          </div>
        </aside>

        <div className="flex-1 space-y-6">
          <header className="rounded-2xl border border-[#ead9c9] bg-white p-4 shadow-[0_10px_30px_rgba(57,31,13,0.08)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 lg:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f28705] text-white">
                  <Truck size={20} />
                </div>
                <p className="text-xl font-bold text-[#2b1d15]">Shipzy</p>
              </div>
              <div className="w-full max-w-xl">
                <Input
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-[#e8cfb9] bg-[#fff8f1] p-2.5 text-[#8f5f2f] transition hover:bg-[#ffeddc]"
                >
                  <Bell size={18} />
                </button>
                <Button onClick={() => setCartOpen(true)} className="relative">
                  <ShoppingCart size={16} />
                  Cart
                  {totalItems > 0 ? (
                    <span
                      className={`absolute -right-2 -top-2 rounded-full bg-[#2b1d15] px-1.5 py-0.5 text-xs text-white ${
                        cartPulse ? "animate-subtle-pop" : ""
                      }`}
                    >
                      {totalItems}
                    </span>
                  ) : null}
                </Button>
              </div>
            </div>
            <div className="mt-3 flex gap-2 lg:hidden">
              <Button
                variant={activeSection === "menu" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSection("menu")}
              >
                <Soup size={14} /> Menu
              </Button>
              <Button
                variant={activeSection === "orders" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSection("orders")}
              >
                <PackageCheck size={14} /> Orders
              </Button>
            </div>
          </header>

          {createOrderMutation.error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              {createOrderMutation.error.message}
            </div>
          ) : null}

          <section className="grid gap-4 md:grid-cols-4">
            <Card className="border-[#e8d2bc] bg-white">
              <CardContent className="p-4">
                <p className="text-xs uppercase text-[#9b6b3f]">Cart Value</p>
                <p className="mt-1 text-2xl font-bold text-[#2b1d15]">Rs. {cartTotal}</p>
              </CardContent>
            </Card>
            <Card className="border-[#e8d2bc] bg-white">
              <CardContent className="p-4">
                <p className="text-xs uppercase text-[#9b6b3f]">Open Orders</p>
                <p className="mt-1 text-2xl font-bold text-[#2b1d15]">{pendingCount}</p>
              </CardContent>
            </Card>
            <Card className="border-[#e8d2bc] bg-white">
              <CardContent className="p-4">
                <p className="text-xs uppercase text-[#9b6b3f]">Delivered</p>
                <p className="mt-1 text-2xl font-bold text-[#2b1d15]">{deliveredCount}</p>
              </CardContent>
            </Card>
            <Card className="border-[#e8d2bc] bg-gradient-to-r from-[#fff3e8] to-[#ffe0c1]">
              <CardContent className="p-4">
                <p className="text-xs uppercase text-[#9b6b3f]">Current Focus</p>
                <p className="mt-1 text-lg font-semibold text-[#2b1d15]">{activeOrderId ? "Tracking live order" : "Ready to order"}</p>
              </CardContent>
            </Card>
          </section>

          {activeSection === "menu" ? (
            <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
              <MenuList
                searchQuery={searchQuery}
                onItemAdded={() => {
                  setCartPulse(true);
                }}
              />
              {ordersLoading ? (
                <LoadingState label="Syncing latest order status..." />
              ) : (
                <OrderTracker orderId={activeOrderId} />
              )}
            </div>
          ) : (
            <OrdersTable onViewOrder={(order) => setSelectedOrder(order)} />
          )}
        </div>
      </div>

      <CommonModal
        open={cartOpen}
        onOpenChange={setCartOpen}
        title="Your Cart"
        description="Review items before checkout."
      >
        <CartSummary className="border-none shadow-none" onCheckout={() => setCheckoutOpen(true)} />
      </CommonModal>

      <CommonModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        title="Checkout"
        description="Enter delivery details to place the order."
      >
        {!canCheckout ? (
          <p className="text-sm text-slate-600">Add at least one item before checkout.</p>
        ) : (
          <CheckoutForm onSubmit={(values) => void handleCheckout(values)} isSubmitting={createOrderMutation.isPending} />
        )}
      </CommonModal>

      <CommonModal
        open={Boolean(selectedOrder)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedOrder(null);
          }
        }}
        title="Order details"
        description={selectedOrder ? `Order ${selectedOrder.id}` : undefined}
      >
        {selectedOrder ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-[#edd7c1] bg-[#fff8f1] p-3">
              <p className="text-sm text-[#6d4524]">{selectedOrder.deliveryDetails.name}</p>
              <StatusBadge status={selectedOrder.status} />
            </div>
            <div className="space-y-2">
              {selectedOrder.items.map((item) => (
                <div key={item.menuItemId} className="flex items-center justify-between rounded-md border border-[#f0dfce] p-3">
                  <p className="text-sm text-[#2b1d15]">
                    {item.name} x {item.quantity}
                  </p>
                  <p className="font-semibold text-[#5a3318]">Rs. {item.lineTotal}</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-[#f0dfce] p-3 text-sm text-[#7a5a3f]">
              <p>Address: {selectedOrder.deliveryDetails.address}</p>
              <p>Phone: {selectedOrder.deliveryDetails.phoneNumber}</p>
            </div>
          </div>
        ) : null}
      </CommonModal>
    </main>
  );
};

export default App;
