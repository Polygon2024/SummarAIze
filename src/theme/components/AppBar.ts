import { CSSObject } from '@mui/system';
import { Blue } from '../color';

// Base AppBar styles
export const AppBarBaseStyle: CSSObject = {
  root: {
    width: '100%',
    boxShadow: 'none',
    flexGrow: 1,
    backgroundColor: Blue.Blue5,
  },
};

// Export AppBar styles object
const AppBarOverrides = {
  MuiAppBar: {
    styleOverrides: AppBarBaseStyle,
  },
};

export default AppBarOverrides;
