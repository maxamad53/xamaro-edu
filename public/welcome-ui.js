window.welcomeHero = function (title) {
  const MSG = ["Waxbarashadu waa furaha mustaqbalka.", "Aqoontu waa iftiinka bulshada.", "Macallinku waa dhisaha jiilka cusub.", "Waxbarasho maanta, horumar berri.", "Dugsi fiican waa bulsho fiican."];
  const w = document.createElement("section");
  w.className = "wl";
  w.innerHTML = "<img src='/logo.png' alt=''><h2>" + esc(title) + "</h2><div class='wsub'>" + esc((me.school_name ? me.school_name + " · " : "") + me.full_name) + "</div><div class='typ'><span></span><i></i></div>";
  $("main").appendChild(w);
  const im = w.querySelector("img");
  im.onerror = () => { im.style.display = "none"; };
  const el = w.querySelector(".typ span");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let mi = 0, ci = 0;
  (function tick() {
    if (!w.isConnected) return;
    const full = MSG[mi % MSG.length];
    if (reduce) { el.textContent = full; mi++; setTimeout(tick, 5000); return; }
    ci++; el.textContent = full.slice(0, ci);
    if (ci >= full.length) { ci = 0; mi++; setTimeout(tick, 2600); } else setTimeout(tick, 50);
  })();
};
