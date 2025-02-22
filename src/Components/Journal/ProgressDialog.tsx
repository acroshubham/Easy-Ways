import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import { CheckCircle, Cancel, Close } from '@mui/icons-material';
import { saveDailyProgress } from '../../Utils/Storage';
import { DailyProgress } from '../../Types/types';

interface ProgressDialogProps {
  open: boolean;
  onClose: () => void;
  selectedDate: string | null;
  onProgressUpdate: () => void;
}

export const ProgressDialog: React.FC<ProgressDialogProps> = ({
  open,
  onClose,
  selectedDate,
  onProgressUpdate,
}) => {
  const [showResultDialog, setShowResultDialog] = React.useState(false);
  const [resultMessage, setResultMessage] = React.useState('');

  const motivationalQuotes = [
    "Keep pushing forward! 🚀",
    "You're doing great! ⭐",
    "Success is on the horizon! 🌅",
    "Amazing work, keep it up! 💪",
    "The future is bright, continue the journey! ✨"
  ];

  const handleOption = (status: 'success' | 'failure') => {
    if (!selectedDate) return;
    
    const newProgress: DailyProgress = {
      date: selectedDate,
      status: status,
      completed: status === 'success'
    };
    
    saveDailyProgress(newProgress);
    onProgressUpdate();
    
    // Show result message
    if (status === 'success') {
      setResultMessage(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    } else {
      setResultMessage("Every setback is a setup for a comeback! Keep pushing forward.");
    }
    setShowResultDialog(true);
  };

  return (
    <>
      <Dialog 
        open={open && !showResultDialog} 
        onClose={onClose}
        PaperProps={{
          sx: {
            borderRadius: 4,
            width: '400px',
            maxWidth: '90vw'
          }
        }}
      >
        <DialogTitle sx={{ pr: 6 }}>
          Update Progress for {selectedDate}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircle />}
              onClick={() => handleOption('success')}
              sx={{ py: 1.5 }}
            >
              Freaking on the way
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<Cancel />}
              onClick={() => handleOption('failure')}
              sx={{ py: 1.5 }}
            >
              Will come back strong next time
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog 
        open={showResultDialog} 
        onClose={() => {
          setShowResultDialog(false);
          onClose();
        }}
        PaperProps={{
          sx: {
            borderRadius: 4,
            width: '400px',
            maxWidth: '90vw'
          }
        }}
      >
        <DialogTitle>
          {resultMessage.includes('comeback') ? 'Keep Going! 💪' : 'Congratulations! 🎉'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ textAlign: 'center', py: 2 }}>
            {resultMessage}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowResultDialog(false);
            onClose();
          }} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};