-- Payroll module SQL for Supabase
-- Tables: salary_structures, allowances, deductions, pf_contributions,
--         esi_contributions, professional_tax, payslips, loans,
--         loan_repayments, advance_salary, bonuses

CREATE TABLE IF NOT EXISTS salary_structures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  basic numeric NOT NULL DEFAULT 0,
  hra numeric NOT NULL DEFAULT 0,
  da numeric NOT NULL DEFAULT 0,
  conveyance_allowance numeric NOT NULL DEFAULT 0,
  medical_allowance numeric NOT NULL DEFAULT 0,
  special_allowance numeric NOT NULL DEFAULT 0,
  effective_from date NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS allowances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  allowance_type text NOT NULL CHECK (allowance_type IN ('hra','da','conveyance','medical','special','other')) DEFAULT 'other',
  amount numeric NOT NULL,
  month date NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS deductions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  deduction_type text NOT NULL CHECK (deduction_type IN ('loan','advance','other')) DEFAULT 'other',
  amount numeric NOT NULL,
  month date NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pf_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  month date NOT NULL,
  uan_number text,
  employee_contribution numeric NOT NULL DEFAULT 0,
  employer_contribution numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE (teacher_id, month)
);

CREATE TABLE IF NOT EXISTS esi_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  month date NOT NULL,
  esi_number text,
  employee_contribution numeric NOT NULL DEFAULT 0,
  employer_contribution numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE (teacher_id, month)
);

CREATE TABLE IF NOT EXISTS professional_tax (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  month date NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE (teacher_id, month)
);

CREATE TABLE IF NOT EXISTS payslips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  month date NOT NULL,
  basic numeric NOT NULL DEFAULT 0,
  total_allowances numeric NOT NULL DEFAULT 0,
  total_deductions numeric NOT NULL DEFAULT 0,
  pf_amount numeric NOT NULL DEFAULT 0,
  esi_amount numeric NOT NULL DEFAULT 0,
  pt_amount numeric NOT NULL DEFAULT 0,
  gross_salary numeric NOT NULL DEFAULT 0,
  net_salary numeric NOT NULL DEFAULT 0,
  status text NOT NULL CHECK (status IN ('draft','generated','paid')) DEFAULT 'generated',
  generated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE (teacher_id, month)
);

CREATE TABLE IF NOT EXISTS loans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  principal_amount numeric NOT NULL,
  interest_rate numeric NOT NULL DEFAULT 0,
  tenure_months integer NOT NULL DEFAULT 1,
  monthly_installment numeric NOT NULL DEFAULT 0,
  start_month date NOT NULL DEFAULT now(),
  status text NOT NULL CHECK (status IN ('active','closed')) DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS loan_repayments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id uuid REFERENCES loans(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  repayment_month date NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS advance_salary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  requested_date date DEFAULT now(),
  status text NOT NULL CHECK (status IN ('pending','approved','rejected','recovered')) DEFAULT 'pending',
  recovery_month date,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bonuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  bonus_type text NOT NULL CHECK (bonus_type IN ('festival','performance','annual','other')) DEFAULT 'other',
  amount numeric NOT NULL,
  month date NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- View: monthly payroll summary (for reports)
CREATE OR REPLACE VIEW payroll_summary AS
SELECT
  month,
  COUNT(*) AS payslip_count,
  COALESCE(SUM(gross_salary), 0) AS total_gross,
  COALESCE(SUM(total_deductions), 0) AS total_deductions,
  COALESCE(SUM(net_salary), 0) AS total_net
FROM payslips
GROUP BY month
ORDER BY month;
