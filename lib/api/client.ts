import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config as (typeof error.config & { _retry?: boolean }) | undefined;
    if (error.response?.status === 401 && request && !request._retry && !request.url?.includes("/auth/")) {
      request._retry = true;
      try {
        await apiClient.post("/auth/refresh");
        return apiClient(request);
      } catch {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
