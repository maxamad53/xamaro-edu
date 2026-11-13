ALTER TABLE users ADD COLUMN student_id INTEGER REFERENCES students(id) ON DELETE SET NULL;
CREATE UNIQUE INDEX idx_users_student ON users(student_id) WHERE student_id IS NOT NULL;
