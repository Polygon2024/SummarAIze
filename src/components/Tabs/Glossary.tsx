import React from 'react';
import { Typography, Box } from '@mui/material';

const Glossary: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Typography variant='h1'>Glossary</Typography>
    </Box>
  );
};

export default Glossary;
