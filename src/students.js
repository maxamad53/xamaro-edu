const express = require("express");
const { db } = require("./db");
const { auth, allow } = require("./auth");
const r = express.Router();
r.use(auth, allow("school_admin", "principal", "receptionist", "teacher"));
const W = allow("school_admin", "principal", "receptionist");
const clean = v => (typeof v === "string" && v.trim() ? v.trim() : null);
r.get("/classes", (req, res) => {
  res.json(db.prepare("SELECT id,name,section,level FROM classes WHERE school_id=? ORDER BY name,section").all(req.user.school_id));
});
r.post("/classes", W, (req, res) => {
  const name = clean(req.body && req.body.name);
  if (!name) return res.status(400).json({ error: "name waa loo baahan yahay" });
  try {
    const x = db.prepare("INSERT INTO classes (school_id,name,section,level) VALUES (?,?,?,?)").run(req.user.school_id, name, clean(req.body.section) || "", req.body.level === "secondary" ? "secondary" : "middle");
    res.status(201).json({ id: Number(x.lastInsertRowid) });
  } catch (e) { res.status(409).json({ error: "Fasalkan hore ayuu u jiray" }); }
});
const okClass = (sid, cid) => cid == null || db.prepare("SELECT 1 FROM classes WHERE id=? AND school_id=?").get(cid, sid);
r.get("/", (req, res) => {
  const { q, class_id, status } = req.query;
  let sql = "SELECT s.id,s.reg_no,s.full_name,s.gender,s.status,c.name AS class,c.section FROM students s LEFT JOIN classes c ON c.id=s.class_id WHERE s.school_id=?";
  const a = [req.user.school_id];
  if (q) { sql += " AND (s.full_name LIKE ? OR s.reg_no LIKE ?)"; a.push("%" + q + "%", "%" + q + "%"); }
  if (class_id) { sql += " AND s.class_id=?"; a.push(Number(class_id)); }
  if (status) { sql += " AND s.status=?"; a.push(status); }
  res.json(db.prepare(sql + " ORDER BY s.id DESC LIMIT 200").all(...a));
});
r.post("/", W, (req, res) => {
  const b = req.body || {}, sid = req.user.school_id;
  const name = clean(b.full_name);
  if (!name) return res.status(400).json({ error: "full_name waa loo baahan yahay" });
  if (b.gender && !["male", "female"].includes(b.gender)) return res.status(400).json({ error: "gender khaldan" });
  const cid = b.class_id == null ? null : Number(b.class_id);
  if (!okClass(sid, cid)) return res.status(400).json({ error: "Fasal lama helin" });
  const n = db.prepare("SELECT COUNT(*) AS n FROM students WHERE school_id=?").get(sid).n;
  const reg = clean(b.reg_no) || "S" + String(n + 1).padStart(4, "0");
  try {
    const x = db.prepare("INSERT INTO students (school_id,reg_no,full_name,gender,birth_date,class_id,guardian_name,guardian_phone,address) VALUES (?,?,?,?,?,?,?,?,?)")
      .run(sid, reg, name, b.gender || null, clean(b.birth_date), cid, clean(b.guardian_name), clean(b.guardian_phone), clean(b.address));
    db.prepare("INSERT INTO audit_logs (school_id,user_id,action,entity,entity_id,ip) VALUES (?,?,?,?,?,?)").run(sid, req.user.id, "student_created", "student", Number(x.lastInsertRowid), req.ip);
    res.status(201).json({ id: Number(x.lastInsertRowid), reg_no: reg });
  } catch (e) { res.status(409).json({ error: "Reg no hore ayuu u jiray" }); }
});
module.exports = r;
