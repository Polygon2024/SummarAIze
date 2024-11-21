import React from 'react';
import { Typography, Box } from '@mui/material';

const Guide: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Typography variant='h1'>Guide</Typography>
    </Box>
  );
};

export default Guide;
