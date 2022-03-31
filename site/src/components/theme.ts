import { createTheme, responsiveFontSizes } from "@mui/material/styles";
// import { red } from '@mui/material/colors';

// A custom theme for Przekaż pacjenta
let themeSettings = createTheme({
  palette: {
    primary: {
      main: "#0058b5"
    },
    secondary: {
      main: "#f7ce00"
    }
  }
});

let theme = createTheme(themeSettings);
theme = responsiveFontSizes(theme);

export default theme;
