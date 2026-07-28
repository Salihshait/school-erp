-- Hostel Management module SQL for Supabase
-- Tables: hostel_blocks, rooms, beds, room_allocations, mess_menu, mess_attendance,
--         visitors, hostel_attendance, hostel_fees, complaints

CREATE TABLE IF NOT EXISTS hostel_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  warden_name text,
  warden_phone text,
  total_floors integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  block_id uuid REFERENCES hostel_blocks(id) ON DELETE CASCADE,
  room_number text NOT NULL,
  floor integer DEFAULT 1,
  room_type text NOT NULL CHECK (room_type IN ('single','double','triple','dormitory')) DEFAULT 'double',
  capacity integer NOT NULL DEFAULT 2,
  status text NOT NULL CHECK (status IN ('active','maintenance','closed')) DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  UNIQUE (block_id, room_number)
);

CREATE TABLE IF NOT EXISTS beds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  bed_number text NOT NULL,
  status text NOT NULL CHECK (status IN ('vacant','occupied','maintenance')) DEFAULT 'vacant',
  created_at timestamptz DEFAULT now(),
  UNIQUE (room_id, bed_number)
);

CREATE TABLE IF NOT EXISTS room_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bed_id uuid REFERENCES beds(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  allocated_date date DEFAULT now(),
  vacated_date date,
  status text NOT NULL CHECK (status IN ('active','vacated')) DEFAULT 'active',
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mess_menu (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week text NOT NULL CHECK (day_of_week IN ('mon','tue','wed','thu','fri','sat','sun')),
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast','lunch','snacks','dinner')),
  items text,
  created_at timestamptz DEFAULT now(),
  UNIQUE (day_of_week, meal_type)
);

CREATE TABLE IF NOT EXISTS mess_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  meal_date date DEFAULT now(),
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast','lunch','snacks','dinner')),
  present boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  visitor_name text NOT NULL,
  relation text,
  phone text,
  purpose text,
  check_in timestamptz DEFAULT now(),
  check_out timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hostel_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  attendance_date date DEFAULT now(),
  status text NOT NULL CHECK (status IN ('present','absent','leave')) DEFAULT 'present',
  created_at timestamptz DEFAULT now(),
  UNIQUE (student_id, attendance_date)
);

CREATE TABLE IF NOT EXISTS hostel_fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  due_date date,
  status text NOT NULL CHECK (status IN ('pending','paid','overdue')) DEFAULT 'pending',
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  room_id uuid REFERENCES rooms(id) ON DELETE SET NULL,
  category text NOT NULL CHECK (category IN ('maintenance','mess','discipline','other')) DEFAULT 'other',
  description text NOT NULL,
  status text NOT NULL CHECK (status IN ('open','in_progress','resolved')) DEFAULT 'open',
  raised_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- View: per-room occupancy summary
CREATE OR REPLACE VIEW room_occupancy AS
SELECT
  r.id AS room_id,
  r.room_number,
  b.name AS block_name,
  r.capacity,
  COUNT(bd.*) FILTER (WHERE bd.status = 'occupied') AS occupied_beds,
  COUNT(bd.*) FILTER (WHERE bd.status = 'vacant') AS vacant_beds
FROM rooms r
JOIN hostel_blocks b ON b.id = r.block_id
LEFT JOIN beds bd ON bd.room_id = r.id
GROUP BY r.id, r.room_number, b.name, r.capacity;

-- View: hostel fee collection summary
CREATE OR REPLACE VIEW hostel_fee_summary AS
SELECT status, COUNT(*) AS count, COALESCE(SUM(amount), 0) AS total_amount
FROM hostel_fees
GROUP BY status;
