window.setupUI = async function () {
  const LV = { all: "Labadaba", middle: "Dhexe", secondary: "Sare" };
  const a = document.createElement("div");
  a.innerHTML = "<h1 style='font-size:18px;margin:0 0 10px'>Fasallada</h1><input id='cn' placeholder='Magaca fasalka (tusaale: Fasalka 5)'><input id='cs' placeholder='Qaybta (A, B...)'><select id='cl'><option value='middle'>Dhexe (5-8)</option><option value='secondary'>Sare (9-12)</option></select><button id='cadd'>Ku dar fasal</button><div id='cm' style='font-size:14px;min-height:18px'></div><div id='cls'></div>";
  $("main").appendChild(a);
  const b = document.createElement("div");
  b.innerHTML = "<h1 style='font-size:18px;margin:0 0 10px'>Maaddooyinka</h1><input id='sn2' placeholder='Magaca maaddada'><select id='sl2'><option value='all'>Labadaba</option><option value='middle'>Dhexe</option><option value='secondary'>Sare</option></select><button id='sadd2'>Ku dar maaddo</button><div id='sm2' style='font-size:14px;min-height:18px'></div><div id='sjs'></div>";
  $("main").appendChild(b);
  async function load() {
    const [cs, sj] = await Promise.all([api("/api/students/classes"), api("/api/exams/subjects")]);
    $("cls").innerHTML = cs.map(c => "<div class='row'>" + esc(c.name + " " + c.section) + "<span class='tag'>" + (c.level === "secondary" ? "Sare" : "Dhexe") + "</span></div>").join("") || "<p>Fasal ma jiro</p>";
    $("sjs").innerHTML = sj.map(s => "<div class='row'>" + esc(s.name) + "<span class='tag'>" + esc(LV[s.level] || s.level) + "</span></div>").join("") || "<p>Maaddo ma jirto</p>";
  }
  $("cadd").onclick = async () => {
    $("cm").textContent = "";
    try {
      await api("/api/students/classes", { method: "POST", body: JSON.stringify({ name: $("cn").value, section: $("cs").value, level: $("cl").value }) });
      $("cn").value = ""; $("cs").value = ""; load();
    } catch (e) { $("cm").textContent = e.message; }
  };
  $("sadd2").onclick = async () => {
    $("sm2").textContent = "";
    try {
      await api("/api/exams/subjects", { method: "POST", body: JSON.stringify({ name: $("sn2").value, level: $("sl2").value }) });
      $("sn2").value = ""; load();
    } catch (e) { $("sm2").textContent = e.message; }
  };
  load();
};
