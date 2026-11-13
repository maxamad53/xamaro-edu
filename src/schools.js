const express = require("express");
const bcrypt = require("bcryptjs");
const { db } = require("./db");
const { auth, allow } = require("./auth");
const r = express.Router();
r.use(auth, allow("super_admin"));
const log = (req, action, id) => db.prepare("INSERT INTO audit_logs (user_id,action,entity,entity_id,ip) VALUES (?,?,?,?,?)").run(req.user.id, action, "school", id, req.ip);
r.get("/", (req, res) => {
  res.json(db.prepare("SELECT s.id,s.name,s.code,s.status,s.approved,p.name AS plan,sub.status AS sub_status,sub.ends_at, (SELECT COUNT(*) FROM students WHERE school_id=s.id) AS students, (SELECT COUNT(*) FROM users u JOIN roles r ON r.id=u.role_id WHERE u.school_id=s.id AND r.name='teacher') AS teachers, (SELECT COUNT(*) FROM attendance WHERE school_id=s.id AND date=date('now','localtime') AND status IN ('present','late')) AS present_today, (SELECT COUNT(*) FROM attendance WHERE school_id=s.id AND date=date('now','localtime') AND status='absent') AS absent_today FROM schools s LEFT JOIN subscriptions sub ON sub.id=(SELECT MAX(id) FROM subscriptions WHERE school_id=s.id) LEFT JOIN plans p ON p.id=sub.plan_id ORDER BY s.id DESC").all());
});
r.patch("/:id/status", (req, res) => {
  const { status } = req.body || {};
  if (!["active", "suspended"].includes(status)) return res.status(400).json({ error: "Status khaldan" });
  const x = db.prepare("UPDATE schools SET status=? WHERE id=?").run(status, req.params.id);
  if (!x.changes) return res.status(404).json({ error: "Dugsi lama helin" });
  log(req, "school_" + status, Number(req.params.id));
  res.json({ ok: true });
});
r.post("/", (req, res) => {
  const b = req.body || {};
  const need = ["name", "code", "admin_name", "admin_email", "admin_password", "plan"];
  for (const k of need) if (typeof b[k] !== "string" || !b[k].trim()) return res.status(400).json({ error: k + " waa loo baahan yahay" });
  if (b.admin_password.length < 8) return res.status(400).json({ error: "Password-ku waa inuu ahaado 8+ xarfood" });
  const plan = db.prepare("SELECT * FROM plans WHERE lower(name)=lower(?)").get(b.plan);
  if (!plan) return res.status(400).json({ error: "Plan lama helin" });
  const role = db.prepare("SELECT id FROM roles WHERE name='school_admin'").get();
  const days = plan.trial_days > 0 ? plan.trial_days : 365;
  const st = plan.trial_days > 0 ? "trial" : "active";
  try {
    db.exec("BEGIN");
    const s = db.prepare("INSERT INTO schools (name,code,email,phone,address) VALUES (?,?,?,?,?)")
      .run(b.name.trim(), b.code.trim().toLowerCase(), b.email || null, b.phone || null, b.address || null);
    const sid = Number(s.lastInsertRowid);
    db.prepare("INSERT INTO subscriptions (school_id,plan_id,status,starts_at,ends_at) VALUES (?,?,?,datetime('now'),datetime('now', ?))")
      .run(sid, plan.id, st, "+" + days + " days");
    db.prepare("INSERT INTO users (school_id,role_id,full_name,email,password_hash) VALUES (?,?,?,?,?)")
      .run(sid, role.id, b.admin_name.trim(), b.admin_email.trim().toLowerCase(), bcrypt.hashSync(b.admin_password, 12));
    db.exec("COMMIT");
    log(req, "school_created", sid);
    res.status(201).json({ id: sid });
  } catch (e) {
    db.exec("ROLLBACK");
    if (String(e.message).includes("UNIQUE")) return res.status(409).json({ error: "Code ama email hore ayuu u jiray" });
    res.status(500).json({ error: "Khalad server" });
  }
});
r.patch("/:id/approve", (req, res) => {
  const x = db.prepare("UPDATE schools SET approved=1 WHERE id=?").run(Number(req.params.id));
  if (!x.changes) return res.status(404).json({ error: "Dugsi lama helin" });
  const q = db.prepare("INSERT OR IGNORE INTO subjects (school_id,name,level) VALUES (?,?,?)");
  [["all", ["Af-Soomaali", "Ingiriis", "Xisaab", "Af-Amxaari", "Anshaxa iyo Muwaadinimada", "Bayoolaji", "Kimiko", "Fiisigis"]], ["middle", ["Sayniska", "Bulshada", "Farshaxanka"]], ["secondary", ["Juquraafi", "Taariikh", "Dhaqaale", "ICT"]]].forEach(([lv, a]) => a.forEach(n => q.run(Number(req.params.id), n, lv)));
  log(req, "school_approved", Number(req.params.id));
  res.json({ ok: true });
});
r.delete("/:id/reject", (req, res) => {
  const x = db.prepare("DELETE FROM schools WHERE id=? AND approved=0").run(Number(req.params.id));
  if (!x.changes) return res.status(404).json({ error: "Dugsi sugaya lama helin" });
  log(req, "school_rejected", Number(req.params.id));
  res.json({ ok: true });
});
r.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const sc = db.prepare("SELECT id,name,code,email,status,approved,created_at FROM schools WHERE id=?").get(id);
  if (!sc) return res.status(404).json({ error: "Dugsi lama helin" });
  const n = sql => db.prepare(sql).get(id).n;
  sc.admins = db.prepare("SELECT u.full_name,u.email FROM users u JOIN roles r ON r.id=u.role_id WHERE u.school_id=? AND r.name='school_admin'").all(id);
  sc.students = n("SELECT COUNT(*) AS n FROM students WHERE school_id=?");
  sc.teachers = n("SELECT COUNT(*) AS n FROM users u JOIN roles r ON r.id=u.role_id WHERE u.school_id=? AND r.name='teacher'");
  sc.classes = n("SELECT COUNT(*) AS n FROM classes WHERE school_id=?");
  sc.subjects = n("SELECT COUNT(*) AS n FROM subjects WHERE school_id=?");
  sc.present_today = n("SELECT COUNT(*) AS n FROM attendance WHERE school_id=? AND date=date('now','localtime') AND status IN ('present','late')");
  sc.absent_today = n("SELECT COUNT(*) AS n FROM attendance WHERE school_id=? AND date=date('now','localtime') AND status='absent'");
  res.json(sc);
});
module.exports = r;
