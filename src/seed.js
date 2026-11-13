const bcrypt = require("bcryptjs");
const { db, migrate } = require("./db");
migrate();
const [email, password, ...nameParts] = process.argv.slice(2);
if (!email || !password || password.length < 8) {
  console.log("Isticmaal: node src/seed.js email password(8+ xarfood) Magac");
  process.exit(1);
}
const role = db.prepare("SELECT id FROM roles WHERE name='super_admin'").get();
const exists = db.prepare("SELECT id FROM users WHERE email=?").get(email);
if (exists) { console.log("Email-kan hore ayuu u jiray"); process.exit(1); }
const hash = bcrypt.hashSync(password, 12);
db.prepare("INSERT INTO users (school_id, role_id, full_name, email, password_hash) VALUES (NULL, ?, ?, ?, ?)")
  .run(role.id, nameParts.join(" ") || "Super Admin", email, hash);
console.log("Super Admin waa la sameeyay:", email);
