-- ═══════════════════════════════════════════════════════════════
--  NEET PYQ — Supabase Schema
--  Run this in your Supabase SQL editor (Dashboard → SQL Editor)
-- ═══════════════════════════════════════════════════════════════

-- Questions table
create table if not exists questions (
  id          text primary key,
  subject     text not null,
  chapter     text not null,
  year        int  not null,
  difficulty  text check (difficulty in ('easy','medium','hard')),
  question    text not null,
  options     jsonb not null,  -- array of 4 strings
  answer      int  not null,   -- 0-indexed correct option
  solution    text,
  tags        text[],
  image_url   text,
  created_at  timestamptz default now()
);

create index if not exists idx_questions_subject   on questions(subject);
create index if not exists idx_questions_chapter   on questions(chapter);
create index if not exists idx_questions_year      on questions(year);
create index if not exists idx_questions_difficulty on questions(difficulty);

-- Attempts table (tracks per-user per-question history)
create table if not exists attempts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade,
  question_id     text references questions(id),
  selected_option int  not null,
  is_correct      bool not null,
  time_taken_sec  int,
  attempted_at    timestamptz default now()
);

create index if not exists idx_attempts_user     on attempts(user_id);
create index if not exists idx_attempts_question on attempts(question_id);

-- Bookmarks
create table if not exists bookmarks (
  user_id     uuid references auth.users(id) on delete cascade,
  question_id text references questions(id),
  created_at  timestamptz default now(),
  primary key (user_id, question_id)
);

-- Custom tests
create table if not exists custom_tests (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  name        text,
  config      jsonb,  -- filters used to build the test
  created_at  timestamptz default now()
);

create table if not exists custom_test_questions (
  test_id     uuid references custom_tests(id) on delete cascade,
  question_id text references questions(id),
  position    int,
  primary key (test_id, question_id)
);

-- RLS policies (required for Supabase auth)
alter table questions       enable row level security;
alter table attempts        enable row level security;
alter table bookmarks       enable row level security;
alter table custom_tests    enable row level security;

-- Questions are public read
create policy "questions_public_read" on questions for select using (true);

-- Users own their attempts/bookmarks/tests
create policy "own_attempts"  on attempts     for all using (auth.uid() = user_id);
create policy "own_bookmarks" on bookmarks    for all using (auth.uid() = user_id);
create policy "own_tests"     on custom_tests for all using (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
--  To import seed questions from JSON, run from your terminal:
--  node scripts/import.js
-- ═══════════════════════════════════════════════════════════════
