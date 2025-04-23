import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './styles/animations.css';
import { MethodProvider } from './context/MethodContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MethodProvider>
      <App />
    </MethodProvider>
  </StrictMode>
);