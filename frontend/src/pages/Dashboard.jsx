import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Search } from "lucide-react";
import { productService } from "@/services/productService";
import { cartService } from "@/services/cartService";
import { ProductCard } from "@/components/ProductCard";
import { CartPopup } from "@/components/CartPopup";

const CATEGORIES = ["All", "Bags", "Accessories", "Clothing", "Favourite"];

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Always try to get products (Public)
      try {
        const productData = await productService.getAllProducts();
        setProducts(productData);
      } catch (err) {
        console.error("Products failed", err);
      }

      // 2. Only try to get cart if there is a token
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const cartData = await cartService.getCartItems();
          setCartItems(cartData);
        } catch (err) {
          console.error("Cart failed", err);
        }
      }
    };

    fetchData();
  }, []);

  const handleUpdateQuantity = async (cartItemId, amount) => {
    // change only in ui (optimistic but lag free)
    setCartItems(
      (
        prev, //prev is everything in the state before
      ) =>
        prev.map((item) => {
          // map will create new array and iterate over every item
          if (item.id === cartItemId) {
            // if current item is one user changed then
            const newQuantity = item.quantity + amount; // change amount

            // Prevent quantity from going below 1
            return { ...item, quantity: Math.max(1, newQuantity) }; // return the current item in the state and continue operating on next item
          }
          return item; // if no match in state item and changed cartItem then ofcourse return item unchanged
        }),
    );
    try {
      await cartService.updateCartItemQuantityByOne(cartItemId, amount);
    } catch (err) {
      console.error("Sync failed, reverting...");
    }
  };

  const handleAddToCart = async (productId, quantity) => {
    // 1. Check if the item is already in our cart state
    const existingItem = cartItems.find(
      (item) => item.product_id === productId,
    );

    if (existingItem) {
      // If it exists, we reuse our Update logic!
      handleUpdateQuantity(existingItem.id, quantity);
    } else {
      // 2. If it's NEW, we have two choices:
      try {
        // Step A: Tell backend to add it
        await cartService.addToCart(productId, quantity);

        // Step B: Fetch the fresh cart to get the new 'cart_item_id' from the DB
        // We do this because we don't know the ID the database just generated yet
        const freshCart = await cartService.getCartItems();
        setCartItems(freshCart);
      } catch (err) {
        console.error("Failed to add new item", err);
      }
    }
  };
  const handleClearCart = async () => {
    try {
      await cartService.clearCart();
      const freshCart = await cartService.getCartItems();
      setCartItems(freshCart);
    } catch (err) {
      console.error("Failed to clear cart", err);
    }
  };

  const handleDeleteCartItem = async (cartItemId) => {
    try {
      await cartService.deleteCartItem(cartItemId);
      const freshCart = await cartService.getCartItems();
      setCartItems(freshCart);
    } catch (err) {
      console.error("Failed to delete cart item", err);
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#faf6f1", fontFamily: "Georgia, serif" }}
    >
      {/* Navbar */}
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
            />
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: "#3d2b1f" }}>
            Your Collection
          </h1>
          <p className="text-stone-500 mt-1 text-sm">
            {filtered.length} handcrafted{" "}
            {filtered.length === 1 ? "piece" : "pieces"}
          </p>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: activeCategory === cat ? "#c0694e" : "#ede5dc",
                color: activeCategory === cat ? "white" : "#7a5c4a",
                fontFamily: "Georgia, serif",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onUpdate={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-stone-400">
            <p className="text-lg">No products found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        )}
      </main>
    </div>
  );
}
