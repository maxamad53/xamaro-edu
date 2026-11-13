document.head.insertAdjacentHTML("beforeend", `<style>
.th{background:linear-gradient(135deg,#0A2540 0%,#1d4ed8 100%);color:#fff;border-radius:22px;padding:22px;margin-bottom:14px;position:relative;overflow:hidden}
.th::after{content:"";position:absolute;right:-30px;top:-30px;width:140px;height:140px;border-radius:50%;background:rgba(230,195,106,.18)}
.th h2{margin:0;font-size:22px}.th p{margin:6px 0 0;opacity:.85;font-size:14px}
.th .chip{display:inline-block;margin-top:12px;padding:5px 12px;border-radius:999px;background:rgba(255,255,255,.16);font-size:12px;font-weight:600}
.tsum{display:flex;align-items:center;gap:16px;background:#fff;border-radius:20px;padding:16px;margin-bottom:14px;box-shadow:0 2px 10px rgba(10,37,64,.08)}
.tsum .nums{flex:1;display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;text-align:center}
.tsum b{display:block;font-size:24px;color:#0A2540}.tsum span{font-size:12px;color:#475569}
.tact{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.tt{background:#fff;border-radius:20px;padding:16px;box-shadow:0 2px 10px rgba(10,37,64,.08);cursor:pointer;transition:transform .12s}
.tt:active{transform:scale(.97)}
.tt .ic{width:46px;height:46px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:10px;color:#fff}
.tt b{display:block;font-size:15px;color:#0A2540}.tt span{font-size:12px;color:#475569}
.tq{text-align:center;margin:18px 8px 4px;color:#64748b;font-size:13px}
.rt{fill:#0A2540}body.dark .rt{fill:#f1f5f9}
body.dark .tsum,body.dark .tt{background:#1e293b}body.dark .tsum b,body.dark .tt b{color:#f1f5f9}body.dark .tsum span,body.dark .tt span{color:#cbd5e1}
</style>`);
window.teacherHome = async function () {
  const st = await api("/api/stats");
  const D = ["Axad", "Isniin", "Salaasa", "Arbaco", "Khamiis", "Jimce", "Sabti"];
  const M = ["Janaayo", "Febraayo", "Maarso", "Abriil", "Maajo", "Juun", "Luuliyo", "Ogosto", "Sebtembar", "Oktoobar", "Nofembar", "Desembar"];
  const n = new Date();
  const tot = st.present_today + st.absent_today;
  const pct = tot ? Math.round((st.present_today / tot) * 100) : null;
  const C = 2 * Math.PI * 34;
  const hero = document.createElement("section");
  hero.className = "th";
  hero.innerHTML = "<h2>Salaan, " + esc(me.full_name) + "</h2><p>" + D[n.getDay()] + ", " + n.getDate() + " " + M[n.getMonth()] + " " + n.getFullYear() + "</p><span class='chip'>Macalin</span>";
  $("main").appendChild(hero);
  const sum = document.createElement("section");
  sum.className = "tsum";
  sum.innerHTML = "<svg width='84' height='84' viewBox='0 0 84 84'><circle cx='42' cy='42' r='34' fill='none' stroke='#e2e8f0' stroke-width='8'/><circle cx='42' cy='42' r='34' fill='none' stroke='#16a34a' stroke-width='8' stroke-linecap='round' stroke-dasharray='" + ((pct || 0) * C / 100) + " " + C + "' transform='rotate(-90 42 42)'/><text class='rt' x='42' y='47' text-anchor='middle' font-size='16' font-weight='700'>" + (pct == null ? "-" : pct + "%") + "</text></svg>" +
    "<div class='nums'><div><b>" + st.students + "</b><span>Arday</span></div><div><b>" + st.present_today + "</b><span>Joogo</span></div><div><b>" + st.absent_today + "</b><span>Maqan</span></div></div>";
  $("main").appendChild(sum);
  const T = [["att", "✅", "Qaado imaanshaha", "Maalinta maanta", "#16a34a"], ["exams", "📝", "Geli dhibcaha", "Imtixaan & natiijo", "#2563eb"], ["students", "🎓", "Ardayda", "Liiska & raadin", "#7c3aed"], ["set", "⚙️", "Settings", "Luuqad & password", "#475569"]];
  const grid = document.createElement("section");
  grid.className = "tact";
  grid.innerHTML = T.map(a => "<div class='tt' data-go='" + a[0] + "'><div class='ic' style='background:" + a[4] + "'>" + a[1] + "</div><b>" + a[2] + "</b><span>" + a[3] + "</span></div>").join("");
  $("main").appendChild(grid);
  grid.querySelectorAll(".tt").forEach(x => x.onclick = () => show(x.dataset.go));
  $("main").insertAdjacentHTML("beforeend", "<p class='tq'>Waxbarasho maanta, horumar berri.</p>");
};
