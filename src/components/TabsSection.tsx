import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { Home, Edit, NoteAdd, Translate, Book } from '@mui/icons-material';
import { Blue } from '../theme/color';

interface TabsSectionProps {
  value: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const tabData = [
  { label: 'Home', icon: <Home fontSize='small' /> },
  { label: 'Prompt', icon: <Edit fontSize='small' /> },
  { label: 'Notes', icon: <NoteAdd fontSize='small' /> },
  { label: 'Translate', icon: <Translate fontSize='small' /> },
  { label: 'Glossary', icon: <Book fontSize='small' /> },
];

const TabsSection: React.FC<TabsSectionProps> = ({ value, onTabChange }) => {
  return (
    <Box
      sx={{
        width: 'fit-content',
        height: '100%',
        backgroundColor: Blue.Blue7,
        display: 'flex',
        flexDirection: 'column',
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
          '& .MuiTabs-indicator': {
            display: 'none',
          },
        }}
      >
        {tabData.map((tab, index) => (
          <Tab
            key={index}
            // label={tab.label}
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
      </Tabs>
    </Box>
  );
};

export default TabsSection;
