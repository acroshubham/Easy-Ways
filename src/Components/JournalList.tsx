import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { JournalEntry, Category } from '../Types/types';

interface JournalListProps {
  entries: JournalEntry[];
  categories: Category[];
  onEntryClick: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
}

export const JournalList: React.FC<JournalListProps> = ({
  entries,
  categories,
  onEntryClick,
  onDeleteEntry
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | false>(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean, entryId?: string }>({ open: false });

  const getEntriesByCategory = (categoryName: string) => {
    return entries.filter(entry => entry.category === categoryName);
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.entryId) {
      onDeleteEntry(deleteDialog.entryId);
    }
    setDeleteDialog({ open: false });
  };

  return (
    <>
      <Box sx={{ mt: 4 }}>
        {categories.map((category) => {
          const categoryEntries = getEntriesByCategory(category.name);
          if (categoryEntries.length === 0) return null;

          return (
            <Accordion 
              key={category.id}
              expanded={expandedCategory === category.id}
              onChange={() => setExpandedCategory(expandedCategory === category.id ? false : category.id)}
              sx={{ 
                mb: 2,
                '&:before': { display: 'none' },
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" sx={{ color: 'gold' }}>
                  {category.name} ({categoryEntries.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {categoryEntries.map((entry) => (
                    <Paper 
                      key={entry.id} 
                      elevation={2}
                      onClick={() => onEntryClick(entry)}
                      sx={{ 
                        p: 2,
                        position: 'relative',
                        cursor: 'pointer',
                        '&:hover': { boxShadow: 3 }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6">{entry.header}</Typography>
                        <Box>
                          <Chip 
                            label={entry.date} 
                            size="small" 
                            sx={{ mr: 1, bgcolor: 'gold', color: 'white' }}
                          />
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteDialog({ open: true, entryId: entry.id });
                            }}
                            sx={{ color: 'red' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                      <Typography variant="body1">
                        {entry.body.substring(0, 100)}...
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false })}
        sx={{ '& .MuiPaper-root': { borderRadius: '12px', padding: '16px', minWidth: '300px' } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ textAlign: 'center' }}>
            Are you sure you want to delete this journal entry?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
          <Button onClick={() => setDeleteDialog({ open: false })} variant="contained" color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
