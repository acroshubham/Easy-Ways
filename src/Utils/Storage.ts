import { JournalEntry, Category ,DailyProgress } from '../Types/types';

const STORAGE_KEYS = {
  ENTRIES: 'journal_entries',
  CATEGORIES: 'journal_categories'
};

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Personal' },
  { id: '2', name: 'Work' },
  { id: '3', name: 'Goals' },
  { id: '4', name: 'Dreams' },
  { id: '5', name: 'Gratitude' }
];

export const getCategories = (): Category[] => {
  const categories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  return categories ? JSON.parse(categories) : DEFAULT_CATEGORIES;
};

export const saveCategory = (name: string): Category[] => {
  const categories = getCategories();
  const newCategory = {
    id: Date.now().toString(),
    name: name.trim()
  };
  const updatedCategories = [...categories, newCategory];
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updatedCategories));
  return updatedCategories;
};

export const saveJournalEntry = (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
  const entries = getJournalEntries();
  const newEntry: JournalEntry = {
    ...entry,
    id: Date.now().toString(),
    createdAt: Date.now()
  };
  entries.push(newEntry);
  localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
  return newEntry;
};

export const getJournalEntries = (): JournalEntry[] => {
  const entries = localStorage.getItem(STORAGE_KEYS.ENTRIES);
  return entries ? JSON.parse(entries) : [];
};

export const deleteJournalEntry = (id: string): JournalEntry[] => {
  const entries = getJournalEntries();
  const filteredEntries = entries.filter(entry => entry.id !== id);
  localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(filteredEntries));
  return filteredEntries;
};
export const saveDailyProgress = (progress: DailyProgress) => {
  const progressList = getDailyProgress();
  const existingIndex = progressList.findIndex(p => p.date === progress.date);
  
  if (existingIndex >= 0) {
    // If status is empty string, remove the entry completely
    if (!progress.status) {
      progressList.splice(existingIndex, 1);
    } else {
      progressList[existingIndex] = progress;
    }
  } else if (progress.status) {
    // Only add new entries if they have a valid status
    progressList.push(progress);
  }
  
  localStorage.setItem('daily_progress', JSON.stringify(progressList));
};

export const getDailyProgress = (): DailyProgress[] => {
  const progress = localStorage.getItem('daily_progress');
  return progress ? JSON.parse(progress) : [];
};

export const calculateStreak = (): number => {
  const progress = getDailyProgress();
  const sortedProgress = progress
    .filter(p => p.status === 'success')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sortedProgress.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayStr = today.toISOString().split('T')[0];
  const hasTodayEntry = sortedProgress.find(p => p.date === todayStr);
  
  let streak = 0;
  let currentDate = new Date(today);
  
  // If no entry for today, start from yesterday
  if (!hasTodayEntry) {
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const entry = sortedProgress.find(p => p.date === dateStr);
    
    if (entry && entry.status === 'success') {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};