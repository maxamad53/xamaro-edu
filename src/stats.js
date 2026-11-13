const express = require("express");
const { db } = require("./db");
const { auth } = require("./auth");
const r = express.Router();
r.get("/", auth, (req, res) => {
  const n = (sql, ...a) => db.prepare(sql).get(...a).n;
  if (req.user.role === "super_admin") {
    return res.json({
      schools: n("SELECT COUNT(*) AS n FROM schools"),
      active_schools: n("SELECT COUNT(*) AS n FROM schools WHERE status='active'"),
      students: n("SELECT COUNT(*) AS n FROM students"),
      users: n("SELECT COUNT(*) AS n FROM users"),
      pending: n("SELECT COUNT(*) AS n FROM schools WHERE approved=0")
    });
  }
  const s = req.user.school_id;
  res.json({
    students: n("SELECT COUNT(*) AS n FROM students WHERE school_id=?", s),
    active_students: n("SELECT COUNT(*) AS n FROM students WHERE school_id=? AND status='active'", s),
    classes: n("SELECT COUNT(*) AS n FROM classes WHERE school_id=?", s),
    teachers: n("SELECT COUNT(*) AS n FROM users u JOIN roles r ON r.id=u.role_id WHERE u.school_id=? AND r.name='teacher'", s),
    present_today: n("SELECT COUNT(*) AS n FROM attendance WHERE school_id=? AND date=date('now','localtime') AND status IN ('present','late')", s),
    absent_today: n("SELECT COUNT(*) AS n FROM attendance WHERE school_id=? AND date=date('now','localtime') AND status='absent'", s),
    users: n("SELECT COUNT(*) AS n FROM users WHERE school_id=?", s)
  });
});
module.exports = r;
