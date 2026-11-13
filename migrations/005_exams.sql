CREATE TABLE subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  UNIQUE (school_id, name)
);
CREATE TABLE exams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_id INTEGER REFERENCES classes(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  exam_date TEXT,
  max_marks REAL NOT NULL DEFAULT 100 CHECK (max_marks > 0)
);
CREATE TABLE results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  marks REAL NOT NULL CHECK (marks >= 0),
  UNIQUE (exam_id, student_id, subject_id)
);
CREATE INDEX idx_results_exam ON results(school_id, exam_id);
