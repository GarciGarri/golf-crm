'use client'
import { useState, useEffect, useRef } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const initContacts = [
  { id:1, name:"Carlos Mendoza", tg:"@carlos_golf", phone:"+34 612 345 678", email:"carlos@email.com", handicap:12, lang:"ES", visits:24, lastVisit:"hace 3 días", tags:["Alto Valor","Torneo"], segment:"VIP", sentiment:"positive", av:"CM", status:"active", clv:2040, notes:"Prefiere tee matutino. Cumple en marzo.", category:"Cliente" },
  { id:2, name:"James Walker", tg:"@jwalker_golf", phone:"+44 7911 123456", email:"james.walker@gmail.com", handicap:8, lang:"EN", visits:41, lastVisit:"ayer", tags:["Madrugador","Alto Valor"], segment:"VIP", sentiment:"positive", av:"JW", status:"active", clv:3485, notes:"VIP corporativo. 4 rondas/mes.", category:"Cliente" },
  { id:3, name:"Ingrid Björk", tg:"@ingrid_bjork", phone:"+46 70 123 45 67", email:"ingrid@bjork.se", handicap:18, lang:"SV", visits:7, lastVisit:"hace 2 semanas", tags:["Turista","Nuevo"], segment:"Normal", sentiment:"neutral", av:"IB", status:"active", clv:595, notes:"Turista de temporada. Viaja con pareja.", category:"Lead" },
  { id:4, name:"Marco Rossi", tg:"@marco_rossi_golf", phone:"+39 333 123 4567", email:"mrossi@gmail.com", handicap:22, lang:"IT", visits:3, lastVisit:"hace 45 días", tags:["Riesgo Churn"], segment:"En Riesgo", sentiment:"negative", av:"MR", status:"at-risk", clv:255, notes:"Queja activa — espera compensación.", category:"Cliente" },
  { id:5, name:"Ana García", tg:"@anagarcia_vv", phone:"+34 690 876 543", email:"ana.garcia@empresa.es", handicap:15, lang:"ES", visits:18, lastVisit:"hace 1 semana", tags:["Torneo","Residente"], segment:"Normal", sentiment:"positive", av:"AG", status:"active", clv:1530, notes:"Participa en todos los torneos locales.", category:"Cliente" },
  { id:6, name:"Hans Müller", tg:"@hansmuller_pro", phone:"+49 160 123 4567", email:"hansm@pro.de", handicap:6, lang:"DE", visits:56, lastVisit:"hace 2 días", tags:["Alto Valor","Pro"], segment:"VIP", sentiment:"positive", av:"HM", status:"active", clv:4760, notes:"Instructor pro. Usa el campo 5d/sem.", category:"Cliente" },
  { id:7, name:"Sophie Dubois", tg:"", phone:"+33 6 12 34 56 78", email:"sophie.d@golf.fr", handicap:20, lang:"FR", visits:0, lastVisit:"—", tags:["Nuevo"], segment:"Lead", sentiment:"neutral", av:"SD", status:"lead", clv:0, notes:"Interesada por el torneo de primavera. Contacto frío.", category:"Lead" },
  { id:8, name:"Robert Chen", tg:"@rchen_golf", phone:"+1 415 555 0123", email:"rchen@corp.com", handicap:14, lang:"EN", visits:2, lastVisit:"hace 3 semanas", tags:["Turista","Alto Valor"], segment:"Normal", sentiment:"neutral", av:"RC", status:"active", clv:170, notes:"Ejecutivo en visita de negocios. Potencial corporativo alto.", category:"Lead" },
];

