-- Admin Dashboard module SQL for Supabase
-- Only one new table: everything else is computed from existing tables/views.
--
-- Reused as-is (no new SQL needed):
--   students, teachers                         -> Total Students / Teachers / Classes / Birthdays widgets
--   attendance_sessions / attendance_records    -> Today's Attendance widget
--   admissions                                  -> Recent Admissions widget
--   notices                                     -> Recent Notices widget
--   monthly_collection (docs/fee-module.sql)    -> Income widget / chart
--   attendance_monthly_summary                  -> Attendance chart (via getAttendanceOverview)
--   events (docs/parent-portal-module.sql),
--   attendance_holidays (docs/attendance-module.sql) -> Calendar widget

CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('salary','maintenance','utilities','supplies','transport','other')) DEFAULT 'other',
  description text,
  amount numeric NOT NULL,
  expense_date date NOT NULL DEFAULT now(),
  created_by uuid,
  created_at timestamptz DEFAULT now()
);
