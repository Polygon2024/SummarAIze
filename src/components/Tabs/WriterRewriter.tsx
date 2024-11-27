import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { writeText, storeWrittenText } from '../../services/write';
import WriteEntry, { Format, Length, Tone } from '../../interface/WriteEntry.type';

const WriterRewriter: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [context, setContext] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tone, setTone] = useState<Tone>('neutral');
  const [format, setFormat] = useState<Format>('plain-text');
  const [length, setLength] = useState<Length>('medium');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  // Load selected text on component mount
  useEffect(() => {
    chrome.storage.local.get('selectedText', (result) => {
      if (result.selectedText) {
        setPrompt(result.selectedText);
        // Optionally remove the stored text after loading
        chrome.storage.local.remove('selectedText');
        // Immediately call the write function with default settings
        handleWrite(result.selectedText, context, tone, format, length);
      }
    });
  }, []);

  const handleWrite = async (
    promptText = prompt,
    contextText = context,
    toneSetting = tone,
    formatSetting = format,
    lengthSetting = length
  ) => {
    if (!promptText.trim()) {
      alert('Please enter a prompt.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const result = await writeText(
        promptText,
        contextText,
        formatSetting,
        toneSetting,
        lengthSetting
      );
      setOutput(result);

      const getPageTitle = async (): Promise<string> => {
        return new Promise((resolve) => {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) {
              resolve('');
              return;
            }
            const activeTab = tabs[0];
            chrome.tabs.sendMessage(
              activeTab.id!,
              { type: 'GET_PAGE_TITLE' },
              (response) => {
                if (chrome.runtime.lastError) {
                  console.error(chrome.runtime.lastError);
                  resolve('');
                } else {
                  resolve(response.title || '');
                }
              }
            );
          });
        });
      };

      // Optional: Store the generated text
      const timestamp = Date.now();
      const pageTitle = await getPageTitle(); // You may need to implement this or provide a value

      await storeWrittenText(
        timestamp,
        pageTitle,
        promptText,
        toneSetting,
        formatSetting,
        lengthSetting,
        result
      );
    } catch (error) {
      console.error('Error during writing process:', error);
      setErrorMessage('An error occurred while generating text.');
    } finally {
      setLoading(false);
    }
  };

  // Function to copy text to the clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setSnackbarSeverity('success');
        setSnackbarMessage('Text copied to clipboard!');
        setOpenSnackbar(true);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
        setSnackbarSeverity('error');
        setSnackbarMessage('Failed to copy text');
        setOpenSnackbar(true);
      });
  };

  // Close Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        padding: 2,
        overflowY: 'auto', // Add scroll if content overflows
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
      <Box sx={{ width: '80%', marginTop: 2 }}>
        <Typography variant='h6'>Advanced Settings:</Typography>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Tone</InputLabel>
          <Select
            value={tone}
            label='Tone'
            onChange={(e) => setTone(e.target.value as Tone)}
          >
            <MenuItem value='neutral'>Neutral</MenuItem>
            <MenuItem value='formal'>Formal</MenuItem>
            <MenuItem value='informal'>Informal</MenuItem>
            {/* Add more tones as needed */}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Format</InputLabel>
          <Select
            value={format}
            label='Format'
            onChange={(e) => setFormat(e.target.value as Format)}
          >
            <MenuItem value='plain-text'>Plain Text</MenuItem>
            <MenuItem value='markdown'>Markdown</MenuItem>
            {/* Add more formats as needed */}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Length</InputLabel>
          <Select
            value={length}
            label='Length'
            onChange={(e) => setLength(e.target.value as Length)}
          >
            <MenuItem value='short'>Short</MenuItem>
            <MenuItem value='medium'>Medium</MenuItem>
            <MenuItem value='long'>Long</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Button
        variant='contained'
        color='primary'
        onClick={() => handleWrite()}
        disabled={loading}
        sx={{ marginTop: 2 }}
      >
        {loading ? 'Rewriting...' : 'Rewrite'}
      </Button>
      <Button variant='text' onClick={() => setDialogOpen(true)}>
        View Original Text
      </Button>
      {errorMessage && (
        <Typography variant='body2' color='error' sx={{ marginTop: 1 }}>
          {errorMessage}
        </Typography>
      )}
      {output && (
        <Box sx={{ width: '80%', marginTop: 2 }}>
          <Typography variant='h6'>Output:</Typography>
          <TextField
            variant='outlined'
            multiline
            rows={6}
            value={output}
            InputProps={{
              readOnly: true,
            }}
            sx={{ width: '100%' }}
          />
          {/* Copy to clipboard IconButton */}
          <Box
            sx={{
              textAlign: 'right',
              mt: '0 !important',
            }}
          >
            <Tooltip title='Copy Content'>
              <IconButton
                size='small'
                onClick={() => copyToClipboard(output)}
                disabled={!output}
              >
                <ContentCopy fontSize='inherit' />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Original Selected Text</DialogTitle>
        <DialogContent>
          <Typography variant='body1'>{prompt}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for copy success */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WriterRewriter;
