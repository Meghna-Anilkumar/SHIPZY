import axios, { AxiosError } from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
  timeout: 10000
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message || error.message || "Unexpected API error";
    return Promise.reject(new Error(message));
  }
);

export { apiClient };
