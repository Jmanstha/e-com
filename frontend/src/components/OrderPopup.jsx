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
import { Info } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useShallow } from "zustand/react/shallow";

export function OrderPopup({ orderId, total, status }) {
  const [isOpen, setIsOpen] = useState(false);

  const orderItems = useStore(
    useShallow((state) =>
      state.orderItems.filter(
        (item) => String(item.order_id) === String(orderId),
      ),
    ),
  );

  const handlePayment = useStore((state) => state.handlePayment);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="w-10 h-10 rounded-full shadow-sm hover:shadow-lg transition-all duration-300 border-none relative"
          style={{ backgroundColor: "#c0694e", color: "white" }}
        >
          <Info size={22} />
          {/* Optional: Small badge showing total item count */}
          {orderItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-[#c0694e] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {orderItems.length}
            </span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white rounded-2xl sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-[#3d2b1f] font-bold text-xl">
            Ordered Items
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 max-h-[60vh] overflow-y-auto space-y-3">
          {orderItems.length > 0 ? (
            orderItems
              .filter((item) => item !== undefined && item !== null)
              .map((item, index) => (
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
                      Rs.{item.price_at_purchase?.toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-lg p-1">
                    <span className="text-sm font-bold w-4 text-center text-stone-700">
                      {item.quantity}
                    </span>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-10">
              <p className="text-stone-400 text-sm italic">
                Your Order is empty.
              </p>
            </div>
          )}
        </div>

        {/* Total Summary Area */}
        {orderItems.length > 0 && (
          <div className="pt-4 border-t border-stone-100 flex justify-between items-center px-2">
            <span className="text-stone-500 text-sm font-medium">
              Estimated Total
            </span>
            <span className="text-lg font-bold text-[#3d2b1f]">
              Rs.
              {orderItems
                .filter(
                  (item) => item && typeof item.price_at_purchase === "number",
                )
                .reduce(
                  (acc, item) => acc + item.price_at_purchase * item.quantity,
                  0,
                )
                .toFixed(2)}
            </span>
          </div>
        )}

        <DialogFooter className="mt-4 flex-row gap-2 sm:justify-end">
          <Button
            className="bg-[#c0694e] hover:bg-[#a0523d] text-white px-8 rounded-lg"
            disabled={status.toLowerCase() !== "pending"}
            onClick={() => {
              handlePayment({
                order_id: String(orderId),
                amount: Number(total * 100),
              });
            }}
          >
            Place Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
