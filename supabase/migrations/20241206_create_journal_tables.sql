-- Create journal_entries table
create table if not exists journal_entries (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) not null,
  date date not null,
  header text not null,
  body text not null,
  category text not null
);

-- Enable RLS for journal_entries
alter table journal_entries enable row level security;

-- Policies for journal_entries
create policy "Users can view their own journal entries" 
  on journal_entries for select 
  using (auth.uid() = user_id);

create policy "Users can insert their own journal entries" 
  on journal_entries for insert 
  with check (auth.uid() = user_id);

create policy "Users can update their own journal entries" 
  on journal_entries for update 
  using (auth.uid() = user_id);

create policy "Users can delete their own journal entries" 
  on journal_entries for delete 
  using (auth.uid() = user_id);


-- Create journal_categories table
create table if not exists journal_categories (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) not null,
  name text not null
);

-- Enable RLS for journal_categories
alter table journal_categories enable row level security;

-- Policies for journal_categories
create policy "Users can view their own categories" 
  on journal_categories for select 
  using (auth.uid() = user_id);

create policy "Users can insert their own categories" 
  on journal_categories for insert 
  with check (auth.uid() = user_id);

create policy "Users can delete their own categories" 
  on journal_categories for delete 
  using (auth.uid() = user_id);
