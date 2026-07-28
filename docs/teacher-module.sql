-- Supabase-compatible SQL schema for Teacher Management Module
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE teacher_gender AS ENUM ('male','female','other');
CREATE TYPE employment_type AS ENUM ('full_time','part_time','contract','visiting');

-- Departments
CREATE TABLE public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  code text UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Core teachers table
CREATE TABLE public.teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_number text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  dob date,
  gender teacher_gender,
  email text,
  mobile text,
  address text,
  city text,
  state text,
  country text,
  postal_code text,
  department_id uuid REFERENCES public.departments(id),
  designation text,
  employment_type employment_type DEFAULT 'full_time',
  joining_date timestamptz,
  salary numeric,
  photo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Qualifications and certifications
CREATE TABLE public.teacher_qualifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  degree text,
  institution text,
  year integer,
  grade text,
  created_at timestamptz DEFAULT now()
);

-- Experience history
CREATE TABLE public.teacher_experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  organization text,
  role text,
  from_date date,
  to_date date,
  responsibilities text
);

-- Attendance records
CREATE TABLE public.teacher_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  date date NOT NULL,
  status text NOT NULL, -- present/absent/leave/half
  check_in timestamptz,
  check_out timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE (teacher_id, date)
);

-- Leave requests
CREATE TABLE public.teacher_leaves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  leave_type text,
  from_date date,
  to_date date,
  reason text,
  status text DEFAULT 'pending', -- pending/approved/rejected
  requested_at timestamptz DEFAULT now()
);

-- Documents storage
CREATE TABLE public.teacher_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  name text NOT NULL,
  storage_path text,
  public_url text,
  uploaded_at timestamptz DEFAULT now()
);

-- Timetable entries
CREATE TABLE public.teacher_timetable (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  day_of_week int NOT NULL, -- 0=Sunday..6=Saturday
  start_time time NOT NULL,
  end_time time NOT NULL,
  class_id uuid,
  subject text,
  location text
);

-- Performance reviews
CREATE TABLE public.teacher_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  review_date timestamptz DEFAULT now(),
  reviewer_id uuid REFERENCES public.profiles(id),
  score numeric,
  comments text
);

-- Full-text search index
CREATE INDEX teachers_fulltext_idx ON public.teachers USING gin (to_tsvector('english', coalesce(first_name,'') || ' ' || coalesce(last_name,'') || ' ' || coalesce(employee_number,'')));
