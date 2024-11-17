import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import {
  Home,
  NoteAdd,
  Translate,
  Book,
  Settings,
  FormatListBulleted,
} from '@mui/icons-material';
import { Blue } from '../theme/color';

interface TabsSectionProps {
  value: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const mainTabs = [
  { label: 'Home', icon: <Home fontSize='small' /> },
  { label: 'Summarize', icon: <FormatListBulleted fontSize='small' /> },
  { label: 'Notes', icon: <NoteAdd fontSize='small' /> },
  { label: 'Translate', icon: <Translate fontSize='small' /> },
  { label: 'Glossary', icon: <Book fontSize='small' /> },
];

const settingsTab = [
  { label: 'Settings', icon: <Settings fontSize='small' /> },
];

const TabsSection: React.FC<TabsSectionProps> = ({ value, onTabChange }) => {
  return (
    <Box
      sx={{
        width: 'fit-content',
        height: '100%',
        backgroundColor: Blue.Blue7,
        display: 'relative',
        alignItems: 'center',
        paddingTop: '20px',
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
        ))}

        {/* Render the Settings tab at the bottom */}
        {settingsTab.map((tab, index) => (
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
        ))}
      </Tabs>
    </Box>
  );
};

export default TabsSection;
