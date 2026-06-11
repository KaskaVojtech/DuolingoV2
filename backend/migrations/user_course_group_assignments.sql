-- User–course direct assignments
CREATE TABLE user_course_assignments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id   UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, course_id)
);

CREATE INDEX idx_uca_user   ON user_course_assignments(user_id);
CREATE INDEX idx_uca_course ON user_course_assignments(course_id);

-- Group–course assignments
CREATE TABLE group_course_assignments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id    UUID NOT NULL REFERENCES user_groups(id) ON DELETE CASCADE,
  course_id   UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (group_id, course_id)
);

CREATE INDEX idx_gca_group  ON group_course_assignments(group_id);
CREATE INDEX idx_gca_course ON group_course_assignments(course_id);
