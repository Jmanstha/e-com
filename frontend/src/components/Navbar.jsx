import { Input } from "@/components/ui/input";
import { ShoppingBag, Search } from "lucide-react";
import { CartPopup } from "@/components/CartPopup";
import { ProfileDropdown } from "@/components/ProfileDropdown";

export function Navbar({
  cartItems,
  search,
  setSearch,
  handleUpdateQuantity,
  handleClearCart,
  handleDeleteCartItem,
  handleCheckout,
}) {
  return (
    <nav
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{
        backgroundColor: "rgba(250,246,241,0.92)",
        borderColor: "#e8ddd4",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#c0694e" }}
          >
            <ShoppingBag size={16} className="text-white" />
          </div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: "#3d2b1f" }}
          >
            Yarnly
          </span>
        </div>

        {/* Search */}
        <div className="relative w-72 hidden md:block">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm border-stone-200 bg-white/70 focus:bg-white rounded-lg"
            style={{ fontFamily: "Georgia, serif" }}
          />
        </div>

        {/* CART */}
        <div className="flex items-center gap-2">
          <CartPopup
            cartItems={cartItems}
            onUpdate={handleUpdateQuantity}
            onClear={handleClearCart}
            onDelete={handleDeleteCartItem}
            onCheckout={handleCheckout}
          />
          {/* Profile Dropdown */}
          <ProfileDropdown />
        </div>
      </div>
    </nav>
  );
}
