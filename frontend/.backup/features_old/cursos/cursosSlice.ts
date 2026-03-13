import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import type { Curso, Semestre } from '@/types';

interface CursosState {
  lista: Curso[];
  cursoSelecionado: Curso | null;
  loading: boolean;
  error: string | null;
}

const initialState: CursosState = {
  lista: [],
  cursoSelecionado: null,
  loading: false,
  error: null,
};

export const fetchCursos = createAsyncThunk(
  'cursos/fetchCursos',
  async () => {
    const response = await api.get<Curso[]>('/salas/cursos');
    return response.data;
  }
);

export const fetchCursoPorNome = createAsyncThunk(
  'cursos/fetchCursoPorNome',
  async (cursoNome: string) => {
    const response = await api.get<Curso>(`/salas/curso/${cursoNome}`);
    return response.data;
  }
);

const cursosSlice = createSlice({
  name: 'cursos',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCursos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCursos.fulfilled, (state, action) => {
        state.loading = false;
        state.lista = action.payload;
      })
      .addCase(fetchCursos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar cursos.';
      })
      .addCase(fetchCursoPorNome.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCursoPorNome.fulfilled, (state, action) => {
        state.loading = false;
        state.cursoSelecionado = action.payload;
      })
      .addCase(fetchCursoPorNome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar curso.';
      });
  },
});

export const { clearError } = cursosSlice.actions;
export default cursosSlice.reducer;