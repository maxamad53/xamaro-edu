CREATE TABLE schools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  email TEXT, phone TEXT, address TEXT, logo TEXT,
  primary_color TEXT NOT NULL DEFAULT '#0A2540',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  price_monthly REAL NOT NULL DEFAULT 0,
  max_students INTEGER,
  trial_days INTEGER NOT NULL DEFAULT 0
);
INSERT INTO plans (name, price_monthly, max_students, trial_days) VALUES
 ('Free', 0, 50, 0), ('Basic', 29, 300, 14),
 ('Professional', 79, 1000, 14), ('Enterprise', 199, NULL, 30);
CREATE TABLE subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  plan_id INTEGER NOT NULL REFERENCES plans(id),
  status TEXT NOT NULL DEFAULT 'trial' CHECK (status IN ('trial','active','expired','cancelled')),
  starts_at TEXT NOT NULL,
  ends_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE subscription_payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subscription_id INTEGER NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  amount REAL NOT NULL CHECK (amount > 0),
  method TEXT, reference TEXT,
  paid_at TEXT NOT NULL DEFAULT (datetime('now'))
);
