import React, { useState } from 'react';
import { Typography, Box, TextField, Button } from '@mui/material';
import { writeText } from '../../services/write';

const WriterRewriter: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [context, setContext] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleWrite = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const result = await writeText(prompt, context);

      setOutput(result);
    } catch (error) {
      console.error('Error during writing process:', error);
      setErrorMessage('An error occurred while generating text.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        padding: 2,
      }}
    >
      <Typography variant='h4' gutterBottom>
        Writer/Rewriter
      </Typography>
      <TextField
        label='Prompt'
        variant='outlined'
        multiline
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        sx={{ width: '80%', marginBottom: 2 }}
      />
      <TextField
        label='Context'
        variant='outlined'
        multiline
        rows={4}
        value={context}
        onChange={(e) => setContext(e.target.value)}
        sx={{ width: '80%', marginBottom: 2 }}
      />
      <Button
        variant='contained'
        color='primary'
        onClick={handleWrite}
        disabled={loading}
      >
        {loading ? 'Writing...' : 'Write'}
      </Button>
      {errorMessage && (
        <Typography variant='body2' color='error' sx={{ marginTop: 1 }}>
          {errorMessage}
        </Typography>
      )}
      {output && (
        <Box sx={{ width: '80%', marginTop: 2 }}>
          <Typography variant='h6'>Output:</Typography>
          <Typography variant='body1'>{output}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default WriterRewriter;
