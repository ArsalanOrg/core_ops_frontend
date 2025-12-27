import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import chakra_theme from './chakra_theme';
import 'style/index.css';
import mui_theme from './mui_theme';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={mui_theme}>
    <ChakraProvider theme={chakra_theme}>
      <ColorModeScript initialColorMode={chakra_theme.config.initialColorMode} />
      <CssBaseline />
      <App />
    </ChakraProvider>
  </ThemeProvider>
);

