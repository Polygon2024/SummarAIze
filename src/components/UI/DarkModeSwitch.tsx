import React from 'react';
import { Box, IconButton } from '@mui/material';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Grays } from '../../theme/color';
import { useThemeContext } from '../../context/ThemeContext';

// Dark Mode Switch to change the colours of the page
const DarkModeSwitch: React.FC = () => {
  const { darkMode, toggleDarkMode } = useThemeContext();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton onClick={toggleDarkMode}>
        {darkMode ? (
          <LightModeIcon />
        ) : (
          <ModeNightIcon sx={{ color: Grays.White }} />
        )}
      </IconButton>
    </Box>
  );
};

export default DarkModeSwitch;
