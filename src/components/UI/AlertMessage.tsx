import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface AlertMessageProps {
  open: boolean;
  message: string;
  severity: 'error' | 'info' | 'success' | 'warning';
  onClose: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  open,
  message,
  severity,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertMessage;
