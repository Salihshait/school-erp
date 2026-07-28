-- Reports module SQL for Supabase
-- Adds only the aggregate views that don't already exist elsewhere.
-- Reused as-is from other modules (no new SQL needed for these):
--   attendance_monthly_summary  (docs/attendance-module.sql)  -> Attendance report
--   monthly_collection          (docs/fee-module.sql)         -> Fees report
--   payroll_summary             (docs/payroll-module.sql)     -> Payroll report
--   vehicle_utilization         (docs/transport-module.sql)   -> Transport report
--   room_occupancy              (docs/hostel-module.sql)      -> Hostel report
--   class_result_summary        (docs/exam-module.sql)        -> Student Performance report

-- Admissions report: admissions per month
CREATE OR REPLACE VIEW admissions_monthly AS
SELECT date_trunc('month', admission_date)::date AS month, COUNT(*) AS count
FROM admissions
GROUP BY 1
ORDER BY 1;

-- Exams report: per-exam average marks and pass/fail counts (pass = >=40%)
CREATE OR REPLACE VIEW exam_performance_summary AS
SELECT
  e.id AS exam_id,
  e.title,
  COUNT(m.*) AS total_entries,
  COALESCE(AVG(m.marks_obtained), 0) AS avg_marks,
  COALESCE(AVG(m.max_marks), 0) AS avg_max_marks,
  SUM(CASE WHEN m.max_marks > 0 AND m.marks_obtained >= 0.4 * m.max_marks THEN 1 ELSE 0 END) AS pass_count,
  SUM(CASE WHEN m.max_marks > 0 AND m.marks_obtained < 0.4 * m.max_marks THEN 1 ELSE 0 END) AS fail_count
FROM exams e
LEFT JOIN marks m ON m.exam_id = e.id
GROUP BY e.id, e.title;

-- Library report: most-issued books
CREATE OR REPLACE VIEW book_issue_summary AS
SELECT b.id AS book_id, b.title, COUNT(i.*) AS total_issues
FROM books b
LEFT JOIN book_copies c ON c.book_id = b.id
LEFT JOIN issues i ON i.copy_id = c.id
GROUP BY b.id, b.title
ORDER BY total_issues DESC;

-- Teacher Performance report: average review score per teacher
CREATE OR REPLACE VIEW teacher_performance_summary AS
SELECT
  t.id AS teacher_id,
  t.first_name,
  t.last_name,
  COUNT(p.*) AS reviews_count,
  COALESCE(AVG(p.score), 0) AS avg_score
FROM teachers t
LEFT JOIN teacher_performance p ON p.teacher_id = t.id
GROUP BY t.id, t.first_name, t.last_name;
