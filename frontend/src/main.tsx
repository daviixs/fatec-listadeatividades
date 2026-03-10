import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { Toaster } from '@/components/ui/sonner';
import AppRoutes from '@/routes';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppRoutes />
      <Toaster richColors position="top-right" />
    </Provider>
  </StrictMode>
);
