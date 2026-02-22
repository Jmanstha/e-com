import api from "../api/axios";

export const authService = {
  async signup(formData) {
    const response = await api.post("/auth/signup", formData);
    return response.data;
  },

  async login(email, password) {
    // OAuth2PasswordRequestForm expects form-data, not JSON!
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await api.post("/auth/token", formData);
    if (response.data.access_token) {
      localStorage.setItem("access_token", response.data.access_token);
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem("access_token");
  },
};
