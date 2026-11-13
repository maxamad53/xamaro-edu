document.head.insertAdjacentHTML("beforeend", "<style>@media print{.top,#drawer,#shade,#tg,.noprint{display:none!important}#app{position:static!important;overflow:visible!important}#main>div{box-shadow:none!important}}</style>");
window.resultsUI = async function () {
  const rows = await api("/api/portal/results");
  const d = document.createElement("div");
  d.innerHTML = "<h1 style='font-size:18px;margin:0 0 10px'>Warbixinta heerka</h1>" + (rows.map(e =>
    "<div style='margin-bottom:16px'><b>" + esc(e.exam) + "</b><span class='tag'>" + (e.status === "pass" ? "Gudbay" : "Dhacay") + "</span>" +
    e.subjects.map(s => "<div class='row'>" + esc(s.subject) + "<span class='tag'>" + esc(s.marks) + "/" + esc(e.max_marks) + " (" + esc(s.grade) + ")</span></div>").join("") +
    "<p>Celcelis: <b>" + esc(e.average) + "%</b> | GPA: <b>" + esc(e.gpa) + "</b></p></div>").join("") || "<p>Natiijo weli ma jirto</p>") +
    "<button class='noprint' id='pr'>Daabac / PDF ku keydi</button>";
  $("main").appendChild(d);
  $("pr").onclick = () => window.print();
};
window.myAttUI = async function () {
  const d = document.createElement("div");
  d.innerHTML = "<h1 style='font-size:18px;margin:0 0 10px'>Imaanshahayga</h1><input id='pm' type='month'><button id='pb2'>Soo bandhig</button><div id='pr2'></div>";
  $("main").appendChild(d);
  $("pm").value = new Date().toISOString().slice(0, 7);
  const ST = { present: "Jooga", absent: "Maqan", late: "Daahay", excused: "Ogolaansho" };
  $("pb2").onclick = async () => {
    try {
      const r = await api("/api/portal/attendance?month=" + $("pm").value);
      $("pr2").innerHTML = (r.percent == null ? "" : "<p>Imaanshaha: <b>" + esc(r.percent) + "%</b></p>") +
        (r.days.map(x => "<div class='row'>" + esc(x.date) + "<span class='tag'>" + esc(ST[x.status] || x.status) + "</span></div>").join("") || "<p>Diiwaan ma jiro</p>");
    } catch (e) { $("pr2").textContent = e.message; }
  };
  $("pb2").click();
};
document.head.insertAdjacentHTML("beforeend", "<style>@media print{body{display:block!important;background:#fff!important;min-height:0!important}#main{max-width:100%!important;padding:0!important}#main>div{background:#fff!important;font-size:16px}#main *{color:#000!important}#box{display:none!important}@page{margin:15mm}}</style>");
