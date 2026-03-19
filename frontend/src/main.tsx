import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import { Provider } from 'react-redux';
import AppRoutes from '@/routes';
import { store } from '@/store';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppRoutes />
      <Toaster richColors position="top-right" />
    </Provider>
  </StrictMode>
);
