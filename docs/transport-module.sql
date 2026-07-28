-- Transport module SQL for Supabase
-- Tables: routes, vehicles, drivers, pickup_points, allocations, maintenance, fuel_expenses

create table if not exists routes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  reg_no text not null,
  model text,
  capacity int default 0,
  status text default 'active',
  created_at timestamptz default now()
);

create table if not exists drivers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  license_no text,
  phone text,
  created_at timestamptz default now()
);

create table if not exists pickup_points (
  id uuid primary key default gen_random_uuid(),
  route_id uuid references routes(id) on delete cascade,
  name text not null,
  sequence int default 0,
  latitude numeric,
  longitude numeric,
  created_at timestamptz default now()
);

create table if not exists allocations (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles(id) on delete cascade,
  driver_id uuid references drivers(id) on delete set null,
  route_id uuid references routes(id) on delete set null,
  start_date date,
  end_date date,
  notes text,
  created_at timestamptz default now()
);

create table if not exists maintenance (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles(id) on delete cascade,
  description text,
  cost numeric,
  maintenance_date date default now(),
  created_at timestamptz default now()
);

create table if not exists fuel_expenses (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles(id) on delete cascade,
  amount numeric,
  litres numeric,
  expense_date date default now(),
  created_at timestamptz default now()
);

-- View for simple utilization metrics
create view if not exists vehicle_utilization as
select v.id as vehicle_id, v.reg_no, count(a.*) as allocations
from vehicles v
left join allocations a on a.vehicle_id = v.id
group by v.id, v.reg_no;
-- Supabase SQL for Transport Module
-- Tables: routes, vehicles, drivers, allocations, pickup_points, drop_points, maintenance, fuel_expenses

CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_point text,
  end_point text,
  stops jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reg_no text NOT NULL UNIQUE,
  model text,
  capacity integer,
  gps_enabled boolean DEFAULT false,
  status text NOT NULL CHECK (status IN ('active','inactive','maintenance')) DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  license_no text UNIQUE,
  phone text,
  assigned_vehicle uuid REFERENCES vehicles(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pickup_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid REFERENCES routes(id) ON DELETE CASCADE,
  name text,
  location geography(POINT,4326),
  sequence integer
);

CREATE TABLE IF NOT EXISTS drop_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid REFERENCES routes(id) ON DELETE CASCADE,
  name text,
  location geography(POINT,4326),
  sequence integer
);

CREATE TABLE IF NOT EXISTS allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id),
  driver_id uuid REFERENCES drivers(id),
  route_id uuid REFERENCES routes(id),
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS maintenance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id),
  description text,
  cost numeric,
  maintained_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fuel_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id),
  amount numeric NOT NULL,
  litres numeric,
  odometer numeric,
  expense_date date DEFAULT now(),
  notes text
);

-- View: vehicle utilization summary (example)
CREATE OR REPLACE VIEW vehicle_utilization AS
SELECT v.id AS vehicle_id, v.reg_no, COUNT(a.*) AS allocations
FROM vehicles v
LEFT JOIN allocations a ON a.vehicle_id = v.id
GROUP BY v.id, v.reg_no;
