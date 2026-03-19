import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import lembreteReducer from '@/features/lembrete/lembreteSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lembrete: lembreteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
