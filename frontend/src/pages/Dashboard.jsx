import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Search, ShoppingCart } from "lucide-react";
import { productService } from "@/services/productService";
import { ProductCard } from "@/components/ProductCard";

const CATEGORIES = ["All", "Bags", "Accessories", "Clothing", "Favourite"];

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);

  const fetchData = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch Products", err);
    }
  };
  useEffect(() => {
    const fetchProductData = async () => {
      await fetchData();
    };
    fetchProductData();
  }, []);

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
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm hover:shadow-lg transition-all duration-300"
              style={{ backgroundColor: "#c0694e" }}
            >
              <ShoppingCart size={22} className="text-white" />
            </div>
          </div>

          {/* {/* Actions */}
          {/* <Button */}
          {/*   size="sm" */}
          {/*   className="flex items-center gap-2 text-sm rounded-lg" */}
          {/*   style={{ */}
          {/*     backgroundColor: "#c0694e", */}
          {/*     color: "white", */}
          {/*     border: "none", */}
          {/*   }} */}
          {/* > */}
          {/*   <Plus size={15} /> */}
          {/*   Add Product */}
          {/* </Button> */}
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
