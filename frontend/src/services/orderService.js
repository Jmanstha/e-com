import api from "../api/axios";

export const orderService = {
  async placeOrder() {
    try {
      const response = await api.post("/order/");
      return response.data;
    } catch (error) {
      this.handleError(error, "placing order");
      throw error;
    }
  },

  async getOrderItems() {
    try {
      const response = await api.get("/order/");
      return response.data;
    } catch (error) {
      this.handleError(error, "retrieving order item");
      throw error;
    }
  },

  async cancelOrderItem(orderItemId) {
    try {
      const response = await api.delete(`/order/${orderItemId}`);
      return response.date;
    } catch (error) {
      this.handleError(error, "cancelling order item");
    }
  },
};
