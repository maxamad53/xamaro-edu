window.schoolDetail = async function (id) {
  const s = await api("/api/schools/" + id);
  $("main").innerHTML = "";
  const K = [["students", "Arday"], ["teachers", "Macalimiin"], ["classes", "Fasallo"], ["subjects", "Maaddooyin"], ["present_today", "Joogo maanta"], ["absent_today", "Maqan maanta"]];
  const d = document.createElement("div");
  d.innerHTML = "<button id='sback' style='width:auto;padding:6px 12px;margin:0 0 12px'>← Dib u noqo</button>" +
    "<h1 style='font-size:20px;margin:0 0 6px'>" + esc(s.name) + "</h1><p>Koodhka: <b>" + esc(s.code) + "</b></p>" +
    "<p>Maamulaha: " + (s.admins.map(a => esc(a.full_name) + " (" + esc(a.email) + ")").join(", ") || "-") + "</p>" +
    "<div class='grid'>" + K.map(k => "<div class='st'><b>" + esc(s[k[0]]) + "</b><span>" + k[1] + "</span></div>").join("") + "</div>" +
    "<button id='ssus'>" + (s.status === "suspended" ? "Fur dugsiga" : "Hakin dugsiga") + "</button><div id='smsg' style='font-size:14px;min-height:18px'></div>";
  $("main").appendChild(d);
  $("sback").onclick = () => show("schools");
  $("ssus").onclick = async () => {
    try { await api("/api/schools/" + id + "/status", { method: "PATCH", body: JSON.stringify({ status: s.status === "suspended" ? "active" : "suspended" }) }); window.schoolDetail(id); }
    catch (e) { $("smsg").textContent = e.message; }
  };
};
