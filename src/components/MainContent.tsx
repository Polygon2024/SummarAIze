import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Blue } from '../theme/color'; // Assuming you have a theme set up

const MainContent: React.FC = () => {
  return (
    <Box
      sx={{
        width: '600px',
        height: '100vh',
        backgroundColor: Blue.Blue0,
        marginLeft: '60px',
        padding: '20px',
      }}
    >
      <Typography
        variant='h4'
        gutterBottom
      >
        SummarAIze Chrome Extension
      </Typography>
      <Button
        variant='contained'
        color='primary'
      >
        Summarize Page
      </Button>
    </Box>
  );
};

export default MainContent;
