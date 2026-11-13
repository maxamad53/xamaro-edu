const st = document.createElement("style");
st.textContent = "body.dark .card{background:#1e293b;color:#e2e8f0}body.dark h1,body.dark .st b{color:#f1f5f9}body.dark .st{background:#334155}body.dark .st span{color:#cbd5e1}body.dark .row{border-color:#334155}body.dark input,body.dark select{background:#0f172a;color:#e2e8f0;border-color:#475569}#tg{position:fixed;top:10px;right:10px;width:auto;padding:8px 12px;z-index:9;font-size:14px}";
document.head.appendChild(st);
const tg = document.createElement("button");
tg.id = "tg";
const apply = on => { document.body.classList.toggle("dark", on); tg.textContent = on ? "Iftiin" : "Mugdi"; };
let on = false;
try { on = localStorage.getItem("dark") === "1"; } catch (e) {}
apply(on);
tg.onclick = () => { on = !on; apply(on); try { localStorage.setItem("dark", on ? "1" : "0"); } catch (e) {} };
document.body.appendChild(tg);
