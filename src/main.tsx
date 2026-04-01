import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';

import '@fontsource-variable/inter';
import '@fontsource-variable/open-sans';
import '@fontsource-variable/roboto-mono';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
