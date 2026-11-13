const express = require("express");
const { db } = require("./db");
const { auth, allow } = require("./auth");
const r = express.Router();
r.use(auth, allow("student"));
const gr = p => p >= 90 ? "A" : p >= 80 ? "B" : p >= 70 ? "C" : p >= 50 ? "D" : "F";
const pt = { A: 4, B: 3, C: 2, D: 1, F: 0 };
r.get("/results", (req, res) => {
  const me = req.user, sid = me.school_id;
  if (!me.student_id) return res.json([]);
  const exams = db.prepare("SELECT DISTINCT e.id,e.name,e.exam_date,e.max_marks FROM results r JOIN exams e ON e.id=r.exam_id WHERE r.student_id=? AND r.school_id=? ORDER BY e.id DESC").all(me.student_id, sid);
  const sub = db.prepare("SELECT sub.name AS subject, r.marks FROM results r JOIN subjects sub ON sub.id=r.subject_id WHERE r.exam_id=? AND r.student_id=? AND r.school_id=? ORDER BY sub.name");
  res.json(exams.map(e => {
    const subjects = sub.all(e.id, me.student_id, sid).map(x => { const p = (x.marks / e.max_marks) * 100; return { subject: x.subject, marks: x.marks, percent: Math.round(p * 10) / 10, grade: gr(p) }; });
    const n = subjects.length || 1;
    const avg = subjects.reduce((a, x) => a + x.marks, 0) / (n * e.max_marks) * 100;
    const gpa = subjects.reduce((a, x) => a + pt[x.grade], 0) / n;
    return { exam: e.name, date: e.exam_date, max_marks: e.max_marks, subjects, average: Math.round(avg * 10) / 10, gpa: Math.round(gpa * 100) / 100, status: avg >= 50 ? "pass" : "fail" };
  }));
});
r.get("/attendance", (req, res) => {
  const me = req.user, month = req.query.month;
  if (!me.student_id || typeof month !== "string" || !/^\d{4}-\d{2}$/.test(month)) return res.status(400).json({ error: "month waa YYYY-MM" });
  const rows = db.prepare("SELECT date,status FROM attendance WHERE student_id=? AND school_id=? AND substr(date,1,7)=? ORDER BY date").all(me.student_id, me.school_id, month);
  const ok = rows.filter(x => x.status === "present" || x.status === "late").length;
  res.json({ days: rows, percent: rows.length ? Math.round((ok / rows.length) * 100) : null });
});
module.exports = r;
