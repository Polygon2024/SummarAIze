import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  ArrowDropDown,
  Check,
  Close,
  Delete,
  DeleteOutline,
  Edit,
  ReportGmailerrorred,
  Sync,
} from '@mui/icons-material';
import { Blue } from '../../theme/color';
import AlertMessage from '../UI/AlertMessage';
import DataEntry from '../../interface/DataEntry.type';

const LocalStorage: React.FC = () => {
  const [allEntries, setAllEntries] = useState<DataEntry[]>([]);
  const [editingTitle, setEditingTitle] = useState<number | null>(null);
  const [editingTitleValue, setEditingTitleValue] = useState<string>('');
  const [toggleRefresh, setToggleRefresh] = useState<boolean>(true);

  // TODO: Testing
  // const [allEntries, setAllEntries] = useState<DataEntry[]>([
  //   {
  //     page: 'Introduction',
  //     text:
  //       'Welcome to the platform. This is your first step to exploring AI-powered features.',
  //     timestamp: new Date().toISOString(), // Current timestamp in ISO 8601 format
  //     languageDetected: 'en',
  //     title: 'Getting Started',
  //     summary: "An overview of the platform's introduction.",
  //     translatedText:
  //       'Chào mừng đến với nền tảng. Đây là bước đầu tiên của bạn để khám phá các tính năng AI.',
  //   },
  //   {
  //     page: 'Advanced Topics',
  //     text: 'Learn about integrating AI into your workflows seamlessly.',
  //     timestamp: new Date(Date.now() - 86400000).toISOString(), // Timestamp for one day ago
  //     languageDetected: 'en',
  //     title: 'AI Integration',
  //     summary: 'A detailed guide on AI integration.',
  //     translatedText:
  //       'Tìm hiểu cách tích hợp AI vào quy trình làm việc của bạn một cách liền mạch.',
  //   },
  // ]);

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
    console.log('Entries', entry);
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
      const result = await chrome.storage.local.get(timestamp.toString()); // Ensure timestamp is a string

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
        <>
          {/* DataEntry List */}

          {allEntries.map((entry) => (
            <Accordion
              defaultExpanded
              key={entry.timestamp}
              sx={{
                border: 'none',
                boxShadow: 'none',
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
                        onClick={(event) =>
                          handleSyncEntry(entry.timestamp, event)
                        }
                        disabled={entry.isSynced}
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
        </>
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
          <Typography>
            There are no Data Entries Available at the moment. Please use the
            Summarise Feature to add data to the storage.
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
  // Successful and Error Snackbar Alert State
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success'
  );
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Confirmation dialog states
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Double Check on Removal Confirmations
  const handleRemove = () => {
    setConfirmDialogOpen(true);
  };

  // Function to remove an data entry
  const confirmRemove = async () => {};

  // TODO: ?? Edit Button
  const handleEdit = async () => {};

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
        <Typography>
          <strong>Original Text:</strong> {DataEntry.text}
        </Typography>
        <Typography>
          <strong>URL Link:</strong> {DataEntry.page}
        </Typography>
        <Typography>
          <strong>Summaries:</strong> {DataEntry.summary}
        </Typography>

        {/* Nested Accordion for Translated Text */}
        {DataEntry.translatedText !== '' && (
          <Accordion
            sx={{
              boxShadow: 'none',
              border: '1px solid',
              borderColor: Blue.Blue5,
              borderRadius: '15px',
              '&:before': {
                display: 'none',
              },
            }}
          >
            <AccordionSummary expandIcon={<ArrowDropDown />}>
              <Typography>
                <strong>Translated Orignal Text</strong>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{DataEntry.translatedText}</Typography>
            </AccordionDetails>
          </Accordion>
        )}
      </Box>

      {/* Snackbar for Success/Error */}
      <AlertMessage
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />

      {/* Confirmation Dialog for Deletion */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>
          <Box display='flex' alignItems='center'>
            <ReportGmailerrorred color='error' sx={{ marginRight: 1 }} />
            Confirm Deletion
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography>Confirm Deletion of Data Entry</Typography>
            <Typography>This action is irreversible!</Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            color='info'
            onClick={() => setConfirmDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={confirmRemove}
            endIcon={<DeleteOutline />}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default LocalStorage;
