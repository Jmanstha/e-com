import { create } from "zustand";
import { cartService } from "@/services/cartService";

export const useStore = create((set) => ({
  search: "",
  setSearch: (value) => set({ search: value }),

  cartItems: [],
  setCartItems: (items) => set({ cartItems: items }),

  products: [],
  setProducts: (product) => set({ product: product }),
}));
