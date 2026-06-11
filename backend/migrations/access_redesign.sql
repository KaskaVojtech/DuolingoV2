-- Access redesign: codes/access are tied to a group and/or an individual user,
-- not to a course in its settings. Course access = individual grant (user_course_assignments)
-- ∪ membership in a group with an assigned course (group_course_assignments).
-- Run manually (synchronize: false).

CREATE TABLE IF NOT EXISTS access_codes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            VARCHAR(50)  NOT NULL UNIQUE,
  course_id       UUID         NOT NULL REFERENCES courses(id)     ON DELETE CASCADE,
  group_id        UUID         NULL     REFERENCES user_groups(id) ON DELETE SET NULL,
  valid_from      TIMESTAMPTZ  NULL,
  valid_until     TIMESTAMPTZ  NULL,
  status          VARCHAR(20)  NOT NULL DEFAULT 'active',   -- active | used | revoked
  used_by_user_id UUID         NULL     REFERENCES users(id) ON DELETE SET NULL,
  used_at         TIMESTAMPTZ  NULL,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_access_codes_course ON access_codes(course_id);
CREATE INDEX IF NOT EXISTS idx_access_codes_status ON access_codes(status);

-- Clean start — the old course-bound access model is dropped
TRUNCATE TABLE course_access;
