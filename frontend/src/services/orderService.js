import api from "../api/axios";

const handleError = (error, action) => {
  console.error(`Error ${action}:`, error);
};

export const orderService = {
  async placeOrder(orderData) {
    try {
      const response = await api.post("/order/", orderData);
      return response.data;
    } catch (error) {
      handleError(error, "placing order");
      throw error;
    }
  },

  async getOrderItems() {
    try {
      const response = await api.get("/order/");
      return response.data;
    } catch (error) {
      handleError(error, "retrieving order item");
      throw error;
    }
  },

  async cancelOrderItem(orderItemId) {
    try {
      const response = await api.delete(`/order/${orderItemId}`);
      return response.data;
    } catch (error) {
      handleError(error, "cancelling order item");
      throw error;
    }
  },
  async updateOrderStataus(statusInt, orderId) {
    try {
      const response = await api.patch(`/order/${statusInt}`, {
        order_id: orderId,
      });
      return response.data;
    } catch (error) {
      handleError(error, `updating order status to ${statusInt}`);
      throw error;
    }
  },
};
