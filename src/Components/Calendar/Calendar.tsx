import React from 'react';
import { DailyProgress } from '../../Types/types';
import { saveDailyProgress } from '../../Utils/Storage';
// MUI components & icons
import { 
  Box,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Fade,
  styled,
  useTheme
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Cancel,
  LocalFireDepartment,
  Close
} from '@mui/icons-material';

interface CalendarProps {
  progress: DailyProgress[];
  onProgressUpdate: () => void;
}

// Styled components
const CalendarCell = styled(Box)(({ theme }) => ({
  width: '100%',
  paddingTop: '100%', // Makes cell square
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.2s ease-in-out',
  cursor: 'pointer',
  backgroundColor: theme.palette.calendar.cellBg,
  '&:hover': {
    transform: 'scale(1.05)',
    backgroundColor: theme.palette.calendar.cellHoverBg,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    transition: 'all 0.2s ease-in-out',
  },
  '&.success::after': {
    backgroundColor: theme.palette.calendar.successOverlay,
  },
  '&.failure::after': {
    backgroundColor: theme.palette.calendar.failureOverlay,
  },
}));

const CellContent = styled(Box)(({ }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
  '& .status-icon': {
    position: 'absolute',
    fontSize: '1.5rem',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[8],
  transition: 'background-color 0.3s ease',
}));

export const Calendar: React.FC<CalendarProps> = ({ progress, onProgressUpdate }) => {
  const theme = useTheme();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = React.useState(today.getMonth());
  const [currentYear, setCurrentYear] = React.useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [openOptionDialog, setOpenOptionDialog] = React.useState(false);
  const [openResultDialog, setOpenResultDialog] = React.useState(false);
  const [resultDialogTitle, setResultDialogTitle] = React.useState('');
  const [resultDialogContent, setResultDialogContent] = React.useState('');

  const motivationalQuotes = [
    "Keep pushing forward! 🚀",
    "You're doing great! ⭐",
    "Success is on the horizon! 🌅",
    "Amazing work, keep it up! 💪",
    "The future is bright, continue the journey! ✨"
  ];

  const calculateStreak = () => {
    let streak = 0;
    const sortedProgress = [...progress].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayStr = today.toISOString().split('T')[0];
    const hasTodayEntry = sortedProgress.find(
      p => p.date === todayStr && p.status === 'success'
    );
    
    if (!hasTodayEntry) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      const hasYesterdayEntry = sortedProgress.find(
        p => p.date === yesterdayStr && p.status === 'success'
      );
      if (!hasYesterdayEntry) {
        return 0; 
      }
    }
        let currentDate = new Date(today);
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const entry = sortedProgress.find(p => p.date === dateStr);
      
      if (entry && entry.status === 'success') {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        // If we don't have an entry for today but have one for yesterday,
        // we'll count back from yesterday
        if (!hasTodayEntry && streak === 0) {
          currentDate.setDate(currentDate.getDate() - 1);
          continue;
        }
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = calculateStreak();

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };
  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleCalendarCellClick = (date: string) => {
    const existingProgress = progress.find(p => p.date === date);
    if (existingProgress && (existingProgress.status === 'success' || existingProgress.status === 'failure')) {
      const resetProgress: DailyProgress = { date, completed: false, status: '' };
      saveDailyProgress(resetProgress);
      onProgressUpdate();
      return;
    }
    setSelectedDate(date);
    setOpenOptionDialog(true);
  };

  const handleOption = (status: 'success' | 'failure') => {
    if (!selectedDate) return;
    const newProgress: DailyProgress = {
      date: selectedDate,
      status: status,
      completed: status === 'success'
    };
    saveDailyProgress(newProgress);
    onProgressUpdate();
    setOpenOptionDialog(false);

    if (status === 'success') {
      setResultDialogTitle("Congratulations! 🎉");
      const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
      setResultDialogContent(randomQuote);
    } else {
      setResultDialogTitle("Keep Going! 💪");
      setResultDialogContent("Every setback is a setup for a comeback! Keep pushing forward.");
    }
    setOpenResultDialog(true);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <Box key={`empty-${i}`} sx={{ width: '100%', paddingTop: '100%' }} />
      );
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
      const progressEntry = progress.find(p => p.date === date);
      const isSuccess = progressEntry?.status === 'success';
      const isFailure = progressEntry?.status === 'failure';
      const isToday = date === today.toISOString().split('T')[0];

      days.push(
        <Fade in key={date}>
          <CalendarCell
            onClick={() => handleCalendarCellClick(date)}
            className={isSuccess ? 'success' : isFailure ? 'failure' : ''}
            sx={{
              border: isToday ? `2px solid ${theme.palette.primary.main}` : 'none',
            }}
          >
            <CellContent>
              <Typography variant="body2" sx={{ fontWeight: isToday ? 'bold' : 'normal' }}>
                {day}
              </Typography>
              {isSuccess && (
                <CheckCircle 
                  className="status-icon"
                  sx={{ color: theme.palette.success.main }} 
                />
              )}
              {isFailure && (
                <Cancel 
                  className="status-icon"
                  sx={{ color: theme.palette.error.main }} 
                />
              )}
            </CellContent>
          </CalendarCell>
        </Fade>
      );
    }
    return days;
  };

  return (
    <StyledPaper elevation={3}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Progress Calendar
          </Typography>
          <Chip
            icon={<LocalFireDepartment sx={{ color: theme.palette.warning.main }} />}
            label={`${currentStreak} Day${currentStreak === 1 ? '' : 's'} Streak`}
            color="primary"
            variant="outlined"
            sx={{ 
              borderRadius: '16px',
              '& .MuiChip-label': {
                fontWeight: 'bold'
              }
            }}
          />
        </Box>
        
        {/* Month Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton onClick={handlePreviousMonth}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6">
            {new Date(currentYear, currentMonth).toLocaleString('default', {
              month: 'long',
              year: 'numeric'
            })}
          </Typography>
          <IconButton onClick={handleNextMonth}>
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      {/* Calendar Grid */}
      <Box sx={{ width: '100%' }}>
        {/* Weekday Headers */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 1,
          mb: 1
        }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Typography 
              key={day} 
              variant="subtitle2" 
              sx={{ 
                textAlign: 'center',
                color: theme.palette.text.secondary,
                fontWeight: 'medium'
              }}
            >
              {day}
            </Typography>
          ))}
        </Box>

        {/* Calendar Days */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 1
        }}>
          {renderCalendar()}
        </Box>
      </Box>

      {/* Option Dialog */}
      <Dialog 
        open={openOptionDialog} 
        onClose={() => setOpenOptionDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: theme.shape.borderRadius * 2,
            minWidth: '320px'
          }
        }}
      >
        <DialogTitle sx={{ pr: 6 }}>
          Update Progress for {selectedDate}
          <IconButton
            aria-label="close"
            onClick={() => setOpenOptionDialog(false)}
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

      {/* Result Dialog */}
      <Dialog 
        open={openResultDialog} 
        onClose={() => setOpenResultDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: theme.shape.borderRadius * 2
          }
        }}
      >
        <DialogTitle>{resultDialogTitle}</DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ textAlign: 'center', py: 2 }}>
            {resultDialogContent}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResultDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </StyledPaper>
  );
};