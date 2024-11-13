import React from 'react';
import { Typography, Box } from '@mui/material';

const Translate: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Typography variant='h1'>Translate</Typography>
    </Box>
  );
};

export default Translate;
