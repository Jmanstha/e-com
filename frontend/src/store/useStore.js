import { create } from "zustand";
import { cartService } from "@/services/cartService";
import { orderService } from "@/services/orderService";
import { productService } from "@/services/productService";
import { paymentService } from "@/services/paymentService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useStore = create((set, get) => ({
  search: "",
  setSearch: (value) => set({ search: value }),

  cartItems: [],
  setCartItems: (items) => set({ cartItems: items }),

  fetchCartItems: async () => {
    const token = localStorage.getItem("access_token");
    console.log("Token at fetch time:", token);
    if (token) {
      try {
        const cartData = await cartService.getCartItems();
        set({ cartItems: cartData });
      } catch (err) {
        console.error("Cart retrieval failed", err);
      }
    }
  },

  products: [],
  setProducts: (product) => set({ product: product }),

  fetchProducts: async () => {
    try {
      const productData = await productService.getAllProducts();
      set({ products: productData });
    } catch (err) {
      console.error("Products retrieval failed", err);
    }
  },

  orders: [],
  setOrders: (orders) => set({ orders: orders }),

  fetchOrders: async () => {
    try {
      const orderItemData = await orderService.getOrderItems();
      console.log("fetched orders:", orderItemData);
      set({ orders: orderItemData });
    } catch (err) {
      console.error("Order retrieval failed", err);
    }
  },

  orderId: null,
  setOrderId: (orderId) => set({ orderId: orderId }),

  selectedLocation: null,
  setSelectedLocation: (selectedLocation) =>
    set({ selectedLocation: selectedLocation }),

  phoneNumber: "",
  setPhoneNumber: (phoneNumber) => set({ phoneNumber: phoneNumber }),

  handleUpdateQuantity: async (cartItemId, amount) => {
    set((state) => ({
      cartItems: state.cartItems.map((item) => {
        // new array loop through every item
        return item.id === cartItemId
          ? { ...item, quantity: Math.max(1, item.quantity + amount) } // make copy of item change quantity and add to new array
          : item; //if no id match add item to new array as it is
      }),
    }));
    try {
      await cartService.updateCartItemQuantityByOne(cartItemId, amount);
    } catch (err) {
      get().fetchCartItems(); // Revert on fail by refetching
    }
  },

  handleAddToCart: async (productId, quantity, productName = "item") => {
    const existingItem = get().cartItems.find(
      (item) => item.product_id === productId,
    );

    if (existingItem) {
      try {
        get().handleUpdateQuantity(existingItem.id, quantity);
        toast.success(`Updated ${productName} quantity`);
      } catch (err) {
        toast.error(`Failed to update ${productName}`);
      }
    } else {
      try {
        await cartService.addToCart(productId, quantity);
        const freshCart = await cartService.getCartItems();
        set({ cartItems: freshCart });
        toast.success(`Added ${productName} to cart`, {
          description: `${quantity} unit(s) added successfully.`,
        });
      } catch (err) {
        console.error("Failed to add new item", err);
        toast.error("Failed to add item to cart");
      }
    }
  },

  handleClearCart: async () => {
    try {
      await cartService.clearCart();
      set({ cartItems: [] });

      toast.info("Cart cleared", {
        description: "All items have been removed from your shopping bag.",
      });
    } catch (err) {
      console.error("Failed to clear cart", err);
      toast.error("Could not clear the cart. Please try again.");
    }
  },

  handleDeleteCartItem: async (cartItemId) => {
    try {
      await cartService.deleteCartItem(cartItemId);
      const freshCart = await cartService.getCartItems();
      set({ cartItems: freshCart });
    } catch (err) {
      console.error("Failed to delete cart item", err);
    }
  },

  handlePlaceOrder: async (orderData) => {
    try {
      const response = await orderService.placeOrder(orderData);
      const freshCart = await cartService.getCartItems();
      set({ cartItems: freshCart });
      toast.success("Order Success", {
        description: "Placed your order successfully!",
      });
      return response.order_id;
    } catch (err) {
      console.error("Failed place order", err);
      toast.error("Could not place the order. Please try again.");
    }
  },
  handleCancelOrder: async (orderItemId) => {
    try {
      await orderService.cancelOrderItem(orderItemId);
      toast.success("Order Cancel Success", {
        description: "Canceled your order successfully!",
      });
      const freshOrders = await orderService.getOrderItems();
      set({ orders: freshOrders });
    } catch (err) {
      console.error("Failed to cancel order", err);
      toast.error("Could not cancel the order. Please try again");
    }
  },
  handlePayment: async (orderData) => {
    try {
      const res = await paymentService.initiatePayment(orderData);
      if (res.payment_url) {
        window.location.href = res.payment_url;
      }
    } catch (err) {
      console.error("Failed to initiate payment", err);
    }
  },
  handleUpdateOrderStatus: async (statusInt, orderId) => {
    try {
      const res = await orderService.updateOrderStataus(statusInt, orderId);
      get().fetchOrders();
      return res.data;
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  },
}));
