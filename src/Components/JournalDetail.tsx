import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip
} from '@mui/material';
import { JournalEntry } from '../Types/types';

interface JournalDetailProps {
  entry: JournalEntry;
  onClose: () => void;
}

export const JournalDetail: React.FC<JournalDetailProps> = ({ entry, onClose }) => {
  return (
    <Dialog 
      open={true} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: 'gold' }}>
            {entry.header}
          </Typography>
          <Box>
            <Chip 
              label={entry.date} 
              size="small" 
              sx={{ mr: 1, bgcolor: 'gold', color: 'white' }}
            />
            <Chip 
              label={entry.category} 
              size="small" 
              sx={{ bgcolor: 'rgba(250, 248, 237, 0.9)', color: 'gold' }}
            />
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
          {entry.body}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: 'gold' }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};