-- Parent Portal module SQL for Supabase
-- Tables: homework, notices, events, messages, notifications
-- Reuses existing tables: attendance_records/attendance_leaves (attendance + leave
-- requests, person_type='student'), marks/progress_cards (marks + report card),
-- fees/payments (fee payment), parents (parent -> student linkage by email)

CREATE TABLE IF NOT EXISTS homework (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid,
  section text,
  subject text NOT NULL,
  title text NOT NULL,
  description text,
  due_date date,
  created_by uuid REFERENCES teachers(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  audience text NOT NULL CHECK (audience IN ('all','class')) DEFAULT 'all',
  class_id uuid,
  posted_by uuid REFERENCES teachers(id) ON DELETE SET NULL,
  posted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date date NOT NULL,
  location text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  sender_type text NOT NULL CHECK (sender_type IN ('parent','teacher')),
  body text NOT NULL,
  sent_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(student_id, teacher_id);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES parents(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
