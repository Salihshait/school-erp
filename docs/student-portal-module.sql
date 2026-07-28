-- Student Portal module SQL for Supabase
-- Tables: assignments, assignment_submissions, study_notes, certificates
-- Reuses existing tables: attendance_records (attendance, person_type='student'),
-- homework, marks/progress_cards (exam results), fees/payments (fees),
-- current_issues/members (library), teacher_timetable (timetable, by class_id),
-- students (profile)

CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid,
  section text,
  subject text NOT NULL,
  title text NOT NULL,
  description text,
  due_date date,
  max_marks numeric,
  created_by uuid REFERENCES teachers(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assignment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid REFERENCES assignments(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  content text,
  file_url text,
  submitted_at timestamptz DEFAULT now(),
  marks_obtained numeric,
  status text NOT NULL CHECK (status IN ('submitted','graded')) DEFAULT 'submitted',
  created_at timestamptz DEFAULT now(),
  UNIQUE (assignment_id, student_id)
);

CREATE TABLE IF NOT EXISTS study_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid,
  section text,
  subject text NOT NULL,
  title text NOT NULL,
  file_url text,
  uploaded_by uuid REFERENCES teachers(id) ON DELETE SET NULL,
  uploaded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  certificate_type text NOT NULL CHECK (certificate_type IN ('bonafide','transfer','character','achievement','other')) DEFAULT 'bonafide',
  issued_date date DEFAULT now(),
  issued_by uuid REFERENCES teachers(id) ON DELETE SET NULL,
  remarks text,
  created_at timestamptz DEFAULT now()
);
