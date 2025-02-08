import { useState, useEffect } from 'react';
import { Calendar } from './Components/Calendar';
import { JournalEntry } from './Components/Journal';
import { DailyMotivation } from './Components/DailyMotivation';
import { NavBar } from './Components/NavBar';
import { Emergency } from './Components/Emergency';
import { EmergencyButton } from './Components/EmergencyButton';
import { getDailyProgress, calculateStreak } from './Utils/Storage';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<'calendar' | 'journal' | 'motivation' | 'emergency'>('calendar');
  const [progress, setProgress] = useState(getDailyProgress());
  const [streak, setStreak] = useState(calculateStreak());

  useEffect(() => {
    setStreak(calculateStreak());
  }, [progress]);

  const handleProgressUpdate = () => {
    setProgress(getDailyProgress());
  };

  return (
    <ThemeProvider>
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
                <h2>Transform Your Life</h2>
                <p>Every mark on this calendar represents a victory. Keep pushing forward!</p>
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
    </ThemeProvider>
  );
}

export default App;