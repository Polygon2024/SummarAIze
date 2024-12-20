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
  // Choose colors based on darkMode
  const primaryText = darkMode ? Grays.White : Blue.Blue7;
  const primaryBackground = darkMode ? Grays.Gray4 : Blue.Blue0;
  const secondaryBackground = darkMode ? Grays.Gray5 : Blue.Blue1;

  const [loading, setLoading] = useState(true);
  const [latestEntry, setLatestEntry] = useState<LatestEntry>(null);
  const [bulletPoints, setBulletPoints] = useState<string[]>([]);
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
    color: primaryText,
    width: '200px',
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
            backgroundColor: secondaryBackground,
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
  const handleSummarize = async () => {
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

      // Splitting Dot Points of Summaries
      const bulletPoints = parsedResult
        .summary!.split('*')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      setBulletPoints(bulletPoints);
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

            // Splitting Dot Points of Summaries
            const bulletPoints = entry
              .summary!.split('*')
              .map((item) => item.trim())
              .filter((item) => item.length > 0);

            setBulletPoints(bulletPoints);
          }
        } else {
          return;
        }
      } catch (error) {
        console.error('Error retrieving data or summarizing:', error);
        setSnackbarMessage('Error retrieving or summarizing data');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      } finally {
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

        const { openTab } = result;

        // Remove Local Value
        if (openTab && openTab === 'summarizer') {
          await chrome.storage.local.remove([
            'openTab',
            'selectedText',
            'openUrl',
          ]);
        }

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
            color: primaryText,
          }}
        >
          Summarizer
        </Typography>

        {/* Summarized Text Field */}
        {loading ? (
          // Loading
          <Box sx={{ width: '100%' }}>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </Box>
        ) : (
          <>
            {latestEntry && bulletPoints ? (
              // Summarized Content as a List
              <Box
                sx={{
                  p: 2,
                  borderRadius: '15px',
                  backgroundColor: primaryBackground,
                }}
              >
                <ul
                  style={{
                    paddingLeft: '20px',
                    listStyleType: 'disc',
                  }}
                >
                  {bulletPoints.map((point, index) => (
                    <li
                      key={index}
                      style={{
                        marginBottom: '4px',
                        color: primaryText,
                      }}
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </Box>
            ) : (
              <Alert severity='info'>
                Get started by inserting your text content in the field below to
                start summarizing
              </Alert>
            )}
          </>
        )}

        {/* Link to copy summarized text */}
        {latestEntry && bulletPoints && (
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
        {/* Prompt Field and Additional Buttons */}
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
            onChange={handleTextChange}
            value={editableText !== null ? editableText : ''}
            placeholder={'Enter content here'}
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
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginTop: 0.5,
            }}
          >
            {/* Redirect to Article Link */}
            <Tooltip title='Open Article Link'>
              <IconButton
                disabled={!latestEntry || !latestEntry.page}
                onClick={() => {
                  if (latestEntry?.page) {
                    window.open(latestEntry.page, '_blank');
                  }
                }}
              >
                <Launch />
              </IconButton>
            </Tooltip>

            {/* Settings Icon */}
            <Tooltip title='Summarizer Settings'>
              <IconButton onClick={() => setShowSumSettings(true)}>
                <Tune />
              </IconButton>
            </Tooltip>

            {/* Send Icon */}
            <Tooltip title='Send'>
              <IconButton disabled={loading} onClick={handleSummarize}>
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
        {/* Title */}
        <DialogTitle
          sx={{
            color: primaryText,
          }}
        >
          Summarizer Settings
        </DialogTitle>

        <DialogContent>
          {/* Stack Dropdown */}
          <Stack spacing={2} sx={{ alignItems: 'center' }}>
            <Stack spacing={0.5}>
              <Typography
                variant='body2'
                sx={{
                  alignSelf: 'flex-start',
                  color: primaryText,
                }}
              >
                Type:
              </Typography>
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
                      color: primaryText,
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
            </Stack>

            {/* Format Dropdown */}
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
            </Stack>

            {/* Length Dropdown */}
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
          </Stack>
        </DialogContent>

        {/* Save and Close Buttons */}
        <DialogActions sx={{ display: 'flex', m: 'auto' }}>
          <Button
            variant='contained'
            color='success'
            onClick={() => setShowSumSettings(false)}
            sx={{
              backgroundColor: darkMode ? Grays.Gray4 : Blue.Blue5,
              minWidth: '90px',
              flexGrow: 1,
            }}
          >
            Save Settings
          </Button>
          <Button
            variant='contained'
            color='error'
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
