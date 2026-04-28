import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "@/store/cart.store";

type CartSummaryProps = {
  onCheckout: () => void;
  className?: string;
};

export const CartSummary = ({ onCheckout, className = "border-[#e7d5c4]" }: CartSummaryProps) => {
  const { items, incrementQty, decrementQty, removeItem } = useCartStore();

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-[#2b1d15]">Cart</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#e5c8ad] bg-[#fff7ef] p-5 text-center">
            <p className="text-lg font-semibold text-[#7a4a1f]">Your cart feels lonely</p>
            <p className="mt-1 text-sm text-[#9e6f44]">Add a hot favorite and make your taste buds celebrate.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{item.name}</p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="rounded p-1 transition hover:bg-red-50"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => decrementQty(item.id)}>
                      <Minus size={14} />
                    </Button>
                    <span>{item.quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => incrementQty(item.id)}>
                      <Plus size={14} />
                    </Button>
                  </div>
                  <span className="font-semibold">Rs. {item.price * item.quantity}</span>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between border-t pt-2">
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
