import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: '/api',
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Interceptor de respuesta ────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const serverMessage: string | undefined =
        error.response?.data?.message ?? error.response?.data?.error;

      if (!error.response) {
        // Sin respuesta del servidor (red caída, CORS, timeout…)
        toast.error("Sin conexión con el servidor. Verifica tu red.");
      } else if (status === 400) {
        toast.error(serverMessage ?? "Solicitud inválida.");
      } else if (status === 401 || status === 403) {
        toast.error("Sin autorización para realizar esta acción.");
      } else if (status === 404) {
        toast.error(serverMessage ?? "Recurso no encontrado.");
      } else if (status && status >= 500) {
        toast.error("Error interno del servidor. Intenta más tarde.");
      } else {
        toast.error(serverMessage ?? "Ocurrió un error inesperado.");
      }
    } else {
      toast.error("Ocurrió un error inesperado.");
    }

    return Promise.reject(error);
  }
);

export default api;