const CONVS = [
  { id:1, contact:"Carlos Mendoza", av:"CM", last:"Perfecto, nos vemos el sábado en el tee 1 🏌️", time:"10:32", unread:0, status:"resolved", sent:"positive" },
  { id:2, contact:"James Walker", av:"JW", last:"Could you confirm my tee time for tomorrow?", time:"09:15", unread:2, status:"open", sent:"neutral" },
  { id:3, contact:"Ingrid Björk", av:"IB", last:"Tack! Vi ses på lördag 🌿", time:"Ayer", unread:0, status:"resolved", sent:"positive" },
  { id:4, contact:"Marco Rossi", av:"MR", last:"Non sono soddisfatto del servizio...", time:"Lun", unread:1, status:"open", sent:"negative" },
  { id:5, contact:"Ana García", av:"AG", last:"¿Hay plazas para el torneo del domingo?", time:"Lun", unread:3, status:"open", sent:"neutral" },
];
const CAMPS = [
  { id:1, name:"Black Friday Golf Week", status:"sent", seg:"Todos", sent:312, opened:187, replies:64, conv:28, date:"22 Nov" },
  { id:2, name:"Torneo Navidad - Invitación", status:"sent", seg:"Torneo", sent:89, opened:71, replies:43, conv:38, date:"15 Nov" },
  { id:3, name:"Reactivación Leads", status:"sending", seg:"Leads", sent:12, opened:5, replies:2, conv:1, date:"Hoy" },
  { id:4, name:"Oferta Fin de Semana VIP", status:"draft", seg:"VIP", sent:0, opened:0, replies:0, conv:0, date:"Pendiente" },
];
const MSGS_JW = [
  { from:"contact", text:"Hi! I'd like to confirm my tee time for tomorrow morning.", time:"09:10" },
  { from:"bot", text:"Hello James! ✅ Your tee time is confirmed for tomorrow at 8:30am, Tee 1.\n\n⛅ Weather: 18°C, light breeze. Perfect conditions.\n\n📍 /myteetimes — /menu — /cancel", time:"09:11" },
  { from:"contact", text:"Could you confirm my tee time for tomorrow?", time:"09:15" },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --forest:#1a3a2a;--pine:#2d5a3d;--sage:#4a8c5c;--mint:#6dbf82;
  --dew:#c8ebd0;--fw:#f0f7f2;--gold:#c8922a;--ink:#1a2318;
  --mist:#8a9e8e;--fog:#e4ede6;--alert:#e05252;--info:#2b7cd3;--tg:#229ED9;
  --lead:#7c4dff;--leadl:#ede8ff;--leadb:#c4b4ff;
  --r:12px;--rs:8px;--sh:0 2px 16px rgba(26,58,42,.10);--shlg:0 8px 40px rgba(26,58,42,.15);
  --fn:'DM Sans',sans-serif;--bnh:64px;
}
html,body{height:100dvh;overflow:hidden;font-family:var(--fn);background:var(--fw);color:var(--ink)}
.app{display:flex;height:100dvh;overflow:hidden}
.sb{width:68px;background:var(--forest);display:flex;flex-direction:column;align-items:center;padding:16px 0;gap:6px;flex-shrink:0;z-index:20}
.logo{width:42px;height:42px;border-radius:13px;margin-bottom:12px;background:linear-gradient(135deg,var(--mint),var(--gold));display:flex;align-items:center;justify-content:center;color:white;font-size:20px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.3)}
.nb{width:46px;height:46px;border-radius:13px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:19px;background:transparent;color:rgba(255,255,255,.4);transition:all .18s;position:relative}
.nb:hover{background:rgba(255,255,255,.1);color:white}
.nb.on{background:var(--sage);color:white}
.nbb{position:absolute;top:5px;right:5px;background:var(--alert);color:white;font-size:9px;font-weight:700;padding:1px 4px;border-radius:6px;min-width:15px;text-align:center}
.sbb{margin-top:auto}
.uav{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--mint),var(--sage));display:flex;align-items:center;justify-content:center;color:white;font-weight:600;font-size:13px;cursor:pointer;border:2px solid rgba(255,255,255,.2)}
.bnav{display:none;position:fixed;bottom:0;left:0;right:0;height:var(--bnh);background:var(--forest);z-index:50;justify-content:space-around;align-items:center;border-top:1px solid rgba(255,255,255,.07);padding-bottom:env(safe-area-inset-bottom,0)}
.bnb{display:flex;flex-direction:column;align-items:center;gap:2px;background:none;border:none;cursor:pointer;padding:5px 8px;color:rgba(255,255,255,.4);font-family:var(--fn);position:relative;min-width:46px}
.bnb.on{color:var(--mint)}
.bnb-ic{font-size:20px;line-height:1}
.bnb-lb{font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.3px}
.bnbb{position:absolute;top:1px;right:3px;background:var(--alert);color:white;font-size:9px;font-weight:700;padding:1px 4px;border-radius:7px}
.main{flex:1;overflow:hidden;display:flex;flex-direction:column;min-width:0}
.topbar{height:52px;background:white;border-bottom:1px solid var(--fog);display:flex;align-items:center;padding:0 14px;gap:10px;flex-shrink:0}
.tb-t{font-size:15px;font-weight:600;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tb-s{font-size:11px;color:var(--mist);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.btn{padding:7px 12px;border-radius:var(--rs);font-family:var(--fn);font-size:13px;font-weight:500;cursor:pointer;border:none;transition:all .15s;display:inline-flex;align-items:center;gap:5px;white-space:nowrap}
.btn:active{transform:scale(.97)}
.btn-p{background:var(--pine);color:white}.btn-p:hover{background:var(--forest)}
.btn-s{background:var(--fog);color:var(--ink)}.btn-s:hover{background:var(--dew)}
.btn-g{background:transparent;color:var(--mist);padding:7px 8px}.btn-g:hover{background:var(--fog)}
.btn-tg{background:var(--tg);color:white}.btn-tg:hover{background:#1a8cbf}
.btn-gold{background:var(--gold);color:white}
.btn-lead{background:var(--lead);color:white}.btn-lead:hover{background:#5c2dd4}
.btn-danger{background:#fde8e8;color:var(--alert)}
.btn-sm{padding:4px 8px;font-size:12px}
.content{flex:1;overflow-y:auto;padding:14px}
.content::-webkit-scrollbar{width:4px}
.content::-webkit-scrollbar-thumb{background:var(--fog);border-radius:2px}
.card{background:white;border-radius:var(--r);border:1px solid var(--fog);box-shadow:var(--sh);overflow:hidden}
.ch{padding:12px 14px;border-bottom:1px solid var(--fog);display:flex;align-items:center;justify-content:space-between;gap:8px}
.ct{font-size:14px;font-weight:600;color:var(--ink)}
.cb{padding:14px}
.sg{display:grid;grid-template-columns:repeat(2,1fr);gap:9px;margin-bottom:13px}
.sc{background:white;border-radius:var(--r);padding:12px;border:1px solid var(--fog);box-shadow:var(--sh);position:relative;overflow:hidden}
.sc::before{content:'';position:absolute;top:0;left:0;right:0;height:3px}
.sc.g::before{background:linear-gradient(90deg,var(--mint),var(--sage))}
.sc.go::before{background:linear-gradient(90deg,var(--gold),#f0c060)}
.sc.b::before{background:linear-gradient(90deg,var(--info),#60a8e0)}
.sc.r::before{background:linear-gradient(90deg,var(--alert),#f08080)}
.sc.l::before{background:linear-gradient(90deg,var(--lead),var(--leadb))}
.sv{font-size:22px;font-weight:700;color:var(--ink);margin:7px 0 2px}
.sl{font-size:10px;color:var(--mist);font-weight:500;text-transform:uppercase;letter-spacing:.4px}
.sch{font-size:10px;margin-top:5px;font-weight:500}
.sch.up{color:var(--sage)}.sch.dn{color:var(--alert)}
.tag{display:inline-flex;align-items:center;padding:2px 7px;border-radius:20px;font-size:11px;font-weight:500}
.t-vip{background:#fff8e6;color:#a06820;border:1px solid #f5d87a}
.t-risk{background:#fdeaea;color:#c03030;border:1px solid #f0b0b0}
.t-norm{background:var(--fw);color:var(--pine);border:1px solid var(--dew)}
.t-blue{background:#e8f2fc;color:#2860a0;border:1px solid #b0cce8}
.t-tg{background:#e8f5fc;color:#1a7aaa;border:1px solid #90d0f0}
.t-lead{background:var(--leadl);color:var(--lead);border:1px solid var(--leadb)}
.av{border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:600;flex-shrink:0}
.av-g{background:linear-gradient(135deg,var(--mint),var(--sage));color:white}
.av-go{background:linear-gradient(135deg,var(--gold),#e0b040);color:white}
.av-b{background:linear-gradient(135deg,#60a0d0,#3060a0);color:white}
.av-r{background:linear-gradient(135deg,#f08080,#c04040);color:white}
.av-l{background:linear-gradient(135deg,var(--lead),#9c6dff);color:white}
.sd{width:7px;height:7px;border-radius:50%;display:inline-block;flex-shrink:0}
.sd-positive{background:var(--mint)}.sd-neutral{background:var(--gold)}.sd-negative{background:var(--alert)}
.inbox-wrap{display:flex;height:calc(100dvh - 52px);overflow:hidden;position:relative}
.inbox-list{width:280px;flex-shrink:0;border-right:1px solid var(--fog);overflow-y:auto;background:white;transition:transform .22s}
.ii{padding:10px 12px;border-bottom:1px solid var(--fog);cursor:pointer;display:flex;align-items:flex-start;gap:9px;transition:background .12s}
.ii:hover{background:var(--fw)}.ii.on{background:var(--fw);border-left:3px solid var(--pine);padding-left:9px}
.ii-n{font-size:12px;font-weight:600;color:var(--ink)}
.ii-p{font-size:11px;color:var(--mist);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}
.ii-t{font-size:10px;color:var(--mist);flex-shrink:0}
.uc{background:var(--pine);color:white;font-size:9px;font-weight:700;padding:1px 5px;border-radius:8px}
.chat{flex:1;display:flex;flex-direction:column;background:#fafcfa;min-width:0}
.chat-head{padding:10px 13px;background:white;border-bottom:1px solid var(--fog);display:flex;align-items:center;gap:9px;flex-shrink:0}
.chat-msgs{flex:1;overflow-y:auto;padding:13px;display:flex;flex-direction:column;gap:8px}
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
.ap-t{font-size:10px;font-weight:700;color:var(--mist);text-transform:uppercase;letter-spacing:.5px}
.ins{background:var(--fw);border-radius:var(--rs);padding:8px;border-left:3px solid var(--sage)}
.ins.w{border-left-color:var(--gold)}.ins.i{border-left-color:var(--info)}.ins.l{border-left-color:var(--lead)}
.ins-lb{font-size:9px;font-weight:700;color:var(--sage);text-transform:uppercase}
.ins.w .ins-lb{color:var(--gold)}.ins.i .ins-lb{color:var(--info)}.ins.l .ins-lb{color:var(--lead)}
.ins-tx{font-size:11px;color:var(--ink);margin-top:2px;line-height:1.5}
.cg{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}
.cc{background:white;border-radius:var(--r);border:1px solid var(--fog);padding:13px;cursor:pointer;transition:all .18s;box-shadow:var(--sh)}
.cc:hover{border-color:var(--dew);transform:translateY(-1px);box-shadow:var(--shlg)}
.cc.lead-card{border-color:var(--leadb);background:linear-gradient(135deg,white,#faf8ff)}
.cst{display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;margin-top:8px;border-top:1px solid var(--fog);padding-top:8px}
.csv{font-size:14px;font-weight:700;color:var(--pine);text-align:center}
.csl{font-size:9px;color:var(--mist);text-transform:uppercase;text-align:center}
.ci{background:white;border-radius:var(--r);border:1px solid var(--fog);overflow:hidden;margin-bottom:9px;box-shadow:var(--sh)}
.ci-h{padding:11px 13px;display:flex;align-items:center;gap:9px;border-bottom:1px solid var(--fog);flex-wrap:wrap}
.cs{padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600}
.cs-sent{background:#e6f7ea;color:#2d6a3a}.cs-sending{background:#e6f0fc;color:#2060a0}.cs-draft{background:var(--fog);color:var(--mist)}
.cm{display:grid;grid-template-columns:repeat(4,1fr);padding:11px 13px;gap:9px}
.cmv{font-size:17px;font-weight:700;color:var(--ink)}
.cml{font-size:10px;color:var(--mist)}
.cmbar{height:3px;background:var(--fog);border-radius:2px;margin-top:3px;overflow:hidden}
.cmf{height:100%;border-radius:2px;background:linear-gradient(90deg,var(--mint),var(--sage))}
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
.aib{background:linear-gradient(135deg,#f0f7f2,#e8f4fc);border:1px solid var(--dew);border-radius:var(--rs);padding:10px;margin-bottom:11px;position:relative;overflow:hidden}
.aib::after{content:'✦';position:absolute;top:6px;right:9px;font-size:13px;color:var(--mint);opacity:.4}
.aib-l{font-size:9px;font-weight:700;color:var(--sage);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}
.aib-t{font-size:12px;color:var(--ink);line-height:1.5}
.div{height:1px;background:var(--fog);margin:11px 0}
.tabs{display:flex;gap:3px;background:var(--fog);padding:3px;border-radius:var(--rs);width:fit-content;margin-bottom:13px}
.tab{padding:5px 12px;border-radius:7px;font-size:12px;font-weight:500;cursor:pointer;border:none;background:transparent;color:var(--mist);transition:all .14s;font-family:var(--fn)}
.tab.on{background:white;color:var(--ink);box-shadow:0 1px 4px rgba(0,0,0,.1)}
.notif{position:fixed;bottom:calc(var(--bnh) + 10px);right:14px;background:var(--forest);color:white;padding:9px 14px;border-radius:var(--r);font-size:13px;font-weight:500;box-shadow:var(--shlg);z-index:200;animation:su .22s;display:flex;align-items:center;gap:7px;max-width:320px}
.cw{display:flex;align-items:flex-end;gap:4px;height:110px}
.cbar{flex:1;border-radius:4px 4px 0 0;cursor:pointer;min-width:0}
.cbar:hover{opacity:.75}
.clabs{display:flex;gap:4px;margin-top:2px}
.clab{flex:1;text-align:center;font-size:9px;color:var(--mist)}
.pr{display:flex;align-items:center;gap:7px;margin-bottom:6px}
.pb{flex:1;height:5px;background:var(--fog);border-radius:3px;overflow:hidden}
.pf{height:100%;border-radius:3px;transition:width .5s}
.pv{font-size:11px;font-weight:600;color:var(--ink);width:26px;text-align:right;flex-shrink:0}
.ob{background:linear-gradient(135deg,var(--forest),var(--pine));border-radius:var(--r);padding:13px 16px;color:white;margin-bottom:13px;position:relative;overflow:hidden}
.ob::after{content:'⛳';position:absolute;right:13px;top:50%;transform:translateY(-50%);font-size:44px;opacity:.1}
.ob-steps{display:flex;gap:5px;margin-top:9px;flex-wrap:wrap}
.sdot{width:20px;height:20px;border-radius:50%;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.sdot.done{background:var(--mint);color:var(--forest)}.sdot.curr{background:var(--gold);color:var(--forest);animation:pulse 2s infinite}.sdot.pend{background:rgba(255,255,255,.15);color:rgba(255,255,255,.4)}
.ci2{background:#fff5f5;border:1px solid #f0c0c0;border-radius:var(--rs);padding:8px;display:flex;align-items:center;gap:9px;margin-bottom:6px}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:11px}
.sl-wrap{display:flex;gap:13px;align-items:flex-start}
.snav{width:185px;flex-shrink:0;background:white;border-radius:var(--r);border:1px solid var(--fog);overflow:hidden}
.snb{width:100%;padding:9px 12px;border:none;background:transparent;cursor:pointer;display:flex;gap:9px;align-items:center;font-size:13px;color:var(--mist);font-weight:400;border-left:3px solid transparent;font-family:var(--fn);text-align:left;transition:all .12s}
.snb.on{background:var(--fw);color:var(--pine);font-weight:600;border-left-color:var(--pine)}
.snb:hover:not(.on){background:var(--fw)}

/* ═══ AI WOW COMPONENTS ════════════════════════════════════════════════════ */
/* AI Copilot Panel */
.ai-cop{background:linear-gradient(160deg,#0d1f14,#1a3a2a);border-radius:var(--r);padding:14px;color:white;margin-bottom:13px;position:relative;overflow:hidden}
.ai-cop::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 80% 20%,rgba(109,191,130,.12),transparent 60%);pointer-events:none}
.ai-cop-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--mint);margin-bottom:10px;display:flex;align-items:center;gap:6px}
.ai-cop-row{display:flex;gap:6px;margin-bottom:6px;align-items:flex-start}
.ai-cop-ic{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.ai-cop-ic.g{background:rgba(109,191,130,.2)}.ai-cop-ic.a{background:rgba(200,146,42,.2)}.ai-cop-ic.r{background:rgba(224,82,82,.2)}.ai-cop-ic.l{background:rgba(124,77,255,.2)}
.ai-cop-tx{font-size:12px;color:rgba(255,255,255,.85);line-height:1.5;flex:1}
.ai-cop-tx strong{color:white}
.ai-cop-btn{margin-top:5px;background:rgba(109,191,130,.15);border:1px solid rgba(109,191,130,.3);color:var(--mint);border-radius:6px;padding:3px 9px;font-size:11px;font-weight:600;cursor:pointer;font-family:var(--fn)}
.ai-cop-btn:hover{background:rgba(109,191,130,.25)}

/* AI Pulse (live thinking indicator) */
.ai-pulse{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--sage)}
.ai-dot{width:5px;height:5px;border-radius:50%;background:var(--mint);animation:bounce .8s infinite}
.ai-dot:nth-child(2){animation-delay:.15s}.ai-dot:nth-child(3){animation-delay:.3s}
@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}

/* Lead Funnel */
.funnel{display:flex;flex-direction:column;gap:4px}
.funnel-stage{border-radius:var(--rs);padding:8px 11px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;transition:all .15s}
.funnel-stage:hover{filter:brightness(1.05)}
.f-prospect{background:linear-gradient(90deg,#ede8ff,#f5f0ff);border:1px solid var(--leadb)}
.f-lead{background:linear-gradient(90deg,var(--leadl),#ede8ff);border:1px solid var(--leadb)}
.f-qualified{background:linear-gradient(90deg,#e8f0fc,var(--leadl));border:1px solid var(--leadb)}
.f-converted{background:linear-gradient(90deg,var(--fw),#e8f7ea);border:1px solid var(--dew)}
.f-name{font-size:12px;font-weight:600}
.f-count{font-size:11px;font-weight:700}

/* Prediction Card */
.pred-card{border-radius:var(--r);border:1px solid var(--fog);overflow:hidden;margin-bottom:8px;transition:all .18s}
.pred-card:hover{border-color:var(--dew);box-shadow:var(--sh)}
.pred-h{padding:10px 12px;display:flex;align-items:center;gap:10px}
.pred-score{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;flex-shrink:0;position:relative}
.pred-score::after{content:'';position:absolute;inset:-3px;border-radius:50%;border:2.5px solid currentColor;opacity:.3}
.pred-score.high{background:#fdeaea;color:var(--alert)}.pred-score.med{background:#fff8e6;color:var(--gold)}.pred-score.low{background:#e8f7ea;color:var(--sage)}
.pred-action{margin:0 12px 10px;padding:8px;background:var(--fw);border-radius:8px;border-left:3px solid var(--mint)}

/* Revenue Forecaster */
.rev-bar{height:8px;border-radius:4px;overflow:hidden;background:var(--fog);margin:4px 0}
.rev-fill{height:100%;border-radius:4px;transition:width 1s ease}

/* Voice of Club Live */
.voc{position:relative}
.voc-cursor{display:inline-block;width:2px;height:14px;background:var(--mint);margin-left:2px;animation:blink 1s infinite;vertical-align:middle}
@keyframes blink{0%,50%{opacity:1}51%,100%{opacity:0}}

/* WOW Modal: AI Profile Analysis */
.ai-profile-card{background:linear-gradient(160deg,#0d1f14 0%,#1a3a2a 60%,#1a3a4a 100%);border-radius:16px;color:white;padding:20px;position:relative;overflow:hidden}
.ai-profile-card::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 30% 80%,rgba(109,191,130,.1),transparent 60%),radial-gradient(ellipse at 80% 10%,rgba(200,146,42,.08),transparent 50%);pointer-events:none}
.score-ring{position:relative;display:inline-flex;align-items:center;justify-content:center}
.score-ring svg{position:absolute;top:0;left:0}
.score-ring-val{font-size:26px;font-weight:800;position:relative;z-index:1}
.score-ring-lbl{font-size:9px;font-weight:600;color:var(--mint);position:relative;z-index:1;text-transform:uppercase;letter-spacing:.5px}

/* Journey Timeline */
.timeline{position:relative;padding-left:20px}
.timeline::before{content:'';position:absolute;left:6px;top:0;bottom:0;width:2px;background:var(--fog)}
.tl-item{position:relative;padding:0 0 12px 14px}
.tl-item::before{content:'';position:absolute;left:-14px;top:4px;width:8px;height:8px;border-radius:50%;background:var(--mint);border:2px solid white;box-shadow:0 0 0 2px var(--mint)}
.tl-item.inactive::before{background:var(--fog);box-shadow:none}
.tl-date{font-size:10px;color:var(--mist);margin-bottom:2px}
.tl-text{font-size:12px;color:var(--ink)}

/* Gradient shimmer for loading */
.shimmer{background:linear-gradient(90deg,var(--fog) 25%,var(--dew) 50%,var(--fog) 75%);background-size:200% 100%;animation:shimmer 1.2s infinite}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}

@keyframes fi{from{opacity:0}to{opacity:1}}
@keyframes su{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.pulse{animation:pulse 2s infinite}

/* MOBILE */
@media(max-width:767px){
  .sb{display:none}.bnav{display:flex}
  .content{padding:10px;padding-bottom:calc(var(--bnh) + 10px)}
  .sg{grid-template-columns:1fr 1fr;gap:7px}
  .sv{font-size:20px}.two-col{grid-template-columns:1fr !important}
  .cg{grid-template-columns:1fr}
  .inbox-list{position:absolute;left:0;top:0;bottom:0;width:100%;z-index:3}
  .inbox-list.hide{transform:translateX(-100%)}
  .ai-panel{display:none}
  .sl-wrap{flex-direction:column}
  .snav{width:100%}
  .snav-inner{display:flex;overflow-x:auto}
  .snb{flex-shrink:0;border-left:none;border-bottom:2.5px solid transparent;white-space:nowrap}
  .snb.on{border-left:none;border-bottom-color:var(--pine)}
  .notif{right:10px;left:10px;max-width:none}
  .ov{padding:0;align-items:flex-end}
  .mo{border-bottom-left-radius:0;border-bottom-right-radius:0;max-width:100%;max-height:88dvh}
  .cm{grid-template-columns:repeat(2,1fr)}
  .ob::after{display:none}.topbar{padding:0 10px}.tb-s{display:none}
}
@media(min-width:768px) and (max-width:1099px){.ai-panel{display:none}.sg{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1100px){.sg{grid-template-columns:repeat(4,1fr)}}
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function Av({ s="CM", size=36, cat="" }) {
  const lead = cat==="Lead"||s==="SD"||s==="RC";
  const cls = lead ? "av-l" : ["av-g","av-go","av-b","av-r"][s.charCodeAt(0)%4];
  return <div className={`av ${cls}`} style={{width:size,height:size,fontSize:size*.35}}>{s}</div>;
}
function SD({ s }) { return <span className={`sd sd-${s}`} />; }
function TB({ tag }) {
  const m={"Alto Valor":"t-vip","Riesgo Churn":"t-risk","Torneo":"t-norm","Madrugador":"t-norm","Turista":"t-blue","Nuevo":"t-blue","Residente":"t-norm","Pro":"t-vip"};
  return <span className={`tag ${m[tag]||"t-norm"}`}>{tag}</span>;
}

// AI pulse dots
function AIPulse() {
  return <div className="ai-pulse"><div className="ai-dot"/><div className="ai-dot"/><div className="ai-dot"/><span style={{marginLeft:4}}>IA analizando...</span></div>;
}

// Score ring
function ScoreRing({ score, size=70, color="#6dbf82" }) {
  const r=28, c=35, circ=2*Math.PI*r;
  const pct = score/100;
  return (
    <div className="score-ring" style={{width:size,height:size}}>
      <svg width={size} height={size} viewBox="0 0 70 70">
        <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="4"/>
        <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={circ} strokeDashoffset={circ*(1-pct)}
          strokeLinecap="round" transform="rotate(-90 35 35)"/>
      </svg>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div className="score-ring-val" style={{color}}>{score}</div>
        <div className="score-ring-lbl">Score</div>
      </div>
    </div>
  );
}

// ─── AI COPILOT PANEL ─────────────────────────────────────────────────────────
function AICopilot({ contacts, onNav }) {
  const [thinking, setThinking] = useState(false);
  const [shown, setShown] = useState(true);
  const leads = contacts.filter(c=>c.category==="Lead");
  const churn = contacts.filter(c=>c.status==="at-risk");
  const hotLeads = leads.filter(c=>c.visits>0||c.tags.includes("Alto Valor"));
  if(!shown) return (
    <button className="btn btn-p btn-sm" style={{marginBottom:13}} onClick={()=>setShown(true)}>✦ Abrir Copiloto IA</button>
  );
  return (
    <div className="ai-cop" style={{marginBottom:13}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div className="ai-cop-title"><span>✦</span> Copiloto IA — Prioridades de hoy</div>
        <button className="btn-g" style={{background:"transparent",border:"none",cursor:"pointer",color:"rgba(255,255,255,.4)",fontSize:16}} onClick={()=>setShown(false)}>✕</button>
      </div>
      {churn.length>0&&(
        <div className="ai-cop-row">
          <div className="ai-cop-ic r">⚠️</div>
          <div className="ai-cop-tx">
            <strong>{churn[0].name}</strong> lleva 45 días sin visitar y tiene una queja activa. Probabilidad de churn: <strong style={{color:"#f08080"}}>92%</strong>. Acción recomendada: ofrecer green fee gratuita hoy.
            <div><button className="ai-cop-btn" onClick={()=>onNav("inbox")}>→ Ir a bandeja</button></div>
          </div>
        </div>
      )}
      {hotLeads.length>0&&(
        <div className="ai-cop-row">
          <div className="ai-cop-ic l">🎯</div>
          <div className="ai-cop-tx">
            <strong>{hotLeads[0].name}</strong> es un lead caliente con potencial corporativo alto. Sin contacto en 3 semanas. Momento óptimo para activar secuencia de nurturing.
            <div><button className="ai-cop-btn" onClick={()=>onNav("contacts")}>→ Ver lead</button></div>
          </div>
        </div>
      )}
      <div className="ai-cop-row">
        <div className="ai-cop-ic g">📅</div>
        <div className="ai-cop-tx">
          <strong>Martes 9:30h</strong> es el mejor momento para enviar la campaña semanal. Apertura estimada: <strong style={{color:var_mint}}>38%</strong> vs. media del sector 24%.
          <div><button className="ai-cop-btn" onClick={()=>onNav("campaigns")}>→ Crear campaña</button></div>
        </div>
      </div>
      <div className="ai-cop-row">
        <div className="ai-cop-ic a">💰</div>
        <div className="ai-cop-tx">
          CLV total recuperable de leads activos: <strong style={{color:"#f0c060"}}>€{leads.reduce((s,l)=>s+(l.visits*85||250),0).toLocaleString()}</strong>. Convertir el top 3 en clientes supondría +€940/mes.
        </div>
      </div>
    </div>
  );
}
const var_mint = "#6dbf82";

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardView({ contacts, onNav }) {
  const bars=[65,48,72,55,80,92,67,74,88,61,77,84];
  const mx=Math.max(...bars);
  const mo=["E","F","M","A","M","J","J","A","S","O","N","D"];
  const leads=contacts.filter(c=>c.category==="Lead").length;
  return (
    <div className="content">
      <AICopilot contacts={contacts} onNav={onNav}/>
      <div className="ob">
        <div style={{fontSize:14,fontWeight:700,marginBottom:3}}>¡Bienvenido, Club Valle Verde! 🌿</div>
        <div style={{fontSize:12,opacity:.8}}>Copiloto IA activo · {contacts.length} contactos · {leads} leads en nurturing</div>
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
        {[
          {ic:"👥",v:String(contacts.length),l:"Contactos",ch:"+18 este mes",d:"up",c:"g"},
          {ic:"✈️",v:"91%",l:"Apertura Telegram",ch:"+4% vs email",d:"up",c:"go"},
          {ic:"📅",v:"47",l:"Reservas CRM",ch:"+12 vs anterior",d:"up",c:"b"},
          {ic:"🎯",v:String(leads),l:"Leads activos",ch:"€940 potencial/mes",d:"up",c:"l"},
        ].map((s,i)=>(
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
          <div className="ch"><span className="ct">✦ IA esta semana</span></div>
          <div className="cb">
            {[{l:"Borradores usados",p:68,c:"var(--sage)"},{l:"Resolución bot",p:74,c:"var(--info)"},{l:"Sentimiento +",p:82,c:"var(--mint)"},{l:"Leads contactados",p:60,c:"var(--lead)"}].map(r=>(
              <div key={r.l} className="pr">
                <span style={{fontSize:11,color:"var(--mist)",width:120,flexShrink:0}}>{r.l}</span>
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
          <div className="ch"><span className="ct">🎯 Embudo de leads</span><button className="btn btn-g btn-sm" onClick={()=>onNav("contacts")}>Ver →</button></div>
          <div className="cb">
            <div className="funnel">
              {[{l:"Prospecto",n:12,cls:"f-prospect",c:"var(--lead)"},{l:"Lead activo",n:contacts.filter(c=>c.category==="Lead").length,cls:"f-lead",c:"var(--lead)"},{l:"Calificado",n:3,cls:"f-qualified",c:"var(--info)"},{l:"Convertido",n:28,cls:"f-converted",c:"var(--sage)"}].map(f=>(
                <div key={f.l} className={`funnel-stage ${f.cls}`}>
                  <span className="f-name" style={{color:"var(--ink)"}}>{f.l}</span>
                  <span className="f-count" style={{color:f.c}}>{f.n}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="ch"><span className="ct">📉 Riesgo churn</span><span className="tag t-risk">{contacts.filter(c=>c.status==="at-risk").length}</span></div>
          <div className="cb">
            {contacts.filter(c=>c.status==="at-risk").map((c,i)=>(
              <div key={i} className="ci2">
                <div style={{fontSize:16,fontWeight:800,color:"var(--alert)",width:32,textAlign:"center",flexShrink:0}}>92</div>
                <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{c.name}</div><div style={{fontSize:10,color:"#c04040",marginTop:1}}>{c.notes}</div></div>
                <button className="btn btn-s btn-sm">✈️</button>
              </div>
            ))}
            <div style={{marginTop:8,fontSize:11,color:"var(--mist)",lineHeight:1.5}}>✦ <strong style={{color:"var(--pine)"}}>IA recomienda:</strong> Campaña reactivación segmentada. Verde 3% → 18% con oferta personalizada.</div>
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
  const msgs=active===2?MSGS_JW:active===4?[{from:"contact",text:"Ciao, non sono soddisfatto del servizio...",time:"14:22"},{from:"agent",text:"Buongiorno Marco, mi dispiace. Ti offriamo una green fee gratuita.",time:"15:10",agent:"Laura M."}]:[];
  const sug=active===2?"Your tee time is confirmed at 8:30am, Tee 1. Weather: 18°C ☀️\n\n/myteetimes — /menu":active===4?"Marco, mi dispiace per l'inconveniente. Ti offriamo una green fee gratuita per la tua prossima visita 🙏":"Hola, ¿en qué puedo ayudarte?";
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
              <div style={{fontSize:11,color:"var(--mist)",display:"flex",alignItems:"center",gap:5,marginTop:1}}><span className="sd sd-positive pulse"/><span>Telegram activo</span></div>
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
              <div style={{flex:1}}><div className="ai-sug-lb">✦ Borrador IA · Personalizado</div><div style={{fontSize:12,color:"var(--ink)",lineHeight:1.4}}>{sug}</div></div>
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
          <div className="ins i"><div className="ins-lb">Intención detectada</div><div className="ins-tx">{active===2?"🎯 Confirmar reserva (94%)":"🎯 Queja. Espera compensación."}</div></div>
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

// ─── AI PROFILE ANALYSIS MODAL ───────────────────────────────────────────────
function AIProfileModal({ contact, onClose }) {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("analysis");
  useEffect(()=>{ const t=setTimeout(()=>setLoading(false),1800); return ()=>clearTimeout(t); },[]);
  const isLead = contact.category==="Lead";
  const churnScore = contact.status==="at-risk"?92:contact.visits<5?60:contact.visits>30?10:25;
  const clv = contact.clv||contact.visits*85;
  const leadScore = isLead ? (contact.visits>0?72:45) : null;

  return (
    <div className="ov" onClick={onClose}>
      <div className="mo" style={{maxWidth:580}} onClick={e=>e.stopPropagation()}>
        <div className="mo-h">
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <Av s={contact.av} size={38} cat={contact.category}/>
            <div>
              <div className="mo-t">{contact.name}</div>
              <div style={{fontSize:11,color:"var(--mist)"}}>{contact.tg||contact.email} · {isLead?<span style={{color:"var(--lead)",fontWeight:600}}>Lead</span>:"Cliente"}</div>
            </div>
          </div>
          <button className="btn btn-g btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="mo-b">
          {loading?(
            <div style={{display:"flex",flexDirection:"column",gap:10,padding:"20px 0"}}>
              <AIPulse/>
              <div style={{fontSize:13,color:"var(--mist)",textAlign:"center",marginTop:8}}>Analizando perfil completo con IA...</div>
              {[1,2,3].map(i=><div key={i} className="shimmer" style={{height:18,borderRadius:8,width:`${[90,70,80][i-1]}%`}}/>)}
            </div>
          ):(
            <>
              <div className="tabs" style={{marginBottom:11}}>
                {[["analysis","✦ Análisis IA"],["profile","👤 Perfil"],["journey","📅 Historial"],isLead&&["nurturing","🎯 Nurturing"]].filter(Boolean).map(([id,l])=>(
                  <button key={id} className={`tab ${tab===id?"on":""}`} onClick={()=>setTab(id)}>{l}</button>
                ))}
              </div>

              {tab==="analysis"&&(
                <div>
                  <div className="ai-profile-card">
                    <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:14}}>
                      <ScoreRing score={isLead?leadScore:100-churnScore} color={isLead?"#9c6dff":churnScore>70?"#f08080":churnScore>40?"#f0c060":"#6dbf82"}/>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:700,color:"white",marginBottom:6}}>
                          {isLead?"Puntuación de lead":"Puntuación de retención"}
                        </div>
                        <div style={{fontSize:12,color:"rgba(255,255,255,.7)",lineHeight:1.6}}>
                          {isLead
                            ? contact.visits>0
                              ? "Lead caliente con potencial corporativo. Ha visitado el campo. Alta probabilidad de conversión con oferta personalizada."
                              : "Lead frío — sin visitas. Interesada por torneos. Potencial de conversión mediante invitación gratuita."
                            : churnScore>70
                              ? "Riesgo de abandono crítico. Sin visita en 45 días. Queja activa sin resolver. Acción inmediata necesaria."
                              : contact.visits>30
                                ? "Cliente fidelizado. Sin riesgo de churn. CLV sólido. Candidato ideal para programa referidos."
                                : "Perfil estable. Sin señales de alerta. Potencial de upsell mediante torneos o bono mensual."
                          }
                        </div>
                        <div style={{marginTop:8,display:"flex",gap:8,flexWrap:"wrap"}}>
                          {[
                            isLead?["🎯 Potencial alta","rgba(156,109,255,.25)","#c4b4ff"]:["💚 Retención OK","rgba(109,191,130,.2)","#6dbf82"],
                            isLead?["✉️ Nurturing activo","rgba(200,146,42,.2)","#f0c060"]:churnScore>50?["⚠️ Churn riesgo","rgba(224,82,82,.2)","#f08080"]:["📈 CLV creciente","rgba(43,124,211,.2)","#60a8e0"],
                          ].map(([l,bg,c])=>(
                            <span key={l} style={{background:bg,border:`1px solid ${c}`,color:c,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20}}>{l}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={{borderTop:"1px solid rgba(255,255,255,.1)",paddingTop:12}}>
                      <div style={{fontSize:10,fontWeight:700,color:"var(--mint)",textTransform:"uppercase",letterSpacing:".5px",marginBottom:8}}>✦ Acciones recomendadas por IA</div>
                      {(isLead?[
                        contact.visits>0
                          ? "Enviar propuesta de membresía mensual con precio especial early-bird."
                          : "Invitar al próximo torneo con entrada gratuita para primera visita.",
                        "Asignar a secuencia de nurturing: 3 mensajes en 10 días.",
                        "Añadir a segmento 'Corporativo' si confirma empresa.",
                      ]:[
                        churnScore>70?"Ofrecer green fee gratuita + llamada personal del director.":"Enviar oferta de bono mensual con descuento del 15%.",
                        churnScore>70?"Escalar a director de campo — cliente VIP en riesgo crítico.":"Invitar al próximo torneo con plaza reservada.",
                        "Activar seguimiento post-visita automático (encuesta + oferta).",
                      ]).map((a,i)=>(
                        <div key={i} style={{display:"flex",gap:8,marginBottom:6,alignItems:"flex-start"}}>
                          <span style={{color:"var(--gold)",fontWeight:700,flexShrink:0}}>{i+1}.</span>
                          <span style={{fontSize:12,color:"rgba(255,255,255,.8)",lineHeight:1.5}}>{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="two-col" style={{marginTop:11}}>
                    <div style={{background:"var(--fw)",borderRadius:"var(--rs)",padding:10,border:"1px solid var(--fog)"}}>
                      <div style={{fontSize:10,fontWeight:700,color:"var(--mist)",textTransform:"uppercase",marginBottom:8}}>CLV Estimado</div>
                      <div style={{fontSize:24,fontWeight:800,color:"var(--pine)"}}>€{isLead?(contact.visits>0?340:150):clv}</div>
                      <div style={{fontSize:11,color:"var(--mist)",marginTop:3}}>acumulado · potencial €{isLead?(contact.visits>0?2400:1800):Math.round(clv*1.4)}/año</div>
                      <div className="rev-bar"><div className="rev-fill" style={{width:`${Math.min(isLead?20:Math.round(clv/50),100)}%`,background:"linear-gradient(90deg,var(--mint),var(--sage))"}} /></div>
                    </div>
                    <div style={{background:"var(--fw)",borderRadius:"var(--rs)",padding:10,border:"1px solid var(--fog)"}}>
                      <div style={{fontSize:10,fontWeight:700,color:"var(--mist)",textTransform:"uppercase",marginBottom:8}}>Predicción próxima visita</div>
                      <div style={{fontSize:20,fontWeight:800,color:"var(--pine)"}}>{isLead?"—":contact.visits>20?"< 7 días":"~21 días"}</div>
                      <div style={{fontSize:11,color:"var(--mist)",marginTop:3,lineHeight:1.4}}>{isLead?"No hay historial de visitas aún.":contact.visits>20?"Patrón de visita frecuente detectado.":"Patrón irregular. Campaña recomendada."}</div>
                    </div>
                  </div>
                </div>
              )}

              {tab==="profile"&&(
                <div>
                  <div className="two-col" style={{marginBottom:11}}>
                    {[["Nombre",contact.name],["Telegram",contact.tg||"—"],["Email",contact.email||"—"],["Teléfono",contact.phone||"—"],["Hándicap",contact.handicap],["Idioma",contact.lang],["Visitas totales",contact.visits],["Última visita",contact.lastVisit],["Segmento",contact.segment],["Categoría",contact.category]].map(([k,v])=>(
                      <div key={k} style={{marginBottom:6}}>
                        <div style={{fontSize:10,fontWeight:700,color:"var(--mist)",textTransform:"uppercase",letterSpacing:".4px"}}>{k}</div>
                        <div style={{fontSize:13,fontWeight:500,marginTop:2}}>{String(v)}</div>
                      </div>
                    ))}
                  </div>
                  {contact.notes&&(
                    <div className="aib"><div className="aib-l">Notas internas</div><div className="aib-t">{contact.notes}</div></div>
                  )}
                  <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:4}}>
                    {contact.tags.map(t=><TB key={t} tag={t}/>)}
                    {isLead&&<span className="tag t-lead">Lead</span>}
                  </div>
                </div>
              )}

              {tab==="journey"&&(
                <div>
                  <div className="timeline">
                    {(isLead?[
                      {d:"15 Jan 2025",t:"Primer contacto",a:true},
                      {d:"20 Jan 2025",t:"Interés en torneo de primavera expresado",a:true},
                      {d:"28 Jan 2025",t:"Sin respuesta a invitación — pendiente follow-up",a:false},
                    ]:[
                      {d:"2 Nov 2024",t:"Ronda 9h · Grupo de empresa",a:true},
                      {d:"10 Nov 2024",t:"Torneo club · 3er puesto · Satisfacción alta",a:true},
                      {d:"18 Nov 2024",t:"18h Verde A · Solitario",a:true},
                      {d:"22 Nov 2024",t:"Respondió a campaña Black Friday",a:true},
                      contact.status==="at-risk"?{d:"hace 45 días",t:"Última visita — queja activa sin resolver",a:false}:{d:"hace 2-3 días",t:"Visita reciente confirmada",a:true},
                    ]).map((it,i)=>(
                      <div key={i} className={`tl-item ${it.a?"":"inactive"}`}>
                        <div className="tl-date">{it.d}</div>
                        <div className="tl-text">{it.t}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab==="nurturing"&&isLead&&(
                <div>
                  <div className="aib" style={{marginBottom:11}}>
                    <div className="aib-l">✦ Secuencia de nurturing generada por IA</div>
                    <div className="aib-t">3 mensajes en 10 días. Adaptados al idioma ({contact.lang}) y perfil del lead.</div>
                  </div>
                  {[
                    {d:"Hoy",step:"1er contacto",msg:`Hola ${contact.name.split(" ")[0]}, somos el equipo de Golf Valle Verde 🌿 Nos gustaría invitarte a descubrir el campo. ¿Te interesa una visita gratuita esta semana? /reservar`,tipo:"Bot automático"},
                    {d:"Día 4",step:"Contenido de valor",msg:`${contact.name.split(" ")[0]}, ¿sabías que este mes organizamos el Torneo de Primavera? Plazas limitadas. Puedes reservar con entrada de invitado: /torneo`,tipo:"Campaña segmentada"},
                    {d:"Día 10",step:"Oferta de cierre",msg:`Última oportunidad, ${contact.name.split(" ")[0]} — tenemos una oferta especial de bono mensual solo esta semana. Incluye torneos ilimitados. ¿Te lo enviamos? /tarifas`,tipo:"Oferta personalizada"},
                  ].map((m,i)=>(
                    <div key={i} style={{border:"1px solid var(--fog)",borderRadius:10,overflow:"hidden",marginBottom:8}}>
                      <div style={{padding:"8px 12px",background:"var(--fw)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div style={{fontSize:12,fontWeight:700,color:"var(--pine)"}}>{m.d} — {m.step}</div>
                        <span style={{fontSize:10,background:"var(--leadl)",color:"var(--lead)",padding:"1px 7px",borderRadius:20,fontWeight:600}}>{m.tipo}</span>
                      </div>
                      <div style={{padding:"9px 12px",fontSize:12,lineHeight:1.6,color:"var(--ink)",background:"white"}}>{m.msg}</div>
                    </div>
                  ))}
                  <div style={{display:"flex",gap:7,marginTop:11,flexWrap:"wrap"}}>
                    <button className="btn btn-lead">🚀 Activar secuencia</button>
                    <button className="btn btn-s">✏️ Personalizar</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {!loading&&(
          <div className="mo-f">
            <button className="btn btn-tg btn-sm">✈️ Mensaje Telegram</button>
            {isLead&&<button className="btn btn-lead btn-sm">✓ Convertir en cliente</button>}
            <button className="btn btn-s btn-sm" onClick={onClose}>Cerrar</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── EDIT PROFILE MODAL ───────────────────────────────────────────────────────
function EditProfileModal({ contact, onSave, onClose }) {
  const [form, setForm] = useState({...contact});
  const f = (k,v) => setForm(p=>({...p,[k]:v}));
  return (
    <div className="ov" onClick={onClose}>
      <div className="mo" style={{maxWidth:540}} onClick={e=>e.stopPropagation()}>
        <div className="mo-h">
          <div style={{display:"flex",alignItems:"center",gap:9}}><Av s={contact.av} size={34} cat={contact.category}/><div className="mo-t">Editar — {contact.name}</div></div>
          <button className="btn btn-g btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="mo-b">
          <div className="two-col">
            <div className="fg"><label className="fl">Nombre completo</label><input className="fi" value={form.name} onChange={e=>f("name",e.target.value)}/></div>
            <div className="fg"><label className="fl">Categoría</label>
              <select className="fs" value={form.category} onChange={e=>f("category",e.target.value)}>
                <option>Lead</option><option>Cliente</option>
              </select>
            </div>
          </div>
          <div className="two-col">
            <div className="fg"><label className="fl">Usuario Telegram</label><input className="fi" value={form.tg||""} onChange={e=>f("tg",e.target.value)} placeholder="@usuario"/></div>
            <div className="fg"><label className="fl">Teléfono</label><input className="fi" value={form.phone||""} onChange={e=>f("phone",e.target.value)} placeholder="+34 600 000 000"/></div>
          </div>
          <div className="two-col">
            <div className="fg"><label className="fl">Email</label><input className="fi" value={form.email||""} onChange={e=>f("email",e.target.value)} placeholder="correo@email.com"/></div>
            <div className="fg"><label className="fl">Hándicap</label><input className="fi" type="number" value={form.handicap||""} onChange={e=>f("handicap",parseInt(e.target.value)||0)}/></div>
          </div>
          <div className="two-col">
            <div className="fg"><label className="fl">Idioma</label>
              <select className="fs" value={form.lang} onChange={e=>f("lang",e.target.value)}>
                {["ES","EN","DE","FR","IT","SV","PT"].map(l=><option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="fg"><label className="fl">Segmento</label>
              <select className="fs" value={form.segment} onChange={e=>f("segment",e.target.value)}>
                <option>Lead</option><option>Normal</option><option>VIP</option><option>En Riesgo</option>
              </select>
            </div>
          </div>
          <div className="fg">
            <label className="fl">Etiquetas</label>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {["Alto Valor","Torneo","Residente","Turista","Madrugador","Pro","Riesgo Churn","Nuevo"].map(t=>{
                const on = form.tags.includes(t);
                return <label key={t} style={{cursor:"pointer"}} onClick={()=>f("tags",on?form.tags.filter(x=>x!==t):[...form.tags,t])}>
                  <span className={`tag ${on?"t-vip":"t-norm"}`} style={{opacity:on?1:.5,transition:"opacity .15s"}}>{t}</span>
                </label>;
              })}
            </div>
          </div>
          <div className="fg">
            <label className="fl">Notas internas</label>
            <textarea className="fta" value={form.notes||""} onChange={e=>f("notes",e.target.value)} placeholder="Observaciones del equipo..."/>
          </div>
        </div>
        <div className="mo-f">
          <button className="btn btn-s" onClick={onClose}>Cancelar</button>
          <button className="btn btn-p" onClick={()=>onSave(form)}>✓ Guardar cambios</button>
        </div>
      </div>
    </div>
  );
}

// ─── CONTACTS ─────────────────────────────────────────────────────────────────
function ContactsView({ contacts, setContacts }) {
  const [modal,setModal]=useState(false);
  const [aiModal,setAiModal]=useState(null);
  const [editModal,setEditModal]=useState(null);
  const [notif,setNotif]=useState(null);
  const [q,setQ]=useState("");
  const [catFilter,setCatFilter]=useState("Todos");
  const notify=msg=>{setNotif(msg);setTimeout(()=>setNotif(null),2500)};

  const flt=contacts.filter(c=>{
    const matchQ=c.name.toLowerCase().includes(q.toLowerCase())||c.tags.some(t=>t.toLowerCase().includes(q.toLowerCase()));
    const matchCat=catFilter==="Todos"||(catFilter==="Leads"&&c.category==="Lead")||(catFilter==="Clientes"&&c.category==="Cliente")||(catFilter==="VIP"&&c.segment==="VIP")||(catFilter==="Riesgo"&&c.status==="at-risk");
    return matchQ&&matchCat;
  });
  const leads=contacts.filter(c=>c.category==="Lead").length;
  const saveEdit=(form)=>{setContacts(prev=>prev.map(c=>c.id===form.id?form:c));setEditModal(null);notify("✓ Perfil actualizado");};
  const convertLead=(c)=>{setContacts(prev=>prev.map(p=>p.id===c.id?{...p,category:"Cliente",segment:"Normal",status:"active"}:p));setAiModal(null);notify(`✓ ${c.name.split(" ")[0]} convertido a cliente`);};

  return (
    <div className="content">
      {/* Lead funnel strip */}
      <div style={{display:"flex",gap:5,marginBottom:11,flexWrap:"wrap"}}>
        {[["Todos",contacts.length,"var(--pine)"],["Leads",leads,"var(--lead)"],["Clientes",contacts.length-leads,"var(--sage)"],["VIP",contacts.filter(c=>c.segment==="VIP").length,"var(--gold)"],["Riesgo",contacts.filter(c=>c.status==="at-risk").length,"var(--alert)"]].map(([l,n,c])=>(
          <button key={l} onClick={()=>setCatFilter(l)} style={{padding:"5px 10px",borderRadius:20,fontSize:12,fontWeight:600,border:`1px solid ${catFilter===l?c:"var(--fog)"}`,background:catFilter===l?c+"18":"white",color:catFilter===l?c:"var(--mist)",cursor:"pointer",transition:"all .15s"}}>{l} <span style={{opacity:.7}}>({n})</span></button>
        ))}
        <div style={{marginLeft:"auto",display:"flex",gap:5}}>
          <div style={{display:"flex",alignItems:"center",gap:6,background:"white",border:"1px solid var(--fog)",borderRadius:"var(--rs)",padding:"5px 9px",maxWidth:180}}>
            <span>🔍</span>
            <input style={{border:"none",background:"transparent",fontFamily:"var(--fn)",fontSize:13,outline:"none",color:"var(--ink)",width:"100%"}} placeholder="Buscar..." value={q} onChange={e=>setQ(e.target.value)}/>
          </div>
          <button className="btn btn-s btn-sm">⬆️ CSV</button>
          <button className="btn btn-p btn-sm" onClick={()=>setModal(true)}>+ Nuevo</button>
        </div>
      </div>

      <div className="cg">
        {flt.map(c=>(
          <div key={c.id} className={`cc ${c.category==="Lead"?"lead-card":""}`}>
            <div style={{display:"flex",alignItems:"flex-start",gap:9,marginBottom:8}}>
              <div onClick={()=>setAiModal(c)} style={{cursor:"pointer"}}>
                <Av s={c.av} size={38} cat={c.category}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",cursor:"pointer"}} onClick={()=>setAiModal(c)}>{c.name}</div>
                <div style={{fontSize:11,color:"var(--tg)",marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.tg||c.email||"—"}</div>
              </div>
              <div style={{display:"flex",gap:3,alignItems:"center"}}>
                <SD s={c.sentiment}/>
                <button className="btn btn-g btn-sm" style={{padding:"3px 5px",fontSize:12}} onClick={()=>setEditModal(c)} title="Editar perfil">✏️</button>
              </div>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:6}}>
              {c.tags.map(t=><TB key={t} tag={t}/>)}
              {c.category==="Lead"&&<span className="tag t-lead">Lead</span>}
            </div>
            <div className="cst">
              <div><div className="csv">{c.handicap}</div><div className="csl">Hcp</div></div>
              <div><div className="csv">{c.visits}</div><div className="csl">Visitas</div></div>
              <div><div className="csv">€{c.clv||c.visits*85}</div><div className="csl">CLV</div></div>
            </div>
            <div style={{marginTop:7,display:"flex",gap:4,justifyContent:"flex-end"}}>
              <button className="btn btn-g btn-sm" style={{padding:"3px 7px",fontSize:11}} onClick={()=>setAiModal(c)}>✦ IA</button>
              {c.category==="Lead"&&<button className="btn btn-sm" style={{background:"var(--leadl)",color:"var(--lead)",border:"1px solid var(--leadb)",padding:"3px 7px",fontSize:11,cursor:"pointer"}} onClick={()=>setAiModal(c)}>🎯 Nurturing</button>}
            </div>
          </div>
        ))}
      </div>

      {/* New contact modal */}
      {modal&&(
        <div className="ov" onClick={()=>setModal(false)}>
          <div className="mo" onClick={e=>e.stopPropagation()}>
            <div className="mo-h"><span className="mo-t">➕ Nuevo contacto</span><button className="btn btn-g btn-sm" onClick={()=>setModal(false)}>✕</button></div>
            <div className="mo-b">
              <div className="two-col">
                <div className="fg"><label className="fl">Nombre</label><input className="fi" placeholder="Carlos Mendoza"/></div>
                <div className="fg"><label className="fl">Categoría</label>
                  <select className="fs"><option>Lead</option><option>Cliente</option></select>
                </div>
              </div>
              <div className="two-col">
                <div className="fg"><label className="fl">Usuario Telegram</label><input className="fi" placeholder="@usuario"/></div>
                <div className="fg"><label className="fl">Teléfono</label><input className="fi" placeholder="+34 600 000 000"/></div>
              </div>
              <div className="two-col">
                <div className="fg"><label className="fl">Hándicap</label><input className="fi" type="number" placeholder="18"/></div>
                <div className="fg"><label className="fl">Idioma</label><select className="fs"><option>ES</option><option>EN</option><option>DE</option><option>FR</option></select></div>
              </div>
              <div className="aib"><div className="aib-l">✦ Consentimiento RGPD</div>
                <label style={{display:"flex",gap:7,alignItems:"flex-start",cursor:"pointer",fontSize:12}}>
                  <input type="checkbox" defaultChecked style={{marginTop:2}}/>
                  <span>El contacto ha dado consentimiento explícito para marketing por Telegram.</span>
                </label>
              </div>
            </div>
            <div className="mo-f">
              <button className="btn btn-s" onClick={()=>setModal(false)}>Cancelar</button>
              <button className="btn btn-p" onClick={()=>{notify("✓ Contacto guardado");setModal(false);}}>✓ Guardar</button>
            </div>
          </div>
        </div>
      )}

      {aiModal&&<AIProfileModal contact={aiModal} onClose={()=>setAiModal(null)} onConvert={convertLead}/>}
      {editModal&&<EditProfileModal contact={editModal} onSave={saveEdit} onClose={()=>setEditModal(null)}/>}
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
  const generate=()=>{setGen(true);setTimeout(()=>{setDraft("¡Hola, {{nombre}}! 🏌️ Te esperamos este fin de semana en Valle Verde.\n\nHemos reservado una hora especial para ti: tarifa 45€ · Tee preferente.\n\n¿Te apuntas? Responde SÍ.\n\nEl equipo de Valle Verde ⛳\n/menu — /stop");setGen(false)},1400)};
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
          {c.status==="sent"&&<div style={{padding:"6px 13px",background:"var(--fw)",borderTop:"1px solid var(--fog)",fontSize:11,color:"var(--mist)"}}>✦ IA: {c.name.includes("Torneo")?"43% conversión — mejor campaña del mes.":Math.round((c.opened/(c.sent||1))*100)+"% apertura — por encima de la media del sector (24%)."}</div>}
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
                <div className="fg"><label className="fl">Segmento</label><select className="fs"><option>Todos (320)</option><option>Alto Valor (78)</option><option>Riesgo Churn (8)</option><option>Torneo (56)</option><option selected>Leads activos (8)</option></select></div>
                <div className="aib" style={{margin:0}}><div className="aib-l">👥 8 leads seleccionados — primera comunicación</div><div className="aib-t">IA adaptará el mensaje automáticamente: tono de primer contacto + invitación de bienvenida.</div></div>
              </>}
              {step===2&&<>
                <div className="aib"><div className="aib-l">✦ Ventaja Telegram</div><div className="aib-t">Sin templates ni aprobaciones. Escribe cualquier mensaje al instante.</div></div>
                <div className="fg">
                  <label className="fl">Mensaje</label>
                  <button className="btn btn-s btn-sm" onClick={generate} disabled={gen} style={{marginBottom:7}}>{gen?"✦ Generando...":"✦ Generar con IA · Personalizado"}</button>
                  {draft?(<div className="aib"><div className="aib-l">✦ Borrador IA · Personalizado por perfil</div><div className="aib-t" style={{whiteSpace:"pre-wrap"}}>{draft}</div><div style={{display:"flex",gap:5,marginTop:6}}><button className="btn btn-p btn-sm">✓ Usar</button><button className="btn btn-s btn-sm" onClick={generate}>🔄 Regenerar</button></div></div>)
                  :<textarea className="fta" placeholder="Escribe libremente — sin restricciones de template ✦"/>}
                </div>
              </>}
              {step===3&&<>
                <div className="two-col">
                  <div className="fg"><label className="fl">Fecha</label><input className="fi" type="date"/></div>
                  <div className="fg"><label className="fl">Hora</label><select className="fs"><option>09:00 — Recomendado ✦</option><option>10:00</option><option>17:00</option></select></div>
                </div>
                <div className="aib"><div className="aib-l">✦ Recomendación IA</div><div className="aib-t">Para leads: <strong>martes 9-11h</strong>. Apertura estimada: <strong>38%</strong>. Respuesta esperada: <strong>3-4 leads</strong>.</div></div>
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
function AnalyticsView({ contacts }) {
  const days=[{l:"Lun",c:42,r:18,b:7},{l:"Mar",c:68,r:31,b:14},{l:"Mié",c:55,r:24,b:11},{l:"Jue",c:38,r:16,b:6},{l:"Vie",c:72,r:38,b:19},{l:"Sáb",c:89,r:52,b:28},{l:"Dom",c:61,r:29,b:13}];
  const mx=Math.max(...days.map(d=>d.c));
  const leads=contacts.filter(c=>c.category==="Lead");
  return (
    <div className="content">
      <div className="sg" style={{marginBottom:11}}>
        {[{ic:"📤",v:"1.247",l:"Mensajes",s:"este mes",c:"g"},{ic:"👁️",v:"87%",l:"Apertura media",s:"+3% vs anterior",c:"go"},{ic:"↩️",v:"34%",l:"Respuestas",s:"sector: ~8%",c:"b"},{ic:"🎯",v:`${leads.length}`,l:"Leads activos",s:"€940 potencial",c:"l"}].map((s,i)=>(
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
            {[{l:"Alto Valor",n:78,p:25,c:"var(--gold)"},{l:"Residente",n:124,p:40,c:"var(--mint)"},{l:"Torneo",n:56,p:18,c:"var(--sage)"},{l:"Leads",n:leads.length,p:Math.round(leads.length/contacts.length*100),c:"var(--lead)"},{l:"Riesgo churn",n:contacts.filter(c=>c.status==="at-risk").length,p:3,c:"var(--alert)"}].map(s=>(
              <div key={s.l} className="pr">
                <span style={{fontSize:11,color:"var(--mist)",width:96,flexShrink:0}}>{s.l} ({s.n})</span>
                <div className="pb"><div className="pf" style={{width:`${s.p}%`,background:s.c}}/></div>
                <span className="pv">{s.p}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* AI Prediction Cards */}
      <div className="card" style={{marginBottom:11}}>
        <div className="ch"><span className="ct">✦ Predicciones IA — próximos 30 días</span><AIPulse/></div>
        <div className="cb">
          <div className="two-col">
            {[
              {name:"Marco Rossi",sc:92,r:"Abandono probable en 7 días",cls:"high",action:"Ofrecer compensación inmediata"},
              {name:"Ingrid Björk",sc:55,r:"Lead sin actividad — 14 días",cls:"med",action:"Activar secuencia nurturing"},
              {name:"Robert Chen",sc:35,r:"Lead corporativo — potencial alto",cls:"low",action:"Enviar propuesta membership"},
              {name:"Stefan Klein",sc:70,r:"Sin respuesta a 3 campañas",cls:"high",action:"Cambiar canal de contacto"},
            ].map(c=>(
              <div key={c.name} className="pred-card">
                <div className="pred-h">
                  <div className={`pred-score ${c.cls}`}>{c.sc}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600}}>{c.name}</div>
                    <div style={{fontSize:11,color:"var(--mist)",marginTop:2}}>{c.r}</div>
                  </div>
                </div>
                <div className="pred-action"><span style={{fontSize:10,fontWeight:700,color:"var(--sage)"}}>✦ IA recomienda: </span><span style={{fontSize:11}}>{c.action}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="two-col">
        <div className="card">
          <div className="ch"><span className="ct">✦ Insights IA</span></div>
          <div className="cb">
            {[{t:"",i:"⏰",tx:"Martes 9-11h: mejor momento. +43% apertura."},{t:"w",i:"📉",tx:"8 clientes sin responder 30+ días. Activar reactivación."},{t:"l",i:"🎯",tx:`${leads.length} leads activos. Potencial €940/mes. Secuencia nurturing recomendada.`},{t:"",i:"🌍",tx:"Contactos EN responden mejor antes 10am."},{t:"",i:"🏆",tx:"'Torneo Navidad': 43% conversión — mejor resultado del año."}].map((ins,i)=>(
              <div key={i} className={`ins ${ins.t}`} style={{marginBottom:6}}><div className="ins-tx">{ins.i} {ins.tx}</div></div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="ch"><span className="ct">💰 Revenue Forecast IA</span></div>
          <div className="cb">
            <div style={{fontSize:11,color:"var(--mist)",marginBottom:8}}>Próximos 30 días — estimado con IA</div>
            {[{l:"Reservas directas",v:4200,t:5000,c:"var(--sage)"},{l:"Conversión leads",v:940,t:2000,c:"var(--lead)"},{l:"Retención churn",v:340,t:1200,c:"var(--gold)"},{l:"Campañas activas",v:780,t:1000,c:"var(--info)"}].map(r=>(
              <div key={r.l} style={{marginBottom:9}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:11,color:"var(--mist)"}}>{r.l}</span><span style={{fontSize:12,fontWeight:700,color:"var(--pine)"}}>€{r.v}</span></div>
                <div className="rev-bar"><div className="rev-fill" style={{width:`${Math.round(r.v/r.t*100)}%`,background:r.c}}/></div>
              </div>
            ))}
            <div style={{borderTop:"1px solid var(--fog)",paddingTop:8,display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:12,fontWeight:600}}>Total estimado</span>
              <span style={{fontSize:16,fontWeight:800,color:"var(--pine)"}}>€{(4200+940+340+780).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS (simplified) ────────────────────────────────────────────────────
function SettingsView() {
  const [tab,setTab]=useState("voz");
  const [notif,setNotif]=useState(null);
  const [typing,setTyping]=useState(false);
  const [preview,setPreview]=useState("Estimado {{nombre}}, en Valle Verde nos complace invitarte a una experiencia exclusiva este fin de semana.");
  const generateVoice=()=>{setTyping(true);let i=0;const text="Estimado {{nombre}}, el verde te espera ⛳ Esta semana en Valle Verde tienes una oportunidad exclusiva. Sabemos que disfrutas de las rondas matutinas — te guardamos el tee 1 a las 8:30h. ¿Te apuntamos?";setPreview("");const ti=setInterval(()=>{setPreview(text.slice(0,i));i++;if(i>text.length){clearInterval(ti);setTyping(false)}},28)};
  const save=()=>{setNotif("✓ Guardado");setTimeout(()=>setNotif(null),2000)};
  return (
    <div className="content">
      <div className="sl-wrap">
        <div className="snav">
          <div className="snav-inner">
            {[["voz","🎨","Voz del club"],["chatbot","🤖","Chatbot IA"],["leads","🎯","Leads & Funnel"],["frecuencia","⏰","Frecuencia"],["rgpd","🔒","RGPD"]].map(([id,ic,l])=>(
              <button key={id} className={`snb ${tab===id?"on":""}`} onClick={()=>setTab(id)}><span style={{fontSize:15}}>{ic}</span>{l}</button>
            ))}
          </div>
        </div>
        <div style={{flex:1,minWidth:0}}>
          {tab==="voz"&&(
            <div className="card">
              <div className="ch"><span className="ct">🎨 Voz del club — IA generativa</span><button className="btn btn-p btn-sm" onClick={generateVoice}>{typing?"✦ Generando...":"✦ Generar con IA"}</button></div>
              <div className="cb">
                <div className="two-col">
                  <div className="fg"><label className="fl">Nombre del club</label><input className="fi" defaultValue="Club de Golf Valle Verde"/></div>
                  <div className="fg"><label className="fl">Tono</label><select className="fs"><option>Formal</option><option selected>Semiformal · Cálido</option><option>Cercano</option><option>Exclusivo</option></select></div>
                </div>
                <div className="fg"><label className="fl">Palabras clave de marca</label><input className="fi" defaultValue="verde, exclusivo, experiencia, excelencia, bienvenida"/></div>
                <div className="fg"><label className="fl">Palabras prohibidas</label><input className="fi" defaultValue="barato, económico, ofertón, descuento agresivo"/></div>
                <div className="fg"><label className="fl">Firma</label><input className="fi" defaultValue="El equipo de Valle Verde ⛳"/></div>
                <div className="aib">
                  <div className="aib-l">✦ Vista previa en tiempo real {typing&&<span className="voc-cursor"/>}</div>
                  <div className="aib-t">{preview}</div>
                </div>
                <button className="btn btn-p" onClick={save}>✓ Guardar</button>
              </div>
            </div>
          )}
          {tab==="chatbot"&&(
            <div className="card">
              <div className="ch"><span className="ct">🤖 Chatbot IA — Comportamiento</span></div>
              <div className="cb">
                <div className="fg"><label className="fl">Nombre del asistente</label><input className="fi" defaultValue="Valeria — Golf Valle Verde"/></div>
                <div className="aib" style={{marginBottom:11}}>
                  <div className="aib-l">✦ Capacidades IA activas</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:4}}>
                    {["Detección de idioma automática","Análisis de sentimiento en tiempo real","Borradores personalizados por perfil","Respuesta a objeciones de precio","Propuesta de reserva contextual","Detección de intención de compra","Resumen post-conversación","Escalado inteligente"].map(f=>(
                      <label key={f} style={{display:"flex",gap:6,fontSize:12,cursor:"pointer",alignItems:"flex-start"}}>
                        <input type="checkbox" defaultChecked style={{marginTop:2,flexShrink:0}}/>{f}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="fg"><label className="fl">Escalar a humano cuando</label>
                  {["No resuelve en 3 intercambios","Detecta sentimiento negativo","Cliente VIP","Menciona: queja, reclamación","Consulta de precio > 200€"].map((l,i)=>(
                    <label key={l} style={{display:"flex",gap:8,alignItems:"center",marginBottom:7,cursor:"pointer",fontSize:13}}><input type="checkbox" defaultChecked/> {l}</label>
                  ))}
                </div>
                <button className="btn btn-p" onClick={save}>✓ Guardar</button>
              </div>
            </div>
          )}
          {tab==="leads"&&(
            <div className="card">
              <div className="ch"><span className="ct">🎯 Leads & Funnel — Configuración</span></div>
              <div className="cb">
                <div className="aib" style={{marginBottom:13}}>
                  <div className="aib-l">✦ Automatización de leads activa</div>
                  <div className="aib-t">Cuando un lead responde, la IA lo califica automáticamente y sugiere el siguiente paso del funnel.</div>
                </div>
                <div className="fg"><label className="fl">Puntuación mínima para calificar como lead caliente</label><input className="fi" type="number" defaultValue="65" style={{maxWidth:80}}/></div>
                <div className="fg"><label className="fl">Días hasta marcar lead como frío (sin respuesta)</label><input className="fi" type="number" defaultValue="14" style={{maxWidth:80}}/></div>
                <div className="fg">
                  <label className="fl">Secuencia nurturing por defecto</label>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {[["Día 0","Primer contacto · Bienvenida + invitación visita"],["Día 4","Contenido de valor · Torneo o novedad del campo"],["Día 10","Oferta de cierre · Membresía o pack de bienvenida"],["Día 21","Seguimiento final · Si no responde → marcar como inactivo"]].map(([d,l])=>(
                      <div key={d} style={{display:"flex",gap:10,alignItems:"center",padding:"6px 10px",background:"var(--fw)",borderRadius:8,border:"1px solid var(--fog)"}}>
                        <span style={{fontSize:11,fontWeight:700,color:"var(--lead)",width:40,flexShrink:0}}>{d}</span>
                        <span style={{fontSize:12,color:"var(--ink)"}}>{l}</span>
                      </div>
                    ))}
                  </div>
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
                <div className="fg"><label className="fl">Máx. mensajes / contacto / semana</label><select className="fs"><option>1</option><option selected>2</option><option>3</option></select></div>
                <button className="btn btn-p" onClick={save}>✓ Guardar</button>
              </div>
            </div>
          )}
          {tab==="rgpd"&&(
            <div className="card">
              <div className="ch"><span className="ct">🔒 RGPD y Privacidad</span></div>
              <div className="cb">
                {[["Consentimiento explícito","Registrado con fecha y texto por contacto"],["Opt-out automático","/stop activa la baja inmediatamente"],["Retención de datos","24 meses — anonimización automática"],["PII y IA","Datos personales eliminados antes de enviar a la API"],["Audit log","Todas las acciones sobre datos registradas"]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",gap:9,padding:"9px 0",borderBottom:"1px solid var(--fog)"}}>
                    <span>✅</span><div><div style={{fontSize:13,fontWeight:600}}>{k}</div><div style={{fontSize:11,color:"var(--mist)",marginTop:2}}>{v}</div></div>
                  </div>
                ))}
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
  const [contacts,setContacts]=useState(initContacts);
  const navItems=[
    {id:"dashboard",ic:"📊",l:"Dashboard"},
    {id:"inbox",ic:"💬",l:"Bandeja",badge:6},
    {id:"contacts",ic:"👥",l:"Contactos"},
    {id:"campaigns",ic:"📣",l:"Campañas"},
    {id:"analytics",ic:"📈",l:"Analítica"},
    {id:"settings",ic:"⚙️",l:"Ajustes"},
  ];
  const titles={
    dashboard:{t:"Dashboard · Copiloto IA",s:"Club Golf Valle Verde · Insights en tiempo real"},
    inbox:{t:"Bandeja Telegram",s:"5 conversaciones · 6 sin leer · Bot activo"},
    contacts:{t:"Contactos",s:`${contacts.length} jugadores · ${contacts.filter(c=>c.category==="Lead").length} leads activos`},
    campaigns:{t:"Campañas",s:"Telegram · Sin templates · Sin aprobaciones"},
    analytics:{t:"Analítica & Predicciones",s:"IA · Revenue Forecast · Churn Score"},
    settings:{t:"Configuración",s:"IA · Leads · Voz del club"},
  };
  return (
    <>
      <style>{css}</style>
      <div className="app">
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
          {view==="dashboard"&&<DashboardView contacts={contacts} onNav={setView}/>}
          {view==="inbox"&&<InboxView/>}
          {view==="contacts"&&<ContactsView contacts={contacts} setContacts={setContacts}/>}
          {view==="campaigns"&&<CampaignsView/>}
          {view==="analytics"&&<AnalyticsView contacts={contacts}/>}
          {view==="settings"&&<SettingsView/>}
        </div>
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
