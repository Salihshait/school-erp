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
  latitude numeric,
  longitude numeric,
  sequence integer
);

CREATE TABLE IF NOT EXISTS drop_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid REFERENCES routes(id) ON DELETE CASCADE,
  name text,
  latitude numeric,
  longitude numeric,
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
