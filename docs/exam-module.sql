-- Supabase SQL for Examination Module
-- Tables: exam_types, exams, questions, question_papers, marks, grade_scales, cgpa_config, progress_cards, hall_tickets, exam_schedule, published_results

CREATE TABLE IF NOT EXISTS exam_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_type_id uuid REFERENCES exam_types(id) ON DELETE SET NULL,
  title text NOT NULL,
  class_id uuid,
  start_date timestamptz,
  end_date timestamptz,
  total_marks numeric,
  passing_marks numeric,
  created_by uuid,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid REFERENCES exams(id) ON DELETE CASCADE,
  subject_id uuid,
  question_text text NOT NULL,
  max_marks numeric NOT NULL,
  question_type text NOT NULL CHECK (question_type IN ('mcq','descriptive','truefalse'))
);

CREATE TABLE IF NOT EXISTS question_papers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid REFERENCES exams(id) ON DELETE CASCADE,
  generated_at timestamptz DEFAULT now(),
  file_url text
);

CREATE TABLE IF NOT EXISTS marks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid REFERENCES exams(id) ON DELETE CASCADE,
  student_id uuid NOT NULL,
  subject_id uuid,
  marks_obtained numeric,
  max_marks numeric,
  entered_by uuid,
  entered_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS grade_scales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  min_percent numeric NOT NULL,
  max_percent numeric NOT NULL,
  grade text NOT NULL,
  point numeric
);

CREATE TABLE IF NOT EXISTS cgpa_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scale_name text NOT NULL,
  max_point numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS progress_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  exam_id uuid REFERENCES exams(id) ON DELETE CASCADE,
  generated_at timestamptz DEFAULT now(),
  file_url text
);

CREATE TABLE IF NOT EXISTS hall_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid REFERENCES exams(id) ON DELETE CASCADE,
  student_id uuid NOT NULL,
  ticket_url text,
  generated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exam_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid REFERENCES exams(id) ON DELETE CASCADE,
  subject_id uuid,
  start_time timestamptz,
  end_time timestamptz,
  venue text
);

CREATE TABLE IF NOT EXISTS published_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid REFERENCES exams(id) ON DELETE CASCADE,
  published_by uuid,
  published_at timestamptz DEFAULT now(),
  notes text
);

-- Views: class-wise result summary (simplified)
CREATE OR REPLACE VIEW class_result_summary AS
SELECT e.class_id, m.student_id, SUM(m.marks_obtained) AS total_obtained, SUM(m.max_marks) AS total_max
FROM marks m
JOIN exams e ON e.id = m.exam_id
GROUP BY e.class_id, m.student_id;
