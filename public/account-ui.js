window.accountUI = function () {
  const d = document.createElement("div");
  d.innerHTML = "<h1 style='font-size:18px;margin-top:16px'>" + t("pass") + "</h1><input id='op' type='password' placeholder='" + t("cur") + "'><input id='np' type='password' placeholder='" + t("nw") + "'><button id='pb'>" + t("change") + "</button><div id='pm' style='font-size:14px;min-height:18px'></div>";
  $("main").appendChild(d);
  $("pb").onclick = async () => {
    try {
      await api("/api/account/password", { method: "POST", body: JSON.stringify({ old_password: $("op").value, new_password: $("np").value }) });
      $("pm").textContent = t("ok"); $("op").value = ""; $("np").value = "";
    } catch (e) { $("pm").textContent = e.message; }
  };
};
