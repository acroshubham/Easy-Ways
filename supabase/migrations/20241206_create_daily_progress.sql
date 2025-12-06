-- Create daily_progress table
create table if not exists daily_progress (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  date date not null,
  status text check (status in ('success', 'failure')) not null,
  completed boolean default false,
  user_id uuid references auth.users(id),
  unique(date, user_id)
);

-- Enable RLS
alter table daily_progress enable row level security;

-- Create policies
create policy "Users can view their own data" 
  on daily_progress for select 
  using (auth.uid() = user_id);

create policy "Users can insert their own data" 
  on daily_progress for insert 
  with check (auth.uid() = user_id);

create policy "Users can update their own data" 
  on daily_progress for update 
  using (auth.uid() = user_id);

create policy "Users can delete their own data" 
  on daily_progress for delete 
  using (auth.uid() = user_id);
