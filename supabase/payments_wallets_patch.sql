alter table payments
add column if not exists move_in_confirmed boolean default false;

create table if not exists wallets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) unique,
  balance integer default 0,
  created_at timestamp with time zone default now()
);

alter table wallets enable row level security;
