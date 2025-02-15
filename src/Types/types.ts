export interface JournalEntry {
  id: string;
  date: string;
  header: string;
  body: string;
  category: string;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
}
export interface DailyProgress {
  date: string;
  completed: boolean;
  status: string ;
}

export interface Quote {
  text: string;
  author: string;
}