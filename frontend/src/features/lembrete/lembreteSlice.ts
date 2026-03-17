import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import type { LembreteEmail } from '@/types';

interface LembreteState {
  lista: LembreteEmail[];
  emailCadastrado: LembreteEmail | null;
  loading: boolean;
  error: string | null;
}

const initialState: LembreteState = {
  lista: [],
  emailCadastrado: null,
  loading: false,
  error: null,
};

export const cadastrarEmail = createAsyncThunk(
  'lembrete/cadastrarEmail',
  async ({ email, cursoNome }: { email: string; cursoNome: string }) => {
    const response = await api.post<LembreteEmail>('/lembretes/email', { email, cursoNome });
    return response.data;
  }
);

export const verificarEmail = createAsyncThunk(
  'lembrete/verificarEmail',
  async ({ email, cursoNome }: { email: string; cursoNome: string }) => {
    const response = await api.get<LembreteEmail>(`/lembretes/email/verificar/${email}/${cursoNome}`);
    return response.data;
  }
);

export const excluirEmail = createAsyncThunk(
  'lembrete/excluirEmail',
  async (id: number) => {
    await api.delete(`/lembretes/email/${id}`);
    return id;
  }
);

const lembreteSlice = createSlice({
  name: 'lembrete',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setEmailCadastrado(state, action) {
      state.emailCadastrado = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cadastrarEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cadastrarEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.emailCadastrado = action.payload;
        if (!state.lista.some(e => e.id === action.payload.id)) {
          state.lista.push(action.payload);
        }
      })
      .addCase(cadastrarEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao cadastrar email.';
      })
      .addCase(verificarEmail.fulfilled, (state, action) => {
        state.emailCadastrado = action.payload;
      })
      .addCase(excluirEmail.fulfilled, (state, action) => {
        state.lista = state.lista.filter(e => e.id !== action.payload);
        if (state.emailCadastrado?.id === action.payload) {
          state.emailCadastrado = null;
        }
      });
  },
});

export const { clearError, setEmailCadastrado } = lembreteSlice.actions;
export default lembreteSlice.reducer;