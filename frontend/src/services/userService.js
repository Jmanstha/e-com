import api from "@/api/axios";
export const userService = {
  async getUser() {
    const response = await api.get("/auth/");
    return response.data;
  },
};
