import axios from 'axios';
import type {
  AdminLoginRequest,
  AdminLoginResponse,
  Atividade,
  AtividadeForm,
  AdminSession
} from '@/types/admin';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const sessionStr = localStorage.getItem('adminSession');
  if (sessionStr) {
    const session: AdminSession = JSON.parse(sessionStr);
    if (config.url?.includes('/salas/')) {
      config.headers['X-Sala-Admin-Secret'] = session.senha;
    }
  }
  return config;
});

export const adminApi = {
  login: async (request: AdminLoginRequest): Promise<AdminLoginResponse> => {
    const response = await api.post<AdminLoginResponse>('/admin/login', request);
    return response.data;
  },

  getAtividadesPorSala: async (salaId: number): Promise<Atividade[]> => {
    const response = await api.get<Atividade[]>(`/admin/salas/${salaId}/atividades`);
    return response.data;
  },

  getAtividadesPendentes: async (salaId: number): Promise<Atividade[]> => {
    const response = await api.get<Atividade[]>(`/admin/salas/${salaId}/atividades/pendentes`);
    return response.data;
  },

  getProvas: async (salaId: number): Promise<Atividade[]> => {
    const response = await api.get<Atividade[]>(`/admin/salas/${salaId}/provas`);
    return response.data;
  },

  criarAtividade: async (salaId: number, atividade: AtividadeForm): Promise<Atividade> => {
    const response = await api.post<Atividade>(`/admin/salas/${salaId}/atividades`, atividade);
    return response.data;
  },

  atualizarAtividade: async (salaId: number, atividadeId: number, atividade: AtividadeForm): Promise<Atividade> => {
    const response = await api.put<Atividade>(`/admin/salas/${salaId}/atividades/${atividadeId}`, atividade);
    return response.data;
  },

  excluirAtividade: async (salaId: number, atividadeId: number): Promise<void> => {
    await api.delete(`/admin/salas/${salaId}/atividades/${atividadeId}`);
  },

  aprovarAtividade: async (salaId: number, atividadeId: number): Promise<Atividade> => {
    const response = await api.post<Atividade>(`/admin/salas/${salaId}/atividades/${atividadeId}/aprovar`);
    return response.data;
  },

  rejeitarAtividade: async (salaId: number, atividadeId: number): Promise<Atividade> => {
    const response = await api.post<Atividade>(`/admin/salas/${salaId}/atividades/${atividadeId}/rejeitar`);
    return response.data;
  },
};

export const adminStorage = {
  saveSession: (session: AdminSession) => {
    localStorage.setItem('adminSession', JSON.stringify(session));
  },

  getSession: (): AdminSession | null => {
    const sessionStr = localStorage.getItem('adminSession');
    if (!sessionStr) return null;
    return JSON.parse(sessionStr);
  },

  clearSession: () => {
    localStorage.removeItem('adminSession');
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem('adminSession') !== null;
  },
};

export default adminApi;
