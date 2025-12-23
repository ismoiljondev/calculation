import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

// --- Base URL setup ---
// const rawApiUrl = new URL(
//   (import.meta?.env?.VITE_API_BASE_URL as string) || "http://localhost:3000"
// );

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
// --- Global Headers ---
export const globalHeaders: Record<string, string> = {};

export const setGlobalHeaders = (newHeaders: Record<string, string>) => {
  Object.assign(globalHeaders, newHeaders);
};

export const removeGlobalHeaders = (headerKeys: string[]) => {
  headerKeys.forEach((key) => {
    delete globalHeaders[key];
  });
};

// --- Custom Error Class ---
export class FetchApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, data: unknown) {
    super(`FetchApiError: ${status}`);
    this.status = status;
    this.data = data;
  }
}

// --- Axios instance setup ---
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Axios Request Interceptor (Attach Token) ---
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = window.localStorage.getItem("jwt_accessToken");

    config.headers.set(
      "Accept-Language",
      window.localStorage.getItem("language")
    );

    if (token) {
      if (config.headers && typeof config.headers.set === "function") {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else if (config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    // Merge global headers
    if (config.headers) {
      for (const [key, value] of Object.entries(globalHeaders)) {
        config.headers[key] = value;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Custom Fetch with Prefix and Full Error Handling ---
export async function customFetch<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await axiosInstance<T>(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const fetchError = new FetchApiError(
        error.response?.status ?? 500,
        error.response?.data
      );
      throw fetchError;
    } else {
      throw error;
    }
  }
}
