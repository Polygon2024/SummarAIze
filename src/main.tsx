import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import theme from './theme/Theme';
import { ExtensionProvider } from './context/textContent';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <ExtensionProvider> */}
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
    {/* </ExtensionProvider> */}
  </StrictMode>
);
