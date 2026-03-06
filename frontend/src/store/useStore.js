import { create } from "zustand";
import { cartService } from "@/services/cartService";
import { productService } from "@/services/productService";
import { toast } from "sonner";

export const useStore = create((set) => ({
  search: "",
  setSearch: (value) => set({ search: value }),

  cartItems: [],
  setCartItems: (items) => set({ cartItems: items }),

  products: [],
  setProducts: (product) => set({ product: product }),

  fetchCart: async () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const cartData = await cartService.getCartItems();
        set({ cartItems: cartData });
      } catch (err) {
        console.error("Cart retrieval failed", err);
      }
    }
  },
  fetchProducts: async () => {
    try {
      const productData = await productService.getAllProducts();
      set({ products: productData });
    } catch (err) {
      console.error("Products failed", err);
    }
  },
}));
