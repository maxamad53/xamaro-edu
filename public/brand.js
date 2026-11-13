document.head.insertAdjacentHTML("beforeend", `<style>
.brand{background:linear-gradient(160deg,#0A2540,#12305a);border-radius:20px;padding:20px 14px;text-align:center;margin-bottom:16px;overflow:hidden}
.brand svg{animation:bfloat 3.5s ease-in-out infinite;filter:drop-shadow(0 6px 10px rgba(0,0,0,.35))}
.brand h2{margin:10px 0 0;color:#fff;font-size:22px;letter-spacing:1px;animation:bup .8s both}
.brand .gold{margin:4px 0 0;font-size:18px;font-weight:700;letter-spacing:1.5px;background:linear-gradient(90deg,#b8902f,#f5de8b,#b8902f);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:bshine 3s linear infinite,bup .8s .2s both}
.brand .line{height:2px;width:80%;margin:12px auto;background:#E6C36A;animation:bline 1s .4s both}
.brand .off{color:#fff;font-weight:700;font-size:14px;letter-spacing:.5px;animation:bup .8s .5s both}
.brand .reg{color:#e2e8f0;font-size:14px;margin-top:4px;animation:bup .8s .65s both}
.brand .tag{margin-top:10px;font-size:12px;color:#93c5fd;animation:bup .8s .8s both}
.brand .tag span{animation:bglow 3s ease-in-out infinite}
.brand .tag span:nth-child(2){animation-delay:1s}
.brand .tag span:nth-child(3){animation-delay:2s}
@keyframes bfloat{50%{transform:translateY(-5px)}}
@keyframes bshine{to{background-position:-200% 0}}
@keyframes bup{from{opacity:0;transform:translateY(10px)}}
@keyframes bline{from{transform:scaleX(0)}}
@keyframes bglow{50%{color:#fff;text-shadow:0 0 8px #93c5fd}}
@media (prefers-reduced-motion:reduce){.brand *{animation:none!important}}
</style>`);
