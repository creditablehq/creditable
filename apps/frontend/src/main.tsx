import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/tailwind.css'
import 'react-tooltip/dist/react-tooltip.css';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme>
      <App />
    </Theme>
  </StrictMode>,
);
