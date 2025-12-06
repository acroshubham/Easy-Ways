import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Button, 
  Typography, 
  Box,
  IconButton
} from '@mui/material';
import { Close, Google } from '@mui/icons-material';
import { useUser } from '../../context/UserContext';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const { loginWithGoogle } = useUser();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      onClose();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          padding: 2,
          minWidth: '320px',
          maxWidth: '400px'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h5" fontWeight="bold">
          Welcome Back!
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          <Typography variant="body1" color="text.secondary" align="center">
            Sign in to sync your progress, save your journal, and keep your streak alive!
          </Typography>

          <Button
            variant="outlined"
            size="large"
            startIcon={<Google />}
            onClick={handleGoogleLogin}
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover'
              }
            }}
          >
            Continue with Google
          </Button>

          <Typography variant="caption" color="text.disabled" align="center">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
