const express = require("express");
const { db } = require("./db");
const { auth, allow } = require("./auth");
const r = express.Router();
r.use(auth, allow("school_admin", "principal", "teacher"));
const clean = v => (typeof v === "string" && v.trim() ? v.trim() : null);
r.get("/subjects", (req, res) => {
  res.json(db.prepare("SELECT id,name,level FROM subjects WHERE school_id=? ORDER BY name").all(req.user.school_id));
});
r.post("/subjects", (req, res) => {
  const name = clean(req.body && req.body.name);
  if (!name) return res.status(400).json({ error: "name waa loo baahan yahay" });
  try {
    const lv = ["all", "middle", "secondary"].includes(req.body.level) ? req.body.level : "all";
    const x = db.prepare("INSERT INTO subjects (school_id,name,level) VALUES (?,?,?)").run(req.user.school_id, name, lv);
    res.status(201).json({ id: Number(x.lastInsertRowid) });
  } catch (e) { res.status(409).json({ error: "Maaddadan hore ayay u jirtay" }); }
});
r.get("/", (req, res) => {
  res.json(db.prepare("SELECT e.id,e.name,e.exam_date,e.max_marks,c.name AS class FROM exams e LEFT JOIN classes c ON c.id=e.class_id WHERE e.school_id=? ORDER BY e.id DESC").all(req.user.school_id));
});
r.post("/", (req, res) => {
  const b = req.body || {}, sid = req.user.school_id;
  const name = clean(b.name);
  const max = b.max_marks == null ? 100 : Number(b.max_marks);
  if (!name || !(max > 0)) return res.status(400).json({ error: "name iyo max_marks sax ah ayaa loo baahan yahay" });
  const cid = b.class_id == null ? null : Number(b.class_id);
  if (cid != null && !db.prepare("SELECT 1 FROM classes WHERE id=? AND school_id=?").get(cid, sid))
    return res.status(400).json({ error: "Fasal lama helin" });
  const x = db.prepare("INSERT INTO exams (school_id,class_id,name,exam_date,max_marks) VALUES (?,?,?,?,?)").run(sid, cid, name, clean(b.exam_date), max);
  res.status(201).json({ id: Number(x.lastInsertRowid) });
});
r.post("/:id/results", (req, res) => {
  const sid = req.user.school_id;
  const exam = db.prepare("SELECT * FROM exams WHERE id=? AND school_id=?").get(Number(req.params.id), sid);
  if (!exam) return res.status(404).json({ error: "Imtixaan lama helin" });
  const recs = (req.body || {}).records;
  if (!Array.isArray(recs) || !recs.length || recs.length > 500) return res.status(400).json({ error: "records waa loo baahan yahay" });
  const st = db.prepare("SELECT 1 FROM students WHERE id=? AND school_id=?");
  const su = db.prepare("SELECT 1 FROM subjects WHERE id=? AND school_id=?");
  for (const x of recs) {
    const m = Number(x.marks);
    if (!st.get(Number(x.student_id), sid) || !su.get(Number(x.subject_id), sid) || !(m >= 0) || m > exam.max_marks)
      return res.status(400).json({ error: "Diiwaan khaldan (dhibcaha ama arday/maaddo)" });
  }
  const up = db.prepare("INSERT INTO results (school_id,exam_id,student_id,subject_id,marks) VALUES (?,?,?,?,?) ON CONFLICT(exam_id,student_id,subject_id) DO UPDATE SET marks=excluded.marks");
  db.exec("BEGIN");
  try {
    for (const x of recs) up.run(sid, exam.id, Number(x.student_id), Number(x.subject_id), Number(x.marks));
    db.exec("COMMIT");
  } catch (e) { db.exec("ROLLBACK"); return res.status(500).json({ error: "Khalad server" }); }
  res.json({ saved: recs.length });
});
const gr = p => p >= 90 ? ["A", 4] : p >= 80 ? ["B", 3] : p >= 70 ? ["C", 2] : p >= 50 ? ["D", 1] : ["F", 0];
r.get("/:id/results", (req, res) => {
  const sid = req.user.school_id;
  const exam = db.prepare("SELECT * FROM exams WHERE id=? AND school_id=?").get(Number(req.params.id), sid);
  if (!exam) return res.status(404).json({ error: "Imtixaan lama helin" });
  const rows = db.prepare("SELECT s.id AS student_id, s.reg_no, s.full_name, sub.name AS subject, r.marks FROM results r JOIN students s ON s.id=r.student_id JOIN subjects sub ON sub.id=r.subject_id WHERE r.exam_id=? AND r.school_id=? ORDER BY s.full_name, sub.name").all(exam.id, sid);
  const by = {};
  for (const x of rows) {
    const o = by[x.student_id] || (by[x.student_id] = { student_id: x.student_id, reg_no: x.reg_no, full_name: x.full_name, subjects: [], sum: 0, pts: 0 });
    const p = (x.marks / exam.max_marks) * 100, g = gr(p);
    o.subjects.push({ subject: x.subject, marks: x.marks, percent: Math.round(p * 10) / 10, grade: g[0] });
    o.sum += x.marks; o.pts += g[1];
  }
  const list = Object.values(by).map(o => {
    const n = o.subjects.length, avg = (o.sum / (n * exam.max_marks)) * 100;
    return { student_id: o.student_id, reg_no: o.reg_no, full_name: o.full_name, subjects: o.subjects, total: o.sum, average: Math.round(avg * 10) / 10, gpa: Math.round((o.pts / n) * 100) / 100, status: avg >= 50 ? "pass" : "fail" };
  }).sort((a, b) => b.average - a.average);
  list.forEach((o, i) => { o.rank = list.findIndex(z => z.average === o.average) + 1; });
  res.json({ exam: { id: exam.id, name: exam.name, max_marks: exam.max_marks }, results: list });
});
module.exports = r;
