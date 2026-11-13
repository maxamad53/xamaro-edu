const express = require("express");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");
const { db } = require("./db");
const r = express.Router();
r.post("/", rateLimit({ windowMs: 3600000, max: 10 }), (req, res) => {
  const b = req.body || {};
  const s = k => (typeof b[k] === "string" ? b[k].trim() : "");
  const name = s("school_name"), code = s("school_code").toLowerCase(), an = s("admin_name"), email = s("admin_email").toLowerCase(), pw = b.admin_password;
  if (!name || !/^[a-z0-9-]{3,30}$/.test(code) || !an || !email || typeof pw !== "string" || pw.length < 8)
    return res.status(400).json({ error: "Xogta waa buuxin weydey (koodhka: xarfo yar, tiro, 3+; password 8+)" });
  const role = db.prepare("SELECT id FROM roles WHERE name='school_admin'").get();
  const plan = db.prepare("SELECT id FROM plans WHERE name='Free'").get();
  try {
    db.exec("BEGIN");
    const x = db.prepare("INSERT INTO schools (name,code,email,approved,status) VALUES (?,?,?,0,'active')").run(name, code, email);
    const sid = Number(x.lastInsertRowid);
    db.prepare("INSERT INTO subscriptions (school_id,plan_id,status,starts_at,ends_at) VALUES (?,?,'active',datetime('now'),datetime('now','+3650 days'))").run(sid, plan.id);
    db.prepare("INSERT INTO users (school_id,role_id,full_name,email,password_hash) VALUES (?,?,?,?,?)").run(sid, role.id, an, email, bcrypt.hashSync(pw, 12));
    db.exec("COMMIT");
    res.status(201).json({ ok: true });
  } catch (e) {
    db.exec("ROLLBACK");
    res.status(409).json({ error: "Koodhka dugsiga ama email-ka hore ayuu u jiray" });
  }
});
module.exports = r;
