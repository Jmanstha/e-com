import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { AddToCartPopup } from "./AddToCartPopup";

export function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const inStock = product.stock > 0;

  return (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white rounded-xl">
      {/* Image area */}
      <div className="relative">
        <PlaceholderImage />
        <button
          onClick={() => setWishlisted(!wishlisted)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Heart
            size={15}
            className={
              wishlisted ? "fill-terracotta text-terracotta" : "text-stone-400"
            }
            style={{
              color: wishlisted ? "#c0694e" : undefined,
              fill: wishlisted ? "#c0694e" : "none",
            }}
          />
        </button>
        <Badge
          className="absolute top-3 left-3 text-xs font-medium"
          style={{
            backgroundColor: inStock ? "#e8f5e9" : "#fce4ec",
            color: inStock ? "#2e7d32" : "#c62828",
            border: "none",
          }}
        >
          {inStock ? `${product.stock} in stock` : "Sold out"}
        </Badge>
      </div>

      {/* Info area */}
      <CardContent className="p-4 space-y-3">
        <div>
          <p className="text-xs text-stone-400 uppercase tracking-widest font-medium">
            {product.category}
          </p>
          <h3 className="text-stone-800 font-semibold text-sm leading-snug mt-0.5 group-hover:text-[#c0694e] transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center gap-1">
          <p className="text-md text-stone-400 ml-1">{product.description}</p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-bold text-stone-800">
            Rs.{product.price.toFixed(2)}
          </span>
          <AddToCartPopup key={product.id} product={product} />
        </div>
      </CardContent>
    </Card>
  );
}
