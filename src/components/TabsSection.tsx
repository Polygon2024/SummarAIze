import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tab,
  Tabs,
  Tooltip,
} from '@mui/material';
import {
  Home,
  Settings,
  FormatListBulleted,
  Inventory,
  Cloud,
  DriveFileRenameOutline,
  HelpOutline,
} from '@mui/icons-material';
import { Blue, Grays } from '../theme/color';
import SettingsDialog from './SettingsDialog';
import DarkModeSwitch from './UI/DarkModeSwitch';
import { useThemeContext } from '../context/ThemeContext';

interface TabsSectionProps {
  value: number;
  onTabChange: (newValue: number) => void;
}

const featureTabs = [
  {
    label: 'Summarizer',
    icon: <FormatListBulleted fontSize='small' />,
    key: 0,
  },
  {
    label: 'Writer / Rewriter',
    icon: <DriveFileRenameOutline fontSize='small' />,
    key: 1,
  },
  { label: 'Local Storage', icon: <Inventory fontSize='small' />, key: 2 },
  { label: 'Sync Storage', icon: <Cloud fontSize='small' />, key: 3 },
];

const settingsTab = [
  { label: 'Guide', icon: <HelpOutline fontSize='small' />, key: 4 },
  { label: 'Settings', icon: <Settings fontSize='small' />, key: 5 },
];

const TabsStyling = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  typography: 'body2',
  fontSize: '12px',
  my: 1,
  p: 0.5,
  py: 1,
  borderRadius: 1,
  '& .MuiTab-wrapper': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  '& .MuiTab-icon': {
    mr: '0 !important',
    mb: '4px !important',
  },
};

const TabsSection: React.FC<TabsSectionProps> = ({ value, onTabChange }) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const { darkMode } = useThemeContext();

  return (
    <Box
      sx={{
        position: 'fixed',
        width: 'fit-content',
        backgroundColor: darkMode ? Grays.Gray6 : Blue.Blue5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        alignItems: 'center',
        paddingTops: '20px',
        px: '4px',
      }}
    >
      <Tabs
        orientation='vertical'
        value={value}
        sx={{
          '& .MuiTabs-indicator': {
            display: 'none',
          },
        }}
      >
        {/* Render Features tabs */}
        {featureTabs.map((tab) => (
          <Tooltip title={tab.label} placement='right' arrow>
            <Button
              onClick={() => onTabChange(tab.key)}
              key={tab.key}
              sx={{
                ...TabsStyling,
                backgroundColor: (() => {
                  if (value === tab.key) {
                    return darkMode
                      ? `${Grays.Gray4} !important`
                      : `${Blue.Blue3} !important`;
                  }
                  return 'none';
                })(),
                '&:hover': {
                  color: (() => {
                    if (value === tab.key) {
                      return darkMode
                        ? `${Grays.White} !important`
                        : `${Blue.Blue1} !important`;
                    }
                    return darkMode ? Grays.Gray3 : Blue.Blue2;
                  })(),
                  backgroundColor: darkMode ? Grays.Gray4 : Blue.Blue5,
                },
              }}
            >
              {tab.icon}
            </Button>
          </Tooltip>
        ))}
      </Tabs>

      <Box>
        <DarkModeSwitch />
        <Tabs
          orientation='vertical'
          value={value}
          sx={{
            '& .MuiTabs-indicator': {
              display: 'none',
            },
          }}
        >
          {/* Render Settings tabs */}
          {settingsTab.map((tab) => (
            <Tooltip title={tab.label} placement='right' arrow>
              <Button
                onClick={
                  tab.key === 5
                    ? () => setOpenDialog(true)
                    : () => onTabChange(tab.key)
                }
                key={tab.key}
                sx={{
                  ...TabsStyling,
                  backgroundColor: (() => {
                    if (value === tab.key) {
                      return darkMode
                        ? `${Grays.Gray4} !important`
                        : `${Blue.Blue3} !important`;
                    }
                    return 'none';
                  })(),
                  '&:hover': {
                    color: (() => {
                      if (value === tab.key) {
                        return darkMode
                          ? `${Grays.White} !important`
                          : `${Blue.Blue1} !important`;
                      }
                      return darkMode ? Grays.Gray3 : Blue.Blue2;
                    })(),
                    backgroundColor: darkMode ? Grays.Gray4 : Blue.Blue5,
                  },
                }}
              >
                {tab.icon}
              </Button>
            </Tooltip>
          ))}
        </Tabs>
      </Box>

      {/* Dialog for Settings */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <SettingsDialog />
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            color='primary'
            onClick={() => setOpenDialog(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TabsSection;
