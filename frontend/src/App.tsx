import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, PackageCheck, ShoppingCart, Soup, Truck, UserRound, X, Crosshair } from "lucide-react";
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
  const [cartPanelOpen, setCartPanelOpen] = useState(false);
  const [emptyCartOpen, setEmptyCartOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<"menu" | "orders">("menu");
  const [selectedFood, setSelectedFood] = useState<MenuItem | null>(null);
  const [cartPulse, setCartPulse] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);
  const trackerRef = useRef<HTMLDivElement | null>(null);
  const cartPanelRef = useRef<HTMLDivElement | null>(null);
  const { items, clearCart, addToCart, removeItem } = useCartStore();
  const createOrderMutation = useCreateOrderMutation();
  const { isLoading: ordersLoading } = useOrdersQuery();

  const canCheckout = items.length > 0;
  const showRightRail = cartPanelOpen || items.length > 0 || Boolean(activeOrderId) || Boolean(selectedFood);
  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
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
    setCelebrate(true);
    window.setTimeout(() => setCelebrate(false), 2200);
  };

  useEffect(() => {
    if (!cartPulse) {
      return;
    }
    const timeout = window.setTimeout(() => setCartPulse(false), 700);
    return () => window.clearTimeout(timeout);
  }, [cartPulse]);

  useEffect(() => {
    if (items.length === 0) {
      setCartPanelOpen(false);
    }
  }, [items.length]);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-gradient-to-br from-[#2b1d15] via-[#3c2a20] to-[#2b1d15] transition-colors duration-500">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#f28705]/20 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-[#ffb567]/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#8d5d35]/20 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-[1500px] space-y-6 p-4 lg:p-6">
        <header className="rounded-2xl bg-transparent p-4 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 pr-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f28705] text-white">
                <Truck size={20} />
              </div>
              <div>
                <p className="text-2xl font-extrabold tracking-wide text-white">Shipzy</p>
                <p className="text-xs italic text-[#f6d8be]">Food delivery made delightful</p>
              </div>
            </div>
            <nav className="flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={() => setActiveSection("menu")}
                className={`inline-flex items-center gap-1.5 text-sm font-bold transition ${activeSection === "menu" ? "text-[#ffd8af]" : "text-white/85 hover:text-white"}`}
              >
                <Soup size={14} /> Browse Food
              </button>
              <button
                type="button"
                onClick={() => setActiveSection("orders")}
                className={`inline-flex items-center gap-1.5 text-sm font-bold transition ${activeSection === "orders" ? "text-[#ffd8af]" : "text-white/85 hover:text-white"}`}
              >
                <PackageCheck size={14} /> My Orders
              </button>
              <button type="button" className="inline-flex items-center gap-1.5 text-sm font-bold text-white/85 transition hover:text-white">
                <UserRound size={14} /> Profile
              </button>
            </nav>
            <div className="ml-auto flex items-center gap-2">
              <button type="button" className="rounded-xl bg-white/5 p-2.5 text-[#ffe5d0] transition hover:bg-white/10">
                <Bell size={18} />
              </button>
              {activeOrderId ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveSection("menu");
                    trackerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  <Crosshair size={14} /> Track Order
                </Button>
              ) : null}
              <Button
                onClick={() => {
                  setActiveSection("menu");
                  if (items.length === 0) {
                    setCartPanelOpen(false);
                    setEmptyCartOpen(true);
                    setSelectedFood(null);
                    return;
                  }
                  setEmptyCartOpen(false);
                  setCartPanelOpen(true);
                  cartPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="relative"
                aria-label="Open cart summary"
              >
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
                className="border-white/20 bg-white/10 text-white placeholder:text-white/70"
              />
            </div>
          </div>
        </header>

        {activeOrderId ? (
          <Card className="animate-section-fade max-w-2xl bg-gradient-to-r from-[#f28705]/25 to-[#ffb567]/20 shadow-[0_14px_30px_rgba(242,135,5,0.2)] backdrop-blur-sm">
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#ffd8af]">Order placed successfully</p>
                <p className="text-lg font-semibold text-white">
                  Your order is live now. Track it in real time.{" "}
                  {celebrate ? <span className="animate-celebrate">🎉🎊</span> : null}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setActiveSection("menu");
                  trackerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="bg-white/10 text-white hover:bg-white/20"
              >
                <Crosshair size={14} /> Track Order
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {activeSection === "menu" ? <BannerCarousel /> : null}

          {createOrderMutation.error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              {createOrderMutation.error.message}
            </div>
          ) : null}

        {activeSection === "menu" ? (
          <div className={`animate-section-fade grid gap-6 ${showRightRail || selectedFood ? "xl:grid-cols-[1.35fr_0.9fr]" : "xl:grid-cols-1"}`}>
            <MenuList
              searchQuery={searchQuery}
              selectedItemId={selectedFood?.id ?? null}
              onCardSelect={(item) => setSelectedFood(item)}
              onItemAdded={() => {
                setCartPulse(true);
                setCartPanelOpen(true);
                setEmptyCartOpen(false);
              }}
              onRequestRemove={(id, name) => setPendingDelete({ id, name })}
            />
            {showRightRail || selectedFood ? (
              <div className="space-y-4" ref={cartPanelRef}>
                {selectedFood ? (
                  <Card className="overflow-hidden bg-white/90">
                    <div className="relative">
                      <img src={selectedFood.image} alt={selectedFood.name} className="h-48 w-full object-cover object-center" />
                      <button
                        type="button"
                        onClick={() => setSelectedFood(null)}
                        className="absolute right-2 top-2 rounded-full bg-black/40 p-1.5 text-white transition hover:bg-black/60"
                        aria-label="Close selected dish details"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <CardContent className="space-y-2 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-wide text-[#9b6b3f]">Selected Dish</p>
                      </div>
                      <h3 className="text-xl font-semibold text-[#2b1d15]">{selectedFood.name}</h3>
                      <p className="text-sm text-[#7a5a3f]">{selectedFood.description}</p>
                      <p className="text-xs italic text-[#8b5b31]">From chef at Spice Route Kitchen</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[#5a3318]">Rs. {selectedFood.price}</span>
                          <span className="rounded-full bg-[#fff6ed] px-2.5 py-1 text-xs font-semibold text-[#8a5a2e]">
                          Rating {getMenuItemRating(selectedFood.id)} / 5
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const itemInCart = items.find((cartItem) => cartItem.id === selectedFood.id);
                          if (!itemInCart) {
                            return (
                              <Button
                                onClick={() => {
                                  addToCart(selectedFood);
                                  setCartPulse(true);
                                  setCartPanelOpen(true);
                                }}
                              >
                                Add to cart
                              </Button>
                            );
                          }
                          return (
                            <>
                              <span className="rounded-full bg-[#fff1e3] px-3 py-1 text-sm font-semibold text-[#7a4a1f]">
                                Already in cart · Qty {itemInCart.quantity}
                              </span>
                              <Button variant="outline" onClick={() => setCartPanelOpen(true)}>
                                View cart
                              </Button>
                            </>
                          );
                        })()}
                      </div>
                    </CardContent>
                  </Card>
                ) : null}
                {items.length > 0 ? (
                  <CartSummary
                    onCheckout={() => setCheckoutOpen(true)}
                    onRequestRemove={(id, name) => setPendingDelete({ id, name })}
                  />
                ) : null}
                {showRightRail ? (
                  ordersLoading ? (
                    <LoadingState label="Syncing latest order status..." />
                  ) : (
                    <div ref={trackerRef}>
                      <OrderTracker orderId={activeOrderId} />
                    </div>
                  )
                ) : null}
              </div>
            ) : null}
          </div>
        ) : (
          <OrdersTable />
        )}
      </div>
      <footer className="relative mx-auto mt-10 max-w-[1500px] px-4 pb-8 text-center text-sm italic text-[#f0cfb4] lg:px-6">
        Shipzy · Crafted for cravings, delivered with delight.
      </footer>

      <CommonModal
        open={emptyCartOpen}
        onOpenChange={setEmptyCartOpen}
        title="Your cart is empty"
        description="Add your first favorite and your cart will appear instantly."
        contentClassName="rounded-[26px] bg-[#fffaf4]"
      >
        <div className="space-y-4 text-center">
          <div className="mx-auto w-fit rounded-full bg-[#ffe8cf] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#8a4f1d]">
            Start your order
          </div>
          <p className="text-sm text-[#8a5a2e]">Browse menu and tap Add to begin your cart journey.</p>
          <div className="flex justify-center">
            <Button onClick={() => setEmptyCartOpen(false)}>Explore menu</Button>
          </div>
        </div>
      </CommonModal>

      <CommonModal
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDelete(null);
          }
        }}
        title="Remove item?"
        description={pendingDelete ? `${pendingDelete.name} will be removed from your cart.` : undefined}
        contentClassName="rounded-[26px] bg-[#fffaf4]"
      >
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-r from-[#fff2e8] to-[#ffe4d8] p-4 text-sm text-[#7a4a1f]">
            You can always add it again later from the menu.
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Keep item
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (pendingDelete) {
                  removeItem(pendingDelete.id);
                }
                setPendingDelete(null);
              }}
            >
              Remove
            </Button>
          </div>
        </div>
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

    </main>
  );
};

export default App;
