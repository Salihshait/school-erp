-- Supabase-compatible SQL schema for Student Management Module
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE gender AS ENUM ('male', 'female', 'other');
CREATE TYPE blood_group AS ENUM ('A+','A-','B+','B-','AB+','AB-','O+','O-');

-- Core students table
CREATE TABLE public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admission_number text UNIQUE NOT NULL,
  roll_number text,
  first_name text NOT NULL,
  last_name text NOT NULL,
  dob date,
  gender gender,
  blood_group blood_group,
  religion text,
  nationality text,
  aadhaar_number text,
  email text,
  mobile text,
  address text,
  city text,
  state text,
  country text,
  postal_code text,
  class_id uuid,
  section text,
  house text,
  admission_date timestamptz,
  photo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Parents/guardians
CREATE TABLE public.parents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  relation text NOT NULL, -- father, mother, guardian
  name text NOT NULL,
  occupation text,
  income numeric,
  phone text,
  email text,
  address text,
  created_at timestamptz DEFAULT now()
);

-- Medical information
CREATE TABLE public.student_medical (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  blood_group blood_group,
  allergies text,
  chronic_conditions text,
  medications text,
  emergency_contact text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Transport info
CREATE TABLE public.student_transport (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  mode text, -- bus/private/own
  route text,
  vehicle_number text,
  pickup_point text,
  drop_point text,
  created_at timestamptz DEFAULT now()
);

-- Hostel info
CREATE TABLE public.student_hostel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  hostel_name text,
  room_number text,
  warden text,
  created_at timestamptz DEFAULT now()
);

-- Previous school
CREATE TABLE public.previous_school (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  school_name text,
  board text,
  from_date date,
  to_date date,
  remarks text
);

-- Admission details
CREATE TABLE public.admissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  admission_date timestamptz,
  admission_type text,
  status text,
  created_at timestamptz DEFAULT now()
);

-- Documents (store Supabase storage path or URL)
CREATE TABLE public.student_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  name text NOT NULL,
  storage_path text,
  public_url text,
  uploaded_at timestamptz DEFAULT now()
);

-- Promotions and transfers
CREATE TABLE public.student_promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  from_class text,
  to_class text,
  promoted_on timestamptz DEFAULT now(),
  notes text
);

CREATE TABLE public.student_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  to_school text,
  transfer_date timestamptz DEFAULT now(),
  notes text
);

-- Full-text index for search convenience
CREATE INDEX students_fulltext_idx ON public.students USING gin (to_tsvector('english', coalesce(first_name,'') || ' ' || coalesce(last_name,'') || ' ' || coalesce(admission_number,'') || ' ' || coalesce(email,'')));
