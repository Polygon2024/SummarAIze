import { createTheme } from '@mui/material';
import { LightPalette, DarkPalette } from './Palette';
import Components from './Components';

// Header's Styling
export const HeaderStyling = {
  fontFamily: "'Be Vietnam Pro', Arial, sans-serif",
  fontWeight: '600',
};

const CommonTypography = {
  fontFamily: "'Be Vietnam Pro', Arial, sans-serif",
  h1: { ...HeaderStyling },
  h2: { ...HeaderStyling },
  h3: { ...HeaderStyling },
  h4: { ...HeaderStyling },
  h5: { ...HeaderStyling, fontWeight: '500' },
  h6: { ...HeaderStyling },

  body1: {
    fontFamily: "'Be Vietnam Pro', Arial, sans-serif",
  },
  body2: {
    fontFamily: "'Be Vietnam Pro', Arial, sans-serif",
  },
  caption: {
    fontFamily: "'Be Vietnam Pro', Arial, sans-serif",
  },
  button: {
    fontFamily: "'Be Vietnam Pro', Arial, sans-serif",
  },
  subtitle1: {
    fontSize: '12px',
    color: 'gray',
    fontFamily: "'Be Vietnam Pro', Arial, sans-serif",
  },
  subtitle2: {
    fontSize: '12px',
    fontFamily: "'Be Vietnam Pro', Arial, sans-serif",
  },
  fontWeightBold: 800,
};

export const LightTheme = createTheme({
  palette: LightPalette,
  components: Components,
  typography: CommonTypography,
});

export const DarkTheme = createTheme({
  palette: DarkPalette,
  components: Components,
  typography: CommonTypography,
});

export default LightTheme;
