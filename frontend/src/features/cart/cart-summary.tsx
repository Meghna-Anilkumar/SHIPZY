import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "@/store/cart.store";

type CartSummaryProps = {
  onCheckout: () => void;
  className?: string;
  onRequestRemove?: (itemId: string, itemName: string) => void;
};

export const CartSummary = ({ onCheckout, className = "", onRequestRemove }: CartSummaryProps) => {
  const { items, incrementQty, decrementQty } = useCartStore();

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-[#2b1d15]">Cart</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="rounded-3xl bg-gradient-to-br from-[#fff6eb] to-[#ffe7cf] p-5 text-center shadow-inner">
            <img
              src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80"
              alt="Food platter"
              className="animate-float mx-auto mb-3 h-32 w-full max-w-xs rounded-2xl object-cover"
            />
            <p className="text-lg font-semibold text-[#7a4a1f]">Your cart feels lonely</p>
            <p className="mt-1 text-sm text-[#9e6f44]">Add a hot favorite and make your taste buds celebrate.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl bg-[#fff8f1] p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={item.image} alt={item.name} className="h-11 w-11 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                    <p className="text-xs italic text-[#8b5b31]">From our chef specials</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRequestRemove?.(item.id, item.name)}
                    aria-label={`Remove ${item.name}`}
                    className="rounded p-1 transition hover:bg-red-50"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button size="icon" className="h-9 w-9 bg-[#2b1d15] text-white hover:bg-[#1d130d]" onClick={() => decrementQty(item.id)}>
                      <Minus size={14} />
                    </Button>
                    <span>{item.quantity}</span>
                    <Button size="icon" className="h-9 w-9 bg-[#2b1d15] text-white hover:bg-[#1d130d]" onClick={() => incrementQty(item.id)}>
                      <Plus size={14} />
                    </Button>
                  </div>
                  <span className="font-semibold">Rs. {item.price * item.quantity}</span>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2">
              <p className="font-semibold">Total ({totalItems} items)</p>
              <p className="text-lg font-bold">Rs. {totalAmount}</p>
            </div>
            <Button className="w-full" disabled={items.length === 0} onClick={onCheckout}>
              Proceed to checkout
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
