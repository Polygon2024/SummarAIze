import { createTheme } from '@mui/material';
import Palette from './Palette';
import components from './Components';

// Header's Styling
export const HeaderStyling = {
  fontFamily: "'Open Sans', Arial, sans-serif",
  fontWeight: '600',
};

const CommonTypography = {
  fontFamily: "'Open Sans', Arial, sans-serif",
  h1: { ...HeaderStyling },
  h2: { ...HeaderStyling },
  h3: { ...HeaderStyling },
  h4: { ...HeaderStyling },
  h5: { ...HeaderStyling, fontWeight: '500' },
  h6: { ...HeaderStyling },

  body1: {
    fontFamily: "'Open Sans', Arial, sans-serif",
  },
  body2: {
    fontFamily: "'Open Sans', Arial, sans-serif",
  },
  caption: {
    fontFamily: "'Open Sans', Arial, sans-serif",
  },
  button: {
    fontFamily: "'Open Sans', Arial, sans-serif",
  },
  subtitle1: {
    fontSize: '12px',
    color: 'gray',
    fontFamily: "'Open Sans', Arial, sans-serif",
  },
  subtitle2: {
    fontSize: '12px',
    fontFamily: "'Open Sans', Arial, sans-serif",
  },
  fontWeightBold: 800,
};

const Theme = createTheme({
  palette: Palette,
  ...CommonTypography,
  components: components,
});
export default Theme;
