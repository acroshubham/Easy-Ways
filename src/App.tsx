import { useState, useEffect } from 'react';
import { Calendar } from './Components/Calendar/Calendar';
import { JournalEntry } from './Components/Journal/Journal';
import { DailyMotivation } from './Components/Motivation/DailyMotivation';
import { NavBar } from './Components/NavBar/NavBar';
import { Emergency } from './Components/Emergency/Emergency';
import { EmergencyButton } from './Components/Emergency/EmergencyButton';
import { getDailyProgress, calculateStreak } from './Utils/Storage';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme/theme';
import './App.css';

function AppContent() {
  const [currentView, setCurrentView] = useState<'calendar' | 'journal' | 'motivation' | 'emergency'>('calendar');
  const [progress, setProgress] = useState(getDailyProgress());
  const [streak, setStreak] = useState(calculateStreak());
  const { isDark } = useTheme();

  useEffect(() => {
    setStreak(calculateStreak());
  }, [progress]);

  const handleProgressUpdate = () => {
    setProgress(getDailyProgress());
  };

  return (
    <MUIThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <div className="app">
        <NavBar 
          currentView={currentView}
          setCurrentView={setCurrentView}
          streak={streak}
        />
        <main className="main-content">
          {currentView === 'calendar' && (
            <div className="calendar-container">
              <div className="banner">
                <h2>Create Your Own Success Story</h2>
                <p>Every mark on this calendar represents Victory! Dare to explore the mightiest Oceans. Keep pushing yourself. </p>
              </div>
              <Calendar progress={progress} onProgressUpdate={handleProgressUpdate} />
              <EmergencyButton onClick={() => setCurrentView('emergency')} />
            </div>
          )}
          {currentView === 'emergency' && <Emergency onClose={() => setCurrentView('calendar')} />}
          {currentView === 'journal' && (
            <JournalEntry />
          )}
          {currentView === 'motivation' && (
            <DailyMotivation />
          )}
        </main>
      </div>
    </MUIThemeProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;