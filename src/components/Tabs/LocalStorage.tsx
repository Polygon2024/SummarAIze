import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  IconButton,
  TextField,
  Tooltip,
  CircularProgress,
  Link,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ArrowDropDown,
  Check,
  Close,
  ContentCopy,
  Delete,
  Edit,
  OpenInNew,
  Sync,
} from '@mui/icons-material';
import { Blue, Grays } from '../../theme/color';
import AlertMessage from '../UI/AlertMessage';
import DataEntry from '../../interface/DataEntry.type';
import { useThemeContext } from '../../context/ThemeContext';

const LocalStorage: React.FC = () => {
  const { darkMode } = useThemeContext();

  // TODO: Testing
  // const [allEntries, setAllEntries] = useState<DataEntry[]>([
  //   {
  //     page: 'https://mui.com/material-ui/material-icons/?query=open',
  //     text:
  //       'Welcome to the platform. This is your first step to exploring AI-powered features.',
  //     timestamp: 123,
  //     languageDetected: 'en',
  //     title: 'Getting Started',
  //     summary: '* First dot point * Second dot point * Third dot point',
  //     translatedText:
  //       'Chào mừng đến với nền tảng. Đây là bước đầu tiên của bạn để khám phá các tính năng AI.',
  //     isSynced: false,
  //   },
  //   {
  //     page: 'https://mui.com/material-ui/material-icons/?query=open',
  //     text: 'Learn about integrating AI into your workflows seamlessly.',
  //     timestamp: 1234,
  //     languageDetected: 'en',
  //     title: 'AI Integration',
  //     summary: '* First dot point * Second dot point * Third dot point',
  //     translatedText:
  //       'Tìm hiểu cách tích hợp AI vào quy trình làm việc của bạn một cách liền mạch.',
  //     isSynced: false,
  //   },
  //   {
  //     page: 'https://mui.com/material-ui/material-icons/?query=open',
  //     text: 'Learn about integrating AI into your workflows seamlessly.',
  //     timestamp: 1234,
  //     languageDetected: 'en',
  //     title: 'AI Integration',
  //     summary: '* First dot point * Second dot point * Third dot point',
  //     translatedText:
  //       'Tìm hiểu cách tích hợp AI vào quy trình làm việc của bạn một cách liền mạch.',
  //     isSynced: false,
  //   },
  // ]);
  const [allEntries, setAllEntries] = useState<DataEntry[]>([]);
  const [editingTitle, setEditingTitle] = useState<number | null>(null);
  const [editingTitleValue, setEditingTitleValue] = useState<string>('');
  const [toggleRefresh, setToggleRefresh] = useState<boolean>(true);

  const [loading, setLoading] = useState(true);

  // State for alerts
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<
    'error' | 'info' | 'success' | 'warning'
  >('info');
  // Close alert handler
  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  function isValidDataEntry(entry: any): entry is DataEntry {
    // Check if required fields exist
    if (
      typeof entry.page === 'string' &&
      typeof entry.text === 'string' &&
      typeof entry.timestamp === 'number'
    ) {
      return true;
    }
    return false;
  }

  // Fetch all data from local storage
  useEffect(() => {
    async function getAllEntries() {
      setLoading(true);
      try {
        const items = await chrome.storage.local.get(null);
        const entries = Object.values(items);

        // Validate the entries
        const validEntries = entries.filter(isValidDataEntry);

        setAllEntries(validEntries);
      } catch (error) {
        console.error('Error retrieving entries:', error);
        setAlertMessage('Error retrieving entries.');
        setAlertSeverity('error');
        setAlertOpen(true);
      } finally {
        setLoading(false);
      }
    }

    getAllEntries();
  }, [toggleRefresh]);

  // Edit Title of Data Entry
  const handleEditTitle = (timestamp: number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (editingTitle === timestamp) {
      setEditingTitle(null);
    } else {
      setEditingTitle(timestamp);
      const entry = allEntries.find((entry) => entry.timestamp === timestamp);
      if (entry && entry.title) setEditingTitleValue(entry.title);
    }
  };

  // Cancel Editing Title
  const handleCancelEdit = () => {
    setEditingTitle(null);
  };

  /// Save Edited Title
  const handleSaveTitle = async (timestamp: number, newTitle: string) => {
    setLoading(true);
    try {
      // Retrieve the current entry from Chrome Storage
      const result = await chrome.storage.local.get(timestamp.toString());

      if (!result[timestamp]) {
        throw new Error('Entry not found in storage.');
      }

      // Update the title of the retrieved entry
      const updatedEntry = {
        ...result[timestamp.toString()],
        title: newTitle,
      };

      // Save the updated entry back to Chrome Storage
      await chrome.storage.local.set({
        [timestamp.toString()]: updatedEntry,
      });

      // Show success alert
      setToggleRefresh(!toggleRefresh);
      setAlertMessage('Title updated successfully.');
      setAlertSeverity('success');
      setAlertOpen(true);

      // Trigger a re-fetch of the data by calling useEffect again
      // This will refresh the entries when useEffect is triggered
    } catch (error) {
      console.error('Error saving title:', error);
      setAlertMessage('Error saving title.');
      setAlertSeverity('error');
      setAlertOpen(true);
    } finally {
      setEditingTitle(null);
      setLoading(false);
    }
  };

  // Sync Data Entry to Storage
  const handleSyncEntry = async (
    timestamp: number,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    try {
      // Ensure the timestamp is converted to a string for proper key usage
      const result = await chrome.storage.local.get(timestamp.toString());

      // Update the synced value of the retrieved entry
      const updatedEntry = {
        ...result[timestamp.toString()],
        isSynced: true,
      };

      // Save the updated entry back to Chrome Storage
      await chrome.storage.local.set({
        [timestamp.toString()]: updatedEntry,
      });

      if (result[timestamp.toString()]) {
        const entryToSync = result[timestamp.toString()];

        // Use chrome.storage.sync.set to save the entry in sync storage
        await chrome.storage.sync.set({
          [timestamp.toString()]: entryToSync,
        });

        setAlertMessage('Entry synced to storage.');
        setAlertSeverity('success');
        setAlertOpen(true);
      } else {
        setAlertMessage('Entry not found in local storage.');
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    } catch (error) {
      console.error('Error syncing entry:', error);
      setAlertMessage('Error syncing entry.');
      setAlertSeverity('error');
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Deletion of Data Entry
  const handleDeleteEntry = async (
    timestamp: number,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    try {
      setLoading(true);

      // Delete the entry from Chrome Storage
      await chrome.storage.local.remove(timestamp.toString());
      setToggleRefresh(!toggleRefresh);
      setAlertMessage('Entry deleted successfully.');
      setAlertSeverity('success');
      setAlertOpen(true);
    } catch (error) {
      console.error('Error deleting entry:', error);
      setAlertMessage('Error deleting entry.');
      setAlertSeverity('error');
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Loading Spinner
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress disableShrink />
      </Box>
    );
  }

  return (
    <>
      {/* Success / Error Alert */}
      <AlertMessage
        open={alertOpen}
        message={alertMessage}
        severity={alertSeverity}
        onClose={handleAlertClose}
      />

      {allEntries.length !== 0 ? (
        <Stack spacing={2}>
          {/* DataEntry List */}

          {allEntries.map((entry) => (
            <Accordion
              key={entry.timestamp}
              sx={{
                border: 'none',
                boxShadow: 'none',
                backgroundColor: darkMode ? Grays.Gray4 : Blue.Blue0,
                '&::before': {
                  display: 'none',
                },
              }}
            >
              {/* DataEntry Accordion Heading */}
              <AccordionSummary expandIcon={<ArrowDropDown />}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      border: 'none',
                    }}
                  >
                    {/* Title */}
                    <TextField
                      variant='standard'
                      value={
                        editingTitle === entry.timestamp
                          ? editingTitleValue
                          : entry.title
                      }
                      disabled={editingTitle !== entry.timestamp}
                      onChange={(e) => setEditingTitleValue(e.target.value)}
                      InputProps={{
                        sx: {
                          color: darkMode
                            ? `${Grays.White} !important`
                            : `${Blue.Blue7} !important`,
                          '&.Mui-disabled': {
                            color: darkMode ? Grays.White : Blue.Blue7, // Ensure disabled text has the same color
                          },
                        },
                      }}
                    />

                    {/* Edit / Save / Cancel Buttons */}
                    {editingTitle === entry.timestamp ? (
                      <>
                        {/* Save Button */}
                        <Tooltip title='Save Entry Title'>
                          <IconButton
                            onClick={() =>
                              handleSaveTitle(
                                entry.timestamp,
                                editingTitleValue
                              )
                            }
                          >
                            <Check fontSize='small' />
                          </IconButton>
                        </Tooltip>

                        {/* Cancel Button */}
                        <Tooltip title='Cancel Edit'>
                          <IconButton onClick={handleCancelEdit}>
                            <Close fontSize='small' />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      // Edit Button
                      <Tooltip title='Edit Entry Title'>
                        <IconButton
                          onClick={(event) =>
                            handleEditTitle(entry.timestamp, event)
                          }
                        >
                          <Edit fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>

                  {/* Sync and Delete Options */}
                  <Box>
                    <Tooltip
                      title={
                        entry.isSynced
                          ? 'Data Entry is already Synced'
                          : 'Sync Data Entry'
                      }
                    >
                      {/* Sync Data to Storage */}
                      <IconButton
                        onClick={
                          entry.isSynced
                            ? () => {}
                            : (event) => handleSyncEntry(entry.timestamp, event)
                        }
                      >
                        <Sync
                          fontSize='small'
                          color={entry.isSynced ? 'success' : 'info'}
                        />
                      </IconButton>
                    </Tooltip>

                    {/* Delete to Data Entry */}
                    <Tooltip title='Delete Data Entry'>
                      <IconButton
                        onClick={(event) =>
                          handleDeleteEntry(entry.timestamp, event)
                        }
                      >
                        <Delete fontSize='small' />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {/* Expanded Accordion - DataEntry Details */}
                <TextDetails DataEntry={entry} />
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            height: '100%',
            gap: '30px',
          }}
        >
          <Typography sx={{ color: darkMode ? Grays.White : Blue.Blue7 }}>
            There are no Data Entries Available at the moment. Please use the
            Summarize Feature to add data to the storage.
          </Typography>
        </Box>
      )}
    </>
  );
};

// Text Details
const TextDetails: React.FC<{
  DataEntry: DataEntry;
}> = ({ DataEntry }) => {
  const { darkMode } = useThemeContext();
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success'
  );
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  // Close Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Splitting Dot Points of Summaries
  const bulletPoints = DataEntry.summary!.split('*')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  // Function to copy text to the clipboard
  const handleCopyOriginal = (text: string, event: React.MouseEvent) => {
    event.stopPropagation();

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

  // Function to copy text to the clipboard
  const handleCopyTranslation = (text: string, event: React.MouseEvent) => {
    event.stopPropagation();

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

  return (
    <Stack spacing={1}>
      {/* Grouping Introduction and Description */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          textAlign: 'left',
          borderRadius: '15px',
          mt: 2,
          gap: 2,
        }}
      >
        {DataEntry.page !== '' && (
          <Typography sx={{ color: darkMode ? Grays.White : Blue.Blue7 }}>
            <Tooltip title={DataEntry.page}>
              <Link
                href={DataEntry.page}
                target='_blank'
                sx={{
                  color: darkMode ? Blue.Blue4 : Blue.Blue6,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <OpenInNew />
                <strong>Click to Open Article Link</strong>
              </Link>
            </Tooltip>
          </Typography>
        )}

        <Stack spacing={1}>
          {/* List Display of Summaries */}
          <Typography
            sx={{ color: darkMode ? Grays.White : Blue.Blue7 }}
            variant='h6'
          >
            <strong>Summaries:</strong>
          </Typography>

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
                  color: darkMode ? Grays.White : Blue.Blue7,
                }}
              >
                {point}
              </li>
            ))}
          </ul>
        </Stack>

        {/* Nested Accordion for Original Text */}
        <Accordion
          sx={{
            boxShadow: 'none',
            border: 'none',
            borderRadius: '5px',
            m: '0 !important',
            backgroundColor: darkMode ? Grays.Gray5 : Blue.Blue1,
            '&::before': {
              display: 'none',
            },
          }}
        >
          <AccordionSummary expandIcon={<ArrowDropDown />}>
            <Typography sx={{ color: darkMode ? Grays.White : Blue.Blue7 }}>
              <strong> Orignal Text</strong>
            </Typography>
            <Tooltip title='Copy Content'>
              <IconButton
                size='small'
                onClick={(event) => handleCopyOriginal(DataEntry.text, event)}
                disabled={!DataEntry.text}
                sx={{ ml: 1 }}
              >
                <ContentCopy fontSize='inherit' />
              </IconButton>
            </Tooltip>
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ color: darkMode ? Grays.White : Blue.Blue7 }}>
              {DataEntry.text}
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Nested Accordion for Translated Text */}
        {DataEntry.translatedText !== '' && (
          <Accordion
            sx={{
              borderRadius: '5px',
              boxShadow: 'none',
              backgroundColor: darkMode ? Grays.Gray5 : Blue.Blue1,
              '&::before': {
                display: 'none',
              },
            }}
          >
            <AccordionSummary expandIcon={<ArrowDropDown />}>
              <Typography sx={{ color: darkMode ? Grays.White : Blue.Blue7 }}>
                <strong>Translation of Orignal Text</strong>
              </Typography>
              <Tooltip title='Copy Content'>
                <IconButton
                  size='small'
                  onClick={(event) =>
                    handleCopyTranslation(DataEntry.translatedText!, event)
                  }
                  disabled={!DataEntry.translatedText}
                  sx={{ ml: 1 }}
                >
                  <ContentCopy fontSize='inherit' />
                </IconButton>
              </Tooltip>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: darkMode ? Grays.White : Blue.Blue7 }}>
                {DataEntry.translatedText}
              </Typography>
            </AccordionDetails>
          </Accordion>
        )}
      </Box>

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

export default LocalStorage;
