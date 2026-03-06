import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import { cartService } from "@/services/cartService";
import { orderService } from "@/services/orderService";
import ProductCard from "@/components/ProductCard";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useStore } from "zustand";

const CATEGORIES = ["All", "Bags", "Accessories", "Clothing", "Favourite"];

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  // const [products, setProducts] = useState([]);
  const products = useStore((state) => state.products);
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = useStore((state) => state.fetchCart);
  const fetchProducts = useStore((state) => state.fetchProducts);

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, [fetchCart, fetchProducts]);

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

  const handleAddToCart = async (productId, quantity, productName = "Item") => {
    const existingItem = cartItems.find(
      (item) => item.product_id === productId,
    );

    if (existingItem) {
      try {
        await handleUpdateQuantity(existingItem.id, quantity);
        toast.success(`Updated ${productName} quantity`);
      } catch (err) {
        toast.error(`Failed to update ${productName}`);
      }
    } else {
      try {
        await cartService.addToCart(productId, quantity);
        const freshCart = await cartService.getCartItems();
        setCartItems(freshCart);

        toast.success(`Added ${productName} to cart`, {
          description: `${quantity} unit(s) added successfully.`,
        });
      } catch (err) {
        console.error("Failed to add new item", err);
        toast.error("Failed to add item to cart");
      }
    }
  };

  const handleClearCart = async () => {
    // You might want to ask for confirmation before calling this!
    try {
      await cartService.clearCart();
      setCartItems([]); // Optimization: just set to empty array instead of fetching

      toast.info("Cart cleared", {
        description: "All items have been removed from your shopping bag.",
      });
    } catch (err) {
      console.error("Failed to clear cart", err);
      toast.error("Could not clear the cart. Please try again.");
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

  const handleCheckout = async () => {
    try {
      await orderService.placeOrder();
      const freshCart = await cartService.getCartItems();
      setCartItems(freshCart);
      toast.success("Order Success", {
        description: "Placed your order successfully!",
      });
    } catch (err) {
      console.error("Failed place order", err);
      toast.error("Could not place the order. Please try again.");
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
      <Navbar
        cartItems={cartItems}
        search={search}
        setSearch={setSearch}
        handleUpdateQuantity={handleUpdateQuantity}
        handleClearCart={handleClearCart}
        handleDeleteCartItem={handleDeleteCartItem}
        handleCheckout={handleCheckout}
      />

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
      <Footer />
    </div>
  );
}
