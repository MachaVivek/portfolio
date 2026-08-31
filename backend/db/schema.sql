-- Database tables for storing chat history.
-- Run this ONCE in the Supabase SQL editor (Dashboard -> SQL Editor -> paste -> Run).
-- Safe to re-run: every statement checks whether the thing already exists.

-- Provides gen_random_uuid(), used to generate ids automatically.
create extension if not exists pgcrypto;

-- One row per visitor session.
create table if not exists conversations (
    id uuid primary key default gen_random_uuid(),
    visitor_ip text,
    created_at timestamptz not null default now()
);

-- Every individual message, from the visitor and the assistant alike.
create table if not exists messages (
    id uuid primary key default gen_random_uuid(),
    -- "on delete cascade": deleting a conversation deletes its messages too,
    -- so no orphaned rows are left behind.
    conversation_id uuid not null references conversations(id) on delete cascade,
    -- Only these two values are allowed; anything else is rejected by the database.
    role text not null check (role in ('user', 'assistant')),
    content text not null,
    tool_used text,
    created_at timestamptz not null default now()
);

-- Messages that were actually emailed through the contact flow.
create table if not exists contact_submissions (
    id uuid primary key default gen_random_uuid(),
    -- "on delete set null": if the conversation is deleted we still keep the
    -- message itself, just without the link back to the chat.
    conversation_id uuid references conversations(id) on delete set null,
    visitor_name text,
    visitor_email text,
    subject text,
    message text not null,
    created_at timestamptz not null default now()
);

-- Indexes make the /admin dashboard's lookups fast as the tables grow.
-- Without them Postgres has to scan every row each time.
create index if not exists idx_messages_conversation_id on messages(conversation_id);
create index if not exists idx_messages_content_search on messages using gin (to_tsvector('english', content));
create index if not exists idx_conversations_created_at on conversations(created_at desc);
