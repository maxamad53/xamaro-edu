window.attendanceUI = async function (sa) {
  if (sa) return;
  const d = document.createElement("div");
  d.innerHTML = "<h1 style='font-size:18px;margin-top:16px'>Imaanshaha (Attendance)</h1>" +
    "<input id='ad' type='date'><select id='ac'><option value=''>Dhammaan fasallada</option></select>" +
    "<button id='al'>Soo bandhig</button><div id='ar'></div>" +
    "<button id='asv' style='display:none'>Kaydi imaanshaha</button><div id='am' style='font-size:14px;min-height:18px'></div>";
  $("main").appendChild(d);
  $("ad").value = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const cs = await api("/api/students/classes");
  $("ac").innerHTML += cs.map(c => "<option value='" + c.id + "'>" + esc(c.name + " " + c.section) + "</option>").join("");
  const OPT = [["present", "Jooga"], ["absent", "Maqan"], ["late", "Daahay"], ["excused", "Ogolaansho"]];
  let ids = [];
  $("al").onclick = async () => {
    $("am").textContent = "";
    try {
      const rows = await api("/api/attendance?date=" + $("ad").value + ($("ac").value ? "&class_id=" + $("ac").value : ""));
      ids = rows.map(r => r.student_id);
      $("ar").innerHTML = rows.map(r => "<div class='row'>" + esc(r.full_name) + "<select data-id='" + r.student_id + "'>" +
        OPT.map(o => "<option value='" + o[0] + "'" + ((r.status || "present") === o[0] ? " selected" : "") + ">" + o[1] + "</option>").join("") +
        "</select></div>").join("") || "<p>Arday ma jiro</p>";
      $("asv").style.display = rows.length ? "block" : "none";
    } catch (e) { $("am").textContent = e.message; }
  };
  $("asv").onclick = async () => {
    try {
      const records = [...document.querySelectorAll("#ar select")].map(s => ({ student_id: Number(s.dataset.id), status: s.value }));
      const r = await api("/api/attendance", { method: "POST", body: JSON.stringify({ date: $("ad").value, records }) });
      $("am").textContent = "Waa la keydiyay: " + r.saved;
    } catch (e) { $("am").textContent = e.message; }
  };
};
