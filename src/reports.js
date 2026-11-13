const express = require("express");
const { db } = require("./db");
const { auth, allow } = require("./auth");
const r = express.Router();
r.use(auth);
r.post("/", allow("school_admin"), (req, res) => {
  const b = req.body || {};
  const title = typeof b.title === "string" ? b.title.trim() : "", body = typeof b.body === "string" ? b.body.trim() : "";
  if (!title || !body || title.length > 150 || body.length > 3000) return res.status(400).json({ error: "Cinwaan iyo qoraal waa loo baahan yahay" });
  const x = db.prepare("INSERT INTO reports (school_id,user_id,title,body) VALUES (?,?,?,?)").run(req.user.school_id, req.user.id, title, body);
  res.status(201).json({ id: Number(x.lastInsertRowid) });
});
r.get("/", allow("school_admin", "super_admin"), (req, res) => {
  const sa = req.user.role === "super_admin";
  const sql = "SELECT r.id,r.title,r.body,r.is_read,r.created_at,s.name AS school FROM reports r JOIN schools s ON s.id=r.school_id" + (sa ? "" : " WHERE r.school_id=?") + " ORDER BY r.id DESC LIMIT 100";
  res.json(sa ? db.prepare(sql).all() : db.prepare(sql).all(req.user.school_id));
});
r.patch("/:id/read", allow("super_admin"), (req, res) => {
  const x = db.prepare("UPDATE reports SET is_read=1 WHERE id=?").run(Number(req.params.id));
  if (!x.changes) return res.status(404).json({ error: "Warbixin lama helin" });
  res.json({ ok: true });
});
module.exports = r;
