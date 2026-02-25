import api from "../api/axios";

export const productService = {
  async getAllProducts() {
    const response = await api.get("/products/");
    return response.data;
  },
};
