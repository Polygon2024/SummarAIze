import { CSSObject } from '@mui/system';

// Base Divider styles
export const DividerBaseStyle: CSSObject = {
  root: {
    backgroundColor: '#FFFFFF',
    marginY: '8px',
  },
};

// Export Divider styles object
const DividerOverrides = {
  MuiDivider: {
    styleOverrides: DividerBaseStyle,
  },
};

export default DividerOverrides;
