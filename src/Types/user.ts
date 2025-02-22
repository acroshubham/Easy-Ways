export interface UserAchievement {
  id: string;
  name: string;
  description: string;
  unlockedAt?: Date;
}

export interface UserLevel {
  current: number;
  experience: number;
  nextLevelAt: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  level: UserLevel;
  achievements: UserAchievement[];
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    theme: 'light' | 'dark';
  };
  lastActive: Date;
}
