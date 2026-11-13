const { db } = require("./db");
const fs = require("fs"), path = require("path");
const dir = path.join(__dirname, "..", "backups");
fs.mkdirSync(dir, { recursive: true });
const f = path.join(dir, "school-" + new Date().toISOString().slice(0, 10) + ".db");
if (fs.existsSync(f)) fs.unlinkSync(f);
db.exec("VACUUM INTO '" + f.replace(/'/g, "''") + "'");
console.log("Backup OK:", f);
fs.readdirSync(dir).filter(n => /^school-.*\.db$/.test(n)).sort().slice(0, -14).forEach(n => fs.unlinkSync(path.join(dir, n)));
