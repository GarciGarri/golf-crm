'use client'
import { useState, useRef } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const CONTACTS = [
  { id:1, name:"Carlos Mendoza", tg:"@carlos_golf", handicap:12, lang:"ES", visits:24, lastVisit:"hace 3 días", tags:["Alto Valor","Torneo"], segment:"VIP", sentiment:"positive", av:"CM", status:"active" },
  { id:2, name:"James Walker", tg:"@jwalker_golf", handicap:8, lang:"EN", visits:41, lastVisit:"ayer", tags:["Madrugador","Alto Valor"], segment:"VIP", sentiment:"positive", av:"JW", status:"active" },
  { id:3, name:"Ingrid Björk", tg:"@ingrid_bjork", handicap:18, lang:"SV", visits:7, lastVisit:"hace 2 semanas", tags:["Turista","Nuevo"], segment:"Normal", sentiment:"neutral", av:"IB", status:"active" },
  { id:4, name:"Marco Rossi", tg:"@marco_rossi_golf", handicap:22, lang:"IT", visits:3, lastVisit:"hace 45 días", tags:["Riesgo Churn"], segment:"En Riesgo", sentiment:"negative", av:"MR", status:"at-risk" },
  { id:5, name:"Ana García", tg:"@anagarcia_vv", handicap:15, lang:"ES", visits:18, lastVisit:"hace 1 semana", tags:["Torneo","Residente"], segment:"Normal", sentiment:"positive", av:"AG", status:"active" },
  { id:6, name:"Hans Müller", tg:"@hansmuller_pro", handicap:6, lang:"DE", visits:56, lastVisit:"hace 2 días", tags:["Alto Valor","Pro"], segment:"VIP", sentiment:"positive", av:"HM", status:"active" },
];
const CONVS = [
  { id:1, contact:"Carlos Mendoza", av:"CM", last:"Perfecto, nos vemos el sábado en el tee 1 🏌️", time:"10:32", unread:0, status:"resolved", sent:"positive" },
  { id:2, contact:"James Walker", av:"JW", last:"Could you confirm my tee time for tomorrow?", time:"09:15", unread:2, status:"open", sent:"neutral" },
  { id:3, contact:"Ingrid Björk", av:"IB", last:"Tack! Vi ses på lördag 🌿", time:"Ayer", unread:0, status:"resolved", sent:"positive" },
  { id:4, contact:"Marco Rossi", av:"MR", last:"Non sono soddisfatto del servizio...", time:"Lun", unread:1, status:"open", sent:"negative" },
  { id:5, contact:"Ana García", av:"AG", last:"¿Hay plazas para el torneo del domingo?", time:"Lun", unread:3, status:"open", sent:"neutral" },
];
const MSGS_JW = [
  { from:"contact", text:"Hi! I'd like to confirm my tee time for tomorrow morning.", time:"09:10" },
  { from:"bot", text:"Hello James! ✅ Your tee time is confirmed for tomorrow at 8:30am, Tee 1.\n\n⛅ Weather: 18°C, light breeze.\n\n📍 /myteetimes — /menu — /cancel", time:"09:11" },
  { from:"contact", text:"Could you confirm my tee time for tomorrow?", time:"09:15" },
];
const MSGS_MR = [
  { from:"contact", text:"Ciao, ho prenotato per le 10:00 ma il campo era in pessime condizioni.", time:"14:22" },
  { from:"contact", text:"Non sono soddisfatto del servizio...", time:"14:23" },
  { from:"agent", text:"Buongiorno Marco, mi dispiace per l'inconveniente. Ti offriamo una green fee gratuita per la tua prossima visita.", time:"15:10", agent:"Laura M." },
];
const CAMPS = [
  { id:1, name:"Black Friday Golf Week", status:"sent", seg:"Todos", sent:312, opened:187, replies:64, conv:28, date:"22 Nov" },
  { id:2, name:"Torneo Navidad - Invitación", status:"sent", seg:"Torneo", sent:89, opened:71, replies:43, conv:38, date:"15 Nov" },
  { id:3, name:"Reactivación Clientes", status:"sending", seg:"Riesgo Churn", sent:34, opened:12, replies:5, conv:2, date:"Hoy" },
  { id:4, name:"Oferta Fin de Semana", status:"draft", seg:"Alto Valor", sent:0, opened:0, replies:0, conv:0, date:"Pendiente" },
];

// ─── STYLES ───────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --forest:#1a3a2a;--pine:#2d5a3d;--sage:#4a8c5c;--mint:#6dbf82;
  --dew:#c8ebd0;--fw:#f0f7f2;--gold:#c8922a;--ink:#1a2318;
  --mist:#8a9e8e;--fog:#e4ede6;--alert:#e05252;--info:#2b7cd3;--tg:#229ED9;
  --r:12px;--rs:8px;--sh:0 2px 16px rgba(26,58,42,.10);--shlg:0 8px 40px rgba(26,58,42,.15);
  --fn:'DM Sans',sans-serif;--bnh:64px;
}
html,body{height:100dvh;overflow:hidden;font-family:var(--fn);background:var(--fw);color:var(--ink)}
.app{display:flex;height:100dvh;overflow:hidden}

/* SIDEBAR */
.sb{width:68px;background:var(--forest);display:flex;flex-direction:column;align-items:center;padding:16px 0;gap:6px;flex-shrink:0;z-index:20}
.logo{width:42px;height:42px;border-radius:13px;margin-bottom:12px;background:linear-gradient(135deg,var(--mint),var(--gold));display:flex;align-items:center;justify-content:center;color:white;font-size:20px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.3)}
.nb{width:46px;height:46px;border-radius:13px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:19px;background:transparent;color:rgba(255,255,255,.4);transition:all .18s;position:relative}
.nb:hover{background:rgba(255,255,255,.1);color:white}
.nb.on{background:var(--sage);color:white}
.nbb{position:absolute;top:5px;right:5px;background:var(--alert);color:white;font-size:9px;font-weight:700;padding:1px 4px;border-radius:6px;min-width:15px;text-align:center}
.sbb{margin-top:auto}
.uav{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--mint),var(--sage));display:flex;align-items:center;justify-content:center;color:white;font-weight:600;font-size:13px;cursor:pointer;border:2px solid rgba(255,255,255,.2)}

/* BOTTOM NAV */
.bnav{display:none;position:fixed;bottom:0;left:0;right:0;height:var(--bnh);background:var(--forest);z-index:50;justify-content:space-around;align-items:center;border-top:1px solid rgba(255,255,255,.07);padding-bottom:env(safe-area-inset-bottom,0)}
.bnb{display:flex;flex-direction:column;align-items:center;gap:2px;background:none;border:none;cursor:pointer;padding:5px 8px;color:rgba(255,255,255,.4);font-family:var(--fn);position:relative;min-width:46px}
.bnb.on{color:var(--mint)}
.bnb-ic{font-size:20px;line-height:1}
.bnb-lb{font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.3px}
.bnbb{position:absolute;top:1px;right:3px;background:var(--alert);color:white;font-size:9px;font-weight:700;padding:1px 4px;border-radius:7px}

