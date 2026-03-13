import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import type { EntradaSala } from '@/types';

interface EntradasState {
  lista: EntradaSala[];
  loading: boolean;
  error: string | null;
}

const initialState: EntradasState = {
  lista: [],
  loading: false,
  error: null,
};

export const fetchEntradas = createAsyncThunk(
  'entradas/fetchEntradas',
  async ({ salaId, status }: { salaId: number; status?: string }) => {
    const params = status ? `?status=${status}` : '';
    const response = await api.get<EntradaSala[]>(
      `/salas/${salaId}/entradas${params}`
    );
    return response.data;
  }
);

export const aprovarEntrada = createAsyncThunk(
  'entradas/aprovarEntrada',
  async ({
    salaId,
    entradaId,
    aprovado,
  }: {
    salaId: number;
    entradaId: number;
    aprovado: boolean;
  }) => {
    const response = await api.patch<EntradaSala>(
      `/salas/${salaId}/entradas/${entradaId}/aprovar`,
      { aprovado }
    );
    return response.data;
  }
);

const entradasSlice = createSlice({
  name: 'entradas',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntradas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEntradas.fulfilled, (state, action) => {
        state.loading = false;
        state.lista = action.payload;
      })
      .addCase(fetchEntradas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar entradas.';
      });

    builder.addCase(aprovarEntrada.fulfilled, (state, action) => {
      const idx = state.lista.findIndex((e) => e.id === action.payload.id);
      if (idx !== -1) state.lista[idx] = action.payload;
    });
  },
});

export default entradasSlice.reducer;
