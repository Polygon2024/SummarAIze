import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Blue } from '../../theme/color';

interface AIPromptFieldProps {
  content?: string;
  name?: string;
}

const SelectedText: React.FC<AIPromptFieldProps> = ({ content }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', maxWidth: '80%' }}>
      {/* Displayed Text */}
      <Card sx={{ backgroundColor: Blue.Blue4 }}>
        {/* AI's response */}
        <CardContent
          sx={{
            textAlign: 'left',
          }}
        >
          <Typography variant='body1'>{content}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SelectedText;
