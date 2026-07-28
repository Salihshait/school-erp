-- Supabase SQL for Fee Management Module
-- Tables: fee_categories, fees, payments, discounts, scholarships, fines, installments, receipts

CREATE TABLE IF NOT EXISTS fee_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  category_id uuid REFERENCES fee_categories(id) ON DELETE SET NULL,
  amount numeric NOT NULL,
  due_date date,
  status text NOT NULL CHECK (status IN ('pending','paid','partial','overdue')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  note text
);

CREATE TABLE IF NOT EXISTS discounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_id uuid REFERENCES fees(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('percentage','fixed')),
  value numeric NOT NULL,
  reason text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scholarships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  title text NOT NULL,
  amount numeric NOT NULL,
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  amount numeric NOT NULL,
  reason text,
  assessed_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS installments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_id uuid REFERENCES fees(id) ON DELETE CASCADE,
  installment_no integer NOT NULL,
  amount numeric NOT NULL,
  due_date date,
  paid boolean DEFAULT false,
  paid_at timestamptz
);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_id uuid REFERENCES fees(id) ON DELETE SET NULL,
  student_id uuid,
  amount numeric NOT NULL,
  method text NOT NULL CHECK (method IN ('cash','card','upi','netbanking','wallet')),
  reference text,
  status text NOT NULL CHECK (status IN ('completed','failed','pending','refunded')) DEFAULT 'completed',
  collected_by uuid,
  collected_at timestamptz DEFAULT now(),
  note text
);

CREATE TABLE IF NOT EXISTS receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid REFERENCES payments(id) ON DELETE CASCADE,
  receipt_number text UNIQUE,
  generated_at timestamptz DEFAULT now()
);

-- Views and helper functions
CREATE OR REPLACE VIEW daily_collection AS
SELECT date_trunc('day', collected_at)::date as day, SUM(amount) as total
FROM payments
WHERE status = 'completed'
GROUP BY 1
ORDER BY 1 DESC;

CREATE OR REPLACE VIEW monthly_collection AS
SELECT date_trunc('month', collected_at)::date as month, SUM(amount) as total
FROM payments
WHERE status = 'completed'
GROUP BY 1
ORDER BY 1 DESC;
