CREATE TABLE roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);
INSERT INTO roles (name) VALUES ('super_admin'),('school_admin'),('principal'),
 ('teacher'),('accountant'),('student'),('parent'),('receptionist');
CREATE TABLE permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE
);
CREATE TABLE role_permissions (
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
  role_id INTEGER NOT NULL REFERENCES roles(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en','ar','so')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_users_school ON users(school_id);
CREATE INDEX idx_subs_school ON subscriptions(school_id);
CREATE TABLE audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_id INTEGER REFERENCES schools(id) ON DELETE SET NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT, entity_id INTEGER, details TEXT, ip TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_audit_school ON audit_logs(school_id, created_at);
