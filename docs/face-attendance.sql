-- Supabase-compatible SQL for face-recognition + biometric-device attendance capture.
-- Builds on docs/attendance-module.sql and docs/student-module.sql.
-- Also requires a Supabase Storage bucket named `student-face-enrollments`
-- (create it the same way `student-photos` was created — see docs/student-module-commit-message.txt).

-- Reference face descriptors captured during enrollment. face-api.js produces a
-- 128-length float descriptor per detected face; we store one row per captured
-- angle (front/left/right) so matching can compare against several samples.
CREATE TABLE IF NOT EXISTS student_face_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  descriptor jsonb NOT NULL,
  image_path text,
  label text,
  captured_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_face_enrollments_student ON student_face_enrollments(student_id);

-- Track how each attendance record was captured, and the recognizer's
-- confidence when it was a face match.
ALTER TABLE attendance_records
  ADD COLUMN IF NOT EXISTS capture_method text NOT NULL DEFAULT 'manual'
    CHECK (capture_method IN ('manual', 'rfid', 'qr', 'face', 'fingerprint')),
  ADD COLUMN IF NOT EXISTS face_confidence numeric;

-- Pluggable fingerprint/biometric hardware registry.
--
-- A browser cannot talk to a USB/serial fingerprint scanner directly — that
-- requires the vendor's SDK running as local middleware that exposes some API
-- (HTTP, WebSocket, etc.) specific to that hardware. This table stores enough
-- connection config for src/services/fingerprintService.js to poll a
-- locally-running bridge once you know its actual contract; until a real
-- device is wired up, `enabled` stays false and the UI just shows the
-- configured device as disconnected.
CREATE TABLE IF NOT EXISTS biometric_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  device_type text NOT NULL DEFAULT 'fingerprint' CHECK (device_type IN ('fingerprint')),
  api_endpoint text NOT NULL,
  api_key text,
  enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Pairing between a student and the template ID the vendor SDK assigned when
-- their fingerprint was enrolled on the device itself (enrollment happens in
-- the vendor's own software/hardware, not this app).
CREATE TABLE IF NOT EXISTS student_fingerprint_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  device_id uuid REFERENCES biometric_devices(id) ON DELETE SET NULL,
  external_template_id text NOT NULL,
  enrolled_at timestamptz DEFAULT now(),
  UNIQUE (device_id, external_template_id)
);
