export interface JournalEntry {
  id: string;
  date: string;
  header: string;
  body: string;
  createdAt: number;
}

export interface DailyProgress {
  date: string;
  completed: boolean;
}

export interface Quote {
  text: string;
  author: string;
}