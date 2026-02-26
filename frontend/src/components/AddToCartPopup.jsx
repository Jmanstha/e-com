import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export function AddToCartPopup({ product }) {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const inStock = product.stock > 0;
  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${product.name} to cart.`);
    setIsOpen(false); // Close the popup after saving
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          disabled={!inStock}
          className="text-xs h-8 px-3 rounded-lg border-none"
          style={{
            backgroundColor: inStock ? "#c0694e" : "#e5d5c5",
            color: inStock ? "white" : "#a89080",
          }}
        >
          Add to cart
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white rounded-2xl sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle className="text-[#3d2b1f] font-bold">
            Select Quantity
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between bg-stone-50 p-3 rounded-lg">
            <span className="text-sm font-medium text-stone-600">Item:</span>
            <span className="text-sm font-bold text-stone-600">
              {product.name}
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-400 uppercase">
              Amount
            </label>
            <Input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="border-stone-200 focus:ring-[#c0694e]"
            />
            <p className="text-[10px] text-stone-400">
              Max available: {product.stock}
            </p>
          </div>
        </div>

        <DialogFooter className="flex-row gap-2 sm:justify-end">
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="text-stone-500"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddToCart}
            className="bg-[#c0694e] hover:bg-[#a0523d] text-white"
          >
            Save to Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
