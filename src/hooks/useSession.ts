import { useState, useEffect } from 'react';
import { UserProfile } from '../Types/user';

const SESSION_KEY = 'user_session';
const SESSION_DURATION = 1000 * 60 * 60; // 1 hour

export const useSession = () => {
  const [session, setSession] = useState<UserProfile | null>(null);

  const startSession = (user: UserProfile) => {
    const sessionData = {
      user,
      timestamp: new Date().getTime(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    setSession(user);
  };

  const endSession = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  useEffect(() => {
    const checkSession = () => {
      const savedSession = localStorage.getItem(SESSION_KEY);
      if (!savedSession) return;

      const { user, timestamp } = JSON.parse(savedSession);
      const now = new Date().getTime();

      if (now - timestamp > SESSION_DURATION) {
        endSession();
      } else {
        setSession(user);
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 1000 * 60); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return { session, startSession, endSession };
};
