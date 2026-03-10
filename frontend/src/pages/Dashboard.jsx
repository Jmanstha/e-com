import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useStore } from "@/store/useStore";

const CATEGORIES = ["All", "Bags", "Accessories", "Clothing", "Favourite"];

export default function Dashboard() {
  const search = useStore((state) => state.search);
  const [activeCategory, setActiveCategory] = useState("All");
  // const [products, setProducts] = useState([]);
  const products = useStore((state) => state.products);
  // const [cartItems, setCartItems] = useState([]);
  const cartItems = useStore((state) => state.product);

  const fetchCartItems = useStore((state) => state.fetchCartItems);
  const fetchProducts = useStore((state) => state.fetchProducts);

  useEffect(() => {
    fetchProducts();
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchCartItems();
    }
  }, [fetchCartItems, fetchProducts]);

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
              <ProductCard key={product.id} product={product} />
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
