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
    progressList[existingIndex] = progress;
  } else {
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
    .filter(p => p.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sortedProgress.length === 0) return 0;

  let streak = 1;
  const today = new Date();
  let currentDate = new Date(sortedProgress[0].date);

  // If the most recent date is not today or yesterday, streak is broken
  if ((today.getTime() - currentDate.getTime()) > (2 * 24 * 60 * 60 * 1000)) {
    return 0;
  }

  for (let i = 1; i < sortedProgress.length; i++) {
    const prevDate = new Date(sortedProgress[i].date);
    const diffDays = Math.floor((currentDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000));
    
    if (diffDays === 1) {
      streak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }

  return streak;
};