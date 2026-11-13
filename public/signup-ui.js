const sb = document.createElement("button");
sb.textContent = "Dugsi cusub? Is-diiwaangeli";
sb.style.cssText = "background:transparent;color:#2563eb;border:0;font-size:14px";
$("box").appendChild(sb);
const sf = document.createElement("div");
sf.style.display = "none";
sf.innerHTML = "<h1 style='font-size:18px;margin-top:12px'>Dugsi cusub</h1><input id='sn1' placeholder='Magaca dugsiga'><input id='sc1' placeholder='Koodhka dugsiga (tusaale: hodan1)'><input id='sa1' placeholder='Magacaaga (maamulaha)'><input id='se1' type='email' placeholder='Email'><input id='sp1' type='password' placeholder='Password (8+)'><button id='ss1'>Dir codsiga</button><div id='sm1' style='font-size:14px;min-height:18px'></div>";
$("box").appendChild(sf);
sb.onclick = () => { sf.style.display = sf.style.display === "none" ? "block" : "none"; };
$("ss1").onclick = async () => {
  $("sm1").textContent = "";
  try {
    const r = await fetch("/api/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ school_name: $("sn1").value, school_code: $("sc1").value, admin_name: $("sa1").value, admin_email: $("se1").value, admin_password: $("sp1").value }) });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error);
    sf.style.display = "none";
    $("msg").textContent = "Codsiga waa la helay. Sug ogolaanshaha Super Admin.";
  } catch (e) { $("sm1").textContent = e.message; }
};
