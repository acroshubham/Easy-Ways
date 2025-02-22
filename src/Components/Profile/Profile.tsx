import React, { useState, Profiler } from 'react';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';
import { CircularProgress, Badge } from '@mui/material';
import './Styles/Profile.css';

interface ProfileProps {
  onClose: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ onClose }) => {
  const { user, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    notifications: user?.preferences.notifications || false,
    emailUpdates: user?.preferences.emailUpdates || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: formData.name,
      email: formData.email,
      preferences: {
        notifications: formData.notifications,
        emailUpdates: formData.emailUpdates
      }
    });
    setIsEditing(false);
  };

  const onRenderCallback: React.ProfilerOnRenderCallback = (...args: any[]) => {
    const [id, actualDuration] = args;
    console.log(`Component ${id} took ${actualDuration}ms to render`);
  };
  

  const calculateLevelProgress = () => {
    if (!user) return 0;
    const { experience, nextLevelAt } = user.level;
    return (experience / nextLevelAt) * 100;
  };

  if (!user) return null;

  return (
    <Profiler id="Profile" onRender={onRenderCallback}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="profile-container p-6 max-w-md mx-auto bg-white rounded-lg shadow-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Profile Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.notifications}
                onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Enable Notifications</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.emailUpdates}
                onChange={(e) => setFormData({ ...formData, emailUpdates: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Receive Email Updates</label>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="level-section mb-6 text-center">
              <div className="relative w-32 h-32 mx-auto">
                <CircularProgress 
                  variant="determinate" 
                  value={calculateLevelProgress()} 
                  size={128}
                  thickness={4}
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Badge badgeContent={user.level.current} color="primary">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                  </Badge>
                </div>
              </div>
              <p className="mt-2 text-lg font-semibold">Level {user.level.current}</p>
              <p className="text-sm text-gray-500">
                {user.level.experience} / {user.level.nextLevelAt} XP
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {user.name.charAt(0)}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Preferences</p>
                <ul className="list-disc list-inside space-y-1">
                  <li className={user.preferences.notifications ? 'text-green-600' : 'text-red-600'}>
                    Notifications: {user.preferences.notifications ? 'Enabled' : 'Disabled'}
                  </li>
                  <li className={user.preferences.emailUpdates ? 'text-green-600' : 'text-red-600'}>
                    Email Updates: {user.preferences.emailUpdates ? 'Enabled' : 'Disabled'}
                  </li>
                </ul>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Edit Profile
              </button>
            </div>
            <div className="achievements-section mt-6">
              <h3 className="text-xl font-semibold mb-4">Achievements</h3>
              <div className="grid grid-cols-2 gap-4">
                {user.achievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    whileHover={{ scale: 1.05 }}
                    className={`p-4 rounded-lg ${
                      achievement.unlockedAt 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <h4 className="font-medium">{achievement.name}</h4>
                    <p className="text-sm">{achievement.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </Profiler>
  );
};
