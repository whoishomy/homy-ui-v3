import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './router';
import './index.css';
import { TayfunProvider } from '@/contexts/TayfunContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TayfunProvider>
      <AppRouter />
    </TayfunProvider>
  </StrictMode>
);
