import { createTheme} from '@mui/material/styles';

const theme = createTheme({
  palette: {
    neutral: {
      main: '#64748B',
      contrastText: '#fff',
    },
    green: {
      main : '#49E68B',
    }
  },
});

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
    green: Palette['primary'];
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
    green?: PaletteOptions['primary'];
  }
}

// Update the Button's color prop options
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    neutral: true;
    green: true,
  }
}
declare module '@mui/material/TextField' {
  interface TextFieldPropsColorOverrides {
    neutral: true;
    green: true,
  }
}
export default theme