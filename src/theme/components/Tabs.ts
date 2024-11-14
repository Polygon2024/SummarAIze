import { CSSObject } from '@mui/system';

// Base Tab styles
export const TabBaseStyle: CSSObject = {
  root: {
    minHeight: '0',
    height: 'fit-content',
    minWidth: 'fit-content',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    m: 0,
    p: 0,
    justifyContent: 'flex-start',
    borderRadius: '5px',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#1565C0',
      color: '#FFFFFF',
    },
    '&.Mui-selected': {
      backgroundColor: '#64B5F6',
      color: '#FFFFFF',
    },
    '& .MuiTabs-indicator': {
      display: 'none',
      backgroundColor: 'transparent',
    },
  },
  iconWrapper: {
    margin: '0 !important',
    marginRight: '8px !important',
  },
};

// Base Tabs styles
export const TabsBaseStyle: CSSObject = {
  root: {
    border: 'none !important',
    boxShadow: 'none',
    '& .MuiTabs-indicator': {
      display: 'none',
    },
    '&.MuiTab-root': {
      textDecoration: 'none',
    },
  },
};

// Export Tabs styles object
const TabsOverrides = {
  MuiTab: {
    styleOverrides: TabBaseStyle,
  },
  MuiTabs: {
    styleOverrides: TabsBaseStyle,
  },
};

export default TabsOverrides;
