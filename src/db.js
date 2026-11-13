const fs = require("fs"), path = require("path");
const { DatabaseSync } = require("node:sqlite");
fs.mkdirSync(path.join(__dirname, "..", "data"), { recursive: true });
const db = new DatabaseSync(path.join(__dirname, "..", "data", "school.db"));
db.exec("PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;");
function migrate() {
  db.exec("CREATE TABLE IF NOT EXISTS schema_migrations(name TEXT PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT (datetime('now')))");
  const dir = path.join(__dirname, "..", "migrations");
  const done = new Set(db.prepare("SELECT name FROM schema_migrations").all().map(r => r.name));
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith(".sql")).sort()) {
    if (done.has(f)) continue;
    db.exec("BEGIN");
    try {
      db.exec(fs.readFileSync(path.join(dir, f), "utf8"));
      db.prepare("INSERT INTO schema_migrations(name) VALUES(?)").run(f);
      db.exec("COMMIT");
      console.log("applied", f);
    } catch (e) { db.exec("ROLLBACK"); throw e; }
  }
}
module.exports = { db, migrate };
