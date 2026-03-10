import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import type { SalaDeAula, EntradaSala } from '@/types';

interface AuthState {
  salaId: number | null;
  salaNome: string;
  salaCodigo: string;
  aluno: { id: number; nome: string; rm: string } | null;
  isLider: boolean;
  entradaId: number | null;
  entradaStatus: 'PENDENTE' | 'APROVADO' | 'REJEITADO' | null;
  loading: boolean;
  error: string | null;
}

// Recuperar dados do localStorage
const storedSalaId = localStorage.getItem('salaId');
const storedAluno = localStorage.getItem('aluno');
const storedIsLider = localStorage.getItem('isLider');
const storedSalaNome = localStorage.getItem('salaNome');
const storedSalaCodigo = localStorage.getItem('salaCodigo');

const initialState: AuthState = {
  salaId: storedSalaId ? Number(storedSalaId) : null,
  salaNome: storedSalaNome || '',
  salaCodigo: storedSalaCodigo || '',
  aluno: storedAluno ? JSON.parse(storedAluno) : null,
  isLider: storedIsLider === 'true',
  entradaId: null,
  entradaStatus: null,
  loading: false,
  error: null,
};

// Acessar sala pelo código de convite
export const acessarSala = createAsyncThunk(
  'auth/acessarSala',
  async (codigo: string) => {
    const response = await api.post<SalaDeAula>('/salas/acessar', { codigo });
    return response.data;
  }
);

// Solicitar entrada na sala
export const solicitarEntrada = createAsyncThunk(
  'auth/solicitarEntrada',
  async ({ salaId, rm, nome }: { salaId: number; rm: string; nome: string }) => {
    const response = await api.post<EntradaSala>(`/salas/${salaId}/entradas`, {
      rm,
      nome,
    });
    return response.data;
  }
);

// Verificar status da entrada (polling)
export const verificarEntrada = createAsyncThunk(
  'auth/verificarEntrada',
  async ({ salaId, entradaId }: { salaId: number; entradaId: number }) => {
    const response = await api.get<EntradaSala>(
      `/salas/${salaId}/entradas/${entradaId}`
    );
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLider(state, action: PayloadAction<boolean>) {
      state.isLider = action.payload;
      localStorage.setItem('isLider', String(action.payload));
    },
    setAluno(
      state,
      action: PayloadAction<{ id: number; nome: string; rm: string }>
    ) {
      state.aluno = action.payload;
      localStorage.setItem('aluno', JSON.stringify(action.payload));
    },
    logout(state) {
      state.salaId = null;
      state.salaNome = '';
      state.salaCodigo = '';
      state.aluno = null;
      state.isLider = false;
      state.entradaId = null;
      state.entradaStatus = null;
      localStorage.removeItem('salaId');
      localStorage.removeItem('salaNome');
      localStorage.removeItem('salaCodigo');
      localStorage.removeItem('aluno');
      localStorage.removeItem('isLider');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Acessar sala
    builder
      .addCase(acessarSala.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acessarSala.fulfilled, (state, action) => {
        state.loading = false;
        state.salaId = action.payload.id;
        state.salaNome = action.payload.nome;
        state.salaCodigo = action.payload.codigoConvite;
        localStorage.setItem('salaId', String(action.payload.id));
        localStorage.setItem('salaNome', action.payload.nome);
        localStorage.setItem('salaCodigo', action.payload.codigoConvite);
      })
      .addCase(acessarSala.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Código da sala inválido.';
      });

    // Solicitar entrada
    builder
      .addCase(solicitarEntrada.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(solicitarEntrada.fulfilled, (state, action) => {
        state.loading = false;
        state.entradaId = action.payload.id;
        state.entradaStatus = action.payload.status;
      })
      .addCase(solicitarEntrada.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao solicitar entrada.';
      });

    // Verificar entrada
    builder
      .addCase(verificarEntrada.fulfilled, (state, action) => {
        state.entradaStatus = action.payload.status;
        if (action.payload.status === 'APROVADO' && action.payload.alunoId) {
          state.aluno = {
            id: action.payload.alunoId,
            nome: action.payload.nome,
            rm: action.payload.rm,
          };
          localStorage.setItem(
            'aluno',
            JSON.stringify({
              id: action.payload.alunoId,
              nome: action.payload.nome,
              rm: action.payload.rm,
            })
          );
        }
      });
  },
});

export const { setLider, setAluno, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
