const express = require("express");
const { db } = require("./db");
const { auth, allow } = require("./auth");
const r = express.Router();
r.use(auth, allow("school_admin", "principal", "teacher"));
const ST = ["present", "absent", "late", "excused"];
const okDate = d => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d);
r.get("/", (req, res) => {
  const { date, class_id } = req.query;
  if (!okDate(date)) return res.status(400).json({ error: "date waa YYYY-MM-DD" });
  let sql = "SELECT s.id AS student_id, s.reg_no, s.full_name, a.status, a.note FROM students s LEFT JOIN attendance a ON a.student_id=s.id AND a.date=? WHERE s.school_id=? AND s.status='active'";
  const a = [date, req.user.school_id];
  if (class_id) { sql += " AND s.class_id=?"; a.push(Number(class_id)); }
  res.json(db.prepare(sql + " ORDER BY s.full_name").all(...a));
});
r.post("/", (req, res) => {
  const { date, records } = req.body || {};
  if (!okDate(date) || !Array.isArray(records) || !records.length || records.length > 500)
    return res.status(400).json({ error: "date iyo records waa loo baahan yahay" });
  const sid = req.user.school_id;
  const own = db.prepare("SELECT 1 FROM students WHERE id=? AND school_id=?");
  const up = db.prepare("INSERT INTO attendance (school_id,student_id,date,status,note,marked_by) VALUES (?,?,?,?,?,?) ON CONFLICT(student_id,date) DO UPDATE SET status=excluded.status, note=excluded.note, marked_by=excluded.marked_by");
  for (const x of records)
    if (!ST.includes(x.status) || !own.get(Number(x.student_id), sid))
      return res.status(400).json({ error: "Diiwaan khaldan" });
  db.exec("BEGIN");
  try {
    for (const x of records) up.run(sid, Number(x.student_id), date, x.status, typeof x.note === "string" ? x.note.slice(0, 200) : null, req.user.id);
    db.exec("COMMIT");
  } catch (e) { db.exec("ROLLBACK"); return res.status(500).json({ error: "Khalad server" }); }
  res.json({ saved: records.length });
});
r.get("/report", (req, res) => {
  const { month } = req.query;
  if (typeof month !== "string" || !/^\d{4}-\d{2}$/.test(month)) return res.status(400).json({ error: "month waa YYYY-MM" });
  const rows = db.prepare("SELECT s.id AS student_id, s.reg_no, s.full_name, SUM(a.status='present') AS present, SUM(a.status='absent') AS absent, SUM(a.status='late') AS late, SUM(a.status='excused') AS excused, COUNT(a.id) AS total FROM students s LEFT JOIN attendance a ON a.student_id=s.id AND substr(a.date,1,7)=? WHERE s.school_id=? AND s.status='active' GROUP BY s.id ORDER BY s.full_name").all(month, req.user.school_id);
  res.json(rows.map(x => ({ ...x, percent: x.total ? Math.round(((x.present + x.late) / x.total) * 100) : null })));
});
module.exports = r;
