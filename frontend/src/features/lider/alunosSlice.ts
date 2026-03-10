import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import type { Aluno, AlunoRequest } from '@/types';

interface AlunosState {
  lista: Aluno[];
  loading: boolean;
  error: string | null;
}

const initialState: AlunosState = {
  lista: [],
  loading: false,
  error: null,
};

export const fetchAlunos = createAsyncThunk(
  'alunos/fetchAlunos',
  async (salaId: number) => {
    const response = await api.get<Aluno[]>(`/salas/${salaId}/alunos`);
    return response.data;
  }
);

export const cadastrarAluno = createAsyncThunk(
  'alunos/cadastrarAluno',
  async ({ salaId, data }: { salaId: number; data: AlunoRequest }) => {
    const response = await api.post<Aluno>(`/salas/${salaId}/alunos`, data);
    return response.data;
  }
);

export const excluirAluno = createAsyncThunk(
  'alunos/excluirAluno',
  async ({ salaId, alunoId }: { salaId: number; alunoId: number }) => {
    await api.delete(`/salas/${salaId}/alunos/${alunoId}`);
    return alunoId;
  }
);

const alunosSlice = createSlice({
  name: 'alunos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlunos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlunos.fulfilled, (state, action) => {
        state.loading = false;
        state.lista = action.payload;
      })
      .addCase(fetchAlunos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar alunos.';
      });

    builder.addCase(cadastrarAluno.fulfilled, (state, action) => {
      state.lista.push(action.payload);
    });

    builder.addCase(excluirAluno.fulfilled, (state, action) => {
      state.lista = state.lista.filter((a) => a.id !== action.payload);
    });
  },
});

export default alunosSlice.reducer;
