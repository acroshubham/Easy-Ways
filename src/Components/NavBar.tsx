import { FC } from 'react';
import { useTheme } from '../context/ThemeContext';
import '../Styles/NavBar.css';

interface NavBarProps {
  currentView: 'calendar' | 'journal' | 'motivation'| 'emergency';
  setCurrentView: (view: 'calendar' | 'journal' | 'motivation') => void;
  streak: number;
}

export const NavBar: FC<NavBarProps> = ({ currentView, setCurrentView, streak}) => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <header className="header">
      <div className="header-container">
        <div className="top-nav">
          <div className="logo">
            <svg className="mountain-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3L12 7L16 3" />
              <path d="M2 21L12 7L22 21" />
            </svg>
            <span className="logo-text">Peak Journal</span>
          </div>
          <div className="header-controls">
            <div className="success-stories">
              <svg className="trophy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5C3.12 9 2 7.88 2 6.5V6C2 4.89 2.89 4 4 4H6" />
                <path d="M18 9H19.5C20.88 9 22 7.88 22 6.5V6C22 4.89 21.11 4 20 4H18" />
                <path d="M6 4H18V9C18 11.21 16.21 13 14 13H10C7.79 13 6 11.21 6 9V4Z" />
                <path d="M12 13V17" />
                <path d="M8 21H16" />
                <path d="M12 17L17 21" />
                <path d="M12 17L7 21" />
              </svg>
              <span>Success Stories</span>
            </div>
            <div className="streak-counter">
              <span>{streak} Day Streak</span>
            </div>
          </div>
        </div>

        <nav className="sub-nav">
        <button
  className={`nav-button ${currentView === 'journal' ? 'active journal' : 'journal'}`}
  onClick={() => setCurrentView('journal')}
>

            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span>Journal</span>
          </button>
          <button
  className={`nav-button ${currentView === 'calendar' ? 'active calendar' : 'calendar'}`}
  onClick={() => setCurrentView('calendar')}
>

            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>Calendar</span>
          </button>
          <button
  className={`nav-button ${currentView === 'motivation' ? 'active motivation' : 'motivation'}`}
  onClick={() => setCurrentView('motivation')}
>

            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>Daily Motivation</span>
          </button>
          <button className="nav-button theme-toggle" onClick={toggleTheme}>
            <svg className="nav-icon" viewBox="0 0 24 24">
              {isDark ? (
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              ) : (
                <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              )}
            </svg>
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
