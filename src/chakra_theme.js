import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const chakra_theme = extendTheme({ config });

export default chakra_theme;
