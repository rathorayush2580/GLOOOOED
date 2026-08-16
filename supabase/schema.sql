-- Glow Database Schema
-- Run this in the Supabase SQL Editor

-- Profiles table (extends Supabase Auth users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text not null,
  created_at timestamptz default now()
);

-- Glows (sticky note posts)
create table public.glows (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null check (char_length(content) <= 280),
  color text default 'yellow',
  created_at timestamptz default now()
);

-- Likes (one per user per glow)
create table public.likes (
  id uuid default gen_random_uuid() primary key,
  glow_id uuid references public.glows(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique (glow_id, user_id)
);

-- Comments (flat list per glow)
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  glow_id uuid references public.glows(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.glows enable row level security;
alter table public.likes enable row level security;
alter table public.comments enable row level security;

-- RLS Policies
create policy "Public profiles" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Public glows" on public.glows for select using (true);
create policy "Users can create glows" on public.glows for insert with check (auth.uid() = user_id);
create policy "Users can update own glows" on public.glows for update using (auth.uid() = user_id);
create policy "Users can delete own glows" on public.glows for delete using (auth.uid() = user_id);

create policy "Public likes" on public.likes for select using (true);
create policy "Users can like" on public.likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike" on public.likes for delete using (auth.uid() = user_id);

create policy "Public comments" on public.comments for select using (true);
create policy "Users can comment" on public.comments for insert with check (auth.uid() = user_id);
create policy "Users can delete own comments" on public.comments for delete using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
