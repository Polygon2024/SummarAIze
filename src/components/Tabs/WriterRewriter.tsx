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
  SelectChangeEvent,
  InputAdornment,
  InputLabel,
} from '@mui/material';
import {
  Check,
  Close,
  ContentCopy,
  Edit,
  Send,
  Tune,
} from '@mui/icons-material';
import { writeText } from '../../services/write';
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
  const { darkMode } = useThemeContext();
  // Choose colors based on darkMode
  const primaryText = darkMode ? Grays.White : Blue.Blue7;
  const primaryBackground = darkMode ? Grays.Gray4 : Blue.Blue0;

  const [defaultContexts, setDefaultContexts] = useState<string[]>([
    'Rewrite this paragraph in simpler words',
    'Write your own context...',
    'Draft a reply to the message',
    'I am a student of...',
    'Explain the main concept of...',
    'Write a professional email regarding...',
    'Avoid any toxic language and be as constructive as possible.',
    'Rewrite this paragraph in a more formal tone.',
    'Provide constructive feedback on the document.',
    'Suggest improvements to make this more engaging.',
  ]);

  const [context, setContext] = useState<string>(defaultContexts[0]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [customContext, setCustomContext] = useState<string>('');
  const [contextEnabled, setContextEnabled] = useState<boolean>(true);

  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'info'
  >('success');
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
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
    color: primaryText,
    width: '160px',
    height: '28px',
    backgroundColor: primaryBackground,
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none', // Removes the outline
    },
  };

  const MenuProps = {
    PaperProps: {
      sx: {
        backgroundColor: primaryBackground,
        '& .MuiMenuItem-root': {
          color: primaryText,
          '&:hover': {
            backgroundColor: darkMode ? Grays.Gray5 : Blue.Blue1,
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
            let initContext;
            switch (openTab) {
              case 'replyMessage':
                initContext = 'Draft a reply to the message';
                break;
              default:
                initContext = 'Rewrite this paragraph in simpler words';
            }
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
        }
      } catch (error) {
        console.error('Error retrieving data or summarizing:', error);
        setSnackbarMessage('Error retrieving or summarizing data');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      } finally {
        // Get selected text from local storage
        const result = await new Promise<any>((resolve, reject) => {
          chrome.storage.local.get(['selectedText', 'openTab'], (result) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            }
            resolve(result);
          });
        });

        const { openTab } = result;

        // Remove Local Value
        if (openTab && ['replyMessage', 'rewriteText'].includes(openTab)) {
          await chrome.storage.local.remove(['openTab', 'selectedText']);
        }
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
        writerFormat,
        writerTone,
        writerLength
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

  // Handle context change
  const handleContextChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    setContext(selectedValue);
  };

  // Editting Context Values
  const handleEdit = (index: number) => {
    setEditIndex(index);
    setCustomContext(defaultContexts[index]);
    setIsEditing(true);
  };

  // Saving New Editted Context Values
  const handleSave = () => {
    if (editIndex !== null) {
      const updatedContexts = [...defaultContexts];
      updatedContexts[editIndex] = customContext;
      setDefaultContexts(updatedContexts);
      setContext(customContext);
    }
    setIsEditing(false);
    setEditIndex(null);
  };

  // Cancel Editting
  const handleCancel = () => {
    setIsEditing(false);
    setEditIndex(null);
  };

  // Context Toggler
  // const handleToggle = () => {
  //   setContextEnabled(!contextEnabled);
  // };

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
            color: primaryText,
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
                  backgroundColor: primaryBackground,
                  '& .MuiInputBase-input': {
                    color: primaryText,
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

      {/* Bottom section */}
      <Stack
        spacing={0.5}
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {contextEnabled && (
          <>
            {isEditing ? (
              // Editable Content
              <TextField
                fullWidth
                variant='outlined'
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
                InputProps={{
                  endAdornment: (
                    // Save and Cancel Buttons
                    <InputAdornment position='end'>
                      <IconButton onClick={handleSave}>
                        <Check />
                      </IconButton>
                      <IconButton onClick={handleCancel}>
                        <Close />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                autoFocus
                sx={{
                  width: '100%',
                  justifySelf: 'flex-start',
                }}
              />
            ) : (
              <FormControl fullWidth>
                {/* Label for the Select */}
                <InputLabel
                  id='context-label'
                  sx={{
                    '&.Mui-focused': {
                      transform: 'translate(4.5px, -8px) scale(0.75)',
                    },
                  }}
                >
                  Context
                </InputLabel>

                {/* Dropdown Options */}
                <Select
                  labelId='context-label'
                  label='Context'
                  value={context}
                  onChange={handleContextChange}
                  renderValue={(selected) => selected}
                  sx={{
                    width: 'fit-content',
                    color: primaryText,
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: darkMode ? Grays.Gray4 : Grays.White,
                        '& .MuiMenuItem-root': {
                          color: primaryText,
                          '&:hover': {
                            backgroundColor: darkMode
                              ? Grays.Gray5
                              : Blue.Blue1,
                          },
                        },
                      },
                    },
                  }}
                >
                  {defaultContexts.map((option, index) => (
                    <MenuItem
                      key={index}
                      value={option}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{option}</span>
                      <IconButton onClick={() => handleEdit(index)}>
                        <Edit fontSize='small' />
                      </IconButton>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </>
        )}

        {/* Outer Box with background and padding */}
        <Box
          sx={{
            position: 'relative',
            backgroundColor: primaryBackground,
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
            placeholder='Enter content here'
            id='prompt'
            sx={{
              backgroundColor: primaryBackground,
              width: '100%',
              '& .MuiInputBase-root': {
                borderRadius: '15px',
              },
              '& .MuiInputBase-input': {
                color: primaryText,
              },
              // Removes the border
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            }}
          />

          {/* Icon Buttons */}
          <Box
            sx={{
              display: 'flex',
              // justifyContent: 'space-between',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginTop: 0.5,
              width: '100%',
            }}
          >
            {/* Context Switch */}
            {/* <Tooltip title='Toggle Context Option'>
              <Box sx={{ display: 'flex' }}>
                <Keyboard sx={{ alignSelf: 'center' }} />
                <Switch
                  checked={contextEnabled}
                  onChange={handleToggle}
                  inputProps={{ 'aria-label': 'context toggle' }}
                />
              </Box>
            </Tooltip> */}

            {/* Settings and Send Buttons */}
            <Box sx={{ display: 'flex' }}>
              <Tooltip title='Writer Settings'>
                <IconButton onClick={() => setShowSumSettings(true)}>
                  <Tune />
                </IconButton>
              </Tooltip>
              <Tooltip title='Send'>
                <IconButton disabled={loading} onClick={() => handleRewrite()}>
                  <Send />
                </IconButton>
              </Tooltip>
            </Box>
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
        <DialogTitle
          sx={{
            color: primaryText,
          }}
        >
          Writer Settings
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ alignItems: 'center' }}>
            <Stack spacing={0.5}>
              <Typography
                variant='body2'
                sx={{
                  alignSelf: 'flex-start',
                  color: primaryText,
                }}
              >
                Tone:
              </Typography>
              <FormControl>
                <Select
                  labelId='writer-type-select-label'
                  id='writer-type-select'
                  value={writerTone}
                  onChange={(e) =>
                    setWriterTone(e.target.value as AIWriterTone)
                  }
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
            </Stack>

            <Stack spacing={0.5}>
              <Typography
                variant='body2'
                sx={{
                  alignSelf: 'flex-start',
                  color: primaryText,
                }}
              >
                Format:
              </Typography>
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
            </Stack>

            <Stack spacing={0.5}>
              <Typography
                variant='body2'
                sx={{
                  alignSelf: 'flex-start',
                  color: primaryText,
                }}
              >
                Length:
              </Typography>
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
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            m: 'auto',
          }}
        >
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
