import { supabase } from './supabaseClient';
import { DailyProgress, JournalEntry, Category } from '../Types/types';

interface DailyProgressRow {
  date: string;
  status: string;
  completed: boolean;
  user_id?: string;
}

interface JournalEntryRow {
  id: string;
  date: string;
  header: string;
  body: string;
  category: string;
  created_at: string;
  user_id?: string;
}

interface JournalCategoryRow {
  id: string;
  name: string;
  created_at: string;
  user_id?: string;
}

export const fetchSupabaseProgress = async (): Promise<DailyProgress[]> => {
  const { data, error } = await supabase
    .from('daily_progress')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching progress:', error);
    return [];
  }

  const rows = (data ?? []) as DailyProgressRow[];
  return rows.map((item) => ({
    date: item.date,
    status: item.status,
    completed: item.completed
  }));
};

export const updateSupabaseJournalEntry = async (entry: JournalEntry) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .update({
      date: entry.date,
      header: entry.header,
      body: entry.body,
      category: entry.category,
    })
    .eq('id', entry.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating journal entry:', error);
    throw error;
  }

  const row = data as any;
  return {
    id: row.id,
    date: row.date,
    header: row.header,
    body: row.body,
    category: row.category,
    createdAt: new Date(row.created_at).getTime(),
  } as JournalEntry;
};

type InsertDailyProgress = Pick<DailyProgressRow, 'date' | 'status' | 'completed' | 'user_id'>;

export const upsertSupabaseProgress = async (progress: DailyProgress) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  const payload: InsertDailyProgress = {
    date: progress.date,
    status: progress.status,
    completed: progress.completed,
    user_id: user?.id
  };

  const { error } = await supabase
    .from('daily_progress')
    .upsert(payload, { onConflict: 'date,user_id' }); // Assuming user_id is part of unique constraint

  if (error) {
    console.error('Error saving progress:', error);
    throw error;
  }
};

export const deleteSupabaseProgress = async (date: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  let query = supabase.from('daily_progress').delete().eq('date', date);
  
  if (user) {
    query = query.eq('user_id', user.id);
  }

  const { error } = await query;

  if (error) {
    console.error('Error deleting progress:', error);
    throw error;
  }
};

// Journal Functions

export const fetchSupabaseJournalEntries = async (): Promise<JournalEntry[]> => {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching journal entries:', error);
    return [];
  }

  const rows = (data ?? []) as JournalEntryRow[];
  return rows.map((item) => ({
    id: item.id,
    date: item.date,
    header: item.header,
    body: item.body,
    category: item.category,
    createdAt: new Date(item.created_at).getTime()
  }));
};

export const saveSupabaseJournalEntry = async (entry: { date: string; header: string; body: string; category: string }) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const payload = {
    user_id: user.id,
    date: entry.date,
    header: entry.header,
    body: entry.body,
    category: entry.category
  };

  const { data, error } = await supabase
    .from('journal_entries')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('Error saving journal entry:', error);
    throw error;
  }

  return {
    id: data.id,
    date: data.date,
    header: data.header,
    body: data.body,
    category: data.category,
    createdAt: new Date(data.created_at).getTime()
  };
};

export const deleteSupabaseJournalEntry = async (id: string) => {
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting journal entry:', error);
    throw error;
  }
};

// Category Functions

export const fetchSupabaseCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('journal_categories')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  const rows = (data ?? []) as JournalCategoryRow[];
  return rows.map((item) => ({
    id: item.id,
    name: item.name
  }));
};

export const saveSupabaseCategory = async (name: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('journal_categories')
    .insert({ user_id: user.id, name })
    .select()
    .single();

  if (error) {
    console.error('Error saving category:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name
  };
};
