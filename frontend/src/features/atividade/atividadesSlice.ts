import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import type { Atividade, AtividadeRequest } from '@/types';

interface AtividadesState {
  lista: Atividade[];
  atividade: Atividade | null;
  loading: boolean;
  error: string | null;
}

const initialState: AtividadesState = {
  lista: [],
  atividade: null,
  loading: false,
  error: null,
};

export const fetchAtividades = createAsyncThunk(
  'atividades/fetchAtividades',
  async () => {
    const response = await api.get<Atividade[]>('/atividades');
    return response.data;
  }
);

export const fetchAtividade = createAsyncThunk(
  'atividades/fetchAtividade',
  async (id: number) => {
    const response = await api.get<Atividade>(`/atividades/${id}`);
    return response.data;
  }
);

export const criarAtividade = createAsyncThunk(
  'atividades/criarAtividade',
  async (data: AtividadeRequest) => {
    const response = await api.post<Atividade>('/atividades', data);
    return response.data;
  }
);

export const atualizarAtividade = createAsyncThunk(
  'atividades/atualizarAtividade',
  async ({ id, data }: { id: number; data: AtividadeRequest }) => {
    const response = await api.put<Atividade>(`/atividades/${id}`, data);
    return response.data;
  }
);

export const excluirAtividade = createAsyncThunk(
  'atividades/excluirAtividade',
  async (id: number) => {
    await api.delete(`/atividades/${id}`);
    return id;
  }
);

const atividadesSlice = createSlice({
  name: 'atividades',
  initialState,
  reducers: {
    limparAtividade(state) {
      state.atividade = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch lista
    builder
      .addCase(fetchAtividades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAtividades.fulfilled, (state, action) => {
        state.loading = false;
        state.lista = action.payload;
      })
      .addCase(fetchAtividades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar atividades.';
      });

    // Fetch uma
    builder
      .addCase(fetchAtividade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAtividade.fulfilled, (state, action) => {
        state.loading = false;
        state.atividade = action.payload;
      })
      .addCase(fetchAtividade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar atividade.';
      });

    // Criar
    builder
      .addCase(criarAtividade.fulfilled, (state, action) => {
        state.lista.push(action.payload);
      });

    // Atualizar
    builder
      .addCase(atualizarAtividade.fulfilled, (state, action) => {
        const idx = state.lista.findIndex((a) => a.id === action.payload.id);
        if (idx !== -1) state.lista[idx] = action.payload;
        if (state.atividade?.id === action.payload.id) {
          state.atividade = action.payload;
        }
      });

    // Excluir
    builder
      .addCase(excluirAtividade.fulfilled, (state, action) => {
        state.lista = state.lista.filter((a) => a.id !== action.payload);
      });
  },
});

export const { limparAtividade } = atividadesSlice.actions;
export default atividadesSlice.reducer;
