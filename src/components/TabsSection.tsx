import React from 'react';
import { Box, Tab, Tabs, Tooltip } from '@mui/material';
import {
  Home,
  Settings,
  FormatListBulleted,
  Inventory,
  Cloud,
  DriveFileRenameOutline,
} from '@mui/icons-material';
import { Blue } from '../theme/color';

interface TabsSectionProps {
  value: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const mainTabs = [
  { label: 'Home', icon: <Home fontSize='small' /> },
  { label: 'Summarizer', icon: <FormatListBulleted fontSize='small' /> },
  {
    label: 'Writer / Rewriter',
    icon: <DriveFileRenameOutline fontSize='small' />,
  },
  { label: 'Local Storage', icon: <Inventory fontSize='small' /> },
  { label: 'Sync Storage', icon: <Cloud fontSize='small' /> },
];

const settingsTab = [
  { label: 'Settings', icon: <Settings fontSize='small' /> },
];

const TabsSection: React.FC<TabsSectionProps> = ({ value, onTabChange }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        width: 'fit-content',
        height: '100%',
        backgroundColor: Blue.Blue7,
        display: 'relative',
        alignItems: 'center',
        paddingTops: '20px',
        px: '4px',
      }}
    >
      <Tabs
        orientation='vertical'
        value={value}
        onChange={onTabChange}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          '& .MuiTabs-indicator': {
            display: 'none',
          },
        }}
      >
        {/* Render main tabs */}
        {mainTabs.map((tab, index) => (
          <Tooltip title={tab.label} placement='right' arrow>
            <Tab
              key={index}
              icon={tab.icon}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                typography: 'body2',
                fontSize: '12px',
                my: 1,
                p: 0.5,
                py: 1,
                color: value === index ? Blue.Blue1 : Blue.Blue3,
                backgroundColor:
                  value === index ? `${Blue.Blue4} !important` : 'none',
                '&:hover': {
                  color: value === index ? Blue.Blue1 : Blue.Blue6,
                  backgroundColor: Blue.Blue5,
                },
                '& .MuiTab-wrapper': {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                },
                '& .MuiTab-icon': {
                  mr: '0 !important',
                  mb: '4px !important',
                },
              }}
            />
          </Tooltip>
        ))}

        {/* Render the Settings tab at the bottom */}
        {settingsTab.map((tab, index) => (
          <Tooltip title={tab.label} placement='right' arrow>
            <Tab
              key={index}
              icon={tab.icon}
              sx={{
                position: 'absolute',
                bottom: 0,
                flexDirection: 'column',
                alignItems: 'center',
                typography: 'body2',
                fontSize: '12px',
                my: 1,
                p: 0.5,
                py: 1,
                color:
                  value === mainTabs.length + index ? Blue.Blue1 : Blue.Blue3,
                backgroundColor:
                  value === mainTabs.length + index
                    ? `${Blue.Blue4} !important`
                    : 'none',
                '&:hover': {
                  color:
                    value === mainTabs.length + index ? Blue.Blue1 : Blue.Blue6,
                  backgroundColor: Blue.Blue5,
                },
                '& .MuiTab-wrapper': {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                },
                '& .MuiTab-icon': {
                  mr: '0 !important',
                  mb: '4px !important',
                },
              }}
            />
          </Tooltip>
        ))}
      </Tabs>
    </Box>
  );
};

export default TabsSection;