/* MAIN */
.main{flex:1;overflow:hidden;display:flex;flex-direction:column;min-width:0}
.topbar{height:52px;background:white;border-bottom:1px solid var(--fog);display:flex;align-items:center;padding:0 14px;gap:10px;flex-shrink:0}
.tb-t{font-size:15px;font-weight:600;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tb-s{font-size:11px;color:var(--mist);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

/* BUTTONS */
.btn{padding:7px 12px;border-radius:var(--rs);font-family:var(--fn);font-size:13px;font-weight:500;cursor:pointer;border:none;transition:all .15s;display:inline-flex;align-items:center;gap:5px;white-space:nowrap}
.btn:active{transform:scale(.97)}
.btn-p{background:var(--pine);color:white}
.btn-p:hover{background:var(--forest)}
.btn-s{background:var(--fog);color:var(--ink)}
.btn-s:hover{background:var(--dew)}
.btn-g{background:transparent;color:var(--mist);padding:7px 8px}
.btn-g:hover{background:var(--fog)}
.btn-tg{background:var(--tg);color:white}
.btn-tg:hover{background:#1a8cbf}
.btn-gold{background:var(--gold);color:white}
.btn-danger{background:#fde8e8;color:var(--alert)}
.btn-sm{padding:4px 8px;font-size:12px}
.btn-full{width:100%;justify-content:center}

/* CONTENT */
.content{flex:1;overflow-y:auto;padding:14px}
.content::-webkit-scrollbar{width:4px}
.content::-webkit-scrollbar-thumb{background:var(--fog);border-radius:2px}

/* CARDS */
.card{background:white;border-radius:var(--r);border:1px solid var(--fog);box-shadow:var(--sh);overflow:hidden}
.ch{padding:12px 14px;border-bottom:1px solid var(--fog);display:flex;align-items:center;justify-content:space-between;gap:8px}
.ct{font-size:14px;font-weight:600;color:var(--ink)}
.cb{padding:14px}

/* STAT GRID */
.sg{display:grid;grid-template-columns:repeat(2,1fr);gap:9px;margin-bottom:13px}
.sc{background:white;border-radius:var(--r);padding:12px;border:1px solid var(--fog);box-shadow:var(--sh);position:relative;overflow:hidden}
.sc::before{content:'';position:absolute;top:0;left:0;right:0;height:3px}
.sc.g::before{background:linear-gradient(90deg,var(--mint),var(--sage))}
.sc.go::before{background:linear-gradient(90deg,var(--gold),#f0c060)}
.sc.b::before{background:linear-gradient(90deg,var(--info),#60a8e0)}
.sc.r::before{background:linear-gradient(90deg,var(--alert),#f08080)}
.sv{font-size:22px;font-weight:700;color:var(--ink);margin:7px 0 2px}
.sl{font-size:10px;color:var(--mist);font-weight:500;text-transform:uppercase;letter-spacing:.4px}
.sch{font-size:10px;margin-top:5px;font-weight:500}
.sch.up{color:var(--sage)}.sch.dn{color:var(--alert)}

/* TAGS */
.tag{display:inline-flex;align-items:center;padding:2px 7px;border-radius:20px;font-size:11px;font-weight:500}
.t-vip{background:#fff8e6;color:#a06820;border:1px solid #f5d87a}
.t-risk{background:#fdeaea;color:#c03030;border:1px solid #f0b0b0}
.t-norm{background:var(--fw);color:var(--pine);border:1px solid var(--dew)}
.t-blue{background:#e8f2fc;color:#2860a0;border:1px solid #b0cce8}
.t-tg{background:#e8f5fc;color:#1a7aaa;border:1px solid #90d0f0}

/* AVATAR */
.av{border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:600;flex-shrink:0}
.av-g{background:linear-gradient(135deg,var(--mint),var(--sage));color:white}
.av-go{background:linear-gradient(135deg,var(--gold),#e0b040);color:white}
.av-b{background:linear-gradient(135deg,#60a0d0,#3060a0);color:white}
.av-r{background:linear-gradient(135deg,#f08080,#c04040);color:white}

/* SENTIMENT */
.sd{width:7px;height:7px;border-radius:50%;display:inline-block;flex-shrink:0}
.sd-positive{background:var(--mint)}.sd-neutral{background:var(--gold)}.sd-negative{background:var(--alert)}

/* INBOX */
.inbox-wrap{display:flex;height:calc(100dvh - 52px);overflow:hidden;position:relative}
.inbox-list{width:280px;flex-shrink:0;border-right:1px solid var(--fog);overflow-y:auto;background:white;transition:transform .22s}
.inbox-list::-webkit-scrollbar{width:3px}
.ii{padding:10px 12px;border-bottom:1px solid var(--fog);cursor:pointer;display:flex;align-items:flex-start;gap:9px;transition:background .12s}
.ii:hover{background:var(--fw)}
.ii.on{background:var(--fw);border-left:3px solid var(--pine);padding-left:9px}
.ii-n{font-size:12px;font-weight:600;color:var(--ink)}
.ii-p{font-size:11px;color:var(--mist);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}
.ii-t{font-size:10px;color:var(--mist);flex-shrink:0}
.uc{background:var(--pine);color:white;font-size:9px;font-weight:700;padding:1px 5px;border-radius:8px}
.chat{flex:1;display:flex;flex-direction:column;background:#fafcfa;min-width:0}
.chat-head{padding:10px 13px;background:white;border-bottom:1px solid var(--fog);display:flex;align-items:center;gap:9px;flex-shrink:0}
.chat-msgs{flex:1;overflow-y:auto;padding:13px;display:flex;flex-direction:column;gap:8px}
.chat-msgs::-webkit-scrollbar{width:3px}
.msg{max-width:72%;display:flex;flex-direction:column;gap:2px}
.msg-c{align-self:flex-start}.msg-a{align-self:flex-end}.msg-b{align-self:flex-start}
.bub{padding:8px 12px;border-radius:14px;font-size:13px;line-height:1.5;white-space:pre-wrap}
.msg-c .bub{background:white;color:var(--ink);border:1px solid var(--fog);border-bottom-left-radius:3px}
.msg-a .bub{background:var(--pine);color:white;border-bottom-right-radius:3px}
.msg-b .bub{background:var(--fw);color:var(--ink);border:1px solid var(--dew);border-bottom-left-radius:3px}
.msg-meta{font-size:10px;color:var(--mist);padding:0 3px}
.bot-tag{font-size:9px;background:var(--dew);color:var(--pine);padding:1px 6px;border-radius:5px;font-weight:700;width:fit-content}
.chat-in{padding:10px 12px;background:white;border-top:1px solid var(--fog);flex-shrink:0}
.ai-sug{background:var(--fw);border:1px solid var(--dew);border-radius:var(--rs);padding:8px 11px;margin-bottom:7px;display:flex;gap:8px;align-items:flex-start}
.ai-sug-lb{font-size:9px;font-weight:700;color:var(--sage);text-transform:uppercase;margin-bottom:3px}
.chat-row{display:flex;gap:6px;align-items:flex-end}
.chat-ta{flex:1;border:1.5px solid var(--fog);border-radius:var(--rs);padding:7px 10px;font-family:var(--fn);font-size:13px;resize:none;outline:none;color:var(--ink);background:var(--fw)}
.chat-ta:focus{border-color:var(--sage);background:white}
.ai-panel{width:230px;border-left:1px solid var(--fog);background:white;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;flex-shrink:0}
.ai-panel::-webkit-scrollbar{width:3px}
.ap-t{font-size:10px;font-weight:700;color:var(--mist);text-transform:uppercase;letter-spacing:.5px}
.ins{background:var(--fw);border-radius:var(--rs);padding:8px;border-left:3px solid var(--sage)}
.ins.w{border-left-color:var(--gold)}.ins.i{border-left-color:var(--info)}
.ins-lb{font-size:9px;font-weight:700;color:var(--sage);text-transform:uppercase}
.ins.w .ins-lb{color:var(--gold)}.ins.i .ins-lb{color:var(--info)}
.ins-tx{font-size:11px;color:var(--ink);margin-top:2px;line-height:1.5}

/* CONTACTS */
.cg{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}
.cc{background:white;border-radius:var(--r);border:1px solid var(--fog);padding:13px;cursor:pointer;transition:all .18s;box-shadow:var(--sh)}
.cc:hover{border-color:var(--dew);transform:translateY(-1px);box-shadow:var(--shlg)}
.cc:active{transform:none}
.cst{display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;margin-top:8px;border-top:1px solid var(--fog);padding-top:8px}
.csv{font-size:14px;font-weight:700;color:var(--pine);text-align:center}
.csl{font-size:9px;color:var(--mist);text-transform:uppercase;text-align:center}

/* CAMPAIGNS */
.ci{background:white;border-radius:var(--r);border:1px solid var(--fog);overflow:hidden;margin-bottom:9px;box-shadow:var(--sh)}
.ci-h{padding:11px 13px;display:flex;align-items:center;gap:9px;border-bottom:1px solid var(--fog);flex-wrap:wrap}
.cs{padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600}
.cs-sent{background:#e6f7ea;color:#2d6a3a}
.cs-sending{background:#e6f0fc;color:#2060a0}
.cs-draft{background:var(--fog);color:var(--mist)}
.cm{display:grid;grid-template-columns:repeat(4,1fr);padding:11px 13px;gap:9px}
.cmv{font-size:17px;font-weight:700;color:var(--ink)}
.cml{font-size:10px;color:var(--mist)}
.cmbar{height:3px;background:var(--fog);border-radius:2px;margin-top:3px;overflow:hidden}
.cmf{height:100%;border-radius:2px;background:linear-gradient(90deg,var(--mint),var(--sage))}

/* MODALS */
.ov{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:100;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);animation:fi .16s;padding:16px}
.mo{background:white;border-radius:16px;width:100%;max-width:530px;max-height:90dvh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.25);animation:su .2s}
.mo-h{padding:14px 17px;border-bottom:1px solid var(--fog);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:white;z-index:2}
.mo-t{font-size:15px;font-weight:700;color:var(--ink)}
.mo-b{padding:17px}
.mo-f{padding:11px 17px;border-top:1px solid var(--fog);display:flex;justify-content:flex-end;gap:7px;flex-wrap:wrap}
.fg{margin-bottom:12px}
.fl{font-size:11px;font-weight:600;color:var(--mist);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px;display:block}
.fi{width:100%;padding:8px 10px;border:1.5px solid var(--fog);border-radius:var(--rs);font-family:var(--fn);font-size:13px;outline:none;color:var(--ink);background:var(--fw);transition:border-color .15s}
.fi:focus{border-color:var(--sage);background:white}
.fi.ok{border-color:var(--mint)}
.fs{width:100%;padding:8px 10px;border:1.5px solid var(--fog);border-radius:var(--rs);font-family:var(--fn);font-size:13px;outline:none;color:var(--ink);background:var(--fw)}
.fta{width:100%;padding:8px 10px;border:1.5px solid var(--fog);border-radius:var(--rs);font-family:var(--fn);font-size:13px;outline:none;color:var(--ink);background:var(--fw);resize:vertical;min-height:72px}

/* AI BOX */
.aib{background:linear-gradient(135deg,#f0f7f2,#e8f4fc);border:1px solid var(--dew);border-radius:var(--rs);padding:10px;margin-bottom:11px;position:relative;overflow:hidden}
.aib::after{content:'✦';position:absolute;top:6px;right:9px;font-size:13px;color:var(--mint);opacity:.4}
.aib-l{font-size:9px;font-weight:700;color:var(--sage);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}
.aib-t{font-size:12px;color:var(--ink);line-height:1.5}

/* WIZARD */
.wz{border:1.5px solid var(--fog);border-radius:var(--r);overflow:hidden;margin-bottom:8px;transition:border-color .18s}
.wz.done{border-color:var(--mint)}
.wz.active{border-color:var(--pine);box-shadow:0 0 0 3px rgba(45,90,61,.07)}
.wz-h{display:flex;align-items:center;gap:10px;padding:11px 13px;cursor:pointer;background:white;user-select:none}
.wz-h:hover{background:var(--fw)}
.wz-n{width:25px;height:25px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0}
.wz-n.done{background:var(--mint);color:white}
.wz-n.active{background:var(--pine);color:white}
.wz-n.pend{background:var(--fog);color:var(--mist)}
.wz-body{padding:13px;background:var(--fw);border-top:1px solid var(--fog)}
.code{background:#1e2d22;color:#a8d5b0;font-family:'Courier New',monospace;font-size:11px;padding:10px 12px;border-radius:8px;margin:6px 0;line-height:1.7;overflow-x:auto}
.code .cmd{color:#6dbf82}.code .cmt{color:#4a6a50}
.cp-btn{background:rgba(255,255,255,.1);color:white;border:none;border-radius:4px;padding:2px 7px;font-size:10px;cursor:pointer;font-family:var(--fn);margin-top:3px}
.cp-btn:hover{background:rgba(255,255,255,.2)}

/* DEPLOY */
.dp{border-radius:var(--r);overflow:hidden;margin-bottom:11px;border:1px solid var(--fog);box-shadow:var(--sh)}
.dp-h{padding:11px 14px;color:white;display:flex;align-items:center;gap:10px}
.dp-n{font-size:20px;font-weight:800;opacity:.5;width:28px;flex-shrink:0}
.dp-ti{font-size:14px;font-weight:700}
.dp-su{font-size:10px;opacity:.75;margin-top:1px}
.dp-b{padding:11px 13px;background:white}
.dt{display:flex;gap:9px;padding:8px 0;border-bottom:1px solid var(--fog);align-items:flex-start}
.dt:last-child{border-bottom:none}
.dt-ic{font-size:16px;flex-shrink:0;width:22px;text-align:center}
.dt-ti{font-size:12px;font-weight:600;color:var(--ink)}
.dt-de{font-size:11px;color:var(--mist);margin-top:2px;line-height:1.5}
.bg-you{background:#e8f7ea;color:#2d6a3a;font-size:10px;font-weight:700;padding:2px 6px;border-radius:8px}
.bg-dev{background:#e8f0fc;color:#2060a0;font-size:10px;font-weight:700;padding:2px 6px;border-radius:8px}
.bg-auto{background:#fff0d8;color:#8a5a00;font-size:10px;font-weight:700;padding:2px 6px;border-radius:8px}

/* PROGRESS */
.pr{display:flex;align-items:center;gap:7px;margin-bottom:6px}
.pb{flex:1;height:5px;background:var(--fog);border-radius:3px;overflow:hidden}
.pf{height:100%;border-radius:3px;transition:width .5s}
.pv{font-size:11px;font-weight:600;color:var(--ink);width:26px;text-align:right;flex-shrink:0}

/* SETTINGS */
.sl{display:flex;gap:13px;align-items:flex-start}
.snav{width:185px;flex-shrink:0;background:white;border-radius:var(--r);border:1px solid var(--fog);overflow:hidden}
.snb{width:100%;padding:9px 12px;border:none;background:transparent;cursor:pointer;display:flex;gap:9px;align-items:center;font-size:13px;color:var(--mist);font-weight:400;border-left:3px solid transparent;font-family:var(--fn);text-align:left;transition:all .12s}
.snb.on{background:var(--fw);color:var(--pine);font-weight:600;border-left-color:var(--pine)}
.snb:hover:not(.on){background:var(--fw)}
.sc2{flex:1;min-width:0}

/* ONBOARDING */
.ob{background:linear-gradient(135deg,var(--forest),var(--pine));border-radius:var(--r);padding:13px 16px;color:white;margin-bottom:13px;position:relative;overflow:hidden}
.ob::after{content:'⛳';position:absolute;right:13px;top:50%;transform:translateY(-50%);font-size:44px;opacity:.1}
.ob-steps{display:flex;gap:5px;margin-top:9px;flex-wrap:wrap}
.sdot{width:20px;height:20px;border-radius:50%;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.sdot.done{background:var(--mint);color:var(--forest)}
.sdot.curr{background:var(--gold);color:var(--forest);animation:pulse 2s infinite}
.sdot.pend{background:rgba(255,255,255,.15);color:rgba(255,255,255,.4)}

/* CHURN */
.ci2{background:#fff5f5;border:1px solid #f0c0c0;border-radius:var(--rs);padding:8px;display:flex;align-items:center;gap:9px;margin-bottom:6px}

/* DIVIDER / TABS */
.div{height:1px;background:var(--fog);margin:11px 0}
.tabs{display:flex;gap:3px;background:var(--fog);padding:3px;border-radius:var(--rs);width:fit-content;margin-bottom:13px}
.tab{padding:5px 12px;border-radius:7px;font-size:12px;font-weight:500;cursor:pointer;border:none;background:transparent;color:var(--mist);transition:all .14s;font-family:var(--fn)}
.tab.on{background:white;color:var(--ink);box-shadow:0 1px 4px rgba(0,0,0,.1)}

/* NOTIFICATION */
.notif{position:fixed;bottom:calc(var(--bnh) + 10px);right:14px;background:var(--forest);color:white;padding:9px 14px;border-radius:var(--r);font-size:13px;font-weight:500;box-shadow:var(--shlg);z-index:200;animation:su .22s;display:flex;align-items:center;gap:7px;max-width:280px}

/* CHARTS */
.cw{display:flex;align-items:flex-end;gap:4px;height:110px}
.cbar{flex:1;border-radius:4px 4px 0 0;cursor:pointer;min-width:0}
.cbar:hover{opacity:.75}
.clabs{display:flex;gap:4px;margin-top:2px}
.clab{flex:1;text-align:center;font-size:9px;color:var(--mist)}

/* COST TABLE */
.cost-row{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--fog);font-size:13px}
.cost-row:last-child{border-bottom:none;font-weight:700}
.cfree{color:var(--sage);font-weight:600}
.cpaid{color:var(--ink);font-weight:600}

@keyframes fi{from{opacity:0}to{opacity:1}}
@keyframes su{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.pulse{animation:pulse 2s infinite}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:11px}

/* MOBILE */
@media(max-width:767px){
  .sb{display:none}
  .bnav{display:flex}
  .content{padding:10px;padding-bottom:calc(var(--bnh) + 10px)}
  .sg{grid-template-columns:1fr 1fr;gap:7px}
  .sv{font-size:20px}
  .two-col{grid-template-columns:1fr !important}
  .cg{grid-template-columns:1fr}
  .inbox-list{position:absolute;left:0;top:0;bottom:0;width:100%;z-index:3}
  .inbox-list.hide{transform:translateX(-100%)}
  .ai-panel{display:none}
  .sl{flex-direction:column}
  .snav{width:100%}
  .snav-inner{display:flex;overflow-x:auto}
  .snb{flex-shrink:0;border-left:none;border-bottom:2.5px solid transparent;white-space:nowrap}
  .snb.on{border-left:none;border-bottom-color:var(--pine)}
  .notif{right:10px;left:10px;max-width:none}
  .ov{padding:0;align-items:flex-end}
  .mo{border-bottom-left-radius:0;border-bottom-right-radius:0;max-width:100%;max-height:88dvh}
  .cm{grid-template-columns:repeat(2,1fr)}
  .ob::after{display:none}
  .topbar{padding:0 10px}
  .tb-s{display:none}
  .dp-b{padding:10px}
  .ci-h{gap:6px}
}
@media(min-width:768px) and (max-width:1099px){
  .ai-panel{display:none}
  .sg{grid-template-columns:repeat(2,1fr)}
}
@media(min-width:1100px){
  .sg{grid-template-columns:repeat(4,1fr)}
}
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function Av({ s="CM", size=36 }) {
  const cls = ["av-g","av-go","av-b","av-r"][s.charCodeAt(0)%4];
  return <div className={`av ${cls}`} style={{width:size,height:size,fontSize:size*.35}}>{s}</div>;
}
function SD({ s }) { return <span className={`sd sd-${s}`} />; }
function TB({ tag }) {
  const m={"Alto Valor":"t-vip","Riesgo Churn":"t-risk","Torneo":"t-norm","Madrugador":"t-norm","Turista":"t-blue","Nuevo":"t-blue","Residente":"t-norm","Pro":"t-vip"};
  return <span className={`tag ${m[tag]||"t-norm"}`}>{tag}</span>;
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardView({ onNav }) {
  const bars=[65,48,72,55,80,92,67,74,88,61,77,84];
  const mx=Math.max(...bars);
  const mo=["E","F","M","A","M","J","J","A","S","O","N","D"];
  return (
    <div className="content">
      <div className="ob">
        <div style={{fontSize:14,fontWeight:700,marginBottom:3}}>¡Bienvenido, Club Valle Verde! 🌿</div>
        <div style={{fontSize:12,opacity:.8}}>Completa la configuración para activar todos los módulos.</div>
        <div className="ob-steps">
          {["Bot Telegram","Importar","1ª campaña","Chatbot IA","¡Listo!"].map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:4}}>
              <div className={`sdot ${i<2?"done":i===2?"curr":"pend"}`}>{i<2?"✓":i+1}</div>
              <span style={{fontSize:10,color:"white",opacity:i<3?1:.4}}>{s}</span>
              {i<4&&<span style={{color:"rgba(255,255,255,.25)",fontSize:11}}>›</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="sg">
        {[{ic:"👥",v:"312",l:"Contactos",ch:"+18 este mes",d:"up",c:"g"},{ic:"✈️",v:"91%",l:"Apertura Telegram",ch:"+4% vs email",d:"up",c:"go"},{ic:"📅",v:"47",l:"Reservas CRM",ch:"+12 vs anterior",d:"up",c:"b"},{ic:"📉",v:"8",l:"Riesgo churn",ch:"Acción recomendada",d:"dn",c:"r"}].map((s,i)=>(
          <div key={i} className={`sc ${s.c}`}>
            <div style={{fontSize:18}}>{s.ic}</div>
            <div className="sv">{s.v}</div>
            <div className="sl">{s.l}</div>
            <div className={`sch ${s.d}`}>{s.d==="up"?"↑":"↓"} {s.ch}</div>
          </div>
        ))}
      </div>
      <div className="two-col" style={{marginBottom:11}}>
        <div className="card">
          <div className="ch"><span className="ct">📈 Reservas — 2024</span></div>
          <div className="cb">
            <div className="cw">{bars.map((v,i)=><div key={i} className="cbar" style={{height:`${(v/mx)*95}px`,background:i===11?"var(--sage)":"var(--dew)",border:i===11?"none":"1px solid var(--mint)"}} />)}</div>
            <div className="clabs">{mo.map(m=><div key={m} className="clab">{m}</div>)}</div>
          </div>
        </div>
        <div className="card">
          <div className="ch"><span className="ct">🤖 IA esta semana</span></div>
          <div className="cb">
            {[{l:"Borradores usados",p:68,c:"var(--sage)"},{l:"Resolución bot",p:74,c:"var(--info)"},{l:"Sentimiento +",p:82,c:"var(--mint)"},{l:"Opt-out",p:3,c:"var(--alert)"}].map(r=>(
              <div key={r.l} className="pr">
                <span style={{fontSize:11,color:"var(--mist)",width:110,flexShrink:0}}>{r.l}</span>
                <div className="pb"><div className="pf" style={{width:`${r.p}%`,background:r.c}} /></div>
                <span className="pv">{r.p}%</span>
              </div>
            ))}
            <div className="div"/>
            <div style={{fontSize:11,color:"var(--mist)",lineHeight:1.5}}>✦ <strong style={{color:"var(--pine)"}}>Insight:</strong> Martes 9-11h → +43% respuestas.</div>
          </div>
        </div>
      </div>
      <div className="two-col">
        <div className="card">
          <div className="ch"><span className="ct">⚡ Actividad reciente</span><button className="btn btn-g btn-sm" onClick={()=>onNav("inbox")}>Bandeja →</button></div>
          {[{ic:"✈️",tx:"James Walker preguntó por su tee time",t:"12 min",col:"var(--info)"},{ic:"📅",tx:"Ana García reservó sábado 10:00h",t:"1h",col:"var(--sage)"},{ic:"⚠️",tx:"Marco Rossi insatisfecho — escalado",t:"2h",col:"var(--alert)"},{ic:"📣",tx:"Campaña 'Reactivación' enviada a 34",t:"3h",col:"var(--gold)"},{ic:"🤖",tx:"Bot resolvió 12 consultas sin humano",t:"hoy",col:"var(--mint)"}].map((a,i)=>(
            <div key={i} style={{padding:"9px 13px",borderBottom:"1px solid var(--fog)",display:"flex",gap:8,alignItems:"flex-start"}}>
              <div style={{width:25,height:25,borderRadius:"50%",background:`${a.col}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>{a.ic}</div>
              <div style={{flex:1}}><div style={{fontSize:12,color:"var(--ink)"}}>{a.tx}</div><div style={{fontSize:10,color:"var(--mist)",marginTop:1}}>hace {a.t}</div></div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="ch"><span className="ct">📉 Riesgo churn</span><span className="tag t-risk">8</span></div>
          <div className="cb">
            {[{name:"Marco Rossi",sc:92,r:"45 días sin visitar · queja activa"},{name:"Stefan Klein",sc:78,r:"3 campañas sin respuesta"},{name:"Yuki Tanaka",sc:65,r:"No renueva bono mensual"}].map((c,i)=>(
              <div key={i} className="ci2">
                <div style={{fontSize:16,fontWeight:800,color:"var(--alert)",width:32,textAlign:"center",flexShrink:0}}>{c.sc}</div>
                <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{c.name}</div><div style={{fontSize:10,color:"#c04040",marginTop:1}}>{c.r}</div></div>
                <button className="btn btn-s btn-sm">✈️</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── INBOX ────────────────────────────────────────────────────────────────────
function InboxView() {
  const [active,setActive]=useState(null);
  const [tabK,setTabK]=useState("all");
  const [inp,setInp]=useState("");
  const [notif,setNotif]=useState(null);
  const isMob=typeof window!=="undefined"&&window.innerWidth<768;
  const ac=CONVS.find(c=>c.id===active);
  const msgs=active===2?MSGS_JW:active===4?MSGS_MR:[];
  const sug=active===2?"Your tee time is confirmed at 8:30am, Tee 1. Weather: 18°C ☀️\n\n/myteetimes — /menu":"Marco, mi dispiace per l'inconveniente. Ti offriamo una green fee gratuita per la prossima visita 🙏";
  const flt=tabK==="all"?CONVS:CONVS.filter(c=>c.status===(tabK==="open"?"open":"resolved"));
  const send=()=>{if(!inp.trim())return;setNotif("✓ Enviado por Telegram");setInp("");setTimeout(()=>setNotif(null),2500)};
  return (
    <div className="inbox-wrap">
      <div className={`inbox-list${active&&isMob?" hide":""}`}>
        <div style={{padding:"8px 11px",borderBottom:"1px solid var(--fog)",background:"white",position:"sticky",top:0,zIndex:1}}>
          <div className="tabs" style={{marginBottom:0}}>
            {["all","open","resolved"].map(t=><button key={t} className={`tab ${tabK===t?"on":""}`} onClick={()=>setTabK(t)}>{t==="all"?"Todos":t==="open"?"Abiertos":"Resueltos"}</button>)}
          </div>
        </div>
        {flt.map(c=>(
          <div key={c.id} className={`ii ${active===c.id?"on":""}`} onClick={()=>setActive(c.id)}>
            <Av s={c.av} size={33}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:4}}><span className="ii-n">{c.contact}</span><span className="ii-t">{c.time}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:2,gap:4}}>
                <span className="ii-p">{c.last}</span>
                <div style={{display:"flex",gap:3,alignItems:"center",flexShrink:0}}><SD s={c.sent}/>{c.unread>0&&<span className="uc">{c.unread}</span>}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="chat" style={{display:active||!isMob?"flex":"none"}}>
        {ac?(<>
          <div className="chat-head">
            {isMob&&<button className="btn btn-g btn-sm" onClick={()=>setActive(null)} style={{padding:"3px 6px"}}>←</button>}
            <Av s={ac.av} size={34}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ac.contact}</div>
              <div style={{fontSize:11,color:"var(--mist)",display:"flex",alignItems:"center",gap:5,marginTop:1}}><span className="sd sd-positive pulse"/><span>Telegram activo</span><SD s={ac.sent}/></div>
            </div>
            <div style={{display:"flex",gap:5,flexShrink:0}}>
              {ac.sent==="negative"&&<span style={{background:"#fdeaea",padding:"2px 7px",borderRadius:20,fontSize:10,color:"var(--alert)",fontWeight:600}}>⚠️ Escalado</span>}
              <button className="btn btn-s btn-sm">✓ Resolver</button>
            </div>
          </div>
          <div className="chat-msgs">
            {msgs.map((m,i)=>(
              <div key={i} className={`msg msg-${m.from}`}>
                {m.from==="bot"&&<div className="bot-tag">🤖 Bot Telegram</div>}
                {m.agent&&<div className="bot-tag">👤 {m.agent}</div>}
                <div className="bub">{m.text}</div>
                <div className="msg-meta" style={{alignSelf:m.from==="agent"?"flex-end":"flex-start"}}>{m.time}</div>
              </div>
            ))}
          </div>
          <div className="chat-in">
            <div className="ai-sug">
              <div style={{flex:1}}><div className="ai-sug-lb">✦ Borrador IA</div><div style={{fontSize:12,color:"var(--ink)",lineHeight:1.4}}>{sug}</div></div>
              <button className="btn btn-p btn-sm" onClick={()=>setInp(sug)}>Usar →</button>
            </div>
            <div className="chat-row">
              <textarea className="chat-ta" rows={2} placeholder="Escribe o /comando..." value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),send())}/>
              <button className="btn btn-p" onClick={send} style={{height:40,padding:"0 11px"}}>✈️</button>
            </div>
          </div>
        </>):(
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"var(--mist)",gap:8}}>
            <div style={{fontSize:34}}>✈️</div><div style={{fontSize:13}}>Selecciona una conversación</div>
          </div>
        )}
      </div>
      {ac&&(
        <div className="ai-panel">
          <div className="ap-t">✦ Contexto IA</div>
          <div className="ins"><div className="ins-lb">Jugador</div><div className="ins-tx">{active===2?"James Walker · Hcp 8 · VIP · 41 visitas":"Marco Rossi · Hcp 22 · 3 visitas · Riesgo"}</div></div>
          <div className={`ins ${ac.sent==="negative"?"w":"i"}`}><div className="ins-lb">Sentimiento</div><div className="ins-tx">{ac.sent==="negative"?"⚠️ Negativo — ofrecer compensación":ac.sent==="positive"?"✅ Positivo":"😐 Neutral"}</div></div>
          <div className="ins i"><div className="ins-lb">Intención</div><div className="ins-tx">{active===2?"🎯 Confirmar reserva (94%)":"🎯 Queja. Espera compensación."}</div></div>
          <div className="div"/>
          <div className="ap-t">Últimas visitas</div>
          {[["18 Nov","18h Verde A"],["10 Nov","Torneo club"],["2 Nov","9h Grupo"]].map(([d,n])=>(
            <div key={d} style={{fontSize:11,padding:"6px 0",borderBottom:"1px solid var(--fog)"}}><div style={{fontWeight:600}}>{d}</div><div style={{color:"var(--mist)",marginTop:1}}>{n}</div></div>
          ))}
        </div>
      )}
      {notif&&<div className="notif">{notif}</div>}
    </div>
  );
}

// ─── CONTACTS ─────────────────────────────────────────────────────────────────
function ContactsView() {
  const [modal,setModal]=useState(false);
  const [sel,setSel]=useState(null);
  const [notif,setNotif]=useState(null);
  const [q,setQ]=useState("");
  const flt=CONTACTS.filter(c=>c.name.toLowerCase().includes(q.toLowerCase())||c.tags.some(t=>t.toLowerCase().includes(q.toLowerCase())));
  return (
    <div className="content">
      <div style={{display:"flex",gap:7,marginBottom:10,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,background:"white",border:"1px solid var(--fog)",borderRadius:"var(--rs)",padding:"6px 10px",flex:1,maxWidth:260}}>
          <span>🔍</span>
          <input style={{border:"none",background:"transparent",fontFamily:"var(--fn)",fontSize:13,outline:"none",color:"var(--ink)",width:"100%"}} placeholder="Buscar..." value={q} onChange={e=>setQ(e.target.value)}/>
        </div>
        <div style={{display:"flex",gap:5}}>
          <button className="btn btn-s btn-sm">⬆️ CSV</button>
          <button className="btn btn-p btn-sm" onClick={()=>setModal(true)}>+ Nuevo</button>
        </div>
      </div>
      <div style={{display:"flex",gap:5,marginBottom:11,flexWrap:"wrap"}}>
        {["Todos (312)","VIP (41)","Riesgo (8)","Torneo (56)"].map((s,i)=>(
          <button key={i} className={`btn btn-sm ${i===0?"btn-p":"btn-s"}`}>{s}</button>
        ))}
      </div>
      <div className="cg">
        {flt.map(c=>(
          <div key={c.id} className="cc" onClick={()=>setSel(c)}>
            <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:8}}>
              <Av s={c.av} size={38}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
                <div style={{fontSize:11,color:"var(--tg)",marginTop:1}}>{c.tg}</div>
              </div>
              <SD s={c.sentiment}/>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:3}}>{c.tags.map(t=><TB key={t} tag={t}/>)}</div>
            <div className="cst">
              <div><div className="csv">{c.handicap}</div><div className="csl">Hcp</div></div>
              <div><div className="csv">{c.visits}</div><div className="csl">Visitas</div></div>
              <div><div className="csv">{c.lang}</div><div className="csl">Idioma</div></div>
            </div>
            <div style={{marginTop:6,fontSize:10,color:"var(--mist)",borderTop:"1px solid var(--fog)",paddingTop:6}}>🕐 {c.lastVisit}</div>
          </div>
        ))}
      </div>
      {modal&&(
        <div className="ov" onClick={()=>setModal(false)}>
          <div className="mo" onClick={e=>e.stopPropagation()}>
            <div className="mo-h"><span className="mo-t">➕ Nuevo contacto</span><button className="btn btn-g btn-sm" onClick={()=>setModal(false)}>✕</button></div>
            <div className="mo-b">
              <div className="two-col">
                <div className="fg"><label className="fl">Nombre</label><input className="fi" placeholder="Carlos Mendoza"/></div>
                <div className="fg"><label className="fl">Usuario Telegram</label><input className="fi" placeholder="@usuario"/></div>
              </div>
              <div className="two-col">
                <div className="fg"><label className="fl">Hándicap</label><input className="fi" type="number" placeholder="18"/></div>
                <div className="fg"><label className="fl">Idioma</label><select className="fs"><option>ES</option><option>EN</option><option>DE</option><option>FR</option></select></div>
              </div>
              <div className="fg">
                <label className="fl">Etiquetas</label>
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  {["Alto Valor","Torneo","Residente","Turista","Madrugador","Pro"].map(t=>(
                    <label key={t} style={{display:"flex",alignItems:"center",gap:3,cursor:"pointer",fontSize:12}}><input type="checkbox"/> <TB tag={t}/></label>
                  ))}
                </div>
              </div>
              <div className="aib">
                <div className="aib-l">✦ Consentimiento RGPD</div>
                <label style={{display:"flex",gap:7,alignItems:"flex-start",cursor:"pointer",fontSize:12}}>
                  <input type="checkbox" defaultChecked style={{marginTop:2}}/>
                  <span>El contacto ha dado consentimiento explícito para marketing por Telegram. Registrado automáticamente.</span>
                </label>
              </div>
            </div>
            <div className="mo-f">
              <button className="btn btn-s" onClick={()=>setModal(false)}>Cancelar</button>
              <button className="btn btn-p" onClick={()=>{setNotif("✓ Contacto guardado");setModal(false);setTimeout(()=>setNotif(null),2500)}}>✓ Guardar</button>
            </div>
          </div>
        </div>
      )}
      {sel&&(
        <div className="ov" onClick={()=>setSel(null)}>
          <div className="mo" style={{maxWidth:540}} onClick={e=>e.stopPropagation()}>
            <div className="mo-h">
              <div style={{display:"flex",alignItems:"center",gap:9}}><Av s={sel.av} size={36}/><div><div className="mo-t">{sel.name}</div><div style={{fontSize:11,color:"var(--tg)"}}>{sel.tg}</div></div></div>
              <button className="btn btn-g btn-sm" onClick={()=>setSel(null)}>✕</button>
            </div>
            <div className="mo-b">
              <div className="two-col">
                <div>{[["Hándicap",sel.handicap],["Visitas",sel.visits],["Última visita",sel.lastVisit],["Idioma",sel.lang],["Segmento",sel.segment]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:12,color:"var(--mist)"}}>{k}</span><span style={{fontSize:12,fontWeight:500}}>{v}</span></div>
                ))}</div>
                <div>
                  <div className="ins" style={{marginBottom:7}}><div className="ins-lb">CLV Estimado</div><div className="ins-tx">€{sel.visits*85}/año · Potencial €{sel.visits*120}/año</div></div>
                  <div className={`ins ${sel.sentiment==="negative"?"w":""}`}><div className="ins-lb">Sentimiento</div><div className="ins-tx">{sel.sentiment==="positive"?"✅ Positivo":sel.sentiment==="negative"?"⚠️ Negativo":"😐 Neutral"}</div></div>
                </div>
              </div>
              <div className="div"/>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                <button className="btn btn-tg btn-sm">✈️ Mensaje Telegram</button>
                <button className="btn btn-s btn-sm">📅 Reservas</button>
                {sel.status==="at-risk"&&<button className="btn btn-gold btn-sm">🚨 Retención</button>}
              </div>
            </div>
          </div>
        </div>
      )}
      {notif&&<div className="notif">{notif}</div>}
    </div>
  );
}

// ─── CAMPAIGNS ────────────────────────────────────────────────────────────────
function CampaignsView() {
  const [modal,setModal]=useState(false);
  const [step,setStep]=useState(1);
  const [notif,setNotif]=useState(null);
  const [draft,setDraft]=useState("");
  const [gen,setGen]=useState(false);
  const generate=()=>{setGen(true);setTimeout(()=>{setDraft("¡Hola, {{nombre}}! 🏌️ Te esperamos este fin de semana en Valle Verde.\n\nHora especial para ti. Tarifa: 45€.\n\n¿Te apuntas? Responde SÍ.\n\nEl equipo de Valle Verde ⛳\n/menu — /stop");setGen(false)},1400)};
  return (
    <div className="content">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:6}}>
        <span style={{fontSize:12,color:"var(--mist)"}}>4 campañas · 435 mensajes este mes</span>
        <button className="btn btn-p btn-sm" onClick={()=>setModal(true)}>📣 Nueva campaña</button>
      </div>
      {CAMPS.map(c=>(
        <div key={c.id} className="ci">
          <div className="ci-h">
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:600,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
              <div style={{fontSize:11,color:"var(--mist)",marginTop:2}}>👥 {c.seg} · 📅 {c.date}</div>
            </div>
            <span className={`cs cs-${c.status}`}>{c.status==="sent"?"✓ Enviada":c.status==="sending"?"⏳ Enviando...":"✏️ Borrador"}</span>
            {c.status==="draft"&&<button className="btn btn-p btn-sm">🚀 Lanzar</button>}
          </div>
          <div className="cm">
            {[{l:"Enviados",v:c.sent,m:400},{l:"Abiertos",v:c.opened,m:c.sent||1},{l:"Respuestas",v:c.replies,m:c.opened||1},{l:"Conversiones",v:c.conv,m:c.replies||1}].map(m=>(
              <div key={m.l}><div className="cmv">{m.v}</div><div className="cml">{m.l}</div><div className="cmbar"><div className="cmf" style={{width:`${Math.round((m.v/m.m)*100)}%`}}/></div></div>
            ))}
          </div>
          {c.status==="sent"&&<div style={{padding:"6px 13px",background:"var(--fw)",borderTop:"1px solid var(--fog)",fontSize:11,color:"var(--mist)"}}>✦ {c.name.includes("Torneo")?"43% conversión — mejor del mes.":Math.round((c.opened/(c.sent||1))*100)+"% apertura — sobre la media del sector (24%)."}</div>}
        </div>
      ))}
      {modal&&(
        <div className="ov" onClick={()=>setModal(false)}>
          <div className="mo" style={{maxWidth:530}} onClick={e=>e.stopPropagation()}>
            <div className="mo-h"><span className="mo-t">📣 Nueva campaña Telegram</span><div style={{display:"flex",gap:7}}><span style={{fontSize:11,color:"var(--mist)"}}>Paso {step}/3</span><button className="btn btn-g btn-sm" onClick={()=>{setModal(false);setStep(1)}}>✕</button></div></div>
            <div className="mo-b">
              <div style={{display:"flex",gap:5,marginBottom:17,alignItems:"center"}}>
                {["Segmento","Mensaje","Programar"].map((s,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:4}}>
                    <div style={{width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,background:i+1===step?"var(--pine)":i+1<step?"var(--mint)":"var(--fog)",color:i+1<=step?"white":"var(--mist)"}}>{i+1<step?"✓":i+1}</div>
                    <span style={{fontSize:11,color:i+1===step?"var(--pine)":"var(--mist)",fontWeight:i+1===step?600:400}}>{s}</span>
                    {i<2&&<span style={{color:"var(--fog)"}}>›</span>}
                  </div>
                ))}
              </div>
              {step===1&&<>
                <div className="fg"><label className="fl">Nombre</label><input className="fi" defaultValue="Oferta Fin de Semana"/></div>
                <div className="fg"><label className="fl">Segmento</label><select className="fs"><option>Todos (312)</option><option>Alto Valor (78)</option><option selected>Riesgo Churn (8)</option><option>Torneo (56)</option></select></div>
                <div className="aib" style={{margin:0}}><div className="aib-l">👥 8 contactos seleccionados</div><div className="aib-t">Con consentimiento Telegram. Última interacción: +30 días.</div></div>
              </>}
              {step===2&&<>
                <div className="aib"><div className="aib-l">✦ Ventaja Telegram</div><div className="aib-t">Sin templates ni aprobaciones. Escribe cualquier mensaje al instante.</div></div>
                <div className="fg">
                  <label className="fl">Mensaje</label>
                  <button className="btn btn-s btn-sm" onClick={generate} disabled={gen} style={{marginBottom:7}}>{gen?"✦ Generando...":"✦ Generar con IA"}</button>
                  {draft?(<div className="aib"><div className="aib-l">✦ Borrador IA</div><div className="aib-t" style={{whiteSpace:"pre-wrap"}}>{draft}</div><div style={{display:"flex",gap:5,marginTop:6}}><button className="btn btn-p btn-sm">✓ Usar</button><button className="btn btn-s btn-sm" onClick={generate}>🔄 Regenerar</button></div></div>)
                  :<textarea className="fta" placeholder="Escribe libremente — sin restricciones de template ✦"/>}
                </div>
              </>}
              {step===3&&<>
                <div className="two-col">
                  <div className="fg"><label className="fl">Fecha</label><input className="fi" type="date"/></div>
                  <div className="fg"><label className="fl">Hora</label><select className="fs"><option>09:00 — Recomendado ✦</option><option>10:00</option><option>17:00</option></select></div>
                </div>
                <div className="aib"><div className="aib-l">✦ Recomendación IA</div><div className="aib-t">Para "Riesgo Churn": <strong>martes 9-11h</strong>. Apertura estimada: <strong>34%</strong>.</div></div>
                <div style={{background:"var(--fw)",borderRadius:"var(--rs)",padding:10}}>
                  {[["Campaña","Oferta Fin de Semana"],["Destinatarios","8 contactos"],["Canal","Telegram Bot API"],["Formato","Mensaje libre + Inline Buttons"]].map(([k,v])=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:12}}><span style={{color:"var(--mist)"}}>{k}</span><span style={{fontWeight:500}}>{v}</span></div>
                  ))}
                </div>
              </>}
            </div>
            <div className="mo-f">
              {step>1&&<button className="btn btn-s" onClick={()=>setStep(s=>s-1)}>← Anterior</button>}
              <button className="btn btn-g" onClick={()=>{setModal(false);setStep(1)}}>Cancelar</button>
              {step<3?<button className="btn btn-p" onClick={()=>setStep(s=>s+1)}>Siguiente →</button>
              :<button className="btn btn-gold" onClick={()=>{setNotif("🚀 Campaña programada");setModal(false);setStep(1);setTimeout(()=>setNotif(null),2500)}}>🚀 Programar</button>}
            </div>
          </div>
        </div>
      )}
      {notif&&<div className="notif">{notif}</div>}
    </div>
  );
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
function AnalyticsView() {
  const days=[{l:"Lun",c:42,r:18,b:7},{l:"Mar",c:68,r:31,b:14},{l:"Mié",c:55,r:24,b:11},{l:"Jue",c:38,r:16,b:6},{l:"Vie",c:72,r:38,b:19},{l:"Sáb",c:89,r:52,b:28},{l:"Dom",c:61,r:29,b:13}];
  const mx=Math.max(...days.map(d=>d.c));
  return (
    <div className="content">
      <div className="sg" style={{marginBottom:11}}>
        {[{ic:"📤",v:"1.247",l:"Mensajes",s:"este mes",c:"g"},{ic:"👁️",v:"87%",l:"Apertura media",s:"+3% vs anterior",c:"go"},{ic:"↩️",v:"34%",l:"Tasa respuesta",s:"sector: ~8%",c:"b"},{ic:"📅",v:"142",l:"Conversiones",s:"reservas directas",c:"g"}].map((s,i)=>(
          <div key={i} className={`sc ${s.c}`}><div style={{fontSize:18}}>{s.ic}</div><div className="sv">{s.v}</div><div className="sl">{s.l}</div><div className="sch up">{s.s}</div></div>
        ))}
      </div>
      <div className="two-col" style={{marginBottom:11}}>
        <div className="card">
          <div className="ch"><span className="ct">📊 Actividad semanal</span></div>
          <div className="cb">
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              {[["var(--dew)","Enviados"],["var(--sage)","Respuestas"],["var(--gold)","Reservas"]].map(([c,l])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:4,fontSize:10}}><div style={{width:8,height:8,borderRadius:2,background:c}}/><span style={{color:"var(--mist)"}}>{l}</span></div>
              ))}
            </div>
            <div style={{display:"flex",alignItems:"flex-end",gap:4,height:100}}>
              {days.map((d,i)=>(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                  <div style={{width:"100%",display:"flex",flexDirection:"column",justifyContent:"flex-end",gap:1,height:82}}>
                    <div style={{height:`${(d.c/mx)*70}px`,background:"var(--dew)",borderRadius:"3px 3px 0 0",border:"1px solid var(--mint)"}}/>
                    <div style={{height:`${(d.r/mx)*70}px`,background:"var(--sage)",borderRadius:"3px 3px 0 0"}}/>
                    <div style={{height:`${(d.b/mx)*70}px`,background:"var(--gold)",borderRadius:"3px 3px 0 0"}}/>
                  </div>
                  <span style={{fontSize:9,color:"var(--mist)"}}>{d.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="ch"><span className="ct">🎯 Segmentos</span></div>
          <div className="cb">
            {[{l:"Alto Valor",n:78,p:25,c:"var(--gold)"},{l:"Residente",n:124,p:40,c:"var(--mint)"},{l:"Torneo",n:56,p:18,c:"var(--sage)"},{l:"Turista",n:23,p:7,c:"var(--info)"},{l:"Riesgo churn",n:8,p:3,c:"var(--alert)"}].map(s=>(
              <div key={s.l} className="pr">
                <span style={{fontSize:11,color:"var(--mist)",width:96,flexShrink:0}}>{s.l} ({s.n})</span>
                <div className="pb"><div className="pf" style={{width:`${s.p}%`,background:s.c}}/></div>
                <span className="pv">{s.p}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="two-col">
        <div className="card">
          <div className="ch"><span className="ct">✦ Insights IA</span><span className="tag t-norm">Auto</span></div>
          <div className="cb">
            {[{t:"",i:"⏰",tx:"Martes 9-11h: mejor momento. +43% apertura."},{t:"w",i:"📉",tx:"8 clientes sin responder 30+ días. Activar reactivación."},{t:"",i:"🌍",tx:"Contactos EN responden mejor antes 10am."},{t:"",i:"🏆",tx:"'Torneo Navidad': 43% conversión — mejor resultado."},{t:"w",i:"⚠️",tx:"Marco Rossi (churn 92) sin respuesta 2 semanas."}].map((ins,i)=>(
              <div key={i} className={`ins ${ins.t}`} style={{marginBottom:6}}><div className="ins-tx">{ins.i} {ins.tx}</div></div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="ch"><span className="ct">🏆 Ranking mensajes</span></div>
          <div className="cb">
            {[["torneo_invitacion","43%","↑"],["oferta_fin_semana","31%","↑"],["recordatorio_reserva","28%","→"],["reactivacion_cliente","18%","↓"]].map(([n,cr,tr],i)=>(
              <div key={n} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid var(--fog)"}}>
                <div style={{width:19,height:19,borderRadius:"50%",background:i===0?"var(--gold)":"var(--fog)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:i===0?"white":"var(--mist)",flexShrink:0}}>{i+1}</div>
                <span style={{flex:1,fontSize:11,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n}</span>
                <span style={{fontSize:12,fontWeight:700,color:"var(--pine)",flexShrink:0}}>{cr}</span>
                <span style={{flexShrink:0}}>{tr}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TELEGRAM WIZARD ──────────────────────────────────────────────────────────
function TgWizard({ cfg, setCfg, onSave }) {
  const [open,setOpen]=useState(1);
  const [copied,setCopied]=useState(null);
  const [testOk,setTestOk]=useState(false);
  const [testing,setTesting]=useState(false);
  const done=[cfg.token&&cfg.username,cfg.webhook,cfg.welcome].filter(Boolean).length;
  const cp=(text,k)=>{try{navigator.clipboard.writeText(text)}catch(e){}setCopied(k);setTimeout(()=>setCopied(null),1500)};
  const test=()=>{if(!cfg.token)return;setTesting(true);setTimeout(()=>{setTesting(false);setTestOk(true)},1600)};

  const STEPS=[
    {id:1,title:"Crear el bot con BotFather",sub:"5 minutos · Solo necesitas Telegram",
     body:<div>
       <p style={{fontSize:13,color:"var(--mist)",marginBottom:11,lineHeight:1.6}}>BotFather es el bot oficial de Telegram para crear otros bots. Es completamente gratuito y no requiere verificación ni empresa.</p>
       <a href="https://t.me/BotFather" target="_blank" style={{textDecoration:"none",display:"block",marginBottom:11}}>
         <button className="btn btn-tg">🤖 Abrir BotFather en Telegram</button>
       </a>
       {[["1","Abre @BotFather y escribe /newbot"],["2","Escribe el nombre visible del bot","Ej: Golf Valle Verde"],["3","Escribe el @username","Debe terminar en 'bot' · Ej: @valleverdegolfbot"],["4","BotFather te enviará el token","Formato: 7234567890:AAHfxyz..."],["5","Copia ese token","Lo necesitas en el paso siguiente"]].map(([n,t,d])=>(
         <div key={n} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:"1px solid var(--fog)",alignItems:"flex-start"}}>
           <div style={{width:23,height:23,borderRadius:"50%",background:"var(--tg)",color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{n}</div>
           <div><div style={{fontSize:12,fontWeight:600,color:"var(--ink)"}}>{t}</div>{d&&<div style={{fontSize:11,color:"var(--mist)",marginTop:2}}>{d}</div>}</div>
         </div>
       ))}
       <div style={{marginTop:10,background:"#e8f5fc",border:"1px solid #90d0f0",borderRadius:8,padding:"9px 11px",fontSize:12,color:"var(--info)"}}>
         💡 El token es la contraseña de tu bot. Nunca lo publiques en código público.
       </div>
     </div>
    },
    {id:2,title:"Introduce las credenciales",sub:"Conecta tu bot al CRM",
     body:<div>
       <div className="fg">
         <label className="fl">Token del bot (de BotFather)</label>
         <input className={`fi ${cfg.token?"ok":""}`} placeholder="7234567890:AAHfqweRTY..." value={cfg.token} onChange={e=>setCfg(p=>({...p,token:e.target.value}))}/>
         <div style={{fontSize:11,color:"var(--mist)",marginTop:4}}>Formato: dígitos:letras — lo recibes de @BotFather</div>
       </div>
       <div className="fg">
         <label className="fl">@Username del bot</label>
         <input className={`fi ${cfg.username?"ok":""}`} placeholder="@valleverdegolfbot" value={cfg.username} onChange={e=>setCfg(p=>({...p,username:e.target.value}))}/>
       </div>
       <div className="fg">
         <label className="fl">Nombre visible del bot</label>
         <input className="fi" placeholder="Golf Valle Verde" value={cfg.name} onChange={e=>setCfg(p=>({...p,name:e.target.value}))}/>
       </div>
       <div style={{display:"flex",gap:8,alignItems:"center",marginTop:11,flexWrap:"wrap"}}>
         <button className="btn btn-p" onClick={test} disabled={!cfg.token||testing}>
           {testing?"⏳ Conectando...":testOk?"✅ Conectado":"🔗 Probar conexión"}
         </button>
         {testOk&&<span style={{fontSize:12,color:"var(--sage)"}}>✓ Token válido · Bot activo</span>}
       </div>
     </div>
    },
    {id:3,title:"Configurar el webhook",sub:"El desarrollador lo hace en 10 minutos",
     body:<div>
       <p style={{fontSize:13,color:"var(--mist)",marginBottom:10,lineHeight:1.6}}>El webhook es la URL a la que Telegram enviará los mensajes de tus usuarios. El desarrollador lo registra con un solo comando.</p>
       <div className="fg">
         <label className="fl">URL del webhook (la da el desarrollador)</label>
         <input className="fi" placeholder="https://api.tudominio.com/telegram/webhook" value={cfg.webhook} onChange={e=>setCfg(p=>({...p,webhook:e.target.value}))}/>
       </div>
       <div style={{fontSize:12,fontWeight:600,color:"var(--ink)",marginBottom:6}}>Comando para registrar el webhook:</div>
       <div className="code">
         <div><span className="cmt"># El desarrollador ejecuta esto una sola vez</span></div>
         <div><span className="cmd">curl</span> -X POST \</div>
         <div>  "https://api.telegram.org/bot<span className="cmd">{cfg.token||"TU_TOKEN"}</span>/setWebhook" \</div>
         <div>  -d "url=<span className="cmd">{cfg.webhook||"TU_URL"}</span>/telegram/webhook"</div>
         <button className="cp-btn" onClick={()=>cp(`curl -X POST "https://api.telegram.org/bot${cfg.token||"TOKEN"}/setWebhook" -d "url=${cfg.webhook||"URL"}/telegram/webhook"`,"wh")}>
           {copied==="wh"?"✓ Copiado":"📋 Copiar comando"}
         </button>
       </div>
       <div style={{marginTop:10,background:"#f0f8ff",border:"1px solid #b0d8f0",borderRadius:8,padding:"9px 11px",fontSize:12}}>
         <strong style={{color:"var(--info)"}}>Durante el desarrollo:</strong> usa ngrok para exponer localhost:
         <div className="code" style={{marginTop:6,marginBottom:0}}>
           <div><span className="cmd">npx ngrok http 3000</span></div>
           <div><span className="cmt"># Copia la URL https://xxxx.ngrok.io que aparece</span></div>
         </div>
       </div>
     </div>
    },
    {id:4,title:"Comandos y mensaje de bienvenida",sub:"Personaliza cómo habla tu bot",
     body:<div>
       <div className="fg">
         <label className="fl">Mensaje de bienvenida (/start)</label>
         <textarea className="fta" value={cfg.welcome} onChange={e=>setCfg(p=>({...p,welcome:e.target.value}))} style={{minHeight:90}}/>
       </div>
       <div className="fg">
         <label className="fl">Comandos del bot</label>
         <div style={{background:"white",border:"1px solid var(--fog)",borderRadius:"var(--rs)",overflow:"hidden"}}>
           {[["/start","Bienvenida e instrucciones"],["/reservar","Flujo de reserva de tee time"],["/tarifas","Precios actuales"],["/torneo","Próximo torneo"],["/menu","Menú con inline buttons"],["/stop","Opt-out — baja del servicio"]].map(([cmd,desc],i)=>(
             <div key={cmd} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 11px",borderBottom:i<5?"1px solid var(--fog)":undefined}}>
               <span style={{fontFamily:"monospace",fontSize:12,color:"var(--pine)",fontWeight:700,width:80,flexShrink:0}}>{cmd}</span>
               <span style={{fontSize:12,color:"var(--mist)",flex:1}}>{desc}</span>
               <button className="btn btn-g btn-sm" style={{padding:"2px 5px"}}>✏️</button>
             </div>
           ))}
         </div>
       </div>
       <div className="fg">
         <label className="fl">Vista previa del menú /menu</label>
         <div style={{background:"var(--fw)",borderRadius:"var(--rs)",padding:10,border:"1px solid var(--fog)"}}>
           <div style={{fontSize:12,color:"var(--ink)",marginBottom:8}}>¿Qué necesitas hoy? ⛳</div>
           {[["📅 Reservar","💰 Tarifas"],["🏆 Torneos","📞 Hablar con agente"],["❌ /stop Darse de baja"]].map((row,i)=>(
             <div key={i} style={{display:"flex",gap:4,marginBottom:4}}>
               {row.map(b=><div key={b} style={{flex:1,background:"white",border:"1px solid var(--dew)",borderRadius:5,padding:"4px 7px",fontSize:11,color:"var(--pine)",textAlign:"center",fontWeight:500}}>{b}</div>)}
             </div>
           ))}
         </div>
       </div>
     </div>
    },
    {id:5,title:"Verificar que todo funciona",sub:"Envía el primer mensaje real",
     body:<div>
       {[{ic:"1️⃣",t:`Busca ${cfg.username||"@tubot"} en Telegram`,d:"Ábrelo y pulsa el botón Iniciar (Start)."},
         {ic:"2️⃣",t:"Envía /start",d:"Deberías recibir el mensaje de bienvenida que configuraste."},
         {ic:"3️⃣",t:"Prueba /menu y /tarifas",d:"Verifica que los inline buttons aparecen y responden."},
         {ic:"4️⃣",t:"Revisa la Bandeja del CRM",d:"El mensaje debe aparecer en la sección Bandeja Telegram."},
         {ic:"5️⃣",t:"Responde desde el CRM",d:"Envía una respuesta y verifica que la recibes en Telegram."}].map((t,i)=>(
         <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid var(--fog)",alignItems:"flex-start"}}>
           <span style={{fontSize:17,flexShrink:0}}>{t.ic}</span>
           <div><div style={{fontSize:12,fontWeight:600,color:"var(--ink)"}}>{t.t}</div><div style={{fontSize:11,color:"var(--mist)",marginTop:2,lineHeight:1.5}}>{t.d}</div></div>
         </div>
       ))}
       <div style={{marginTop:13,background:"#e8f7ea",border:"1px solid var(--mint)",borderRadius:8,padding:"10px 12px",fontSize:12}}>
         ✅ Si todo funciona: <strong>el bot está listo para producción.</strong> Importa contactos e inicia la primera campaña.
       </div>
     </div>
    },
  ];

  return (
    <div>
      <div style={{background:"white",border:"1px solid var(--fog)",borderRadius:"var(--r)",padding:"10px 13px",marginBottom:13,display:"flex",alignItems:"center",gap:10}}>
        <span className={`sd sd-${done>=3?"positive":"neutral"} ${done<3?"pulse":""}`} style={{width:9,height:9}}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:600}}>{done>=3?`✅ Bot configurado · ${cfg.username||"@tubot"}`:`⚙️ ${done}/3 pasos completados`}</div>
          <div style={{fontSize:11,color:"var(--mist)",marginTop:1}}>API gratuita · Sin límite mensajes · Sin templates ni aprobaciones</div>
        </div>
        <div style={{display:"flex",gap:5,flexShrink:0}}>
          {cfg.username&&<span className="tag t-tg">{cfg.username}</span>}
          {done>=3&&<button className="btn btn-p btn-sm" onClick={onSave}>✓ Guardar</button>}
        </div>
      </div>
      {STEPS.map(s=>(
        <div key={s.id} className={`wz ${open===s.id?"active":s.id<=done?"done":""}`}>
          <div className="wz-h" onClick={()=>setOpen(open===s.id?null:s.id)}>
            <div className={`wz-n ${open===s.id?"active":s.id<=done?"done":"pend"}`}>{s.id<=done?"✓":s.id}</div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:"var(--ink)"}}>{s.title}</div><div style={{fontSize:11,color:"var(--mist)",marginTop:1}}>{s.sub}</div></div>
            <span style={{color:"var(--mist)",fontSize:11}}>{open===s.id?"▲":"▼"}</span>
          </div>
          {open===s.id&&<div className="wz-body">{s.body}</div>}
        </div>
      ))}
    </div>
  );
}

// ─── DEPLOY GUIDE ─────────────────────────────────────────────────────────────
function DeployGuide() {
  const [tab,setTab]=useState("pasos");
  const phases=[
    {num:"01",title:"Crea las cuentas",sub:"Semana 1 · Tú solo · 2-3h",col:"var(--pine)",tasks:[
      {ic:"👤",t:"GitHub",d:'github.com → Sign up → Plan gratuito. Aquí vivirá el código y es tuyo siempre.',b:"by"},
      {ic:"👤",t:"Supabase (base de datos)",d:"supabase.com → Nuevo proyecto → Región EU West. Guarda la URL, anon key y service_role key.",b:"by"},
      {ic:"👤",t:"Vercel (hosting)",d:"vercel.com → Regístrate con GitHub. El deploy se actualiza automáticamente al subir código.",b:"by"},
      {ic:"👤",t:"Anthropic (IA)",d:"console.anthropic.com → Nueva API key → Añade tarjeta. Coste: 5-20€/mes según uso.",b:"by"},
      {ic:"👤",t:"Bot Telegram",d:"Crea tu bot con @BotFather en Telegram (5 min). Guarda el token. Ver guía en pestaña Telegram.",b:"by"},
    ]},
    {num:"02",title:"Contrata el desarrollador",sub:"Semana 1-2 · Lo gestionas tú",col:"#2d5a7a",tasks:[
      {ic:"🔍",t:"Dónde buscar",d:"malt.es → busca 'Next.js React' → España · disponible ahora. Presupuesto orientativo: 4.000-8.000€.",b:"by"},
      {ic:"📋",t:"Qué pedirle exactamente",d:"Stack: Next.js 14 + Supabase + Fastify + Telegram Bot API + Claude. Código en TU repositorio de GitHub desde el día 1.",b:"by"},
      {ic:"💳",t:"Estructura de pagos",d:"30% al firmar · 40% al MVP funcionando · 30% al lanzamiento en producción. Nunca el 100% por adelantado.",b:"by"},
    ]},
    {num:"03",title:"Desarrollo del MVP",sub:"Semanas 2-6 · Tu desarrollador",col:"#2a4a6a",tasks:[
      {ic:"🛠️",t:"Sprint 1-2: Base del CRM",d:"Perfiles de jugador, importación CSV, autenticación Supabase, estructura de base de datos.",b:"dev"},
      {ic:"🛠️",t:"Sprint 3-4: Telegram + IA",d:"Webhook, bandeja en tiempo real, bot con comandos /start /reservar /tarifas, asistente IA para borradores.",b:"dev"},
      {ic:"🛠️",t:"Sprint 5-6: Campañas",d:"Campañas segmentadas, confirmación de reserva automática, recordatorios, flujos de retención.",b:"dev"},
      {ic:"📊",t:"Sprint 7: Dashboard + Deploy",d:"Métricas, análisis sentimiento, predicción churn básica. Deploy final en Vercel con dominio propio.",b:"dev"},
      {ic:"👤",t:"Tu rol durante el desarrollo",d:"Revisión semanal de 30 min (lunes). Validas lo construido antes de continuar. Pides cambios inmediatamente.",b:"by"},
    ]},
    {num:"04",title:"Configuración y datos",sub:"Semana 7 · 3-4h tuyas",col:"var(--forest)",tasks:[
      {ic:"🎨",t:"Tono de voz del club",d:"Configura cómo habla la IA en tu nombre: tono, palabras prohibidas, firma. Ver pestaña 'Voz del club'.",b:"by"},
      {ic:"🤖",t:"Base de conocimiento del bot",d:"Horarios, tarifas, cómo reservar, FAQs. Cuanta más información, más útil es el bot.",b:"by"},
      {ic:"📥",t:"Importar contactos piloto",d:"20-30 contactos de confianza. Solo con consentimiento RGPD documentado.",b:"by"},
      {ic:"✅",t:"Prueba completa del flujo",d:"Envía mensaje → recíbelo en Telegram → responde desde CRM → verifica bot → verifica escalado.",b:"by"},
    ]},
    {num:"05",title:"Lanzamiento — primeros 30 días",sub:"Semana 8+ · Proceso continuo",col:"#1a4a2a",tasks:[
      {ic:"🎯",t:"Semana 8: Piloto con 20-30 contactos",d:"Primera campaña manual. Observa las respuestas 3-5 días. Anota todo lo que mejorar.",b:"by"},
      {ic:"📈",t:"Semanas 9-10: Escalar a 100",d:"Activa confirmaciones de reserva automáticas. Primera campaña segmentada real.",b:"auto"},
      {ic:"🔁",t:"Mes 2: Operación plena",d:"Todos los contactos activos. Encuestas post-ronda. Dashboard cada lunes (15 min). Campaña semanal.",b:"auto"},
    ]},
  ];

  return (
    <div>
      <div className="tabs">
        {[["pasos","🚀 Pasos"],["costes","💰 Costes"],["checklist","☑️ Checklist"]].map(([id,l])=>(
          <button key={id} className={`tab ${tab===id?"on":""}`} onClick={()=>setTab(id)}>{l}</button>
        ))}
      </div>
      {tab==="pasos"&&<div>
        {phases.map(ph=>(
          <div key={ph.num} className="dp">
            <div className="dp-h" style={{background:ph.col}}>
              <div className="dp-n">{ph.num}</div>
              <div><div className="dp-ti">{ph.title}</div><div className="dp-su">{ph.sub}</div></div>
            </div>
            <div className="dp-b">
              {ph.tasks.map(t=>(
                <div key={t.t} className="dt">
                  <div className="dt-ic">{t.ic}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                      <div className="dt-ti">{t.t}</div>
                      <span className={`bg-${t.b}`}>{t.b==="by"?"👤 Tú":t.b==="dev"?"🛠️ Dev":"⚙️ Auto"}</span>
                    </div>
                    <div className="dt-de">{t.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>}
      {tab==="costes"&&<div>
        <div className="card" style={{marginBottom:10}}>
          <div className="ch"><span className="ct">💳 Costes únicos (desarrollo)</span></div>
          <div className="cb">
            {[["Desarrollo MVP con desarrollador","4.000 – 8.000 €"],["Diseño UI/UX adicional (opcional)","500 – 2.000 €"],["Dominio personalizado + SSL","10 – 30 €/año"]].map(([k,v])=>(
              <div key={k} className="cost-row"><span>{k}</span><span className="cpaid">{v}</span></div>
            ))}
            <div className="cost-row"><span>Total estimado</span><span className="cpaid">~5.000 – 10.000 €</span></div>
          </div>
        </div>
        <div className="card" style={{marginBottom:10}}>
          <div className="ch"><span className="ct">📅 Costes mensuales recurrentes</span></div>
          <div className="cb">
            {[["Telegram Bot API","Gratuita · Sin límite de mensajes",true],["Supabase (base de datos)","Gratis hasta 500MB | Pro: 25€/mes",false],["Vercel (hosting frontend)","Gratis (hobby) | Pro: 20€/mes",false],["Fly.io (backend API)","~20-40€/mes",false],["Upstash Redis (cola mensajes)","Gratis | ~10€/mes en producción",false],["Anthropic Claude (IA)","5-80€/mes según volumen de uso",false],["Sentry (monitoreo de errores)","Gratis para proyectos pequeños",true]].map(([s,v,f])=>(
              <div key={s} className="cost-row"><span>{s}</span><span className={f?"cfree":"cpaid"}>{v}</span></div>
            ))}
            <div className="cost-row"><span>Total estimado/mes</span><span className="cpaid">~100 – 250 €/mes</span></div>
          </div>
        </div>
        <div className="aib">
          <div className="aib-l">✦ Ahorro vs WhatsApp Business API</div>
          <div className="aib-t">WhatsApp cobra ~0.06€/conversación. 1.000 mensajes/mes = 60€ solo en mensajes. <strong>Con Telegram: 0€.</strong> Ahorro anual estimado: +700€ por campo de golf.</div>
        </div>
      </div>}
      {tab==="checklist"&&<div>
        {[
          {ph:"Preparación (Semana 1)",items:["GitHub creado y accesible","Supabase creado · URL y API keys guardadas en lugar seguro","Vercel conectado a GitHub","Anthropic · API key generada y tarjeta añadida","Bot Telegram creado con @BotFather · token guardado","Desarrollador contratado con briefing completo enviado"]},
          {ph:"Desarrollo (Semanas 2-6)",items:["Webhook Telegram configurado y funcionando","Primer mensaje de prueba enviado y recibido en CRM","Perfiles de jugador CRUD operativos","Importación CSV probada con datos reales","Bandeja Telegram en tiempo real funcionando","Bot respondiendo /start, /tarifas, /menu","Asistente IA generando borradores de respuesta","Campañas segmentadas enviando correctamente","Confirmación + recordatorio de reserva automáticos","Dashboard con métricas principales en tiempo real","Opt-out /stop procesado automáticamente","Deploy en Vercel con dominio propio funcionando"]},
          {ph:"Pre-lanzamiento (Semana 7)",items:["Tono de voz del club configurado en ajustes","Base de conocimiento del bot completada","Reglas de frecuencia y horario de silencio configuradas","20-30 contactos piloto importados (con consentimiento RGPD)","Flujo completo probado de extremo a extremo","Primera campaña de prueba enviada y recibida correctamente"]},
          {ph:"Lanzamiento (Semana 8+)",items:["Primera campaña real enviada al grupo piloto","Respuestas gestionadas desde la bandeja del CRM","KPIs del primer envío revisados y documentados","Expansión a 100 contactos completada","Flujos automáticos de reserva activos","¡Lanzamiento completo! 🎉"]},
        ].map(group=>(
          <div key={group.ph} className="card" style={{marginBottom:9}}>
            <div className="ch"><span className="ct">📋 {group.ph}</span></div>
            <div className="cb" style={{padding:"7px 13px"}}>
              {group.items.map((item,i)=>(
                <label key={i} style={{display:"flex",alignItems:"flex-start",gap:9,padding:"7px 0",borderBottom:"1px solid var(--fog)",cursor:"pointer",fontSize:13}}>
                  <input type="checkbox" style={{marginTop:2,flexShrink:0}}/>
                  <span style={{color:"var(--ink)"}}>{item}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>}
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function SettingsView() {
  const [tab,setTab]=useState("telegram");
  const [notif,setNotif]=useState(null);
  const [tgCfg,setTgCfg]=useState({
    token:"",username:"",name:"",webhook:"",
    welcome:"¡Hola! 👋 Soy Valeria, asistente de Golf Valle Verde.\n\nPuedo ayudarte con:\n📅 /reservar — Reservar tee time\n💰 /tarifas — Ver precios\n🏆 /torneo — Próximo torneo\n❓ Escríbeme lo que necesitas"
  });
  const save=()=>{setNotif("✓ Configuración guardada");setTimeout(()=>setNotif(null),2000)};
  const navItems=[
    {id:"telegram",ic:"✈️",l:"Telegram Bot"},
    {id:"deploy",ic:"🚀",l:"Despliegue"},
    {id:"voz",ic:"🎨",l:"Voz del club"},
    {id:"chatbot",ic:"🤖",l:"Chatbot IA"},
    {id:"frecuencia",ic:"⏰",l:"Frecuencia"},
    {id:"rgpd",ic:"🔒",l:"RGPD"},
  ];
  return (
    <div className="content">
      <div className="sl">
        <div className="snav">
          <div className="snav-inner">
            {navItems.map(n=>(
              <button key={n.id} className={`snb ${tab===n.id?"on":""}`} onClick={()=>setTab(n.id)}>
                <span style={{fontSize:15}}>{n.ic}</span>{n.l}
              </button>
            ))}
          </div>
        </div>
        <div className="sc2">
          {tab==="telegram"&&(
            <div className="card">
              <div className="ch"><span className="ct">✈️ Bot Telegram — Configuración paso a paso</span><span className="tag t-tg">Wizard</span></div>
              <div className="cb"><TgWizard cfg={tgCfg} setCfg={setTgCfg} onSave={save}/></div>
            </div>
          )}
          {tab==="deploy"&&(
            <div className="card">
              <div className="ch"><span className="ct">🚀 De prototipo a producción</span><span className="tag t-norm">Guía completa</span></div>
              <div className="cb"><DeployGuide/></div>
            </div>
          )}
          {tab==="voz"&&(
            <div className="card">
              <div className="ch"><span className="ct">🎨 Voz del club</span></div>
              <div className="cb">
                <div className="fg"><label className="fl">Nombre del club</label><input className="fi" defaultValue="Club de Golf Valle Verde"/></div>
                <div className="fg">
                  <label className="fl">Tono de comunicación</label>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    {["formal","semiformal","cercano","exclusivo"].map(t=>(
                      <button key={t} className={`btn btn-sm ${t==="semiformal"?"btn-p":"btn-s"}`} style={{textTransform:"capitalize"}}>{t}</button>
                    ))}
                  </div>
                </div>
                <div className="fg"><label className="fl">Palabras a evitar</label><input className="fi" defaultValue="barato, económico, descuento agresivo"/></div>
                <div className="fg"><label className="fl">Palabras clave de marca</label><input className="fi" defaultValue="verde, exclusivo, experiencia, excelencia"/></div>
                <div className="fg"><label className="fl">Firma de mensajes</label><input className="fi" defaultValue="El equipo de Valle Verde ⛳"/></div>
                <div className="aib">
                  <div className="aib-l">✦ Vista previa</div>
                  <div className="aib-t">"Estimado {"{nombre}"}, en Valle Verde nos complace invitarte a una experiencia exclusiva este fin de semana. El equipo de Valle Verde ⛳"</div>
                </div>
                <button className="btn btn-p" onClick={save}>✓ Guardar</button>
              </div>
            </div>
          )}
          {tab==="chatbot"&&(
            <div className="card">
              <div className="ch"><span className="ct">🤖 Chatbot IA</span></div>
              <div className="cb">
                <div className="fg"><label className="fl">Nombre del asistente</label><input className="fi" defaultValue="Valeria — Asistente de Valle Verde"/></div>
                <div className="fg"><label className="fl">Mensaje de bienvenida</label><textarea className="fta" defaultValue="¡Hola! 👋 Soy Valeria, la asistente de Golf Valle Verde. ¿En qué puedo ayudarte hoy?"/></div>
                <div className="fg">
                  <label className="fl">Vista previa del menú /menu</label>
                  <div style={{background:"var(--fw)",borderRadius:"var(--rs)",padding:10,border:"1px solid var(--fog)"}}>
                    <div style={{fontSize:12,color:"var(--ink)",marginBottom:8}}>¿Qué necesitas hoy? ⛳</div>
                    {[["📅 Reservar","💰 Tarifas"],["🏆 Torneos","📞 Agente"],["❌ /stop Darse de baja"]].map((row,i)=>(
                      <div key={i} style={{display:"flex",gap:4,marginBottom:4}}>
                        {row.map(b=><div key={b} style={{flex:1,background:"white",border:"1px solid var(--dew)",borderRadius:5,padding:"4px 7px",fontSize:11,color:"var(--pine)",textAlign:"center",fontWeight:500}}>{b}</div>)}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="fg">
                  <label className="fl">Escalar a humano cuando...</label>
                  {[["No resuelve en 3 intercambios",true],["Detecta sentimiento negativo",true],["Cliente VIP",true],["Menciona: queja, reclamación",true],["Fuera de horario de atención",false]].map(([l,c])=>(
                    <label key={l} style={{display:"flex",gap:8,alignItems:"center",marginBottom:7,cursor:"pointer",fontSize:13}}>
                      <input type="checkbox" defaultChecked={c}/> {l}
                    </label>
                  ))}
                </div>
                <button className="btn btn-p" onClick={save}>✓ Guardar</button>
              </div>
            </div>
          )}
          {tab==="frecuencia"&&(
            <div className="card">
              <div className="ch"><span className="ct">⏰ Frecuencia y silencio</span></div>
              <div className="cb">
                <div className="two-col">
                  <div className="fg"><label className="fl">Silencio desde</label><input className="fi" type="time" defaultValue="21:00"/></div>
                  <div className="fg"><label className="fl">Silencio hasta</label><input className="fi" type="time" defaultValue="09:00"/></div>
                </div>
                <div className="fg"><label className="fl">Máx. campañas / contacto / semana</label><select className="fs"><option>1/semana</option><option selected>2/semana</option><option>3/semana</option></select></div>
                <div className="fg">
                  <label className="fl">Reglas especiales</label>
                  {["No enviar si hay reserva en las próximas 24h","No enviar si respondió hace menos de 2 horas","VIPs: máximo 1 campaña/semana"].map(r=>(
                    <label key={r} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:7,cursor:"pointer",fontSize:13}}>
                      <input type="checkbox" defaultChecked style={{marginTop:2}}/> {r}
                    </label>
                  ))}
                </div>
                <button className="btn btn-p" onClick={save}>✓ Guardar</button>
              </div>
            </div>
          )}
          {tab==="rgpd"&&(
            <div className="card">
              <div className="ch"><span className="ct">🔒 RGPD y Privacidad</span></div>
              <div className="cb">
                {[["Registro de consentimiento","Activo — Fecha, canal y texto guardados por contacto"],["Opt-out automático","Activo — /stop activa el opt-out inmediato"],["Retención de datos","24 meses — inactivos se anonimizan automáticamente"],["Audit log","Activo — Todas las acciones sobre datos registradas"],["IA y datos personales","Activo — PII eliminada antes de enviar a la API de IA"]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",alignItems:"flex-start",gap:9,padding:"9px 0",borderBottom:"1px solid var(--fog)"}}>
                    <span>✅</span><div><div style={{fontSize:13,fontWeight:600,color:"var(--ink)"}}>{k}</div><div style={{fontSize:11,color:"var(--mist)",marginTop:2}}>{v}</div></div>
                  </div>
                ))}
                <div style={{marginTop:12,display:"flex",gap:7,flexWrap:"wrap"}}>
                  <button className="btn btn-s btn-sm">📥 Exportar datos</button>
                  <button className="btn btn-danger btn-sm">🗑️ Eliminar (RGPD)</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {notif&&<div className="notif">{notif}</div>}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function GolfCRM() {
  const [view,setView]=useState("dashboard");
  const navItems=[
    {id:"dashboard",ic:"📊",l:"Dashboard"},
    {id:"inbox",ic:"💬",l:"Bandeja",badge:6},
    {id:"contacts",ic:"👥",l:"Contactos"},
    {id:"campaigns",ic:"📣",l:"Campañas"},
    {id:"analytics",ic:"📈",l:"Analítica"},
    {id:"settings",ic:"⚙️",l:"Ajustes"},
  ];
  const titles={
    dashboard:{t:"Dashboard",s:"Club Golf Valle Verde · Hoy"},
    inbox:{t:"Bandeja Telegram",s:"5 conversaciones · 6 sin leer · Bot activo"},
    contacts:{t:"Contactos",s:"312 jugadores registrados"},
    campaigns:{t:"Campañas",s:"Telegram · Sin templates · Sin aprobaciones"},
    analytics:{t:"Analítica",s:"Últimos 30 días"},
    settings:{t:"Configuración",s:"Sistema y ajustes del club"},
  };
  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* Desktop sidebar */}
        <div className="sb">
          <div className="logo" onClick={()=>setView("dashboard")}>⛳</div>
          {navItems.map(n=>(
            <button key={n.id} className={`nb ${view===n.id?"on":""}`} onClick={()=>setView(n.id)} title={n.l}>
              {n.ic}
              {n.badge&&view!==n.id&&<span className="nbb">{n.badge}</span>}
            </button>
          ))}
          <div className="sbb"><div className="uav" title="Laura M.">LM</div></div>
        </div>

        {/* Main area */}
        <div className="main">
          <div className="topbar">
            <div style={{flex:1,minWidth:0}}>
              <div className="tb-t">{titles[view].t}</div>
              <div className="tb-s">{titles[view].s}</div>
            </div>
            <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
              {view!=="inbox"&&(
                <div style={{display:"flex",alignItems:"center",gap:5,background:"var(--fw)",border:"1px solid var(--fog)",borderRadius:"var(--rs)",padding:"5px 9px"}}>
                  <span style={{fontSize:12}}>🔍</span>
                  <input style={{border:"none",background:"transparent",fontFamily:"var(--fn)",fontSize:12,outline:"none",color:"var(--ink)",width:110}} placeholder="Buscar..."/>
                </div>
              )}
              <div style={{width:30,height:30,borderRadius:"50%",background:"var(--fw)",border:"1px solid var(--fog)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,cursor:"pointer",position:"relative",flexShrink:0}}>
                🔔<span style={{position:"absolute",top:1,right:1,width:7,height:7,background:"var(--alert)",borderRadius:"50%"}}/>
              </div>
            </div>
          </div>
          {view==="dashboard"&&<DashboardView onNav={setView}/>}
          {view==="inbox"&&<InboxView/>}
          {view==="contacts"&&<ContactsView/>}
          {view==="campaigns"&&<CampaignsView/>}
          {view==="analytics"&&<AnalyticsView/>}
          {view==="settings"&&<SettingsView/>}
        </div>

        {/* Mobile bottom nav */}
        <nav className="bnav">
          {navItems.map(n=>(
            <button key={n.id} className={`bnb ${view===n.id?"on":""}`} onClick={()=>setView(n.id)}>
              {n.badge&&view!==n.id&&<span className="bnbb">{n.badge}</span>}
              <span className="bnb-ic">{n.ic}</span>
              <span className="bnb-lb">{n.l}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
