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
  Link,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from '@mui/material';
import {
  Close,
  ContentCopy,
  DownloadForOffline,
  Launch,
  Send,
  Sync,
  Tune,
} from '@mui/icons-material';

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
  timestamp: number;
  page: string;
  summary: string;
} | null;

const testContent = `A complex issue Climate change impacts our society in many different ways. Drought can harm food production and human health. Flooding can lead to spread of disease, death, and damage ecosystems and infrastructure. Human health issues that result from drought, flooding, and other weather conditions increase the death rate, change food availability, and limit how much a worker can get done, and ultimately the productivity of our economy. Climate change affects everyone, but the impacts are uneven across the country and around the world. Even within one community, climate change can affect one neighborhood or person more than another. Long-standing differences in income and opportunity, or socioeconomic inequalities, can make some groups more vulnerable. Communities that have less access to resources to protect themselves or cope with impacts are often the same communities that are also more exposed to hazards.
`;

const Home: React.FC = () => {
  const [model, setModel] = useState<any>([]);
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(false);

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

  const [showSumSettings, setShowSumSettings] = useState<boolean>(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success'
  );
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const SummariserDropdownStyle = {
    width: '140px',
    height: '28px',
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

  useEffect(() => {
    // Function to get the latest entry based on timestamp
    async function getLatestEntry() {
      try {
        const items = await chrome.storage.local.get(null);
        const entries = Object.values(items);

        if (entries.length === 0) {
          console.log('No entries found in local storage.');
          return;
        }

        // Sort entries by timestamp in descending order to get the latest one
        entries.sort((a, b) => b.timestamp - a.timestamp);
        const latest = entries[0];

        console.log('Latest entry retrieved:', latest);
        setLatestEntry(latest);
        setEditableText(latest.text);
      } catch (error) {
        console.error('Error retrieving latest entry:', error);
      }
    }

    getLatestEntry();
  }, []);

  return (
    <Stack
      spacing={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      {/* Top section */}
      <Stack spacing={1}>
        {/* Title */}
        <Typography
          variant='h6'
          sx={{
            width: '100%',
            textAlign: 'center',
            textDecoration: 'underline',
          }}
        >
          Summarizer
        </Typography>
        {/* Summarised Text Field */}
        <TextField
          fullWidth
          multiline
          maxRows={8}
          variant='outlined'
          value={latestEntry ? latestEntry.summary : ''}
          id='summarized'
          sx={{
            '& textarea': {
              // Hides the typing indicator (caret) for multiline TextField
              caretColor: 'transparent',
            },
          }}
        />

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
            borderRadius: '15px',
            width: '100%',
            '& .MuiInputBase-root': {
              borderRadius: '15px',
            },
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
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {/* TODO: Syncing Summary  */}
            <Tooltip title='Sync summaries'>
              <IconButton disabled={latestEntry === null}>
                <Sync />
              </IconButton>
            </Tooltip>

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

          {/* Right-aligned Summarise icon */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {/* Download Document */}
            <Tooltip title='Download as Word Document'>
              <IconButton>
                <DownloadForOffline />
              </IconButton>
            </Tooltip>

            {/* AI Summarising */}
            <Tooltip title='Summarise'>
              <IconButton>
                <Send />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Stack>

      {/* Dialog for Summarizer Settings */}
      <Dialog open={showSumSettings} onClose={() => setShowSumSettings(false)}>
        <DialogTitle>Summarizer Settings</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ alignItems: 'center' }}>
            <FormControl>
              <Select
                labelId='summarizer-type-select-label'
                id='summarizer-type-select'
                value={summarizerType}
                onChange={(e) =>
                  setSummarizerType(e.target.value as AISummarizerType)
                }
                sx={SummariserDropdownStyle}
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
                sx={SummariserDropdownStyle}
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
                sx={SummariserDropdownStyle}
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

export default Home;
