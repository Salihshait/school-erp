-- Supabase SQL for Library Module
-- Tables: book_categories, books, book_copies, members (students/teachers/staff), issues, reservations, fines, barcodes

CREATE TABLE IF NOT EXISTS book_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text
);

CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text,
  isbn text UNIQUE,
  category_id uuid REFERENCES book_categories(id) ON DELETE SET NULL,
  publisher text,
  year integer,
  total_copies integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS book_copies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  copy_no integer,
  barcode text UNIQUE,
  rfid_tag text UNIQUE,
  status text NOT NULL CHECK (status IN ('available','issued','reserved','lost','maintenance')) DEFAULT 'available'
);

CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL, -- links to profiles table
  person_type text NOT NULL CHECK (person_type IN ('student','teacher','staff')),
  membership_started date DEFAULT now(),
  membership_expires date
);

CREATE TABLE IF NOT EXISTS issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  copy_id uuid REFERENCES book_copies(id) ON DELETE SET NULL,
  member_id uuid REFERENCES members(id) ON DELETE SET NULL,
  issued_at timestamptz DEFAULT now(),
  due_date date,
  returned_at timestamptz,
  renewed_count integer DEFAULT 0,
  status text NOT NULL CHECK (status IN ('issued','returned','overdue','lost')) DEFAULT 'issued'
);

CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  member_id uuid REFERENCES members(id) ON DELETE SET NULL,
  reserved_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

CREATE TABLE IF NOT EXISTS fines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id uuid REFERENCES issues(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  reason text,
  paid boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Simple view: current_issues
CREATE OR REPLACE VIEW current_issues AS
SELECT i.id, b.title, c.copy_no, m.person_id, i.issued_at, i.due_date, i.status
FROM issues i
LEFT JOIN book_copies c ON c.id = i.copy_id
LEFT JOIN books b ON b.id = c.book_id
LEFT JOIN members m ON m.id = i.member_id
WHERE i.status = 'issued' OR i.status = 'overdue';
