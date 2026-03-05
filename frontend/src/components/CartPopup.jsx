import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ShoppingCart, Plus, Minus, X } from "lucide-react";
import { cartService } from "@/services/cartService";

export function CartPopup({
  cartItems = [],
  onUpdate,
  onClear,
  onDelete,
  onCheckout,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="w-10 h-10 rounded-full shadow-sm hover:shadow-lg transition-all duration-300 border-none relative"
          style={{ backgroundColor: "#c0694e", color: "white" }}
        >
          <ShoppingCart size={22} />
          {/* Optional: Small badge showing total item count */}
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-[#c0694e] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {cartItems.length}
            </span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white rounded-2xl sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-[#3d2b1f] font-bold text-xl">
            Your Cart
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 max-h-[60vh] overflow-y-auto space-y-3">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div
                key={item.id || index}
                className="flex items-center justify-between bg-stone-50 p-4 rounded-xl border border-stone-100"
              >
                {/* Product Name & Info */}
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-stone-800">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                    Rs.{item.price?.toFixed(2)}
                  </span>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-stone-500 hover:text-[#c0694e]"
                    onClick={() => onUpdate(item.id, -1)}
                  >
                    <Minus size={14} strokeWidth={3} />
                  </Button>

                  <span className="text-sm font-bold w-4 text-center text-stone-700">
                    {item.quantity}
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-stone-500 hover:text-[#c0694e]"
                    onClick={() => onUpdate(item.id, 1)}
                  >
                    <Plus size={14} strokeWidth={3} />
                  </Button>
                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-stone-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                    onClick={() => {
                      onDelete(item.id);
                    }}
                  >
                    <X size={18} />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-stone-400 text-sm italic">
                Your cart is empty.
              </p>
            </div>
          )}
        </div>

        {/* Total Summary Area */}
        {cartItems.length > 0 && (
          <div className="pt-4 border-t border-stone-100 flex justify-between items-center px-2">
            <span className="text-stone-500 text-sm font-medium">
              Estimated Total
            </span>
            <span className="text-lg font-bold text-[#3d2b1f]">
              Rs.
              {cartItems
                .reduce((acc, item) => acc + item.price * item.quantity, 0)
                .toFixed(2)}
            </span>
          </div>
        )}

        <DialogFooter className="mt-4 flex-row gap-2 sm:justify-end">
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="text-stone-400 hover:bg-stone-50"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onClear();
              setIsOpen(false);
            }}
            className="text-stone-800 hover:bg-stone-50"
          >
            Delete Cart
          </Button>
          <Button
            className="bg-[#c0694e] hover:bg-[#a0523d] text-white px-8 rounded-lg"
            onClick={() => {
              onCheckout();
              setIsOpen(false);
            }}
          >
            Checkout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
