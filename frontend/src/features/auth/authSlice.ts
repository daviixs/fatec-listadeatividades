import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import type { SalaAcessoResponse } from '@/types';

export interface AuthState {
  loading: boolean;
  error: string | null;
  isLider: boolean;
  sala: SalaAcessoResponse | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  isLider: false,
  sala: null,
};

export const acessarSala = createAsyncThunk<SalaAcessoResponse, string>(
  'auth/acessarSala',
  async (codigoConvite, { rejectWithValue }) => {
    try {
      const { data } = await api.post<SalaAcessoResponse>(
        '/salas/acessar',
        codigoConvite,
        { headers: { 'Content-Type': 'text/plain' } }
      );
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.mensagem || 'Não foi possível acessar a sala');
    }
  }
);

export const solicitarEntrada = createAsyncThunk<
  void,
  { salaId: number; rm: string; nome: string; codigo?: string }
>(
  'auth/solicitarEntrada',
  async ({ salaId, rm, nome, codigo }, { rejectWithValue }) => {
    try {
      await api.post(`/salas/${salaId}/entradas`, {
        codigo: codigo ?? '',
        rm,
        nome,
      });
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.mensagem || 'Não foi possível solicitar entrada');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLider(state, action: PayloadAction<boolean>) {
      state.isLider = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(acessarSala.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acessarSala.fulfilled, (state, action) => {
        state.loading = false;
        state.sala = action.payload;
      })
      .addCase(acessarSala.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || 'Erro ao acessar sala';
      })
      .addCase(solicitarEntrada.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(solicitarEntrada.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(solicitarEntrada.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || 'Erro ao solicitar entrada';
      });
  },
});

export const { setLider, clearError } = authSlice.actions;
export default authSlice.reducer;
