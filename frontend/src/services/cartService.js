import api from "../api/axios";

export const cartService = {
  async getCartItems() {
    try {
      const response = await api.get("/cart/");
      return response.data;
    } catch (error) {
      this.handleError(error, "fetching cart items");
      throw error; // Rethrow so the component knows something went wrong
    }
  },

  async updateCartItemQuantityByOne(cartId, amount) {
    try {
      const response = await api.patch(
        `/cart/update/${cartId}?amount=${amount}`,
      );
      return response.data;
    } catch (error) {
      this.handleError(error, "updating quantity");
      throw error;
    }
  },

  async addToCart(productId, quantity) {
    try {
      const response = await api.post(
        `/cart/item/${productId}?quantity=${quantity}`,
      );
      return response.data;
    } catch (error) {
      this.handleError(error, "adding to cart");
      throw error;
    }
  },
  // A helper method to keep your logs clean
  handleError(error, action) {
    const message = error.response?.data?.message || error.message;
    console.error(`Error while ${action}:`, message);
  },
};
