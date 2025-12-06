-- Add DELETE policy for daily_progress
create policy "Users can delete their own data" 
  on daily_progress for delete 
  using (auth.uid() = user_id);
