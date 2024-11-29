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
  Stack,
  Skeleton,
  InputAdornment,
} from '@mui/material';
import { Close, ContentCopy, Launch, Send, Tune } from '@mui/icons-material';
import { writeText } from '../../services/write';
import { Format, Length, Tone } from '../../interface/WriteEntry.type';
import { Blue, Grays } from '../../theme/color';
import { useThemeContext } from '../../context/ThemeContext';

enum AIWriterTone {
  'formal' = 'formal',
  'neutral' = 'neutral',
  'casual' = 'casual',
}

enum AIWriterFormat {
  'plain-text' = 'plain-text',
  'markdown' = 'markdown',
}

enum AIWriterLength {
  'short' = 'short',
  'medium' = 'medium',
  'long' = 'long',
}

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
  const { darkMode } = useThemeContext();
  const [showSumSettings, setShowSumSettings] = useState<boolean>(false);
  const [writerTone, setWriterTone] = useState<AIWriterTone>(
    AIWriterTone['neutral']
  );
  const [writerFormat, setWriterFormat] = useState<AIWriterFormat>(
    AIWriterFormat['plain-text']
  );
  const [writerLength, setWriterLength] = useState<AIWriterLength>(
    AIWriterLength['medium']
  );

  const WriterDropdownStyle = {
    width: '160px',
    height: '28px',
    backgroundColor: darkMode ? Grays.Gray4 : Blue.Blue0,
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none', // Removes the outline
    },
  };

  const MenuProps = {
    PaperProps: {
      sx: {
        backgroundColor: darkMode ? Grays.Gray4 : Grays.White, // Background color of the dropdown
        '& .MuiMenuItem-root': {
          color: darkMode ? Grays.White : Blue.Blue7, // Text color of dropdown items
          '&:hover': {
            backgroundColor: darkMode ? Grays.Gray5 : Blue.Blue1, // Hover background color
          },
        },
      },
    },
  };

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
    <Stack
      spacing={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        width: '100%',
      }}
    >
      {/* Top section */}
      <Stack spacing={1}>
        {/* Title */}
        <Typography
          variant='h4'
          sx={{
            width: '100%',
            textAlign: 'center',
            color: darkMode ? Grays.White : Blue.Blue7,
          }}
        >
          Writer/Rewriter
        </Typography>
        {/* Written Content Text Field */}
        {loading ? (
          // Loading
          <Box sx={{ width: '100%' }}>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </Box>
        ) : (
          // Rewritten Content
          <TextField
            fullWidth
            multiline
            maxRows={8}
            variant='outlined'
            value={output ? output : ''}
            id='summarized'
            sx={{
              backgroundColor: darkMode ? Grays.Gray4 : Blue.Blue0,
              '& .MuiInputBase-input': {
                color: darkMode ? Grays.White : Blue.Blue7,
                opacity: 1,
              },
              '& textarea': {
                // Hides the typing indicator (caret) for multiline TextField
                caretColor: 'transparent',
              },
            }}
          />
        )}

        {/* Link to copy summarized text */}
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
      </Stack>

      {/* Prompt Field */}
      {/* <TextField
        label='Prompt'
        variant='outlined'
        multiline
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        sx={{
          width: '80%',
          marginBottom: 2,
          backgroundColor: darkMode ? Grays.Gray4 : Blue.Blue0,
        }}
      /> */}

      {/* Context Field */}
      {/* <TextField
        label='Context'
        variant='outlined'
        multiline
        rows={4}
        value={context}
        onChange={(e) => setContext(e.target.value)}
        sx={{
          width: '80%',
          marginBottom: 2,
          backgroundColor: darkMode ? Grays.Gray4 : Blue.Blue0,
        }}
      /> */}

      {/* Bottom section */}
      <Stack
        spacing={0.5}
        sx={{
          display: 'absolute',
          bottom: 0,
        }}
      >
        {/* Input Text Field */}
        <TextField
          fullWidth
          multiline
          maxRows={3}
          variant='outlined'
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          placeholder={'Enter a paragraph here'}
          id='prompt'
          sx={{
            backgroundColor: darkMode ? Grays.Gray4 : Blue.Blue0,
            width: '100%',
            '& .MuiInputBase-root': {
              borderRadius: '15px',
            },
            '& .MuiInputBase-input': {
              color: darkMode ? Grays.White : Blue.Blue7,
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <Tooltip title='Summarize'>
                  <IconButton
                    disabled={loading}
                    onClick={() => handleRewrite()}
                  >
                    <Send />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />

        {/* Icon Buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* Left-aligned icons */}
          <Box sx={{ display: 'flex' }}>
            {/* Toggle Writer Settings */}
            <Tooltip title='Writer Settings'>
              <IconButton
                onClick={() => setShowSumSettings(true)}
                color='primary'
              >
                <Tune />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Stack>

      {/* Dialog for Summarizer Settings */}
      <Dialog
        open={showSumSettings}
        onClose={() => setShowSumSettings(false)}
        PaperProps={{
          sx: {
            backgroundColor: darkMode ? Grays.Gray6 : Grays.White,
          },
        }}
      >
        <DialogTitle sx={{ color: darkMode ? Grays.White : Blue.Blue7 }}>
          Writer Settings
        </DialogTitle>
        <DialogContent>
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
            }}
          >
            <FormControl>
              <Select
                labelId='writer-type-select-label'
                id='writer-type-select'
                value={writerTone}
                onChange={(e) => setWriterTone(e.target.value as AIWriterTone)}
                sx={WriterDropdownStyle}
                MenuProps={MenuProps}
              >
                {Object.values(AIWriterTone).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <Select
                labelId='writer-format-select-label'
                id='writer-format-select'
                value={writerFormat}
                onChange={(e) =>
                  setWriterFormat(e.target.value as AIWriterFormat)
                }
                sx={WriterDropdownStyle}
                MenuProps={MenuProps}
              >
                {Object.values(AIWriterFormat).map((format) => (
                  <MenuItem key={format} value={format}>
                    {format}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <Select
                labelId='writer-length-select-label'
                id='writer-length-select'
                value={writerLength}
                onChange={(e) =>
                  setWriterLength(e.target.value as AIWriterLength)
                }
                sx={WriterDropdownStyle}
                MenuProps={MenuProps}
              >
                {Object.values(AIWriterLength).map((length) => (
                  <MenuItem key={length} value={length}>
                    {length}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', m: 'auto' }}>
          <Button
            variant='contained'
            onClick={() => setShowSumSettings(false)}
            sx={{
              backgroundColor: darkMode ? Grays.Gray4 : Blue.Blue5,
              minWidth: '90px',
              flexGrow: 1,
            }}
          >
            Save
          </Button>
          <Button
            variant='contained'
            onClick={() => setShowSumSettings(false)}
            sx={{
              backgroundColor: darkMode ? Grays.Gray4 : Blue.Blue5,
              width: 'fit-content',
            }}
          >
            <Close />
          </Button>
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
    </Stack>
  );
};

export default WriterRewriter;
