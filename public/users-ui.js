window.usersUI = async function () {
  const d = document.createElement("div");
  d.innerHTML = "<h1 style='font-size:18px;margin:0 0 10px'>Isticmaalayaasha</h1>" +
    "<input id='un' placeholder='Magaca buuxa'>" +
    "<input id='ue' type='email' placeholder='Email' autocomplete='off'>" +
    "<input id='up' type='password' placeholder='Password (8+)' autocomplete='new-password'>" +
    "<select id='ur'><option value='teacher'>Macalin</option><option value='principal'>Maamule</option><option value='receptionist'>Soo dhaweeye</option></select>" +
    "<button id='uadd'>Ku dar</button><div id='um' style='font-size:14px;min-height:18px'></div><div id='ul'></div>";
  $("main").appendChild(d);
  const RN = { teacher: "Macalin", principal: "Maamule", receptionist: "Soo dhaweeye", student: "Arday", school_admin: "Maamulaha dugsiga", accountant: "Xisaabiye", parent: "Waalid" };
  async function load() {
    const rows = await api("/api/users");
    $("ul").innerHTML = rows.map(u => "<div class='row'>" + esc(u.full_name) + "<span class='tag'>" + esc(RN[u.role] || u.role) + "</span></div>").join("");
  }
  $("uadd").onclick = async () => {
    $("um").textContent = "";
    try {
      await api("/api/users", { method: "POST", body: JSON.stringify({ full_name: $("un").value, email: $("ue").value, password: $("up").value, role: $("ur").value }) });
      $("um").textContent = "Waa la keydiyay";
      $("un").value = ""; $("ue").value = ""; $("up").value = "";
      load();
    } catch (e) { $("um").textContent = e.message; }
  };
  load();
};
