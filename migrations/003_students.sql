CREATE TABLE classes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  section TEXT NOT NULL DEFAULT '',
  UNIQUE (school_id, name, section)
);
CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  reg_no TEXT NOT NULL,
  full_name TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('male','female')),
  birth_date TEXT,
  class_id INTEGER REFERENCES classes(id) ON DELETE SET NULL,
  guardian_name TEXT, guardian_phone TEXT, address TEXT, photo TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','graduated')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (school_id, reg_no)
);
CREATE INDEX idx_students_school ON students(school_id, class_id);
