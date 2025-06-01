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
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { JournalEntry, Category } from '../../Types/types';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expandedCategory, setExpandedCategory] = useState<string | false>(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean, entryId?: string }>({ open: false });

  const getEntriesByCategory = (categoryName: string) => {
    return entries
      .filter(entry => entry.category === categoryName)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.entryId) {
      onDeleteEntry(deleteDialog.entryId);
    }
    setDeleteDialog({ open: false });
  };

  return (
    <>
      <Box sx={{ mt: isMobile ? 2 : 4 }}>
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
                bgcolor: theme.palette.background.paper,
                backdropFilter: 'blur(10px)',
                borderRadius: '8px !important',
                overflow: 'hidden'
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                sx={{ 
                  px: isMobile ? 2 : 3,
                  py: isMobile ? 1 : 2
                }}
              >
                <Typography variant="h6" sx={{ color: 'primary.main' }}>
                  {category.name} ({categoryEntries.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 1 : 2 }}>
                  {categoryEntries.map((entry) => (
                    <Paper 
                      key={entry.id} 
                      elevation={2}
                      onClick={() => onEntryClick(entry)}
                      sx={{ 
                        p: isMobile ? 1.5 : 2,
                        position: 'relative',
                        cursor: 'pointer',
                        '&:hover': { boxShadow: 3 }
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: isMobile ? 'column' : 'row',
                        justifyContent: 'space-between', 
                        alignItems: isMobile ? 'flex-start' : 'center', 
                        mb: 1 
                      }}>
                        <Typography 
                          variant={isMobile ? "subtitle1" : "h6"}
                          sx={{ mb: isMobile ? 1 : 0 }}
                        >
                          {entry.header}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip 
                            label={entry.date} 
                            size="small" 
                            sx={{ 
                              mr: 1,
                              bgcolor: 'gold',
                              color: 'white',
                              fontSize: isMobile ? '0.75rem' : '0.875rem'
                            }}
                          />
                          <IconButton 
                            size={isMobile ? "small" : "medium"}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteDialog({ open: true, entryId: entry.id });
                            }}
                            sx={{ color: 'red' }}
                          >
                            <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
                          </IconButton>
                        </Box>
                      </Box>
                      <Typography 
                        variant={isMobile ? "body2" : "body1"}
                        sx={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {entry.body.substring(0, isMobile ? 50 : 100)}...
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
          <Button onClick={() => setDeleteDialog({ open: false })} variant="contained">
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
