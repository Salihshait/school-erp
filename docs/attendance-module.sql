-- Supabase-compatible SQL for Attendance Module
-- Tables: attendance_sessions, attendance_records, attendance_leaves, attendance_holidays

-- attendance_sessions: a logical session for a date or event
CREATE TABLE IF NOT EXISTS attendance_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_date date NOT NULL,
  session_type text NOT NULL CHECK (session_type IN ('student','teacher','staff')),
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  note text
);

-- attendance_records: per-person attendance marks
CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  person_id uuid NOT NULL,
  person_type text NOT NULL CHECK (person_type IN ('student','teacher','staff')),
  status text NOT NULL CHECK (status IN ('present','absent','late','on_leave','excused')),
  recorded_at timestamptz DEFAULT now(),
  recorded_by uuid,
  rfid_tag text,
  qr_code text,
  note text
);

CREATE INDEX IF NOT EXISTS idx_attendance_records_person ON attendance_records(person_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_session ON attendance_records(session_id);

-- attendance_leaves: leave requests and approvals
CREATE TABLE IF NOT EXISTS attendance_leaves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL,
  person_type text NOT NULL CHECK (person_type IN ('student','teacher','staff')),
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text,
  status text NOT NULL CHECK (status IN ('pending','approved','rejected')) DEFAULT 'pending',
  requested_by uuid,
  requested_at timestamptz DEFAULT now(),
  reviewed_by uuid,
  reviewed_at timestamptz
);

-- attendance_holidays: official holidays affecting attendance
CREATE TABLE IF NOT EXISTS attendance_holidays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  holiday_date date NOT NULL UNIQUE,
  title text NOT NULL,
  description text
);

-- Views: monthly summary (example)
CREATE OR REPLACE VIEW attendance_monthly_summary AS
SELECT
  date_trunc('month', a.session_date)::date AS month,
  ar.person_id,
  ar.person_type,
  SUM(CASE WHEN ar.status = 'present' THEN 1 ELSE 0 END) AS present_count,
  SUM(CASE WHEN ar.status = 'absent' THEN 1 ELSE 0 END) AS absent_count,
  COUNT(ar.*) AS total_records
FROM attendance_sessions a
JOIN attendance_records ar ON ar.session_id = a.id
GROUP BY 1, ar.person_id, ar.person_type;
