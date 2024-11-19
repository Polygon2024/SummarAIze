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
} from '@mui/material';
import {
  ArrowDropDown,
  Delete,
  DeleteOutline,
  Edit,
  ReportGmailerrorred,
  Sync,
} from '@mui/icons-material';
import { Blue } from '../../theme/color';
import AlertMessage from '../UI/AlertMessage';
import DataEntry from '../../interface/dataEntry.type';

const LocalStorage: React.FC = () => {
  // const [allEntries, setAllEntries] = useState<DataEntry[]>([]);

  // TODO: Testing
  const [allEntries, setAllEntries] = useState<DataEntry[]>([
    {
      page: 'Introduction',
      text:
        'Welcome to the platform. This is your first step to exploring AI-powered features.',
      timestamp: new Date().toISOString(), // Current timestamp in ISO 8601 format
      languageDetected: 'en',
      title: 'Getting Started',
      summary: "An overview of the platform's introduction.",
      translatedText:
        'Chào mừng đến với nền tảng. Đây là bước đầu tiên của bạn để khám phá các tính năng AI.',
    },
    {
      page: 'Advanced Topics',
      text: 'Learn about integrating AI into your workflows seamlessly.',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // Timestamp for one day ago
      languageDetected: 'en',
      title: 'AI Integration',
      summary: 'A detailed guide on AI integration.',
      translatedText:
        'Tìm hiểu cách tích hợp AI vào quy trình làm việc của bạn một cách liền mạch.',
    },
  ]);

  const [pageLoading, setPageLoading] = useState(true);

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

  // Fetch all data from local storage
  useEffect(() => {
    async function getAllEntries() {
      try {
        const items = await chrome.storage.local.get(null);
        const entries = Object.values(items);

        if (entries.length === 0) {
          console.log('No entries found in local storage.');
          return;
        }

        console.log('Entries retrieved:', entries);
        setAllEntries(entries);
      } catch (error) {
        console.error('Error retrieving entries:', error);
      }
    }

    getAllEntries();
  }, []);

  // Edit Title of Data Entry
  const handleEditTitle = (timestamp: string) => {};

  // Sync Data Entry to Storage
  const handleSyncEntry = (timestamp: string) => {};

  // Deletion of Data Entry
  const handleDeleteEntry = (timestamp: string) => {};

  return (
    <Box>
      {/* Success / Error Alert */}
      <AlertMessage
        open={alertOpen}
        message={alertMessage}
        severity={alertSeverity}
        onClose={handleAlertClose}
      />

      {/* Display a Button instead of There are no Asignments */}
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
                    <TextField variant='standard' value={entry.title} />

                    {/* Edit Title */}
                    <Tooltip title='Edit Entry Title'>
                      <IconButton
                        onClick={() => handleEditTitle(entry.timestamp)}
                      >
                        <Edit fontSize='small' />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {/* Sync and Delete Options */}
                  <Box>
                    {/* Sync Data to Storage */}
                    <Tooltip title='Sync Data Entry'>
                      <IconButton
                        onClick={() => handleSyncEntry(entry.timestamp)}
                      >
                        <Sync fontSize='small' />
                      </IconButton>
                    </Tooltip>

                    {/* Delete to Data Entry */}
                    <Tooltip title='Delete Data Entry'>
                      <IconButton
                        onClick={() => handleDeleteEntry(entry.timestamp)}
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
    </Box>
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
