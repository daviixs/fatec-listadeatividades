import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import type { Materia } from '@/types';

interface MateriasState {
  lista: Materia[];
  loading: boolean;
  error: string | null;
}

const initialState: MateriasState = {
  lista: [],
  loading: false,
  error: null,
};

export const fetchMaterias = createAsyncThunk(
  'materias/fetchMaterias',
  async (salaId: number) => {
    const response = await api.get<Materia[]>(`/materias/sala/${salaId}`);
    return response.data;
  }
);

const materiasSlice = createSlice({
  name: 'materias',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaterias.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaterias.fulfilled, (state, action) => {
        state.loading = false;
        state.lista = action.payload;
      })
      .addCase(fetchMaterias.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar matérias.';
      });
  },
});

export default materiasSlice.reducer;
