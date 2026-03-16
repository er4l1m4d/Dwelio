-- Dwelio initial schema (Phase 0.4)

create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  role text check (role in ('landlord', 'tenant', 'buyer')),
  avatar_url text,
  is_verified boolean default false,
  nin_submitted boolean default false,
  created_at timestamp with time zone default now()
);
alter table profiles enable row level security;

create table properties (
  id uuid default gen_random_uuid() primary key,
  landlord_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  type text check (type in ('rent', 'sale')),
  property_type text check (property_type in ('flat', 'house', 'room', 'duplex', 'bungalow', 'land')),
  price integer not null,
  price_period text check (price_period in ('monthly', 'yearly')),
  bedrooms integer,
  bathrooms integer,
  address text,
  neighbourhood text,
  city text default 'Ibadan',
  state text default 'Oyo',
  images text[],
  video_url text,
  is_available boolean default true,
  is_featured boolean default false,
  views integer default 0,
  created_at timestamp with time zone default now()
);
alter table properties enable row level security;

create table reviews (
  id uuid default gen_random_uuid() primary key,
  reviewer_id uuid references profiles(id),
  reviewed_id uuid references profiles(id),
  property_id uuid references properties(id),
  rating integer check (rating between 1 and 5),
  comment text,
  created_at timestamp with time zone default now()
);
alter table reviews enable row level security;

create table messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references profiles(id),
  receiver_id uuid references profiles(id),
  property_id uuid references properties(id),
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);
alter table messages enable row level security;

create table payments (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid references profiles(id),
  landlord_id uuid references profiles(id),
  property_id uuid references properties(id),
  amount integer not null,
  status text check (status in ('pending', 'paid', 'failed', 'in_escrow', 'released')),
  paystack_reference text,
  move_in_confirmed boolean default false,
  payment_month date,
  created_at timestamp with time zone default now()
);
alter table payments enable row level security;

create table wallets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) unique,
  balance integer default 0,
  created_at timestamp with time zone default now()
);
alter table wallets enable row level security;

create table tenancy_agreements (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid references profiles(id),
  landlord_id uuid references profiles(id),
  property_id uuid references properties(id),
  start_date date,
  end_date date,
  monthly_rent integer,
  terms text,
  tenant_signed boolean default false,
  landlord_signed boolean default false,
  created_at timestamp with time zone default now()
);
alter table tenancy_agreements enable row level security;
