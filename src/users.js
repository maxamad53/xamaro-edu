const express = require("express");
const bcrypt = require("bcryptjs");
const { db } = require("./db");
const { auth, allow } = require("./auth");
const r = express.Router();
r.use(auth, allow("school_admin"));
const ROLES = ["principal", "teacher", "accountant", "student", "parent", "receptionist"];
r.get("/", (req, res) => {
  res.json(db.prepare("SELECT u.id,u.full_name,u.email,u.status,r.name AS role FROM users u JOIN roles r ON r.id=u.role_id WHERE u.school_id=? ORDER BY u.id DESC").all(req.user.school_id));
});
r.post("/", (req, res) => {
  const b = req.body || {};
  const ok = k => typeof b[k] === "string" && b[k].trim();
  if (!ok("full_name") || !ok("email") || !ok("password") || !ROLES.includes(b.role))
    return res.status(400).json({ error: "full_name, email, password iyo role sax ah ayaa loo baahan yahay" });
  if (b.password.length < 8) return res.status(400).json({ error: "Password-ku waa inuu ahaado 8+ xarfood" });
  const role = db.prepare("SELECT id FROM roles WHERE name=?").get(b.role);
  try {
    const x = db.prepare("INSERT INTO users (school_id,role_id,full_name,email,password_hash) VALUES (?,?,?,?,?)")
      .run(req.user.school_id, role.id, b.full_name.trim(), b.email.trim().toLowerCase(), bcrypt.hashSync(b.password, 12));
    db.prepare("INSERT INTO audit_logs (school_id,user_id,action,entity,entity_id,ip) VALUES (?,?,?,?,?,?)").run(req.user.school_id, req.user.id, "user_created", "user", Number(x.lastInsertRowid), req.ip);
    res.status(201).json({ id: Number(x.lastInsertRowid) });
  } catch (e) { res.status(409).json({ error: "Email-kan hore ayuu u jiray" }); }
});
r.patch("/:id/status", (req, res) => {
  const { status } = req.body || {};
  const id = Number(req.params.id);
  if (!["active", "inactive"].includes(status)) return res.status(400).json({ error: "Status khaldan" });
  if (id === req.user.id) return res.status(400).json({ error: "Naftaada ma xidhi kartid" });
  const x = db.prepare("UPDATE users SET status=? WHERE id=? AND school_id=?").run(status, id, req.user.school_id);
  if (!x.changes) return res.status(404).json({ error: "Isticmaale lama helin" });
  db.prepare("INSERT INTO audit_logs (school_id,user_id,action,entity,entity_id,ip) VALUES (?,?,?,?,?,?)").run(req.user.school_id, req.user.id, "user_" + status, "user", id, req.ip);
  res.json({ ok: true });
});
module.exports = r;
