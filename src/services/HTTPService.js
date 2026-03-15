import axios from "axios";
import config from "../config";

const HTTPService = axios.create({
  baseURL: config.BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add token
HTTPService.interceptors.request.use(
  (req) => {
    // Add token if exists
    const token = localStorage.getItem("TOKEN");
    if (token) {
      req.headers["x-access-token"] = token;
    }

    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
HTTPService.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    // Handle different error status codes
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem("TOKEN");
          if (window.location.pathname !== "/") {
            window.location.href = "/";
          }
          error.message = "Sesi Anda telah berakhir. Silakan login kembali.";
          break;

        case 400:
          // Bad Request
          error.message = data?.message || "Permintaan tidak valid. Periksa data Anda.";
          break;

        case 403:
          // Forbidden
          error.message = "Anda tidak memiliki akses ke fitur ini.";
          break;

        case 404:
          // Not Found
          error.message = data?.message || "Data tidak ditemukan.";
          break;

        case 409:
          // Conflict (e.g., duplicate entry)
          error.message = data?.message || "Data sudah ada.";
          break;

        case 429:
          // Too Many Requests (rate limiting)
          error.message = data?.error || "Terlalu banyak request. Silakan tunggu beberapa saat.";
          break;

        case 500:
          // Internal Server Error
          error.message = "Terjadi kesalahan pada server. Silakan coba lagi nanti.";
          break;

        default:
          error.message = data?.message || "Terjadi kesalahan. Silakan coba lagi.";
      }
    } else if (error.request) {
      // Request made but no response
      error.message = "Tidak ada respons dari server. Periksa koneksi internet Anda.";
    } else {
      // Error setting up request
      error.message = error.message || "Terjadi kesalahan. Silakan coba lagi.";
    }

    // Log error for debugging
    console.error("HTTP Error:", {
      status: error.response?.status,
      message: error.message,
      path: error.config?.url,
      method: error.config?.method,
    });

    return Promise.reject(error);
  }
);

export default HTTPService;