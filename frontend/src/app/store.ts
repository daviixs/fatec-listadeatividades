import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import materiasReducer from '@/features/aluno/materiasSlice';
import atividadesReducer from '@/features/atividade/atividadesSlice';
import votacaoReducer from '@/features/atividade/votacaoSlice';
import alunosReducer from '@/features/lider/alunosSlice';
import entradasReducer from '@/features/lider/entradasSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    materias: materiasReducer,
    atividades: atividadesReducer,
    votacao: votacaoReducer,
    alunos: alunosReducer,
    entradas: entradasReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
