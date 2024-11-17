import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Blue } from '../../theme/color';

interface SummarisedTextProps {
  content?: string;
}

const SummarisedText: React.FC<SummarisedTextProps> = ({ content }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        maxWidth: '100%',
        // backgroundColor: Blue.Blue4,
        border: `1px solid #000`,
        maxHeight: '40%',
        overflow: 'auto',
        padding: 2,
      }}
    >
      <Typography variant='body1'>{content}</Typography>
    </Box>
  );
};

export default SummarisedText;
