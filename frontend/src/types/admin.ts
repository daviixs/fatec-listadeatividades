export enum TipoAtividade {
  ATIVIDADE = 'ATIVIDADE',
  PROVA = 'PROVA',
  TRABALHO = 'TRABALHO'
}

export enum StatusAprovacao {
  PENDENTE = 'PENDENTE',
  APROVADA = 'APROVADA',
  REJEITADA = 'REJEITADA'
}

export enum TipoEntrega {
  LINK_EXTERNO = 'LINK_EXTERNO',
  ENTREGA_MANUAL = 'ENTREGA_MANUAL'
}

export interface AdminLoginRequest {
  codigoSala: string;
  senha: string;
}

export interface AdminLoginResponse {
  salaId: number;
  nomeSala: string;
  semestre: string;
  autenticado: boolean;
}

export interface Atividade {
  id: number;
  titulo: string;
  descricao: string;
  tipoEntrega: TipoEntrega;
  linkEntrega?: string;
  regras: string;
  prazo: string;
  status: 'ATIVA' | 'CANCELADA';
  materiaNome: string;
  tipo: TipoAtividade;
  statusAprovacao: StatusAprovacao;
  criadoPorAlunoId?: number;
}

export interface AtividadeForm {
  id: number;
  titulo: string;
  descricao: string;
  tipoEntrega: TipoEntrega;
  linkEntrega?: string;
  regras: string;
  prazo: string;
  materiaId: number;
  tipo: TipoAtividade;
}

export interface AdminSession {
  salaId: number;
  nomeSala: string;
  semestre: string;
  senha: string;
}
