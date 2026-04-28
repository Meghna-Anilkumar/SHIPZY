import { useEffect, useMemo, useState } from "react";
import { Bell, PackageCheck, ShoppingCart, Soup, Truck, UserRound } from "lucide-react";
import { CommonModal } from "@/components/common/common-modal";
import { BannerCarousel } from "@/features/menu/banner-carousel";
import { MenuList } from "@/features/menu/menu-list";
import { CartSummary } from "@/features/cart/cart-summary";
import { CheckoutForm } from "@/features/order/checkout-form";
import { OrderTracker } from "@/features/order/order-tracker";
import { OrdersTable } from "@/features/order/orders-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/store/cart.store";
import { useCreateOrderMutation } from "@/hooks/use-create-order-mutation";
import { useOrdersQuery } from "@/hooks/use-orders-query";
import { LoadingState } from "@/components/common/loading-state";
import type { CheckoutFormValues } from "@/validations/checkout.schema";
import type { MenuItem } from "@/interfaces/menu.interface";
import { getMenuItemRating } from "@/models/ratings.model";

const App = () => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<"menu" | "orders">("menu");
  const [selectedFood, setSelectedFood] = useState<MenuItem | null>(null);
  const [cartPulse, setCartPulse] = useState(false);
  const { items, clearCart } = useCartStore();
  const createOrderMutation = useCreateOrderMutation();
  const { data: orders, isLoading: ordersLoading } = useOrdersQuery();

  const canCheckout = items.length > 0;
  const showRightRail = items.length > 0 || Boolean(activeOrderId);
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
      <div className="mx-auto max-w-[1500px] space-y-6 p-4 lg:p-6">
        <header className="rounded-2xl border border-[#ead9c9] bg-white p-4 shadow-[0_10px_30px_rgba(57,31,13,0.08)]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 pr-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f28705] text-white">
                <Truck size={20} />
              </div>
              <div>
                <p className="text-xl font-bold text-[#2b1d15]">Shipzy</p>
                <p className="text-xs text-[#9b6b3f]">Food delivery made delightful</p>
              </div>
            </div>
            <nav className="flex flex-wrap items-center gap-2 rounded-xl border border-[#f0dfcf] bg-[#fff8f1] p-1">
              <Button variant={activeSection === "menu" ? "default" : "outline"} size="sm" onClick={() => setActiveSection("menu")}>
                <Soup size={14} /> Browse Food
              </Button>
              <Button variant={activeSection === "orders" ? "default" : "outline"} size="sm" onClick={() => setActiveSection("orders")}>
                <PackageCheck size={14} /> My Orders
              </Button>
              <Button variant="outline" size="sm">
                <UserRound size={14} /> Profile
              </Button>
            </nav>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                className="rounded-xl border border-[#e8cfb9] bg-[#fff8f1] p-2.5 text-[#8f5f2f] transition hover:bg-[#ffeddc]"
              >
                <Bell size={18} />
              </button>
              <Button onClick={() => setActiveSection("menu")} className="relative" aria-label="Open cart summary">
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
            <div className="w-full max-w-xl">
              <Input
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
          </div>
        </header>

        {activeSection === "menu" ? <BannerCarousel /> : null}

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
          <div className={`grid gap-6 ${showRightRail || selectedFood ? "xl:grid-cols-[1.35fr_0.9fr]" : "xl:grid-cols-1"}`}>
            <MenuList
              searchQuery={searchQuery}
              selectedItemId={selectedFood?.id ?? null}
              onCardSelect={(item) => setSelectedFood(item)}
              onItemAdded={() => {
                setCartPulse(true);
              }}
            />
            {showRightRail || selectedFood ? (
              <div className="space-y-4">
                {selectedFood ? (
                  <Card className="overflow-hidden border-[#e8d2bc]">
                    <img src={selectedFood.image} alt={selectedFood.name} className="h-48 w-full object-cover object-center" />
                    <CardContent className="space-y-2 p-4">
                      <p className="text-xs uppercase tracking-wide text-[#9b6b3f]">Selected Dish</p>
                      <h3 className="text-xl font-semibold text-[#2b1d15]">{selectedFood.name}</h3>
                      <p className="text-sm text-[#7a5a3f]">{selectedFood.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[#5a3318]">Rs. {selectedFood.price}</span>
                        <span className="rounded-full border border-[#f1d7bc] bg-[#fff6ed] px-2.5 py-1 text-xs font-semibold text-[#8a5a2e]">
                          Rating {getMenuItemRating(selectedFood.id)} / 5
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ) : null}
                {showRightRail ? <CartSummary onCheckout={() => setCheckoutOpen(true)} /> : null}
                {showRightRail ? (
                  ordersLoading ? (
                    <LoadingState label="Syncing latest order status..." />
                  ) : (
                    <OrderTracker orderId={activeOrderId} />
                  )
                ) : null}
              </div>
            ) : null}
          </div>
        ) : (
          <OrdersTable />
        )}
      </div>

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

    </main>
  );
};

export default App;
