// src/api.js
import axios from "axios";
import { getLoadingHandlers } from "./pages/loadingManager";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    // token otomatis ada di cookie → tidak perlu header Authorization
    getLoadingHandlers().showLoading("Memuat data...");
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → sembunyikan loading dan tangani error
api.interceptors.response.use(
  (response) => {
    const { hideLoading } = getLoadingHandlers();
    hideLoading();
    return response;
  },
  (error) => {
    const { hideLoading } = getLoadingHandlers();
    hideLoading();

    // Jika ada respons dari server
    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.message ||
        "Terjadi kesalahan, silakan coba lagi.";

      // Jika 403 → tampilkan toast error sesuai kondisi
      if (status === 403) {
        toast.error(message, {
          position: "top-right",
          autoClose: 4000,
        });
      }
      // Bisa tambahkan kasus error lain juga kalau mau
      else if (status === 500) {
        toast.error("Terjadi kesalahan pada server.", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } else {
      // Jika error tanpa respons (misalnya koneksi gagal)
      toast.error("Tidak dapat terhubung ke server.", {
        position: "top-right",
        autoClose: 4000,
      });
    }

    return Promise.reject(error);
  }
);

export default api;
