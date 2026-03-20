import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log de depuração para inspecionar baseURL em runtime
if (import.meta.env.DEV || import.meta.env.VITE_LOG_API_BASE === 'true') {
  // eslint-disable-next-line no-console
  console.info('[API] baseURL =', import.meta.env.VITE_API_BASE_URL ?? '/api');
}

// Response interceptor para tratamento global de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 404:
          toast.error(data?.mensagem || 'Recurso não encontrado. Tente novamente.');
          break;
        case 403:
          toast.error('Você não tem permissão para esta ação.');
          break;
        case 400:
          toast.error(data?.mensagem || 'Dados inválidos. Verifique os campos.');
          break;
        case 409:
          toast.error(data?.mensagem || 'Conflito: recurso já existe.');
          break;
        case 500:
          toast.error('Ocorreu um erro inesperado. Tente novamente mais tarde.');
          break;
        default:
          toast.error(data?.mensagem || 'Erro desconhecido.');
      }
    } else if (error.request) {
      toast.error('Não foi possível conectar ao servidor. Verifique sua conexão.');
    }
    return Promise.reject(error);
  }
);

export default api;
