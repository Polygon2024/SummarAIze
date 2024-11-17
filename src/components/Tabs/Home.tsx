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
} from '@mui/material';
import SelectedText from '../Prompt/SelectedText';
import { Launch, Send, Sync } from '@mui/icons-material';

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

  const SummariserDropdownStyle = {
    width: '140px',
    height: '28px',
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
      } catch (error) {
        console.error('Error retrieving latest entry:', error);
      }
    }

    getLatestEntry();
  }, []);

  return (
    <Stack
      spacing={1}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
      }}
    >
      {/* Dropdowns for AISummarizerType, AISummarizerFormat, AISummarizerLength */}
      <Typography variant='body1'>Summarizer Options</Typography>

      <Box sx={{ display: 'flex', gap: 0.5, width: '100%' }}>
        {/* AISummarizerType Dropdown */}
        <FormControl fullWidth>
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

        {/* AISummarizerFormat Dropdown */}
        <FormControl fullWidth>
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

        {/* AISummarizerLength Dropdown */}
        <FormControl fullWidth>
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
      </Box>

      <SelectedText />

      <Stack
        spacing={0.5}
        sx={{
          width: '100%',
        }}
      >
        {/* Input Text Field */}
        <TextField
          fullWidth
          multiline
          maxRows={2}
          variant='outlined'
          value={latestEntry !== null ? latestEntry.text : ''}
          placeholder={'Enter a paragraph here'}
          id='prompt'
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
            <Tooltip title='Sync summaries'>
              <IconButton disabled={latestEntry === null}>
                <Sync />
              </IconButton>
            </Tooltip>
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
          </Box>

          {/* Right-aligned Summarise icon */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title='Summarise'>
              <IconButton>
                <Send />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
};

export default Home;
