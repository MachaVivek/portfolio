create extension if not exists pgcrypto;

create table if not exists conversations (
    id uuid primary key default gen_random_uuid(),
    visitor_ip text,
    created_at timestamptz not null default now()
);

create table if not exists messages (
    id uuid primary key default gen_random_uuid(),

    conversation_id uuid not null references conversations(id) on delete cascade,

    role text not null check (role in ('user', 'assistant')),
    content text not null,
    tool_used text,
    created_at timestamptz not null default now()
);

create table if not exists contact_submissions (
    id uuid primary key default gen_random_uuid(),

    conversation_id uuid references conversations(id) on delete set null,
    visitor_name text,
    visitor_email text,
    subject text,
    message text not null,
    created_at timestamptz not null default now()
);

create index if not exists idx_messages_conversation_id on messages(conversation_id);
create index if not exists idx_messages_content_search on messages using gin (to_tsvector('english', content));
create index if not exists idx_conversations_created_at on conversations(created_at desc);
