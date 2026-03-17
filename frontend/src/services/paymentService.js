import api from "../api/axios";

export const paymentService = {
  async initiatePayment(orderData) {
    const response = await api.post("/payment/initiate", orderData);
    return response.data;
  },
};
