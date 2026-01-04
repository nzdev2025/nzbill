-- Create the recurring_expenses table
create table public.recurring_expenses (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  amount numeric not null,
  due_day integer not null,
  category text not null,
  active boolean not null default true,
  is_installment boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  primary key (id)
);

-- Enable Row Level Security (RLS)
alter table public.recurring_expenses enable row level security;

-- Create Policies
create policy "Users can view their own recurring expenses" on public.recurring_expenses
  for select using (auth.uid() = user_id);

create policy "Users can insert their own recurring expenses" on public.recurring_expenses
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own recurring expenses" on public.recurring_expenses
  for update using (auth.uid() = user_id);

create policy "Users can delete their own recurring expenses" on public.recurring_expenses
  for delete using (auth.uid() = user_id);
