import React, { useState, useEffect } from 'react';
import {
  Stack,
  FormGroup,
  FormControlLabel,
  Switch,
  MenuItem,
  Select,
  FormControl,
  SelectChangeEvent,
  FormHelperText,
  Alert,
  Snackbar,
  Box,
  CircularProgress,
} from '@mui/material';
import supportedLanguages from '../data/supportedLanguages';
import { getUserSettings, updateUserSettings } from '../services/setting';

const SettingsDialog: React.FC = () => {
  // Snackbar state for success or error messages
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success'
  );

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Loading state for fetching user settings
  const [loading, setLoading] = useState(true);

  // State for translation switch and preferred language
  const [translationOn, setTranslationOn] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState<string>('en');

  // Handle language change
  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const {
      target: { value },
    } = event;
    setPreferredLanguage(value);
    // Update user settings with the new language
    updateUserSettings({ preferredLanguage: value });
    // Optionally show a success snackbar for the language change
    setSnackbarMessage('Preferred language updated successfully!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  // Handle translation toggle
  const handleTranslationToggle = () => {
    const newTranslationState = !translationOn;
    setTranslationOn(newTranslationState);
    // Update user settings with the new translation state
    updateUserSettings({ translationOn: newTranslationState });
    setSnackbarMessage('Translation preference updated successfully!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  // useEffect to fetch user settings on initial load
  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const userSettings = await getUserSettings();
        setTranslationOn(userSettings.translationOn);
        setPreferredLanguage(userSettings.preferredLanguage);
      } catch (error) {
        console.log('Error Loading User Settings: ', error);
      } finally {
        setLoading(false); // Set loading to false after fetching is done
      }
    };

    fetchUserSettings();
  }, []);

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack
      spacing={2}
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Translation Switch */}
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={translationOn}
              onChange={handleTranslationToggle}
            />
          }
          label='Enable Translation'
        />
      </FormGroup>

      {/* Language Dropdown */}
      <FormControl>
        <Select
          value={preferredLanguage}
          onChange={handleLanguageChange}
          sx={{
            width: '200px',
          }}
        >
          {Object.entries(supportedLanguages).map(([code, name]) => (
            <MenuItem key={code} value={code}>
              {name}
              {/* Display the language name, value is the language code */}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Preferred Language</FormHelperText>
      </FormControl>

      {/* Snackbar for Success/Error Messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default SettingsDialog;
