import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { useUiStore } from "../store/useUiStore";

export const createHttpClient = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: 15000
  });

  instance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    useUiStore.getState().startLoading();
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      useUiStore.getState().stopLoading();
      return response;
    },
    (error) => {
      useUiStore.getState().stopLoading();
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Request failed";
      useUiStore.getState().setError(message);
      return Promise.reject(error);
    }
  );

  return instance;
};
