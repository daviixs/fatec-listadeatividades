// Tipos compartilhados que espelham os DTOs do backend

export interface SalaDeAula {
  id: number;
  nome: string;
  semestre: string;
  codigoConvite: string;
}

export interface Aluno {
  id: number;
  rm: string;
  nome: string;
  salaId: number;
}

export interface Materia {
  id: number;
  nome: string;
  professor: string;
  salaId: number;
}

export interface Atividade {
  id: number;
  titulo: string;
  descricao: string;
  tipoEntrega: 'LINK_EXTERNO' | 'ENTREGA_MANUAL';
  linkEntrega: string | null;
  regrasEntrega: string | null;
  prazo: string;
  status: 'ATIVA' | 'CANCELADA';
  materiaId: number;
  materiaNome?: string;
  professorNome?: string;
}

export interface EntradaSala {
  id: number;
  nome: string;
  rm: string;
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
  dataSolicitacao: string;
  salaId: number;
  alunoId: number | null;
}

export interface VotacaoCancelamento {
  id: number;
  atividadeId: number;
  atividadeTitulo?: string;
  atividadeStatus?: 'ATIVA' | 'CANCELADA';
  status: 'ABERTA' | 'ENCERRADA';
  iniciadaEm: string;
  encerraEm: string;
  votosSim: number;
  votosNao: number;
  totalAlunos: number;
  metaCancelamento: number;
}

export interface Voto {
  id: number;
  opcao: 'SIM' | 'NAO';
  alunoId: number;
  votacaoId: number;
}

// Request types
export interface EntradaSalaRequest {
  codigo: string;
  rm: string;
  nome: string;
}

export interface AlunoRequest {
  rm: string;
  nome: string;
}

export interface AtividadeRequest {
  titulo: string;
  descricao: string;
  tipoEntrega: 'LINK_EXTERNO' | 'ENTREGA_MANUAL';
  linkEntrega?: string;
  regrasEntrega?: string;
  prazo: string;
  materiaId: number;
}

export interface VotoRequest {
  opcao: 'SIM' | 'NAO';
}

export interface AprovarEntradaRequest {
  aprovado: boolean;
}

// Response wrapper
export interface SalaAcessoResponse {
  id: number;
  nome: string;
  semestre: string;
  codigoConvite: string;
}
