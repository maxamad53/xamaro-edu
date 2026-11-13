CREATE TABLE fees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('tuition','registration','transport','other')),
  amount REAL NOT NULL CHECK (amount > 0),
  discount REAL NOT NULL DEFAULT 0 CHECK (discount >= 0),
  due_date TEXT,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  CHECK (discount <= amount)
);
CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  fee_id INTEGER NOT NULL REFERENCES fees(id) ON DELETE CASCADE,
  receipt_no TEXT NOT NULL,
  amount REAL NOT NULL CHECK (amount > 0),
  method TEXT,
  paid_at TEXT NOT NULL DEFAULT (datetime('now')),
  received_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (school_id, receipt_no)
);
CREATE TABLE expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount REAL NOT NULL CHECK (amount > 0),
  spent_at TEXT NOT NULL,
  note TEXT
);
CREATE INDEX idx_fees_student ON fees(school_id, student_id);
CREATE INDEX idx_payments_fee ON payments(fee_id);
