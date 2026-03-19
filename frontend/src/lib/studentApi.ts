import api from '@/lib/api';
import type { Atividade, TipoAtividade, TipoEntrega } from '@/types/admin';
import type { VotacaoCancelamento, VotoRequest } from '@/types';

export interface SalaApiResponse {
  id: number;
  nome: string;
  semestre: string;
  codigoConvite: string;
}

export interface MateriaApiResponse {
  id: number;
  nome: string;
  professor: string;
  salaNome: string;
}

export interface LembreteRequest {
  email: string;
  salaIds: number[];
}

export interface LembreteResponse {
  assinanteId: number;
  email: string;
  ativo: boolean;
  salaIds: number[];
  ultimoEnvio: string | null;
}

export interface CriarAtividadeRequest {
  id?: number | null;
  titulo: string;
  descricao: string;
  tipoEntrega: TipoEntrega;
  linkEntrega?: string | null;
  regras: string;
  prazo: string;
  materiaId: number;
  tipo: TipoAtividade;
}

export const studentApi = {
  getSalas: async (): Promise<SalaApiResponse[]> => {
    const response = await api.get<SalaApiResponse[]>('/salas');
    return response.data;
  },

  getMateriasPorSala: async (salaId: number): Promise<MateriaApiResponse[]> => {
    const response = await api.get<MateriaApiResponse[]>(`/salas/${salaId}/materias`);
    return response.data;
  },

  getMateriaById: async (materiaId: number): Promise<MateriaApiResponse> => {
    const response = await api.get<MateriaApiResponse>(`/materias/${materiaId}`);
    return response.data;
  },

  getAtividadesPorMateria: async (materiaId: number): Promise<Atividade[]> => {
    const response = await api.get<Atividade[]>(`/materias/${materiaId}/atividades`);
    return response.data;
  },

  getVotacaoPorAtividade: async (atividadeId: number): Promise<VotacaoCancelamento> => {
    const response = await api.get<VotacaoCancelamento>(`/atividades/${atividadeId}/votacao`);
    return response.data;
  },

  registrarVoto: async (atividadeId: number, payload: VotoRequest): Promise<void> => {
    await api.post(`/atividades/${atividadeId}/votacao/votos`, payload);
  },

  criarAtividade: async (payload: CriarAtividadeRequest): Promise<Atividade> => {
    const response = await api.post<Atividade>('/atividades', payload);
    return response.data;
  },

  cadastrarLembrete: async (payload: LembreteRequest): Promise<LembreteResponse> => {
    const response = await api.post<LembreteResponse>('/lembretes/assinantes', payload);
    return response.data;
  },
};

export default studentApi;
