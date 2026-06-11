-- =====================================================================
--  USER PORTAL — progress / completion tables
--  These tables were referenced in the code (user-portal.service) but
--  were never created. Without them the user side crashes at runtime.
-- =====================================================================

-- Lessons completed by the user
CREATE TABLE IF NOT EXISTS user_lesson_completions (
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id    UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, lesson_id)
);
CREATE INDEX IF NOT EXISTS idx_ulc_user ON user_lesson_completions(user_id);

-- Blocks completed by the user (content read / exercise / mix finished)
CREATE TABLE IF NOT EXISTS user_block_completions (
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  block_id     UUID NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, block_id)
);
CREATE INDEX IF NOT EXISTS idx_ubc_user ON user_block_completions(user_id);

-- Activity results (exercise / mix) — for score, XP and the progress profile.
-- block_id refers to a block of type 'exercise' or 'mix'.
CREATE TABLE IF NOT EXISTS user_activity_results (
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  block_id     UUID NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
  lesson_id    UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  kind         VARCHAR(20) NOT NULL,         -- 'exercise' | 'mix'
  score        INT NOT NULL DEFAULT 0,       -- correctly answered items
  total        INT NOT NULL DEFAULT 0,       -- total items
  xp_earned    INT NOT NULL DEFAULT 0,       -- best earned XP
  attempts     INT NOT NULL DEFAULT 1,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, block_id)
);
CREATE INDEX IF NOT EXISTS idx_uar_user ON user_activity_results(user_id);
CREATE INDEX IF NOT EXISTS idx_uar_lesson ON user_activity_results(lesson_id);
