import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { JournalEntry as JournalEntryType, Category } from '../../Types/types';
import { saveJournalEntry, getJournalEntries, getCategories, saveCategory, deleteJournalEntry } from '../../Utils/Storage';
import { JournalList } from './JournalList';
import { JournalDetail } from './JournalDetail';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export const JournalEntry: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [date, setDate] = useState('');
  const [header, setHeader] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');
  const [entries, setEntries] = useState<JournalEntryType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntryType | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const savedEntries = getJournalEntries();
    const savedCategories = getCategories();
    setEntries(savedEntries.sort((a: any, b: any) => b.createdAt - a.createdAt));
    setCategories(savedCategories);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) {
      setSnackbar({
        open: true,
        message: 'Please select a category',
        severity: 'error'
      });
      return;
    }

    const newEntry = saveJournalEntry({ date, header, body, category });
    setEntries([newEntry, ...entries]);
    setDate('');
    setHeader('');
    setBody('');
    setCategory('');
    
    setSnackbar({
      open: true,
      message: 'Entry saved successfully!',
      severity: 'success'
    });
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const updatedCategories = saveCategory(newCategory);
      setCategories(updatedCategories);
      setNewCategory('');
      setOpenDialog(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4 }}>
      <Box sx={{ mb: isMobile ? 2 : 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          color: 'primary.main',
          fontWeight: 'bold',
          textAlign: 'center',
          mb: isMobile ? 2 : 4
        }}>
          My Diary
        </Typography>

        <Paper 
          elevation={3} 
          sx={{ 
            p: isMobile ? 2 : 3,
            background: theme.palette.background.paper,
            backdropFilter: 'blur(10px)',
            borderRadius: 2
          }}
        >
          <form onSubmit={handleSubmit}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 2, 
              mb: 3 
            }}>
              <TextField
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                fullWidth
                sx={{ flex: 1 }}
              />
              <Box sx={{ 
                display: 'flex', 
                gap: 1,
                alignItems: 'center'
              }}>
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    label="Category"
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <IconButton 
                  onClick={() => setOpenDialog(true)}
                  sx={{ 
                    color: 'gold',
                    '&:hover': { 
                      color: 'gold',
                      backgroundColor: 'rgba(255, 231, 98, 0.2)'
                    }
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>

            <TextField
              label="Header"
              value={header}
              onChange={(e) => setHeader(e.target.value)}
              required
              fullWidth
              sx={{ mb: 3 }}
            />

            <TextField
              label="Write your thoughts..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              fullWidth
              multiline
              rows={4}
              sx={{ mb: 3 }}
            />

            <Button 
              type="submit" 
              variant="contained"
              sx={{ 
                bgcolor: 'primary.main',
                color: 'text.primary',
                '&:hover': { 
                  bgcolor: 'primary.dark'
                },
                width: '100%',
                py: isMobile ? 1.5 : 2
              }}
            >
              Save Entry
            </Button>
          </form>
        </Paper>
      </Box>

      <JournalList
        entries={entries}
        categories={categories}
        onEntryClick={setSelectedEntry}
        onDeleteEntry={(id) => {
          const updatedEntries = deleteJournalEntry(id);
          setEntries(updatedEntries.sort((a, b) => b.createdAt - a.createdAt));
          if (selectedEntry?.id === id) {
            setSelectedEntry(null);
          }
          setSnackbar({
            open: true,
            message: 'Entry deleted successfully!',
            severity: 'success'
          });
        }}
      />

      {selectedEntry && (
        <JournalDetail
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}

      {/* Add Category Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} sx={{color: 'red'}}>Cancel</Button>
          <Button onClick={handleAddCategory} sx={{ color: 'gold' }}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} 
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity as any}
          sx={{ 
            width: '100%', 
            maxHeight: '150px', 
            overflowY: 'auto', 
            display: 'flex', 
            alignItems: 'center',
            height: '70%'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Container>
  );
};