import { FC, useState, Dispatch, SetStateAction } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import './Styles/NavBar.css';
import { Profile } from '../Profile/Profile';

export interface NavBarProps {
  currentView: 'calendar' | 'journal' | 'motivation' | 'emergency';
  setCurrentView: Dispatch<SetStateAction<'calendar' | 'journal' | 'motivation' | 'emergency'>>;
  streak: number;
}

export const NavBar: FC<NavBarProps> = ({ currentView, setCurrentView }) => {
  const featureDisabled = true;
  const { toggleTheme, isDark } = useTheme();
  const { user, logout } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleProfileClick = () => {
    setIsProfileOpen(true);
    setShowProfileMenu(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <nav className="top-nav">
            <div className="nav-left">
              {/* Menu Icon (mobile) */}
              <button className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <span></span>
                <span></span>
                <span></span>
              </button>
              {/* Success Story Logo */}
              <div className="success-story-logo">
                <svg className="mountain-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 20H3L7 8L12 13L16 6L21 20Z" />
                  <path d="M8 18L12 13L16 18" />
                </svg>
                <span className="logo-text">Success Story</span>
              </div>
              {/* Navigation Items */}
              <div className={`nav-items ${isMenuOpen ? 'active' : ''}`}>
                <button
                  className={`nav-button journal ${currentView === 'journal' ? 'active' : ''}`}
                  onClick={() => setCurrentView('journal')}
                >
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                  <span>Journal</span>
                </button>
                <button
                  className={`nav-button calendar ${currentView === 'calendar' ? 'active' : ''}`}
                  onClick={() => setCurrentView('calendar')}
                >
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>Calendar</span>
                </button>
                <button
                  className={`nav-button motivation ${currentView === 'motivation' ? 'active' : ''}`}
                  onClick={() => setCurrentView('motivation')}
                >
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  <span>Daily Motivation</span>
                </button>
              </div>
            </div>
            <div className="nav-right">
              {/* Theme Toggle Switch */}
              <div className="theme-toggle-wrapper">
                <label className="theme-switch">
                  <input type="checkbox" checked={isDark} onChange={toggleTheme} />
                  <span className="switch-slider"></span>
                </label>
              </div>
              {/* Profile Section */}
              {user && (
              <div className={`profile-section ${featureDisabled ? 'disabled' : ''}`}>
                <div
                  className="profile-trigger"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <div className="avatar">{user.name.charAt(0)}</div>
                </div>
                <div className={`profile-menu ${showProfileMenu ? 'active' : ''}`}>
                  <div className="profile-menu-item" onClick={handleProfileClick}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>Profile Settings</span>
                  </div>
                  <div className="profile-menu-item danger" onClick={logout}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Logout</span>
                  </div>
                </div>
              </div>
            )}
            </div>
          </nav>
        </div>
        {/* Profile Modal */}
        {isProfileOpen && (
          <div className="profile-modal">
            <Profile onClose={() => setIsProfileOpen(false)} />
          </div>
        )}
      </header>
    </>
  );
};
