import { ShoppingBag } from "lucide-react";
import { CartPopup } from "@/components/CartPopup";
import ProfileDropdown from "./ProfileDropdown";
import { useStore } from "@/store/useStore";
import { Link } from "react-router-dom";

export default function NavbarWOSearch() {
  const cartItems = useStore((state) => state.cartItems);
  const handleUpdateQuantity = useStore((state) => state.handleUpdateQuantity);
  const handleClearCart = useStore((state) => state.handleClearCart);
  const handleDeleteCartItem = useStore((state) => state.handleDeleteCartItem);
  const handlePlaceOrder = useStore((state) => state.handlePlaceOrder);

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
        <Link to="/">
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
        </Link>
        {/* CART */}
        <div className="flex items-center gap-2">
          <CartPopup
            cartItems={cartItems}
            onUpdate={handleUpdateQuantity}
            onClear={handleClearCart}
            onDelete={handleDeleteCartItem}
            onCheckout={handlePlaceOrder}
          />
          {/* Profile Dropdown */}
          <ProfileDropdown />
        </div>
      </div>
    </nav>
  );
}
