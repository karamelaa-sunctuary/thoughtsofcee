create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create table private.department_instructions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scope text not null check (scope in ('global','project','agent')),
  scope_ref text,
  title text not null check (char_length(title) between 1 and 200),
  content text not null check (char_length(content) between 1 and 20000),
  version integer not null default 1 check (version > 0),
  status text not null default 'draft' check (status in ('draft','pending_review','approved','superseded','archived')),
  created_by uuid not null references auth.users(id),
  approved_by uuid references auth.users(id),
  approved_at timestamptz,
  supersedes_id uuid references private.department_instructions(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, scope, scope_ref, title, version)
);

create table private.department_memory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  memory_type text not null check (memory_type in ('brand','project','decision','research','lesson','working_context','agent_feedback')),
  title text not null check (char_length(title) between 1 and 200),
  content text not null check (char_length(content) between 1 and 20000),
  source_ref text,
  provenance text,
  trust_class text not null default 'provisional' check (trust_class in ('founder_approved','verified_primary','corroborated','provisional','unverified')),
  status text not null default 'draft' check (status in ('draft','pending_review','approved','superseded','archived')),
  sensitivity text not null default 'internal' check (sensitivity in ('public','internal','confidential')),
  created_by uuid not null references auth.users(id),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  review_due_at timestamptz,
  version integer not null default 1 check (version > 0),
  supersedes_id uuid references private.department_memory(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table private.agent_profiles (
  id text primary key check (id ~ '^[a-z0-9][a-z0-9-]{1,79}$'),
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null,
  constitution_version text,
  capabilities jsonb not null default '[]'::jsonb check (jsonb_typeof(capabilities) = 'array'),
  enabled boolean not null default true,
  execution_mode text not null default 'on_demand' check (execution_mode in ('on_demand','scheduled','event_triggered','disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, display_name)
);

create table private.agent_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  parent_task_id uuid references private.agent_tasks(id) on delete set null,
  title text not null check (char_length(title) between 1 and 240),
  objective text not null check (char_length(objective) between 1 and 20000),
  assigned_agent_id text,
  status text not null default 'draft' check (status in ('draft','ready','assigned','running','review','awaiting_founder','approved','completed','changes_requested','rejected','blocked','failed','cancelled')),
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  acceptance_criteria jsonb not null default '[]'::jsonb check (jsonb_typeof(acceptance_criteria) = 'array'),
  input_refs jsonb not null default '[]'::jsonb check (jsonb_typeof(input_refs) = 'array'),
  due_at timestamptz,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create table private.agent_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid not null references private.agent_tasks(id) on delete cascade,
  agent_id text not null,
  run_number integer not null default 1 check (run_number > 0),
  status text not null default 'queued' check (status in ('queued','running','succeeded','failed','cancelled')),
  provider text,
  model text,
  cost_amount numeric(12,6) check (cost_amount is null or cost_amount >= 0),
  cost_currency text,
  started_at timestamptz,
  finished_at timestamptz,
  output jsonb not null default '{}'::jsonb,
  error_summary text,
  created_at timestamptz not null default now(),
  unique (task_id, agent_id, run_number)
);

create table private.agent_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid not null references private.agent_tasks(id) on delete cascade,
  run_id uuid references private.agent_runs(id) on delete set null,
  from_agent_id text,
  to_agent_id text,
  message_type text not null check (message_type in ('brief','handoff','question','result','critique','status','system')),
  content jsonb not null,
  created_at timestamptz not null default now()
);

create table private.review_decisions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid not null references private.agent_tasks(id) on delete cascade,
  reviewer_agent_id text not null,
  verdict text not null check (verdict in ('approved','needs_revision','rejected','unable_to_assess')),
  findings jsonb not null default '[]'::jsonb check (jsonb_typeof(findings) = 'array'),
  evidence_refs jsonb not null default '[]'::jsonb check (jsonb_typeof(evidence_refs) = 'array'),
  created_at timestamptz not null default now()
);

create table private.founder_decisions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid references private.agent_tasks(id) on delete set null,
  decision text not null check (decision in ('approved','rejected','changes_requested','deferred')),
  rationale text,
  decided_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table private.department_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  actor_type text not null check (actor_type in ('founder','brain','agent','system')),
  actor_id text,
  task_id uuid references private.agent_tasks(id) on delete set null,
  entity_type text,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['department_instructions','department_memory','agent_profiles','agent_tasks','agent_runs','agent_messages','review_decisions','founder_decisions','department_events']
  loop
    execute format('alter table private.%I enable row level security', t);
    execute format('create policy %I on private.%I for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)', 'founder_owns_' || t, t);
    execute format('grant select, insert, update, delete on private.%I to authenticated', t);
  end loop;
end $$;

grant usage, select on all sequences in schema private to authenticated;
create index department_memory_user_status_idx on private.department_memory(user_id, status, updated_at desc);
create index department_instructions_user_scope_idx on private.department_instructions(user_id, scope, status);
create index agent_tasks_user_status_idx on private.agent_tasks(user_id, status, updated_at desc);
create index agent_tasks_parent_idx on private.agent_tasks(parent_task_id);
create index agent_runs_task_idx on private.agent_runs(task_id, created_at desc);
create index agent_messages_task_idx on private.agent_messages(task_id, created_at);
create index review_decisions_task_idx on private.review_decisions(task_id, created_at desc);
create index department_events_user_created_idx on private.department_events(user_id, created_at desc);
