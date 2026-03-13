import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import AppRoutes from '@/routes';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRoutes />
    <Toaster richColors position="top-right" />
  </StrictMode>
);
