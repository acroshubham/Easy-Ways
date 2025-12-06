import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../Utils/supabaseClient';
import { UserProfile } from '../Types/user';

type AuthState = 'login' | 'logout';

interface EmailCredentials {
  email: string;
  password: string;
}

interface SignUpPayload extends EmailCredentials {
  name: string;
}

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  authState: AuthState;
  loginWithGoogle: () => Promise<void>;
  signInWithEmail: (credentials: EmailCredentials) => Promise<void>;
  signUpWithEmail: (payload: SignUpPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authState, setAuthState] = useState<AuthState>('login');

  useEffect(() => {
    // Check active session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        mapUser(session.user);
        // Industry Grade: Clean up the URL hash to remove access tokens
        if (window.location.hash && window.location.hash.includes('access_token')) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      } else {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        mapUser(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const mapUser = (supabaseUser: SupabaseUser) => {
    const newUser: UserProfile = {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata.full_name || supabaseUser.email?.split('@')[0] || 'User',
      email: supabaseUser.email || '',
      avatar_url: supabaseUser.user_metadata.avatar_url,
      level: { current: 1, experience: 0, nextLevelAt: 100 }, // Placeholder
      achievements: [], // Placeholder
      preferences: {
        notifications: true,
        emailUpdates: false,
        theme: 'light'
      },
      lastActive: new Date()
    };
    setUser(newUser);
    setLoading(false);
    setAuthState('login');
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
    setAuthState('login');
  };

  const signInWithEmail = async ({ email, password }: EmailCredentials) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    setAuthState('login');
  };

  const signUpWithEmail = async ({ email, password, name }: SignUpPayload) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      },
    });
    if (error) throw error;
    setAuthState('login');
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setAuthState('logout');
  };

  const updateUser = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: updates.name,
          // Store preferences in metadata for now
          preferences: updates.preferences
        }
      });

      if (error) throw error;

      // Optimistic update
      setUser(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, authState, loginWithGoogle, signInWithEmail, signUpWithEmail, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
