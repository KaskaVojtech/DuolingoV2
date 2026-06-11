-- The old course-bound access model is fully replaced by the new one
-- (access_codes + user_course_assignments + group membership).
-- The course_access table is no longer used anywhere.
-- Run manually (synchronize: false).

DROP TABLE IF EXISTS course_access;
