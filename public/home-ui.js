document.head.insertAdjacentHTML("beforeend", `<style>
.hero{background:linear-gradient(135deg,#0A2540,#1d4ed8);color:#fff;border-radius:20px;padding:22px;margin-bottom:14px}
.hero h2{margin:0;font-size:22px}.hero p{margin:6px 0 0;opacity:.85;font-size:14px}
.sgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px}
.sc{background:#fff;border-radius:18px;padding:16px;box-shadow:0 2px 8px rgba(10,37,64,.08);cursor:pointer;transition:transform .1s}
.sc:active{transform:scale(.97)}
.sc b{display:block;font-size:30px;color:#0A2540}.sc span{font-size:13px;color:#475569}
body.dark .sc{background:#1e293b}body.dark .sc b{color:#f1f5f9}body.dark .sc span{color:#cbd5e1}
</style>`);
window.homeUI = async function () {
  if (me.role === "teacher") return window.teacherHome();
  const adm = me.role === "super_admin" || me.role === "school_admin";
  if (adm) window.welcomeHero("Soo dhawoow, " + (me.role === "super_admin" ? "Super Admin" : "Maamule"));
  else {
    const h = document.createElement("section");
    h.className = "hero";
    h.innerHTML = "<h2>" + t("welcome") + ", " + esc(me.full_name) + "</h2><p>" + esc(me.role) + "</p>";
    $("main").appendChild(h);
  }
  const st = me.role === "student" ? {} : await api("/api/stats");
  if (adm) { delete st.users; delete st.teachers; }
  const GO = { students: "students", active_students: "students", classes: "setup", present_today: "att", absent_today: "att" };
  const g = document.createElement("section");
  g.className = "sgrid";
  g.innerHTML = Object.keys(st).map(k => "<div class='sc' data-go='" + (me.role === "super_admin" ? "schools" : (GO[k] || "home")) + "'><b>" + esc(st[k]) + "</b><span>" + esc(L[k] || k) + "</span></div>").join("");
  $("main").appendChild(g);
  g.querySelectorAll(".sc").forEach(x => x.onclick = () => {
    const k = x.dataset.go;
    if (MENU.some(m => m.k === k && (m.r === "*" || m.r.includes(me.role)))) show(k);
  });
};
