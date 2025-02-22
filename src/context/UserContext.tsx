import React, { createContext, useContext, useState, useEffect } from 'react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt?: Date;
}

interface Level {
  current: number;
  experience: number;
  nextLevelAt: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
  };
  level: Level;
  achievements: Achievement[];
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user data
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      preferences: {
        notifications: true,
        emailUpdates: false
      },
      level: {
        current: 1,
        experience: 20,
        nextLevelAt: 100
      },
      achievements: [
        { id: 'a1', name: 'First Login', description: 'Logged in for the first time', unlockedAt: new Date() },
        { id: 'a2', name: 'Profile Updated', description: 'Updated profile' }
      ]
    };

    setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 1000);
  }, []);

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, logout }}>
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
