document.head.insertAdjacentHTML("beforeend", "<style>#box.wide{max-width:640px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}.st{background:#eff6ff;border-radius:12px;padding:14px;display:flex;flex-direction:column}.st b{font-size:26px;color:#0A2540}.st span{font-size:13px;color:#475569}.row{padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:15px}.tag{float:right;font-size:12px;color:#2563eb}</style>");
const L = { schools: "Dugsiyo", active_schools: "Dugsiyo firfircoon", students: "Arday", active_students: "Arday firfircoon", classes: "Fasallo", users: "Isticmaalayaal", teachers: "Macalimiin", present_today: "Joogo maanta", absent_today: "Maqan maanta", pending: "Sugaya ogolaansho" };
async function dash() {
  try {
    const me = await api("/api/me");
    const st = await api("/api/stats");
    const sa = me.role === "super_admin";
    const rows = await api(sa ? "/api/schools" : "/api/students").catch(() => []);
    $("box").classList.add("wide");
    $("box").innerHTML = "<h1>Soo dhawoow, " + esc(me.full_name) + "</h1><p>" + esc(me.role) + "</p><div class='grid'>" +
      Object.keys(st).map(k => "<div class='st'><b>" + esc(st[k]) + "</b><span>" + esc(L[k] || k) + "</span></div>").join("") + "</div>" +
      rows.map(r => "<div class='row'>" + esc(r.name || r.full_name) + "<span class='tag'>" + esc(r.status || r.reg_no) + "</span></div>").join("") +
      "<button id='out'>Ka bax</button>";
    $("out").onclick = () => { localStorage.removeItem("t"); location.reload(); };
    ["school_admin","principal","receptionist","teacher"].includes(me.role) && window.studentsUI?.(false);
    ["school_admin","principal","teacher"].includes(me.role) && window.attendanceUI?.(false);
    ["school_admin","principal","teacher"].includes(me.role) && window.attReportUI?.(false);
    window.accountUI?.();
  } catch (e) { localStorage.removeItem("t"); $("msg").textContent = e.message; }
}
