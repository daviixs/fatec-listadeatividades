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

export interface SalaCalendarioResponse {
  sala: SalaApiResponse;
  materias: MateriaApiResponse[];
  atividades: Array<Atividade & { materiaId: number }>;
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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function createInvalidContractError(resource: string): Error {
  return new Error(`A API retornou um formato invalido para ${resource}.`);
}

function ensureArrayPayload<T>(data: unknown, resource: string): T[] {
  if (!Array.isArray(data)) {
    throw createInvalidContractError(resource);
  }
  return data as T[];
}

function ensureObjectPayload<T extends object>(data: unknown, resource: string): T {
  if (!isPlainObject(data)) {
    throw createInvalidContractError(resource);
  }
  return data as T;
}

function ensureCalendarioPayload(data: unknown): SalaCalendarioResponse {
  if (!isPlainObject(data)) {
    throw createInvalidContractError('o calendario da sala');
  }

  if (!isPlainObject(data.sala) || !Array.isArray(data.materias) || !Array.isArray(data.atividades)) {
    throw createInvalidContractError('o calendario da sala');
  }

  return data as unknown as SalaCalendarioResponse;
}

export const studentApi = {
  getSalas: async (): Promise<SalaApiResponse[]> => {
    const response = await api.get<SalaApiResponse[]>('/salas');
    return ensureArrayPayload<SalaApiResponse>(response.data, 'a lista de salas');
  },

  getMateriasPorSala: async (salaId: number): Promise<MateriaApiResponse[]> => {
    const response = await api.get<MateriaApiResponse[]>(`/salas/${salaId}/materias`);
    return ensureArrayPayload<MateriaApiResponse>(response.data, 'a lista de materias da sala');
  },

  getCalendarioSala: async (salaId: number): Promise<SalaCalendarioResponse> => {
    const response = await api.get<SalaCalendarioResponse>(`/salas/${salaId}/calendario`);
    return ensureCalendarioPayload(response.data);
  },

  getMateriaById: async (materiaId: number): Promise<MateriaApiResponse> => {
    const response = await api.get<MateriaApiResponse>(`/materias/${materiaId}`);
    return ensureObjectPayload<MateriaApiResponse>(response.data, 'a materia');
  },

  getAtividadesPorMateria: async (materiaId: number): Promise<Atividade[]> => {
    const response = await api.get<Atividade[]>(`/materias/${materiaId}/atividades`);
    return ensureArrayPayload<Atividade>(response.data, 'a lista de atividades da materia');
  },

  getVotacaoPorAtividade: async (atividadeId: number): Promise<VotacaoCancelamento> => {
    const response = await api.get<VotacaoCancelamento>(`/atividades/${atividadeId}/votacao`);
    return ensureObjectPayload<VotacaoCancelamento>(response.data, 'a votacao da atividade');
  },

  registrarVoto: async (atividadeId: number, payload: VotoRequest): Promise<void> => {
    await api.post(`/atividades/${atividadeId}/votacao/votos`, payload);
  },

  criarAtividade: async (payload: CriarAtividadeRequest): Promise<Atividade> => {
    const response = await api.post<Atividade>('/atividades', payload);
    return ensureObjectPayload<Atividade>(response.data, 'a atividade criada');
  },

  cadastrarLembrete: async (payload: LembreteRequest): Promise<LembreteResponse> => {
    const response = await api.post<LembreteResponse>('/lembretes/assinantes', payload);
    return ensureObjectPayload<LembreteResponse>(response.data, 'o cadastro de lembrete');
  },
};

export default studentApi;
