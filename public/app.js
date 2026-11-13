const $ = id => document.getElementById(id);
let token = localStorage.getItem("t");
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
async function api(p, o = {}) {
  const r = await fetch(p, { ...o, headers: { "Content-Type": "application/json", Authorization: "Bearer " + token } });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || "Khalad");
  return d;
}
async function dash() {
  try {
    const me = await api("/api/me");
    const rows = await api(me.role === "super_admin" ? "/api/schools" : "/api/students");
    $("box").innerHTML = "<h1>Soo dhawoow, " + esc(me.full_name) + "</h1><p>" + esc(me.role) + "</p>" +
      rows.map(r => "<p>" + esc(r.name || r.full_name) + "</p>").join("") + '<button id="out">Ka bax</button>';
    $("out").onclick = () => { localStorage.removeItem("t"); location.reload(); };
  } catch (e) { localStorage.removeItem("t"); $("msg").textContent = e.message; }
}
$("go").onclick = async () => {
  $("msg").textContent = "";
  try {
    const r = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: $("email").value, password: $("pass").value }) });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error);
    token = d.token; localStorage.setItem("t", token); dash();
  } catch (e) { $("msg").textContent = e.message; }
};
