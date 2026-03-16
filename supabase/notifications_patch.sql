create table if not exists notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  type text check (type in ('new_message', 'payment_due', 'agreement_signed', 'listing_inquiry')),
  message text not null,
  link text,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

alter table notifications enable row level security;
