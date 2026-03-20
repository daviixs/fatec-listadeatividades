import axios from 'axios';
import type {
  MasterAdminLoginRequest,
  MasterAdminLoginResponse,
  EmailAssinanteResponse,
  AtividadeAdminResponse,
  SalaAdminResponse
} from '@/types/admin';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('masterAdminToken');
  if (token && config.url?.includes('/master-admin/')) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const masterAdminApi = {
  login: async (request: MasterAdminLoginRequest): Promise<MasterAdminLoginResponse> => {
    const response = await api.post<MasterAdminLoginResponse>('/master-admin/login', request);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/master-admin/logout');
  },

  getEmails: async (): Promise<EmailAssinanteResponse[]> => {
    const response = await api.get<EmailAssinanteResponse[]>('/master-admin/emails');
    return response.data;
  },

  deleteEmail: async (id: number): Promise<void> => {
    await api.delete(`/master-admin/emails/${id}`);
  },

  getAtividades: async (): Promise<AtividadeAdminResponse[]> => {
    const response = await api.get<AtividadeAdminResponse[]>('/master-admin/atividades');
    return response.data;
  },

  deleteAtividade: async (id: number): Promise<void> => {
    await api.delete(`/master-admin/atividades/${id}`);
  },

  getSalas: async (): Promise<SalaAdminResponse[]> => {
    const response = await api.get<SalaAdminResponse[]>('/master-admin/salas');
    return response.data;
  },

  deleteSala: async (id: number): Promise<void> => {
    await api.delete(`/master-admin/salas/${id}`);
  },
};

export const masterAdminStorage = {
  saveSession: (session: { token: string; username: string }) => {
    localStorage.setItem('masterAdminToken', session.token);
    localStorage.setItem('masterAdminUsername', session.username);
  },

  getSession: (): { token: string; username: string } | null => {
    const token = localStorage.getItem('masterAdminToken');
    const username = localStorage.getItem('masterAdminUsername');
    if (!token || !username) return null;
    return { token, username };
  },

  clearSession: () => {
    localStorage.removeItem('masterAdminToken');
    localStorage.removeItem('masterAdminUsername');
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem('masterAdminToken') !== null;
  },
};

export default masterAdminApi;
