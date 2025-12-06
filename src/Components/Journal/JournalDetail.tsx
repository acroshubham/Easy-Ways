import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  IconButton,
  TextField
} from '@mui/material';
import { JournalEntry } from '../../Types/types';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Edit, Close } from '@mui/icons-material';
import { updateSupabaseJournalEntry } from '../../Utils/SupabaseStorage';

interface JournalDetailProps {
  entry: JournalEntry;
  onClose: () => void;
  onEntryUpdated: (entry: JournalEntry) => void;
}

export const JournalDetail: React.FC<JournalDetailProps> = ({ entry, onClose, onEntryUpdated }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(entry);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(entry);
    setIsEditing(false);
    setSaving(false);
  }, [entry]);

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const updated = await updateSupabaseJournalEntry(draft);
      onEntryUpdated(updated);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating journal entry:', error);
    } finally {
      setSaving(false);
    }
  };

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
      <DialogTitle sx={{ px: isMobile ? 2 : 3, py: isMobile ? 2 : 3, position: 'relative' }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0,
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'flex-start' : 'center' 
        }}>
          <Typography variant="h6" sx={{ color: 'primary.main' }}>
            {isEditing ? 'Editing Entry' : entry.header}
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
            <IconButton
              size="small"
              onClick={() => setIsEditing(prev => !prev)}
              sx={{ ml: 1, color: 'primary.main' }}
            >
              {isEditing ? <Close fontSize="small" /> : <Edit fontSize="small" />}
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {isEditing ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Header"
              value={draft.header}
              onChange={(e) => setDraft({ ...draft, header: e.target.value })}
              fullWidth
            />
            <TextField
              label="Your Thoughts"
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              fullWidth
              multiline
              minRows={6}
            />
          </Box>
        ) : (
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>
            {entry.body}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        {isEditing ? (
          <>
            <Button onClick={() => { setIsEditing(false); setDraft(entry); }} disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving || !draft.header.trim() || !draft.body.trim()}
              sx={{ bgcolor: 'gold', color: 'black' }}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </>
        ) : (
          <Button onClick={onClose} sx={{ color: 'gold' }}>Close</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};