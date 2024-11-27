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
import { writeText } from '../../services/write';
import { Format, Length, Tone } from '../../interface/WriteEntry.type';

const WriterRewriter: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [context, setContext] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [format, setFormat] = useState<Format>('plain-text');
  const [tone, setTone] = useState<Tone>('neutral');
  const [length, setLength] = useState<Length>('medium');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'info'
  >('success');
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  // Load selected text on component mount
  useEffect(() => {
    const handleWrite = async () => {
      setLoading(true);

      try {
        // Get selected text from local storage
        const result = await new Promise<any>((resolve, reject) => {
          chrome.storage.local.get(['selectedText', 'openTab'], (result) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            }
            resolve(result);
          });
        });

        const { selectedText, openTab } = result;

        if (openTab && ['replyMessage', 'rewriteText'].includes(openTab)) {
          if (selectedText) {
            // Defining the Context Basing on the Context Menu Action
            setPrompt(selectedText);
            const initContext =
              openTab === 'replyMessage'
                ? 'Draft reply message'
                : openTab === 'rewriteText'
                ? ''
                : '';
            setContext(initContext);

            // Exit Early if context doesn't exist
            if (!initContext) {
              setSnackbarMessage(
                'Please add the context value before generating new content'
              );
              setSnackbarSeverity('info');
              setOpenSnackbar(true);
              return;
            }

            // Rewrite the text
            const rewriteOutput = await writeText(selectedText, initContext);
            setOutput(rewriteOutput);
          }

          // Remove Local Storage of Data
          await chrome.storage.local.remove([
            'openTab',
            'selectedText',
            'openUrl',
          ]);
        }
      } catch (error) {
        console.error('Error retrieving data or summarizing:', error);
        setSnackbarMessage('Error retrieving or summarizing data');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    handleWrite();
  }, []);

  // Rewriting Content Functions
  const handleRewrite = async () => {
    setLoading(true);
    try {
      const rewriteOutput = await writeText(
        prompt,
        context,
        format,
        tone,
        length
      );
      setOutput(rewriteOutput);
    } catch (error) {
      console.error('Error with Rewriter API:', error);
      setSnackbarMessage('Error with Rewriter API');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
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
        overflowY: 'auto',
      }}
    >
      {/* Title */}
      <Typography variant='h4' gutterBottom>
        Writer/Rewriter
      </Typography>
      {/* Prompt Field */}
      <TextField
        label='Prompt'
        variant='outlined'
        multiline
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        sx={{ width: '80%', marginBottom: 2 }}
      />
      {/* Context Field */}
      <TextField
        label='Context'
        variant='outlined'
        multiline
        rows={4}
        value={context}
        onChange={(e) => setContext(e.target.value)}
        sx={{ width: '80%', marginBottom: 2 }}
      />
      {/* API Settings */}
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
      {/* Execute Buttons */}
      <Button
        variant='contained'
        color='primary'
        onClick={() => handleRewrite()}
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

      {/* Output Displays */}
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

      {/* Displays of Original Text */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Original Selected Text</DialogTitle>
        <DialogContent>
          <Typography variant='body1'>{prompt}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbars */}
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
