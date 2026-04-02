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
  async getOrders() {
    try {
      const response = await api.get("/order/");
      return response.data;
    } catch (error) {
      handleError(error, "retrieving orders");
      throw error;
    }
  },

  async getOrderItems() {
    try {
      const response = await api.get("/order/orderitems");
      return response.data;
    } catch (error) {
      handleError(error, "retrieving order item");
      throw error;
    }
  },

  async deleteOrder(orderId) {
    try {
      const response = await api.delete(`/order/${orderId}`);
      return response.data;
    } catch (error) {
      handleError(error, "deleting order item");
      throw error;
    }
  },
  async updateOrderStatus(orderId, status) {
    try {
      const response = await api.patch(`/order/${orderId}/status`, {
        status: status,
      });
      return response.data;
    } catch (error) {
      handleError(error, `updating order status to ${status}`);
      throw error;
    }
  },
};
