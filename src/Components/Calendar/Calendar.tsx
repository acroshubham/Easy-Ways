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
  // DialogActions,
  Button,
  Chip,
  Fade,
  styled,
  useTheme,
  LinearProgress,
  Backdrop
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
  backgroundColor: theme.palette.calendar?.cellBg || theme.palette.grey[100],
  '&:hover': {
    transform: 'scale(1.05)',
    backgroundColor: theme.palette.calendar?.cellHoverBg || theme.palette.grey[200],
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    transition: 'all 0.2s ease-in-out',
  },
  '&.success::after': {
    backgroundColor: theme.palette.calendar?.successOverlay || theme.palette.success.light + '40',
  },
  '&.failure::after': {
    backgroundColor: theme.palette.calendar?.failureOverlay || theme.palette.error.light + '40',
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

const ToastModal = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  top: '20px',
  right: '20px',
  minWidth: '320px',
  maxWidth: '400px',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[12],
  zIndex: 1400,
  transition: 'all 0.3s ease-in-out',
  border: `1px solid ${theme.palette.divider}`,
}));

export const Calendar: React.FC<CalendarProps> = ({ progress, onProgressUpdate }) => {
  const theme = useTheme();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = React.useState(today.getMonth());
  const [currentYear, setCurrentYear] = React.useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [openOptionDialog, setOpenOptionDialog] = React.useState(false);
  const [showToast, setShowToast] = React.useState(false);
  const [toastContent, setToastContent] = React.useState({ title: '', message: '', type: 'success' as 'success' | 'failure' });
  const [progress_bar, setProgressBar] = React.useState(100);

  const motivationalQuotes = [
    "Keep pushing forward! 🚀",
    "You're doing great! ⭐",
    "Success is on the horizon! 🌅",
    "Amazing work, keep it up! 💪",
    "The future is bright, continue the journey! ✨"
  ];

  const failureQuotes = [
    "Every setback is a setup for a comeback! 💪",
    "Fall seven times, stand up eight! 🌟",
    "Today's failure is tomorrow's strength! 💯",
    "Keep going, you're stronger than you think! 🔥",
    "This is just a detour, not a dead end! 🛤️"
  ];

  // Fixed streak calculation
  const calculateStreak = () => {
    let streak = 0;
    const sortedProgress = [...progress]
      .filter(p => p.status === 'success')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (sortedProgress.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayStr = today.toISOString().split('T')[0];
    const hasTodayEntry = sortedProgress.find(p => p.date === todayStr);
    
    let currentDate = new Date(today);
    
    // If no entry for today, start from yesterday
    if (!hasTodayEntry) {
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const entry = sortedProgress.find(p => p.date === dateStr);
      
      if (entry && entry.status === 'success') {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = calculateStreak();

  // Toast auto-dismiss effect
  React.useEffect(() => {
    if (showToast) {
      setProgressBar(100);
      const duration = 4000; // 4 seconds
      const interval = 50; // Update every 50ms
      const decrement = 100 / (duration / interval);
      
      const timer = setInterval(() => {
        setProgressBar(prev => {
          if (prev <= 0) {
            setShowToast(false);
            clearInterval(timer);
            return 0;
          }
          return prev - decrement;
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [showToast]);

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
      // Reset progress for existing entries
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

    // Show toast notification
    if (status === 'success') {
      const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
      setToastContent({
        title: "Congratulations! 🎉",
        message: randomQuote,
        type: 'success'
      });
    } else {
      const randomQuote = failureQuotes[Math.floor(Math.random() * failureQuotes.length)];
      setToastContent({
        title: "Keep Going! 💪",
        message: randomQuote,
        type: 'failure'
      });
    }
    setShowToast(true);
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
    <>
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
              borderRadius:'10px',
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
                Will Never Choose this Path
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </StyledPaper>

      {/* Toast Notification */}
      {showToast && (
        <>
          <Backdrop 
            open={showToast} 
            onClick={() => setShowToast(false)}
            sx={{ zIndex: 1300, backgroundColor: 'transparent' }}
          />
          <Fade in={showToast}>
            <ToastModal
              elevation={8}
              sx={{
                borderLeft: `4px solid ${toastContent.type === 'success' ? theme.palette.success.main : theme.palette.error.main}`
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: toastContent.type === 'success' ? theme.palette.success.main : theme.palette.error.main }}>
                  {toastContent.title}
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => setShowToast(false)}
                  sx={{ mt: -1, mr: -1 }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {toastContent.message}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={progress_bar} 
                sx={{ 
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: theme.palette.grey[200],
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: toastContent.type === 'success' ? theme.palette.success.main : theme.palette.error.main,
                    borderRadius: 2
                  }
                }}
              />
            </ToastModal>
          </Fade>
        </>
      )}
    </>
  );
};