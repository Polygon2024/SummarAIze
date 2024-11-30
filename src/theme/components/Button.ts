import { CSSObject } from '@mui/system';
import { Blue } from '../color';

// Base button styles
export const ButtonBaseStyle: CSSObject = {
  minWidth: 'fit-content',
  width: '100%',
  height: '40px',
  padding: '6px 18px',
  margin: 'none',
  border: 'none',
  borderRadius: '8px',
  textTransform: 'none',
  fontSize: '16px',
  fontFamily: "'Open Sans', Arial, sans-serif",
  boxShadow: 'none !important',
};

// Button styles with variants and colors
export const ButtonStyles = {
  root: ButtonBaseStyle,

  // Text Variant
  textPrimary: {
    ...ButtonBaseStyle,
    color: '#FFFFFF',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: Blue.Blue4,
      color: '#FFFFFF',
    },
  },
  textSecondary: {
    ...ButtonBaseStyle,
    color: Blue.Blue0,
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: Blue.Blue2,
      color: '#FFFFFF',
    },
  },

  // Outlined Variant
  outlinedPrimary: {
    ...ButtonBaseStyle,
    color: '#FFFFFF',
    border: 'solid 1px #FFFFFF',
    backgroundColor: 'transparent',
    '&:hover': {
      borderColor: '#64B5F6',
      backgroundColor: 'transparent',
    },
  },
  outlinedSecondary: {
    ...ButtonBaseStyle,
    color: '#64B5F6',
    border: 'solid 1px #64B5F6',
    backgroundColor: 'transparent',
    '&:hover': {
      borderColor: '#1976D2',
      backgroundColor: 'transparent',
    },
  },

  // Contained Variant
  containedPrimary: {
    ...ButtonBaseStyle,
    color: '#FFFFFF',
    backgroundColor: Blue.Blue4,
    '&:hover': {
      backgroundColor: Blue.Blue5,
    },
  },
  containedSecondary: {
    ...ButtonBaseStyle,
    color: '#FFFFFF',
    backgroundColor: Blue.Blue6,
    '&:hover': {
      backgroundColor: Blue.Blue5,
    },
  },
};

const Button = {
  MuiButton: {
    styleOverrides: ButtonStyles,
  },
};

export default Button;
