document.head.insertAdjacentHTML("beforeend", "<style>select{width:100%;padding:12px;margin:6px 0;border-radius:10px;border:1px solid #cbd5e1;font-size:16px;box-sizing:border-box;background:#fff}</style>");
window.studentsUI = async function (sa) {
  if (sa) return;
  const d = document.createElement("div");
  d.id = "stu";
  d.innerHTML = "<h1 style='font-size:18px;margin-top:16px'>Ardayda</h1>" +
    "<input id='sn' placeholder='Magaca ardayga'>" + "<label style='font-size:13px'>Taariikhda dhalashada</label><input id='sb' type='date'>" +
    "<select id='sg'><option value=''>Jinsi</option><option value='male'>Wiil</option><option value='female'>Gabadh</option></select>" +
    "<select id='sc'><option value=''>Fasal</option></select>" +
    "<input id='sp' placeholder='Magaca waalidka'>" +
    "<button id='sadd'>Ku dar arday</button><div id='sm' style='font-size:14px;min-height:18px'></div>" +
    "<input id='sq' autocomplete='off' name='ssearch' placeholder='Raadi arday...'><div id='sl'></div>";
  $("main").appendChild(d);
  if (me.role === "teacher") { ["sn", "sb", "sg", "sc", "sp", "sadd", "sm"].forEach(i => { $(i).style.display = "none"; }); d.querySelector("label").style.display = "none"; }
  const cs = await api("/api/students/classes");
  $("sc").innerHTML += cs.map(c => "<option value='" + c.id + "'>" + esc(c.name + " " + c.section) + "</option>").join("");
  async function load() {
    const rows = await api("/api/students?q=" + encodeURIComponent($("sq").value));
    $("sl").innerHTML = rows.map(r => "<div class='row'>" + esc(r.full_name) + "<span class='tag'>" + esc(r.reg_no) + "</span></div>").join("") || "<p>Arday ma jiro</p>";
  }
  $("sq").oninput = load;
  $("sadd").onclick = async () => {
    $("sm").textContent = "";
    try {
      const r = await api("/api/students", { method: "POST", body: JSON.stringify({ full_name: $("sn").value, gender: $("sg").value || null, class_id: $("sc").value ? Number($("sc").value) : null, guardian_name: $("sp").value, birth_date: $("sb").value || null }) });
      $("sm").textContent = "Waa la keydiyay: " + r.reg_no;
      $("sn").value = ""; $("sp").value = "";
      load();
    } catch (e) { $("sm").textContent = e.message; }
  };
  load();
};
