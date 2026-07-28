-- Phase 3: Supabase-compatible PostgreSQL schema for School ERP

-- Enable UUID generation for Supabase/PostgreSQL
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums for domain constraints
CREATE TYPE user_role AS ENUM ('teacher', 'admin', 'student', 'guardian');
CREATE TYPE assignment_type AS ENUM ('quiz', 'homework', 'project', 'exam', 'assessment', 'other');
CREATE TYPE mastery_level AS ENUM ('introduced', 'practiced', 'mastered', 'exceeded');
CREATE TYPE export_format AS ENUM ('csv', 'pdf');
CREATE TYPE export_status AS ENUM ('pending', 'completed', 'failed');

-- User profile records linked to Supabase Auth users
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL UNIQUE,
  full_name text NOT NULL,
  role user_role NOT NULL DEFAULT 'teacher',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Optional institution/school metadata for multi-school support
CREATE TABLE public.schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE,
  address text,
  timezone text DEFAULT 'UTC',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Class or course sections taught by a staff profile
CREATE TABLE public.classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES public.schools(id),
  name text NOT NULL,
  code text UNIQUE,
  teacher_id uuid NOT NULL REFERENCES public.profiles(id),
  term text,
  grade_level text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Canonical student records separate from auth users
CREATE TABLE public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES public.schools(id),
  student_number text NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date,
  gender text,
  enrollment_status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Many-to-many student enrollment in class sections
CREATE TABLE public.student_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  left_at timestamptz,
  UNIQUE (student_id, class_id)
);

-- Assignments, tasks, and assessments assigned to a class
CREATE TABLE public.assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  type assignment_type NOT NULL DEFAULT 'other',
  due_date timestamptz,
  total_points numeric CHECK (total_points >= 0),
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Each student's grade entry for a given assignment
CREATE TABLE public.student_grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  assignment_id uuid NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  score numeric CHECK (score >= 0),
  letter_grade text,
  grade_percent numeric CHECK (grade_percent >= 0 AND grade_percent <= 100),
  comments text,
  is_final boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, assignment_id)
);

-- Academic standards that can be attached to assignments or grade entries
CREATE TABLE public.standards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  description text NOT NULL,
  subject text,
  grade_level text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Mapping of student-grade entries to standards alignment and mastery
CREATE TABLE public.grade_standard_alignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_grade_id uuid NOT NULL REFERENCES public.student_grades(id) ON DELETE CASCADE,
  standard_id uuid NOT NULL REFERENCES public.standards(id) ON DELETE CASCADE,
  mastery_level mastery_level NOT NULL DEFAULT 'introduced',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_grade_id, standard_id)
);

-- Export request audit table for permission-aware report generation
CREATE TABLE public.export_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requested_by uuid NOT NULL REFERENCES public.profiles(id),
  requested_at timestamptz NOT NULL DEFAULT now(),
  format export_format NOT NULL DEFAULT 'pdf',
  min_role user_role NOT NULL DEFAULT 'teacher',
  restrict_comments_to_admin boolean NOT NULL DEFAULT false,
  restrict_standards_to_admin boolean NOT NULL DEFAULT false,
  columns text[] NOT NULL DEFAULT ARRAY['studentName','assignment','grade','standards'],
  student_count integer NOT NULL DEFAULT 0,
  status export_status NOT NULL DEFAULT 'completed',
  result_url text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- General audit events for actions like login, exports, and role changes
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES public.profiles(id),
  event_type text NOT NULL,
  event_at timestamptz NOT NULL DEFAULT now(),
  resource text,
  details jsonb,
  client_ip inet
);
