window.examsUI = async function () {
  const cs = await api("/api/students/classes");
  const sj = await api("/api/exams/subjects");
  const opt = (a, f) => a.map(f).join("");
  const co = opt(cs, c => "<option value='" + c.id + "'>" + esc(c.name + " " + c.section) + "</option>");
  const so = opt(sj, s => "<option value='" + s.id + "'>" + esc(s.name) + "</option>");
  const a = document.createElement("div");
  a.innerHTML = "<h1 style='font-size:18px;margin:0 0 10px'>Imtixaan cusub</h1>" +
    "<input id='en' placeholder='Magaca imtixaanka'>" +
    "<select id='ec'>" + co + "</select>" +
    "<input id='em' type='number' placeholder='Dhibcaha ugu badan (100)'>" +
    "<button id='eadd'>Samee imtixaan</button><div id='emsg' style='font-size:14px;min-height:18px'></div>";
  $("main").appendChild(a);
  const exSel = async () => {
    const r = await api("/api/exams");
    $("xe").innerHTML = opt(r, e => "<option value='" + e.id + "'>" + esc(e.name) + "</option>");
  };
  $("eadd").onclick = async () => {
    $("emsg").textContent = "";
    try {
      await api("/api/exams", { method: "POST", body: JSON.stringify({ name: $("en").value, class_id: Number($("ec").value) || null, max_marks: Number($("em").value) || 100 }) });
      $("emsg").textContent = "Waa la sameeyay"; $("en").value = ""; exSel();
    } catch (e) { $("emsg").textContent = e.message; }
  };
  const b = document.createElement("div");
  b.innerHTML = "<h1 style='font-size:18px;margin:0 0 10px'>Geli dhibcaha</h1><select id='xe'></select><select id='xc'>" + co + "</select><select id='xs'>" + so + "</select><button id='xl'>Soo bandhig ardayda</button><div id='xr'></div><button id='xsv' style='display:none'>Kaydi dhibcaha</button><div id='xm' style='font-size:14px;min-height:18px'></div>";
  $("main").appendChild(b);
  exSel();
  $("xl").onclick = async () => {
    $("xm").textContent = "";
    try {
      const rows = await api("/api/students?status=active&class_id=" + $("xc").value);
      $("xr").innerHTML = rows.map(s => "<div class='row'>" + esc(s.full_name) + "<input type='number' data-id='" + s.id + "' style='width:90px;margin:0' placeholder='0'></div>").join("") || "<p>Arday ma jiro</p>";
      $("xsv").style.display = rows.length ? "block" : "none";
    } catch (e) { $("xm").textContent = e.message; }
  };
  $("xsv").onclick = async () => {
    try {
      const records = [...document.querySelectorAll("#xr input")].filter(i => i.value !== "").map(i => ({ student_id: Number(i.dataset.id), subject_id: Number($("xs").value), marks: Number(i.value) }));
      if (!records.length) throw new Error("Geli dhibco");
      const r = await api("/api/exams/" + $("xe").value + "/results", { method: "POST", body: JSON.stringify({ records }) });
      $("xm").textContent = "Waa la keydiyay: " + r.saved;
    } catch (e) { $("xm").textContent = e.message; }
  };
};
