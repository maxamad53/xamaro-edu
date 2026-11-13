window.attReportUI = function (sa) {
  if (sa) return;
  const d = document.createElement("div");
  d.innerHTML = "<h1 style='font-size:18px;margin-top:16px'>Warbixinta bisha</h1><input id='rm' type='month'><button id='rb'>Soo bandhig</button><div id='rr'></div>";
  $("main").appendChild(d);
  $("rm").value = new Date().toISOString().slice(0, 7);
  $("rb").onclick = async () => {
    try {
      const rows = await api("/api/attendance/report?month=" + $("rm").value);
      $("rr").innerHTML = rows.map(r => "<div class='row'>" + esc(r.full_name) + "<span class='tag'>" + (r.percent == null ? "-" : r.percent + "%") + "</span></div>").join("") || "<p>Arday ma jiro</p>";
    } catch (e) { $("rr").textContent = e.message; }
  };
};
