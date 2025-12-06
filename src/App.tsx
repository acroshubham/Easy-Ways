import { useState, useEffect } from 'react';
import { Calendar } from './Components/Calendar/Calendar';
import { JournalEntry } from './Components/Journal/Journal';
import { DailyMotivation } from './Components/Motivation/DailyMotivation';
import { NavBar } from './Components/NavBar/NavBar';
import { Emergency } from './Components/Emergency/Emergency';
import { EmergencyButton } from './Components/Emergency/EmergencyButton';
import { calculateStreak } from './Utils/Storage';
import { fetchSupabaseProgress } from './Utils/SupabaseStorage';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { UserProvider, useUser } from './context/UserContext';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme/theme';
import { Buddy } from './Components/Buddy/Buddy';
import { buddyOptions, type BuddyVariant } from './Components/Buddy/buddyData';
import { AuthGate } from './Components/Auth/AuthGate';
import { LogoutScreen } from './Components/Auth/LogoutScreen';
import type { DailyProgress } from './Types/types';
import './App.css';

function AppContent() {
  const [currentView, setCurrentView] = useState<'calendar' | 'journal' | 'motivation' | 'emergency'>('calendar');
  const [progress, setProgress] = useState<DailyProgress[]>([]);
  const [streak, setStreak] = useState(0);
  const [showBuddy, setShowBuddy] = useState(true);
  const [buddyVariant, setBuddyVariant] = useState<BuddyVariant>('warrior');
  const [showLoginAfterLogout, setShowLoginAfterLogout] = useState(false);
  const { isDark } = useTheme();
  const { user, loading, authState } = useUser();

  useEffect(() => {
    if (!user) {
      setProgress([]);
      setStreak(0);
      return;
    }

    fetchSupabaseProgress().then(data => {
      setProgress(data);
      setStreak(calculateStreak(data));
    });
  }, [user]);

  useEffect(() => {
    setStreak(calculateStreak(progress));
  }, [progress]);

  const handleProgressUpdate = () => {
    if (!user) return;
    fetchSupabaseProgress().then(data => {
      setProgress(data);
    });
  };

  useEffect(() => {
    if (user) {
      setShowLoginAfterLogout(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center text-white">
          <div className="h-12 w-12 rounded-full border-4 border-white/30 border-t-indigo-500 animate-spin mb-4" />
          <p className="text-sm tracking-[0.3em] uppercase text-white/60">Preparing your success story...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (authState === 'logout' && !showLoginAfterLogout) {
      return <LogoutScreen onReturn={() => setShowLoginAfterLogout(true)} />;
    }
    return <AuthGate />;
  }

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
        <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setShowBuddy((prev) => !prev)}
            className="rounded-full bg-indigo-600/90 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-500"
          >
            {showBuddy ? 'Hide Buddy' : 'Summon Buddy'}
          </button>
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Choose Buddy</p>
            <div className="flex gap-2">
              {buddyOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setBuddyVariant(option.id)}
                  className={`flex flex-col items-center rounded-2xl border px-3 py-2 text-xs font-semibold transition hover:-translate-y-0.5 ${
                    buddyVariant === option.id
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-200'
                      : 'border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-lg">{option.emoji}</span>
                  {option.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
        {showBuddy && <Buddy variant={buddyVariant} />}
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