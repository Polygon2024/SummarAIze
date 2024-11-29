import React, { useEffect, useState } from 'react';
import {
  Box,
  IconButton,
  TextField,
  Stack,
  Tooltip,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Skeleton,
  InputAdornment,
} from '@mui/material';
import { Close, ContentCopy, Launch, Send, Tune } from '@mui/icons-material';
import { handleSummarization } from '../../services/summarize';
import { Blue, Grays } from '../../theme/color';
import { useThemeContext } from '../../context/ThemeContext';

enum AISummarizerType {
  'tl;dr' = 'tl;dr',
  'key-points' = 'key-points',
  'teaser' = 'teaser',
  'headline' = 'headline',
}

enum AISummarizerFormat {
  'plain-text' = 'plain-text',
  'markdown' = 'markdown',
}

enum AISummarizerLength {
  'short' = 'short',
  'medium' = 'medium',
  'long' = 'long',
}

type LatestEntry = {
  text: string;
  page: string;
  summary: string;
} | null;

const Summarize: React.FC = () => {
  const { darkMode } = useThemeContext();
  const [loading, setLoading] = useState(true);
  const [latestEntry, setLatestEntry] = useState<LatestEntry>(null);
  const [summarizerType, setSummarizerType] = useState<AISummarizerType>(
    AISummarizerType['key-points']
  );
  const [summarizerFormat, setSummarizerFormat] = useState<AISummarizerFormat>(
    AISummarizerFormat['markdown']
  );
  const [summarizerLength, setSummarizerLength] = useState<AISummarizerLength>(
    AISummarizerLength['medium']
  );

  const [editableText, setEditableText] = useState<string>('');

  // State for alerts
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success'
  );
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [showSumSettings, setShowSumSettings] = useState<boolean>(false);

  const SummarizerDropdownStyle = {
    width: '140px',
    height: '28px',
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

  // Handler for editable text change
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditableText(event.target.value);
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

  // Summarising Text Input
  const handleSummarise = async () => {
    setLoading(true);
    const pageUrl = '';
    try {
      const summary = await handleSummarization(editableText, pageUrl);
      const parsedResult = {
        text: editableText || '',
        page: pageUrl || '',
        summary: summary || '',
      };
      setLatestEntry(parsedResult);
    } catch (error) {
      console.error('Error Summarising:', error);
      setSnackbarMessage('Error Summarising.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Create the async function inside the useEffect
    const fetchData = async () => {
      setLoading(true);

      try {
        // Get selected text and page URL from local storage
        const result = await new Promise<any>((resolve, reject) => {
          chrome.storage.local.get(
            ['selectedText', 'pageUrl', 'openTab'],
            (result) => {
              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
              }
              resolve(result);
            }
          );
        });

        const { selectedText, pageUrl, openTab } = result;

        if (openTab && openTab === 'summarizer') {
          if (selectedText && pageUrl) {
            setEditableText(selectedText);

            // Summarize the text
            const summary = await handleSummarization(selectedText, pageUrl);
            const entry = {
              text: selectedText || '',
              page: pageUrl || '',
              summary: summary || '',
            };
            setLatestEntry(entry);
            console.log('Remove openTab');
            await chrome.storage.local.remove([
              'openTab',
              'selectedText',
              'openUrl',
            ]);

            console.log('after remove opentab');
          }
        } else {
          // If no selectedText or pageUrl, get the latest entry from local storage
          const items = await chrome.storage.local.get(null);
          const entries = Object.values(items);

          if (entries.length === 0) {
            console.log('No entries found in local storage.');
            return;
          }

          // Sort entries by timestamp in descending order to get the latest one
          entries.sort((a, b) => b.timestamp - a.timestamp);
          const latest = entries[0];

          setLatestEntry(latest);
          setEditableText(latest.text);
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

    fetchData();
  }, []);
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
          Summarizer
        </Typography>
        {/* Summarised Text Field */}
        {loading ? (
          // Loading
          <Box sx={{ width: '100%' }}>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </Box>
        ) : (
          // Summarised Content
          <TextField
            fullWidth
            multiline
            maxRows={8}
            variant='outlined'
            value={latestEntry ? latestEntry.summary : 'Test'}
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
              onClick={() => copyToClipboard(latestEntry!.summary)}
              disabled={!latestEntry}
            >
              <ContentCopy fontSize='inherit' />
            </IconButton>
          </Tooltip>
        </Box>
      </Stack>

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
          onChange={handleTextChange}
          value={editableText !== null ? editableText : ''}
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
                  <IconButton onClick={handleSummarise}>
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
          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
            }}
          >
            {/* Redirect to Article Link */}
            <Tooltip title='Open Article Link'>
              <IconButton
                disabled={latestEntry === null}
                onClick={() => {
                  if (latestEntry?.page) {
                    window.open(latestEntry.page, '_blank');
                  }
                }}
              >
                <Launch />
              </IconButton>
            </Tooltip>

            {/* Toggle Summarizer Settings */}
            <Tooltip title='Summarizer Settings'>
              <Tooltip title='Summarizer Settings'>
                <IconButton
                  onClick={() => setShowSumSettings(true)}
                  color='primary'
                >
                  <Tune />
                </IconButton>
              </Tooltip>
            </Tooltip>
          </Box>

          {/* TODO */}
          {/* Download Document */}
          {/* <Tooltip title='Download as Word Document'>
              <IconButton>
                <DownloadForOffline />
              </IconButton>
            </Tooltip> */}
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
          Summarizer Settings
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
                labelId='summarizer-type-select-label'
                id='summarizer-type-select'
                value={summarizerType}
                onChange={(e) =>
                  setSummarizerType(e.target.value as AISummarizerType)
                }
                sx={{
                  ...SummarizerDropdownStyle,
                  '& .MuiFormControlLabel-label': {
                    color: darkMode ? Grays.White : Blue.Blue7,
                  },
                }}
                MenuProps={MenuProps}
              >
                {Object.values(AISummarizerType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <Select
                labelId='summarizer-format-select-label'
                id='summarizer-format-select'
                value={summarizerFormat}
                onChange={(e) =>
                  setSummarizerFormat(e.target.value as AISummarizerFormat)
                }
                sx={SummarizerDropdownStyle}
                MenuProps={MenuProps}
              >
                {Object.values(AISummarizerFormat).map((format) => (
                  <MenuItem key={format} value={format}>
                    {format}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <Select
                labelId='summarizer-length-select-label'
                id='summarizer-length-select'
                value={summarizerLength}
                onChange={(e) =>
                  setSummarizerLength(e.target.value as AISummarizerLength)
                }
                sx={SummarizerDropdownStyle}
                MenuProps={MenuProps}
              >
                {Object.values(AISummarizerLength).map((length) => (
                  <MenuItem key={length} value={length}>
                    {length}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            color='success'
            onClick={() => setShowSumSettings(false)}
          >
            Save Settings
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={() => setShowSumSettings(false)}
          >
            <Close />
          </Button>
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
    </Stack>
  );
};

export default Summarize;
