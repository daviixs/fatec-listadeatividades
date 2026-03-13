import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import type { VotacaoCancelamento, Voto } from '@/types';

interface VotacaoState {
  votacao: VotacaoCancelamento | null;
  loading: boolean;
  error: string | null;
  votando: boolean;
  votoRegistrado: boolean;
}

const initialState: VotacaoState = {
  votacao: null,
  loading: false,
  error: null,
  votando: false,
  votoRegistrado: false,
};

export const fetchVotacao = createAsyncThunk(
  'votacao/fetchVotacao',
  async (atividadeId: number) => {
    const response = await api.get<VotacaoCancelamento>(
      `/atividades/${atividadeId}/votacao`
    );
    return response.data;
  }
);

export const abrirVotacao = createAsyncThunk(
  'votacao/abrirVotacao',
  async (atividadeId: number) => {
    const response = await api.post<VotacaoCancelamento>(
      `/atividades/${atividadeId}/votacao`
    );
    return response.data;
  }
);

export const registrarVoto = createAsyncThunk(
  'votacao/registrarVoto',
  async ({
    atividadeId,
    alunoId,
    opcao,
  }: {
    atividadeId: number;
    alunoId: number;
    opcao: 'SIM' | 'NAO';
  }) => {
    const response = await api.post<Voto>(
      `/atividades/${atividadeId}/votacao/votos?alunoId=${alunoId}`,
      { opcao }
    );
    return response.data;
  }
);

const votacaoSlice = createSlice({
  name: 'votacao',
  initialState,
  reducers: {
    limparVotacao(state) {
      state.votacao = null;
      state.votoRegistrado = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch votação
    builder
      .addCase(fetchVotacao.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVotacao.fulfilled, (state, action) => {
        state.loading = false;
        state.votacao = action.payload;
      })
      .addCase(fetchVotacao.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar votação.';
      });

    // Abrir votação
    builder
      .addCase(abrirVotacao.fulfilled, (state, action) => {
        state.votacao = action.payload;
      });

    // Registrar voto
    builder
      .addCase(registrarVoto.pending, (state) => {
        state.votando = true;
      })
      .addCase(registrarVoto.fulfilled, (state) => {
        state.votando = false;
        state.votoRegistrado = true;
      })
      .addCase(registrarVoto.rejected, (state) => {
        state.votando = false;
      });
  },
});

export const { limparVotacao } = votacaoSlice.actions;
export default votacaoSlice.reducer;
