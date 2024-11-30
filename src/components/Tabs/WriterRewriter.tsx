import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
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
} from '@mui/material';
import { Close, ContentCopy, Send, Tune } from '@mui/icons-material';
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
  const defaultContexts = [
    'Draft a reply to the message',
    'I am a student of...',
    'Explain the main concept of...',
    'Write a professional email regarding...',
    'Avoid any toxic language and be as constructive as possible.',
    'Rewrite this paragraph in a more formal tone.',
    'Generate a concise summary of the provided text.',
    'Provide constructive feedback on the document.',
    'Suggest improvements to make this more engaging.',
  ];

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
  const [isEditing, setIsEditing] = useState<boolean>(false);

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

  const handleContextChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setContext(event.target.value as string);
    setIsEditing(false);
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
          <>
            {output ? (
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
            ) : (
              <Alert severity='info'>
                Get started by inserting your text content in the field below to
                start rewriting the content
              </Alert>
            )}
          </>
        )}

        {/* Link to copy summarized text */}
        {output && (
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
        )}
      </Stack>

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
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Outer Box with background and padding */}
        <Box
          sx={{
            position: 'relative',
            backgroundColor: darkMode ? Grays.Gray4 : Blue.Blue0,
            px: 1,
            pt: 1,
            pb: 0.5,
            borderRadius: '15px',
            display: 'flex',
            flexDirection: 'column',
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
            placeholder='Enter a content here'
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
          />

          {/* Icon Buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginTop: 0.5,
            }}
          >
            {/* Context Dropdown */}
            {isEditing ? (
              // Editable text field
              <TextField
                fullWidth
                value={context}
                onChange={(e) => setContext(e.target.value)}
                onBlur={() => setIsEditing(false)}
                autoFocus
              />
            ) : (
              // Dropdown with default contexts
              <Select
                fullWidth
                value={context}
                onChange={() => handleContextChange}
                onClick={() => setIsEditing(true)}
                displayEmpty
              >
                {defaultContexts.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
                <MenuItem value={context}>Custom: {context}</MenuItem>
              </Select>
            )}
            {/* </Box> */}

            {/* Settings Icon */}
            <Tooltip title='Writer Settings'>
              <IconButton onClick={() => setShowSumSettings(true)}>
                <Tune />
              </IconButton>
            </Tooltip>

            {/* Send Icon */}
            <Tooltip title='Send'>
              <IconButton disabled={loading} onClick={() => handleRewrite()}>
                <Send />
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
