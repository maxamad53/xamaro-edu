const express = require("express");
const { db } = require("./db");
const { auth, allow } = require("./auth");
const r = express.Router();
r.use(auth, allow("school_admin", "principal", "accountant"));
const clean = v => (typeof v === "string" && v.trim() ? v.trim() : null);
const money = v => Math.round(Number(v) * 100) / 100;
const TYPES = ["tuition", "registration", "transport", "other"];
const FEE = "SELECT f.id,f.student_id,s.full_name,s.reg_no,f.type,f.amount,f.discount,f.due_date,ROUND(f.amount-f.discount,2) AS net,ROUND(COALESCE((SELECT SUM(amount) FROM payments WHERE fee_id=f.id),0),2) AS paid FROM fees f JOIN students s ON s.id=f.student_id WHERE f.school_id=?";
r.post("/fees", (req, res) => {
  const b = req.body || {}, sid = req.user.school_id;
  const amount = money(b.amount), discount = money(b.discount || 0);
  if (!TYPES.includes(b.type) || !(amount > 0) || !(discount >= 0) || discount > amount)
    return res.status(400).json({ error: "type, amount ama discount waa khaldan yihiin" });
  if (!db.prepare("SELECT 1 FROM students WHERE id=? AND school_id=?").get(Number(b.student_id), sid))
    return res.status(400).json({ error: "Arday lama helin" });
  const x = db.prepare("INSERT INTO fees (school_id,student_id,type,amount,discount,due_date,note) VALUES (?,?,?,?,?,?,?)")
    .run(sid, Number(b.student_id), b.type, amount, discount, clean(b.due_date), clean(b.note));
  res.status(201).json({ id: Number(x.lastInsertRowid) });
});
r.get("/fees", (req, res) => {
  let sql = FEE; const a = [req.user.school_id];
  if (req.query.student_id) { sql += " AND f.student_id=?"; a.push(Number(req.query.student_id)); }
  const rows = db.prepare(sql + " ORDER BY f.id DESC LIMIT 200").all(...a);
  res.json(rows.map(x => ({ ...x, balance: money(x.net - x.paid) })));
});
r.post("/payments", (req, res) => {
  const b = req.body || {}, sid = req.user.school_id;
  const amount = money(b.amount);
  if (!(amount > 0)) return res.status(400).json({ error: "amount waa khaldan yahay" });
  const fee = db.prepare("SELECT f.*, ROUND(f.amount-f.discount,2) AS net, ROUND(COALESCE((SELECT SUM(amount) FROM payments WHERE fee_id=f.id),0),2) AS paid FROM fees f WHERE f.id=? AND f.school_id=?").get(Number(b.fee_id), sid);
  if (!fee) return res.status(404).json({ error: "Fee lama helin" });
  const balance = money(fee.net - fee.paid);
  if (amount > balance) return res.status(400).json({ error: "Lacagtu waxay ka badan tahay hadhaaga (" + balance + ")" });
  const n = db.prepare("SELECT COUNT(*) AS n FROM payments WHERE school_id=?").get(sid).n;
  const receipt = "R" + String(n + 1).padStart(6, "0");
  const x = db.prepare("INSERT INTO payments (school_id,fee_id,receipt_no,amount,method,received_by) VALUES (?,?,?,?,?,?)")
    .run(sid, fee.id, receipt, amount, clean(b.method), req.user.id);
  db.prepare("INSERT INTO audit_logs (school_id,user_id,action,entity,entity_id,ip) VALUES (?,?,?,?,?,?)").run(sid, req.user.id, "payment_received", "payment", Number(x.lastInsertRowid), req.ip);
  res.status(201).json({ id: Number(x.lastInsertRowid), receipt_no: receipt, balance: money(balance - amount) });
});
r.get("/payments/:id/receipt", (req, res) => {
  const p = db.prepare("SELECT p.receipt_no,p.amount,p.method,p.paid_at,f.type,s.full_name,s.reg_no,sc.name AS school FROM payments p JOIN fees f ON f.id=p.fee_id JOIN students s ON s.id=f.student_id JOIN schools sc ON sc.id=p.school_id WHERE p.id=? AND p.school_id=?").get(Number(req.params.id), req.user.school_id);
  if (!p) return res.status(404).json({ error: "Rasiid lama helin" });
  res.json(p);
});
r.post("/expenses", (req, res) => {
  const b = req.body || {}, amount = money(b.amount);
  if (!clean(b.category) || !(amount > 0) || !/^\d{4}-\d{2}-\d{2}$/.test(b.spent_at || ""))
    return res.status(400).json({ error: "category, amount iyo spent_at (YYYY-MM-DD) waa loo baahan yahay" });
  const x = db.prepare("INSERT INTO expenses (school_id,category,amount,spent_at,note) VALUES (?,?,?,?,?)").run(req.user.school_id, clean(b.category), amount, b.spent_at, clean(b.note));
  res.status(201).json({ id: Number(x.lastInsertRowid) });
});
r.get("/report", (req, res) => {
  const { month } = req.query, sid = req.user.school_id;
  if (typeof month !== "string" || !/^\d{4}-\d{2}$/.test(month)) return res.status(400).json({ error: "month waa YYYY-MM" });
  const one = (sql, ...a) => db.prepare(sql).get(...a).n;
  const income = one("SELECT COALESCE(SUM(amount),0) AS n FROM payments WHERE school_id=? AND substr(paid_at,1,7)=?", sid, month);
  const expenses = one("SELECT COALESCE(SUM(amount),0) AS n FROM expenses WHERE school_id=? AND substr(spent_at,1,7)=?", sid, month);
  const net = one("SELECT COALESCE(SUM(amount-discount),0) AS n FROM fees WHERE school_id=?", sid);
  const paid = one("SELECT COALESCE(SUM(amount),0) AS n FROM payments WHERE school_id=?", sid);
  res.json({ month, income: money(income), expenses: money(expenses), profit: money(income - expenses), outstanding: money(net - paid) });
});
module.exports = r;
