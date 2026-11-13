CREATE TABLE attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present','absent','late','excused')),
  note TEXT,
  marked_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (student_id, date)
);
CREATE INDEX idx_att_school_date ON attendance(school_id, date);
