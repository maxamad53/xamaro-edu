const express = require("express");
const bcrypt = require("bcryptjs");
const { db } = require("./db");
const { auth } = require("./auth");
const r = express.Router();
r.post("/password", auth, (req, res) => {
  const { old_password, new_password } = req.body || {};
  if (typeof old_password !== "string" || typeof new_password !== "string" || new_password.length < 8)
    return res.status(400).json({ error: "Password cusub waa inuu ahaado 8+ xarfood" });
  const u = db.prepare("SELECT password_hash FROM users WHERE id=?").get(req.user.id);
  if (!bcrypt.compareSync(old_password, u.password_hash)) return res.status(400).json({ error: "Password-ka hore waa khaldan yahay" });
  db.prepare("UPDATE users SET password_hash=? WHERE id=?").run(bcrypt.hashSync(new_password, 12), req.user.id);
  db.prepare("INSERT INTO audit_logs (school_id,user_id,action,entity,entity_id,ip) VALUES (?,?,?,?,?,?)").run(req.user.school_id, req.user.id, "password_changed", "user", req.user.id, req.ip);
  res.json({ ok: true });
});
module.exports = r;
