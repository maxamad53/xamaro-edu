const jwt = require("jsonwebtoken");
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const { db } = require("./db");
const f = path.join(__dirname, "..", "data", "secret.key");
if (!fs.existsSync(f)) fs.writeFileSync(f, crypto.randomBytes(48).toString("hex"), { mode: 0o600 });
const SECRET = fs.readFileSync(f, "utf8");
const sign = u => jwt.sign({ id: u.id, role: u.role, school_id: u.school_id }, SECRET, { expiresIn: "8h" });
const Q = "SELECT u.status, u.school_id, u.student_id, r.name AS role, s.status AS ss, s.approved AS ap FROM users u JOIN roles r ON r.id=u.role_id LEFT JOIN schools s ON s.id=u.school_id WHERE u.id=?";
function auth(req, res, next) {
  try {
    const p = jwt.verify((req.headers.authorization || "").replace("Bearer ", ""), SECRET);
    const u = db.prepare(Q).get(p.id);
    if (!u || u.status !== "active" || u.ss === "suspended" || u.ap === 0) throw new Error("x");
    req.user = { id: p.id, role: u.role, school_id: u.school_id, student_id: u.student_id };
    next();
  } catch { res.status(401).json({ error: "Unauthorized" }); }
}
const allow = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : res.status(403).json({ error: "Forbidden" });
module.exports = { sign, auth, allow };
