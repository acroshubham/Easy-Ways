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
import { JournalEntry } from '../../Types/types';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

interface JournalDetailProps {
  entry: JournalEntry;
  onClose: () => void;
}

export const JournalDetail: React.FC<JournalDetailProps> = ({ entry, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog 
      open={true} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          bgcolor: theme.palette.background.paper,
          backgroundImage: 'none',
          m: isMobile ? 0 : 2,
          borderRadius: isMobile ? 0 : 2
        }
      }}
    >
      <DialogTitle sx={{ px: isMobile ? 2 : 3, py: isMobile ? 2 : 3 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0,
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'flex-start' : 'center' 
        }}>
          <Typography variant="h6" sx={{ color: 'primary.main' }}>
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