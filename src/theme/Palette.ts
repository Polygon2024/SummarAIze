import { Blue, Grays } from './color';
import { PaletteMode } from '@mui/material';

// Main Palette
const Palette = {
  primary: {
    main: Blue.Blue4,
    dark: Blue.Blue6,
    light: Blue.Blue2,
    contrastText: '#FFFFFF',
  },
  background: {
    paper: Blue.Blue1,
  },
  error: {
    main: '#d32f2f',
  },
  warning: {
    main: '#ed6c02',
  },
  info: {
    main: '#0288d1',
  },
  success: {
    main: '#2e7d32',
  },
  link: {
    main: '#1976d2',
    dark: '#115293',
  },
};

// Light Mode Color Palette
const LightPalette = {
  mode: 'light' as PaletteMode,
  text: {
    primary: Grays.Gray4,
    secondary: Grays.Gray3,
    inactive: Grays.Gray3,
    contrast: Grays.White,
    disabled: Grays.Black,
  },
  // background: {
  //   default: Grays.Gray01,
  //   paper: Grays.Gray02,
  // },
  ...Palette,
};

// Dark Mode Color Palette
const DarkPalette = {
  mode: 'dark' as PaletteMode,
  text: {
    primary: Grays.Gray2,
    secondary: Grays.Gray3,
    inactive: Grays.Gray2,
    contrast: Grays.Gray4,
    disabled: Grays.Gray2,
  },
  border: {
    primary: Grays.White,
  },
  // background: {
  //   default: Grays.Gray05,
  //   paper: Grays.Gray04,
  // },
  ...Palette,
};

export { Palette, LightPalette, DarkPalette };

export default Palette;
