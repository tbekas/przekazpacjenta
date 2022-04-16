import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let themeSettings = createTheme({
  palette: {
    primary: {
      main: '#0058b5',
    },
    secondary: {
      main: '#f7ce00',
    },
  },
});

let theme = createTheme(themeSettings);
theme = responsiveFontSizes(theme);

export default theme;
