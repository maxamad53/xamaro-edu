document.head.insertAdjacentHTML("beforeend", "<style>textarea{width:100%;padding:12px;margin:6px 0;border-radius:10px;border:1px solid #cbd5e1;font-size:16px;box-sizing:border-box;font-family:inherit}body.dark textarea{background:#0f172a;color:#e2e8f0;border-color:#475569}</style>");
window.reportsUI = async function () {
  const sa = me.role === "super_admin";
  const H1 = "<h1 style='font-size:18px;margin:0 0 10px'>";
  const d = document.createElement("div");
  d.innerHTML = (sa ? "" : H1 + "Warbixin cusub</h1><input id='rt' placeholder='Cinwaanka'><textarea id='rb' rows='4' placeholder='Qoraalka warbixinta'></textarea><button id='radd'>Dir warbixinta</button><div id='rm2' style='font-size:14px;min-height:18px'></div>") + H1 + "Warbixinaha</h1><div id='rl'></div>";
  $("main").appendChild(d);
  async function load() {
    const rows = await api("/api/reports");
    $("rl").innerHTML = rows.map(r => "<div class='row'><b>" + esc(r.title) + "</b>" + (sa ? "<span class='tag'>" + esc(r.school) + "</span>" : "") +
      "<p style='margin:6px 0'>" + esc(r.body) + "</p><small>" + esc(r.created_at) +
      (sa ? (r.is_read ? " · ✓" : " · <a href='#' data-rid='" + r.id + "'>Akhriyay</a>") : "") + "</small></div>").join("") || "<p>Warbixin ma jirto</p>";
    document.querySelectorAll("a[data-rid]").forEach(x => x.onclick = async e => {
      e.preventDefault();
      await api("/api/reports/" + x.dataset.rid + "/read", { method: "PATCH" });
      load();
    });
  }
  if (!sa) $("radd").onclick = async () => {
    $("rm2").textContent = "";
    try {
      await api("/api/reports", { method: "POST", body: JSON.stringify({ title: $("rt").value, body: $("rb").value }) });
      $("rt").value = ""; $("rb").value = ""; $("rm2").textContent = "Waa la diray"; load();
    } catch (e) { $("rm2").textContent = e.message; }
  };
  load();
};
