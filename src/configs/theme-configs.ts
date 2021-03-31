import { ThemeOptions } from '@material-ui/core';
import VazirWoff2 from '../static/fonts/Vazir.woff2';

const vazir = {
  fontFamily: 'Vazir',
  fontStyle: 'normal',
  fontDisplay: 'swap' as const,
  fontWeight: 400,
  src: `
    local('Vazir'),
    local('Vazir-Regular'),
    url(${VazirWoff2 as string}) format('woff2')
  `,
};

const theme: ThemeOptions = {
  direction: 'rtl',
  typography: {
    fontFamily: 'Vazir, Roboto, sans-serif',
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [vazir],
      },
    },
    MuiTab: {
      wrapper: {
        flexDirection: 'row',
      },
    },
  },
};

export default theme;
