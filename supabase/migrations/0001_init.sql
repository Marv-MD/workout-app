-- Enums
create type logging_type as enum ('REPS_WEIGHT', 'DURATION_WEIGHT', 'BW_REPS');
create type weight_unit as enum ('kg', 'lb');

-- Base tables
create table exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  logging_type logging_type not null,
  parent_exercise_id uuid references exercises(id) on delete cascade,
  progression_level int,
  group_key text,
  default_rest_seconds int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table workout_exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  workout_id uuid references workouts(id) on delete cascade,
  exercise_id uuid references exercises(id) on delete cascade,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table sets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  workout_exercise_id uuid references workout_exercises(id) on delete cascade,
  exercise_id uuid references exercises(id) on delete cascade,
  logging_type logging_type not null,
  performance jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint performance_shape_check check (
    (logging_type = 'REPS_WEIGHT' and performance ? 'reps' and performance ? 'weight' and performance ? 'unit') or
    (logging_type = 'DURATION_WEIGHT' and performance ? 'seconds' and performance ? 'load' and performance ? 'unit') or
    (logging_type = 'BW_REPS' and performance ? 'reps' and performance ? 'load' and performance ? 'unit')
  )
);

-- Indexes
create index on exercises (user_id);
create index on workouts (user_id, started_at desc);
create index on workout_exercises (user_id, workout_id);
create index on sets (user_id, exercise_id);
create index on sets (updated_at);

-- Updated at triggers
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_exercises before update on exercises
  for each row execute function set_updated_at();
create trigger set_updated_at_workouts before update on workouts
  for each row execute function set_updated_at();
create trigger set_updated_at_workout_exercises before update on workout_exercises
  for each row execute function set_updated_at();
create trigger set_updated_at_sets before update on sets
  for each row execute function set_updated_at();

-- RLS policies
alter table exercises enable row level security;
alter table workouts enable row level security;
alter table workout_exercises enable row level security;
alter table sets enable row level security;

create policy "Exercises are user scoped" on exercises
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Workouts are user scoped" on workouts
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Workout exercises are user scoped" on workout_exercises
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Sets are user scoped" on sets
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
