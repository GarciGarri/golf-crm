'use client'
import { useState, useEffect, useCallback } from "react";

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
.msg-in{align-self:flex-start}.msg-out{align-self:flex-end}.msg-bot{align-self:flex-start}
.bub{padding:8px 12px;border-radius:14px;font-size:13px;line-height:1.5;white-space:pre-wrap}
.msg-in .bub{background:white;color:var(--ink);border:1px solid var(--fog);border-bottom-left-radius:3px}
.msg-out .bub{background:var(--pine);color:white;border-bottom-right-radius:3px}
.msg-bot .bub{background:var(--fw);color:var(--ink);border:1px solid var(--dew);border-bottom-left-radius:3px}
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
.empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;color:var(--mist);gap:8px;text-align:center}
.shimmer{background:linear-gradient(90deg,var(--fog) 25%,var(--dew) 50%,var(--fog) 75%);background-size:200% 100%;animation:shimmer 1.2s infinite}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
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
.ai-pulse{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--sage)}
.ai-dot{width:5px;height:5px;border-radius:50%;background:var(--mint);animation:bounce .8s infinite}
.ai-dot:nth-child(2){animation-delay:.15s}.ai-dot:nth-child(3){animation-delay:.3s}
@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}
.pred-card{border-radius:var(--r);border:1px solid var(--fog);overflow:hidden;margin-bottom:8px;transition:all .18s}
.pred-card:hover{border-color:var(--dew);box-shadow:var(--sh)}
.pred-h{padding:10px 12px;display:flex;align-items:center;gap:10px}
.pred-score{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;flex-shrink:0}
.pred-score.high{background:#fdeaea;color:var(--alert)}.pred-score.med{background:#fff8e6;color:var(--gold)}.pred-score.low{background:#e8f7ea;color:var(--sage)}
.pred-action{margin:0 12px 10px;padding:8px;background:var(--fw);border-radius:8px;border-left:3px solid var(--mint)}
.rev-bar{height:8px;border-radius:4px;overflow:hidden;background:var(--fog);margin:4px 0}
.rev-fill{height:100%;border-radius:4px;transition:width 1s ease}
.funnel{display:flex;flex-direction:column;gap:4px}
.funnel-stage{border-radius:var(--rs);padding:8px 11px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;transition:all .15s}
.f-prospect{background:linear-gradient(90deg,#ede8ff,#f5f0ff);border:1px solid var(--leadb)}
.f-lead{background:linear-gradient(90deg,var(--leadl),#ede8ff);border:1px solid var(--leadb)}
.f-qualified{background:linear-gradient(90deg,#e8f0fc,var(--leadl));border:1px solid var(--leadb)}
.f-converted{background:linear-gradient(90deg,var(--fw),#e8f7ea);border:1px solid var(--dew)}
.f-name{font-size:12px;font-weight:600}
.f-count{font-size:11px;font-weight:700}
@keyframes fi{from{opacity:0}to{opacity:1}}
@keyframes su{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.pulse{animation:pulse 2s infinite}
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
function normalizeContact(c) {
  const name = c.name || 'Sin nombre';
  const initials = name.split(' ').map(n => n[0] || '').join('').slice(0, 2).toUpperCase() || '??';
  return {
    ...c,
    tg: c.telegram_username ? '@' + c.telegram_username : '',
    lang: c.language || 'ES',
    lastVisit: c.last_visit ? new Date(c.last_visit).toLocaleDateString('es') : '—',
    av: initials,
    clv: (c.visits || 0) * 85,
    status: c.segment === 'En Riesgo' ? 'at-risk' : c.segment === 'Lead' ? 'lead' : 'active',
    category: c.segment === 'Lead' ? 'Lead' : 'Cliente',
    tags: Array.isArray(c.tags) ? c.tags : [],
    messages: Array.isArray(c.messages) ? c.messages : [],
    email: c.email || '',
    phone: c.phone || '',
    notes: c.notes || '',
  };
}

function Av({ s = "?", size = 36, cat = "" }) {
  const lead = cat === "Lead";
  const cls = lead ? "av-l" : ["av-g", "av-go", "av-b", "av-r"][(s.charCodeAt(0) || 0) % 4];
  return <div className={`av ${cls}`} style={{ width: size, height: size, fontSize: size * .35 }}>{s}</div>;
}
function SD({ s }) { return <span className={`sd sd-${s || 'neutral'}`} />; }
function TB({ tag }) {
  const m = { "Alto Valor": "t-vip", "Riesgo Churn": "t-risk", "Torneo": "t-norm", "Madrugador": "t-norm", "Turista": "t-blue", "Nuevo": "t-blue", "Residente": "t-norm", "Pro": "t-vip" };
  return <span className={`tag ${m[tag] || "t-norm"}`}>{tag}</span>;
}
function AIPulse() {
  return <div className="ai-pulse"><div className="ai-dot" /><div className="ai-dot" /><div className="ai-dot" /><span style={{ marginLeft: 4 }}>IA analizando...</span></div>;
}
function Notif({ msg }) {
  if (!msg) return null;
  return <div className="notif">{msg}</div>;
}

// ─── AI COPILOT ───────────────────────────────────────────────────────────────
function AICopilot({ contacts, onNav }) {
  const [shown, setShown] = useState(true);
  const churn = contacts.filter(c => c.status === 'at-risk');
  const leads = contacts.filter(c => c.category === 'Lead');
  const totalClv = leads.reduce((s, l) => s + (l.visits * 85 || 250), 0);
  if (!shown) return (
    <button className="btn btn-p btn-sm" style={{ marginBottom: 13 }} onClick={() => setShown(true)}>✦ Abrir Copiloto IA</button>
  );
  return (
    <div className="ai-cop">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div className="ai-cop-title"><span>✦</span> Copiloto IA — Prioridades de hoy</div>
        <button style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,.4)", fontSize: 16 }} onClick={() => setShown(false)}>✕</button>
      </div>
      {churn.length > 0 && (
        <div className="ai-cop-row">
          <div className="ai-cop-ic r">⚠️</div>
          <div className="ai-cop-tx">
            <strong>{churn[0].name}</strong> en riesgo de abandono. Acción recomendada: ofrecer green fee gratuita.
            <div><button className="ai-cop-btn" onClick={() => onNav("inbox")}>→ Ir a bandeja</button></div>
          </div>
        </div>
      )}
      {leads.length > 0 && (
        <div className="ai-cop-row">
          <div className="ai-cop-ic l">🎯</div>
          <div className="ai-cop-tx">
            <strong>{leads.length} leads activos</strong> en nurturing. CLV potencial: <strong style={{ color: "#f0c060" }}>€{totalClv.toLocaleString()}</strong>.
            <div><button className="ai-cop-btn" onClick={() => onNav("contacts")}>→ Ver leads</button></div>
          </div>
        </div>
      )}
      <div className="ai-cop-row">
        <div className="ai-cop-ic g">📅</div>
        <div className="ai-cop-tx">
          <strong>Martes 9:30h</strong> es el mejor momento para enviar campañas. Apertura estimada: <strong style={{ color: "#6dbf82" }}>38%</strong>.
          <div><button className="ai-cop-btn" onClick={() => onNav("campaigns")}>→ Crear campaña</button></div>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardView({ contacts, onNav }) {
  const bars = [65, 48, 72, 55, 80, 92, 67, 74, 88, 61, 77, 84];
  const mx = Math.max(...bars);
  const mo = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const leads = contacts.filter(c => c.category === 'Lead').length;
  const atRisk = contacts.filter(c => c.status === 'at-risk');
  const totalVisits = contacts.reduce((s, c) => s + (c.visits || 0), 0);
  const unread = contacts.reduce((s, c) => s + (c.messages?.filter(m => m.direction === 'in' && !m.read).length || 0), 0);

  return (
    <div className="content">
      <AICopilot contacts={contacts} onNav={onNav} />
      <div className="ob">
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>¡Bienvenido, Club Valle Verde! 🌿</div>
        <div style={{ fontSize: 12, opacity: .8 }}>Copiloto IA activo · {contacts.length} contactos · {leads} leads en nurturing</div>
        <div className="ob-steps">
          {["Bot Telegram", "Contactos", "Campaña", "Chatbot IA", "¡Listo!"].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div className={`sdot ${i < 2 ? "done" : i === 2 ? "curr" : "pend"}`}>{i < 2 ? "✓" : i + 1}</div>
              <span style={{ fontSize: 10, color: "white", opacity: i < 3 ? 1 : .4 }}>{s}</span>
              {i < 4 && <span style={{ color: "rgba(255,255,255,.25)", fontSize: 11 }}>›</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="sg">
        {[
          { ic: "👥", v: String(contacts.length), l: "Contactos", ch: `${leads} leads activos`, d: "up", c: "g" },
          { ic: "💬", v: String(unread), l: "Sin leer", ch: "mensajes pendientes", d: unread > 0 ? "dn" : "up", c: "go" },
          { ic: "📅", v: String(totalVisits), l: "Visitas totales", ch: "acumulado CRM", d: "up", c: "b" },
          { ic: "🎯", v: String(leads), l: "Leads activos", ch: "en nurturing", d: "up", c: "l" },
        ].map((s, i) => (
          <div key={i} className={`sc ${s.c}`}>
            <div style={{ fontSize: 18 }}>{s.ic}</div>
            <div className="sv">{s.v}</div>
            <div className="sl">{s.l}</div>
            <div className={`sch ${s.d}`}>{s.d === "up" ? "↑" : "↓"} {s.ch}</div>
          </div>
        ))}
      </div>
      <div className="two-col" style={{ marginBottom: 11 }}>
        <div className="card">
          <div className="ch"><span className="ct">📈 Actividad — 2024</span></div>
          <div className="cb">
            <div className="cw">{bars.map((v, i) => <div key={i} className="cbar" style={{ height: `${(v / mx) * 95}px`, background: i === 11 ? "var(--sage)" : "var(--dew)", border: i === 11 ? "none" : "1px solid var(--mint)" }} />)}</div>
            <div className="clabs">{mo.map(m => <div key={m} className="clab">{m}</div>)}</div>
          </div>
        </div>
        <div className="card">
          <div className="ch"><span className="ct">🎯 Embudo de leads</span><button className="btn btn-g btn-sm" onClick={() => onNav("contacts")}>Ver →</button></div>
          <div className="cb">
            <div className="funnel">
              {[
                { l: "Lead activo", n: leads, cls: "f-lead", c: "var(--lead)" },
                { l: "Cliente Normal", n: contacts.filter(c => c.segment === 'Normal').length, cls: "f-qualified", c: "var(--info)" },
                { l: "Cliente VIP", n: contacts.filter(c => c.segment === 'VIP').length, cls: "f-converted", c: "var(--sage)" },
              ].map(f => (
                <div key={f.l} className={`funnel-stage ${f.cls}`}>
                  <span className="f-name" style={{ color: "var(--ink)" }}>{f.l}</span>
                  <span className="f-count" style={{ color: f.c }}>{f.n}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {atRisk.length > 0 && (
        <div className="card">
          <div className="ch"><span className="ct">📉 Riesgo churn</span><span className="tag t-risk">{atRisk.length}</span></div>
          <div className="cb">
            {atRisk.map((c, i) => (
              <div key={i} className="ci2">
                <Av s={c.av} size={32} />
                <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</div><div style={{ fontSize: 10, color: "#c04040", marginTop: 1 }}>Segmento: {c.segment} · {c.visits} visitas</div></div>
                <button className="btn btn-tg btn-sm" onClick={() => onNav("inbox")}>✈️</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── INBOX ────────────────────────────────────────────────────────────────────
function InboxView({ contacts, onRefresh }) {
  const [active, setActive] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [inp, setInp] = useState("");
  const [notif, setNotif] = useState(null);
  const [draft, setDraft] = useState("");
  const [draftLoading, setDraftLoading] = useState(false);
  const [tabK, setTabK] = useState("all");
  const isMob = typeof window !== "undefined" && window.innerWidth < 768;

  // Build conversation list from contacts
  const convs = contacts
    .filter(c => c.telegram_chat_id)
    .map(c => ({
      id: c.id,
      contact: c.name,
      av: c.av,
      telegram_chat_id: c.telegram_chat_id,
      last: c.messages?.slice(-1)[0]?.text || 'Sin mensajes',
      time: c.messages?.slice(-1)[0]?.created_at
        ? new Date(c.messages.slice(-1)[0].created_at).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
        : '—',
      unread: c.messages?.filter(m => m.direction === 'in' && !m.read).length || 0,
      sent: c.sentiment || 'neutral',
      status: 'open',
      segment: c.segment,
    }));

  const flt = tabK === "all" ? convs : convs.filter(c => tabK === "open" ? c.unread > 0 : c.unread === 0);
  const ac = convs.find(c => c.id === active);
  const activeContact = contacts.find(c => c.id === active);

  // Load & poll messages
  useEffect(() => {
    if (!active) return;
    const load = () => {
      fetch(`/api/messages?contact_id=${active}`)
        .then(r => r.json())
        .then(data => setMsgs(Array.isArray(data) ? data : []));
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [active]);

  // AI draft
  const generateDraft = useCallback(async () => {
    if (!activeContact) return;
    setDraftLoading(true);
    try {
      const res = await fetch('/api/ai/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: activeContact, messages: msgs }),
      });
      const { draft: d } = await res.json();
      setDraft(d || '');
    } catch (e) {
      setDraft('Hola, ¿en qué puedo ayudarte?');
    }
    setDraftLoading(false);
  }, [activeContact, msgs]);

  useEffect(() => {
    if (active && activeContact) {
      setDraft('');
      generateDraft();
    }
  }, [active]);

  const send = async () => {
    if (!inp.trim() || !ac) return;
    const text = inp;
    setInp('');
    await fetch('/api/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact_id: active, text, telegram_chat_id: ac.telegram_chat_id }),
    });
    setNotif('✓ Enviado por Telegram');
    setTimeout(() => setNotif(null), 2500);
    // Reload messages & contacts
    fetch(`/api/messages?contact_id=${active}`).then(r => r.json()).then(data => setMsgs(Array.isArray(data) ? data : []));
    onRefresh();
  };

  return (
    <div className="inbox-wrap">
      <div className={`inbox-list${active && isMob ? " hide" : ""}`}>
        <div style={{ padding: "8px 11px", borderBottom: "1px solid var(--fog)", background: "white", position: "sticky", top: 0, zIndex: 1 }}>
          <div className="tabs" style={{ marginBottom: 0 }}>
            {["all", "open", "resolved"].map(t => (
              <button key={t} className={`tab ${tabK === t ? "on" : ""}`} onClick={() => setTabK(t)}>
                {t === "all" ? "Todos" : t === "open" ? "Sin leer" : "Leídos"}
              </button>
            ))}
          </div>
        </div>
        {flt.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: 28 }}>✈️</div>
            <div style={{ fontSize: 12 }}>Sin conversaciones</div>
            <div style={{ fontSize: 11 }}>Los contactos aparecerán cuando escriban al bot</div>
          </div>
        )}
        {flt.map(c => (
          <div key={c.id} className={`ii ${active === c.id ? "on" : ""}`} onClick={() => setActive(c.id)}>
            <Av s={c.av} size={33} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
                <span className="ii-n">{c.contact}</span>
                <span className="ii-t">{c.time}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2, gap: 4 }}>
                <span className="ii-p">{c.last}</span>
                <div style={{ display: "flex", gap: 3, alignItems: "center", flexShrink: 0 }}>
                  <SD s={c.sent} />
                  {c.unread > 0 && <span className="uc">{c.unread}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="chat" style={{ display: active || !isMob ? "flex" : "none" }}>
        {ac ? (
          <>
            <div className="chat-head">
              {isMob && <button className="btn btn-g btn-sm" onClick={() => setActive(null)} style={{ padding: "3px 6px" }}>←</button>}
              <Av s={ac.av} size={34} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{ac.contact}</div>
                <div style={{ fontSize: 11, color: "var(--mist)", display: "flex", alignItems: "center", gap: 5, marginTop: 1 }}>
                  <span className="sd sd-positive pulse" /><span>Telegram</span>
                  <span style={{ color: "var(--fog)" }}>·</span>
                  <span>{ac.segment}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 5 }}>
                {ac.sent === "negative" && <span style={{ background: "#fdeaea", padding: "2px 7px", borderRadius: 20, fontSize: 10, color: "var(--alert)", fontWeight: 600 }}>⚠️ Neg.</span>}
                <button className="btn btn-s btn-sm">✓ Resolver</button>
              </div>
            </div>

            <div className="chat-msgs">
              {msgs.length === 0 && (
                <div className="empty-state"><div style={{ fontSize: 12 }}>Sin mensajes aún</div></div>
              )}
              {msgs.map((m, i) => (
                <div key={i} className={`msg msg-${m.direction === 'in' ? 'in' : m.direction === 'bot' ? 'bot' : 'out'}`}>
                  {m.direction === 'bot' && <div className="bot-tag">🤖 Bot</div>}
                  {m.agent_name && <div className="bot-tag">👤 {m.agent_name}</div>}
                  <div className="bub">{m.text}</div>
                  <div className="msg-meta" style={{ alignSelf: m.direction !== 'in' ? "flex-end" : "flex-start" }}>
                    {new Date(m.created_at).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>

            <div className="chat-in">
              <div className="ai-sug">
                <div style={{ flex: 1 }}>
                  <div className="ai-sug-lb">✦ Borrador IA · {draftLoading ? "Generando..." : "Personalizado"}</div>
                  <div style={{ fontSize: 12, color: "var(--ink)", lineHeight: 1.4 }}>
                    {draftLoading ? <AIPulse /> : (draft || "—")}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <button className="btn btn-p btn-sm" onClick={() => draft && setInp(draft)} disabled={!draft}>Usar →</button>
                  <button className="btn btn-s btn-sm" onClick={generateDraft} disabled={draftLoading}>🔄</button>
                </div>
              </div>
              <div className="chat-row">
                <textarea className="chat-ta" rows={2} placeholder="Escribe o /comando..."
                  value={inp} onChange={e => setInp(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())} />
                <button className="btn btn-p" onClick={send} style={{ height: 40, padding: "0 11px" }}>✈️</button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--mist)", gap: 8 }}>
            <div style={{ fontSize: 34 }}>✈️</div>
            <div style={{ fontSize: 13 }}>Selecciona una conversación</div>
            {convs.length === 0 && <div style={{ fontSize: 11, textAlign: "center", maxWidth: 200 }}>Los contactos aparecerán cuando escriban al bot de Telegram</div>}
          </div>
        )}
      </div>

      {ac && activeContact && (
        <div className="ai-panel">
          <div className="ap-t">✦ Contexto IA</div>
          <div className="ins"><div className="ins-lb">Perfil</div><div className="ins-tx">{ac.contact} · Hcp {activeContact.handicap || '—'} · {activeContact.segment} · {activeContact.visits || 0} visitas</div></div>
          <div className={`ins ${ac.sent === "negative" ? "w" : "i"}`}>
            <div className="ins-lb">Sentimiento</div>
            <div className="ins-tx">{ac.sent === "negative" ? "⚠️ Negativo" : ac.sent === "positive" ? "✅ Positivo" : "😐 Neutral"}</div>
          </div>
          <div className="ins i"><div className="ins-lb">Idioma</div><div className="ins-tx">{activeContact.language || 'ES'}</div></div>
          <div className="div" />
          <div className="ap-t">Tags</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {(activeContact.tags || []).map(t => <TB key={t} tag={t} />)}
            {activeContact.tags?.length === 0 && <span style={{ fontSize: 11, color: "var(--mist)" }}>Sin etiquetas</span>}
          </div>
        </div>
      )}

      <Notif msg={notif} />
    </div>
  );
}

// ─── CONTACTS ─────────────────────────────────────────────────────────────────
function ContactsView({ contacts, onRefresh }) {
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [notif, setNotif] = useState(null);
  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState("Todos");
  const [newForm, setNewForm] = useState({ name: '', telegram_username: '', handicap: '', language: 'ES', segment: 'Normal', tags: [], opted_in: true });

  const notify = msg => { setNotif(msg); setTimeout(() => setNotif(null), 2500); };

  const flt = contacts.filter(c => {
    const matchQ = c.name.toLowerCase().includes(q.toLowerCase()) || (c.tg || '').toLowerCase().includes(q.toLowerCase());
    const matchCat = catFilter === "Todos" || (catFilter === "Leads" && c.category === "Lead") || (catFilter === "Clientes" && c.category === "Cliente") || (catFilter === "VIP" && c.segment === "VIP") || (catFilter === "Riesgo" && c.status === "at-risk");
    return matchQ && matchCat;
  });

  const createContact = async () => {
    if (!newForm.name.trim()) return;
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newForm, handicap: parseInt(newForm.handicap) || null }),
    });
    if (res.ok) {
      notify('✓ Contacto creado');
      setModal(false);
      setNewForm({ name: '', telegram_username: '', handicap: '', language: 'ES', segment: 'Normal', tags: [], opted_in: true });
      onRefresh();
    } else {
      notify('Error al crear contacto');
    }
  };

  const saveEdit = async (form) => {
    const res = await fetch(`/api/contacts/${form.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        telegram_username: form.tg?.replace('@', '') || null,
        handicap: form.handicap || null,
        language: form.lang || 'ES',
        segment: form.segment || 'Normal',
        tags: form.tags || [],
        sentiment: form.sentiment || 'neutral',
      }),
    });
    if (res.ok) {
      notify('✓ Perfil actualizado');
      setEditModal(null);
      onRefresh();
    } else {
      notify('Error al guardar');
    }
  };

  const leads = contacts.filter(c => c.category === 'Lead').length;

  return (
    <div className="content">
      <div style={{ display: "flex", gap: 5, marginBottom: 11, flexWrap: "wrap" }}>
        {[["Todos", contacts.length, "var(--pine)"], ["Leads", leads, "var(--lead)"], ["Clientes", contacts.length - leads, "var(--sage)"], ["VIP", contacts.filter(c => c.segment === "VIP").length, "var(--gold)"], ["Riesgo", contacts.filter(c => c.status === "at-risk").length, "var(--alert)"]].map(([l, n, c]) => (
          <button key={l} onClick={() => setCatFilter(l)} style={{ padding: "5px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: `1px solid ${catFilter === l ? c : "var(--fog)"}`, background: catFilter === l ? c + "18" : "white", color: catFilter === l ? c : "var(--mist)", cursor: "pointer", transition: "all .15s" }}>{l} <span style={{ opacity: .7 }}>({n})</span></button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 5 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "white", border: "1px solid var(--fog)", borderRadius: "var(--rs)", padding: "5px 9px", maxWidth: 180 }}>
            <span>🔍</span>
            <input style={{ border: "none", background: "transparent", fontFamily: "var(--fn)", fontSize: 13, outline: "none", color: "var(--ink)", width: "100%" }} placeholder="Buscar..." value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <button className="btn btn-p btn-sm" onClick={() => setModal(true)}>+ Nuevo</button>
        </div>
      </div>

      {flt.length === 0 && (
        <div className="empty-state">
          <div style={{ fontSize: 32 }}>👥</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Sin contactos</div>
          <div style={{ fontSize: 12 }}>Los contactos aparecen automáticamente cuando usan el bot de Telegram, o puedes añadirlos manualmente.</div>
          <button className="btn btn-p" onClick={() => setModal(true)}>+ Añadir contacto</button>
        </div>
      )}

      <div className="cg">
        {flt.map(c => (
          <div key={c.id} className={`cc ${c.category === "Lead" ? "lead-card" : ""}`}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 8 }}>
              <Av s={c.av} size={38} cat={c.category} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                <div style={{ fontSize: 11, color: "var(--tg)", marginTop: 1 }}>{c.tg || c.email || <span style={{ color: "var(--mist)" }}>Sin Telegram</span>}</div>
              </div>
              <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                <SD s={c.sentiment} />
                <button className="btn btn-g btn-sm" style={{ padding: "3px 5px", fontSize: 12 }} onClick={() => setEditModal(c)} title="Editar">✏️</button>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 6 }}>
              {c.tags.map(t => <TB key={t} tag={t} />)}
              {c.category === "Lead" && <span className="tag t-lead">Lead</span>}
            </div>
            <div className="cst">
              <div><div className="csv">{c.handicap || '—'}</div><div className="csl">Hcp</div></div>
              <div><div className="csv">{c.visits || 0}</div><div className="csl">Visitas</div></div>
              <div><div className="csv">€{c.clv}</div><div className="csl">CLV est.</div></div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="ov" onClick={() => setModal(false)}>
          <div className="mo" onClick={e => e.stopPropagation()}>
            <div className="mo-h"><span className="mo-t">➕ Nuevo contacto</span><button className="btn btn-g btn-sm" onClick={() => setModal(false)}>✕</button></div>
            <div className="mo-b">
              <div className="two-col">
                <div className="fg"><label className="fl">Nombre *</label><input className="fi" value={newForm.name} onChange={e => setNewForm(p => ({ ...p, name: e.target.value }))} placeholder="Carlos Mendoza" /></div>
                <div className="fg"><label className="fl">Segmento</label>
                  <select className="fs" value={newForm.segment} onChange={e => setNewForm(p => ({ ...p, segment: e.target.value }))}>
                    <option>Lead</option><option>Normal</option><option>VIP</option><option>En Riesgo</option>
                  </select>
                </div>
              </div>
              <div className="two-col">
                <div className="fg"><label className="fl">Usuario Telegram</label><input className="fi" value={newForm.telegram_username} onChange={e => setNewForm(p => ({ ...p, telegram_username: e.target.value.replace('@', '') }))} placeholder="@usuario" /></div>
                <div className="fg"><label className="fl">Hándicap</label><input className="fi" type="number" value={newForm.handicap} onChange={e => setNewForm(p => ({ ...p, handicap: e.target.value }))} placeholder="18" /></div>
              </div>
              <div className="two-col">
                <div className="fg"><label className="fl">Idioma</label>
                  <select className="fs" value={newForm.language} onChange={e => setNewForm(p => ({ ...p, language: e.target.value }))}>
                    {["ES", "EN", "DE", "FR", "IT", "SV", "PT"].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div className="fg"><label className="fl">Etiquetas</label>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {["Alto Valor", "Torneo", "Turista", "Nuevo"].map(t => {
                      const on = newForm.tags.includes(t);
                      return <span key={t} className={`tag ${on ? "t-vip" : "t-norm"}`} style={{ cursor: "pointer", opacity: on ? 1 : .5 }} onClick={() => setNewForm(p => ({ ...p, tags: on ? p.tags.filter(x => x !== t) : [...p.tags, t] }))}>{t}</span>;
                    })}
                  </div>
                </div>
              </div>
              <div className="aib">
                <div className="aib-l">✦ Consentimiento RGPD</div>
                <label style={{ display: "flex", gap: 7, alignItems: "flex-start", cursor: "pointer", fontSize: 12 }}>
                  <input type="checkbox" checked={newForm.opted_in} onChange={e => setNewForm(p => ({ ...p, opted_in: e.target.checked }))} style={{ marginTop: 2 }} />
                  <span>El contacto ha dado consentimiento explícito para marketing por Telegram.</span>
                </label>
              </div>
            </div>
            <div className="mo-f">
              <button className="btn btn-s" onClick={() => setModal(false)}>Cancelar</button>
              <button className="btn btn-p" onClick={createContact}>✓ Guardar</button>
            </div>
          </div>
        </div>
      )}

      {editModal && <EditModal contact={editModal} onSave={saveEdit} onClose={() => setEditModal(null)} />}
      <Notif msg={notif} />
    </div>
  );
}

function EditModal({ contact, onSave, onClose }) {
  const [form, setForm] = useState({ ...contact });
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div className="ov" onClick={onClose}>
      <div className="mo" onClick={e => e.stopPropagation()}>
        <div className="mo-h">
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}><Av s={contact.av} size={34} cat={contact.category} /><div className="mo-t">Editar — {contact.name}</div></div>
          <button className="btn btn-g btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="mo-b">
          <div className="two-col">
            <div className="fg"><label className="fl">Nombre</label><input className="fi" value={form.name} onChange={e => f("name", e.target.value)} /></div>
            <div className="fg"><label className="fl">Telegram</label><input className="fi" value={form.tg || ''} onChange={e => f("tg", e.target.value)} placeholder="@usuario" /></div>
          </div>
          <div className="two-col">
            <div className="fg"><label className="fl">Hándicap</label><input className="fi" type="number" value={form.handicap || ''} onChange={e => f("handicap", parseInt(e.target.value) || 0)} /></div>
            <div className="fg"><label className="fl">Idioma</label>
              <select className="fs" value={form.lang} onChange={e => f("lang", e.target.value)}>
                {["ES", "EN", "DE", "FR", "IT", "SV", "PT"].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div className="fg"><label className="fl">Segmento</label>
            <select className="fs" value={form.segment} onChange={e => f("segment", e.target.value)}>
              <option>Lead</option><option>Normal</option><option>VIP</option><option>En Riesgo</option>
            </select>
          </div>
          <div className="fg">
            <label className="fl">Sentimiento</label>
            <select className="fs" value={form.sentiment || 'neutral'} onChange={e => f("sentiment", e.target.value)}>
              <option value="positive">✅ Positivo</option>
              <option value="neutral">😐 Neutral</option>
              <option value="negative">⚠️ Negativo</option>
            </select>
          </div>
          <div className="fg">
            <label className="fl">Etiquetas</label>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {["Alto Valor", "Torneo", "Residente", "Turista", "Madrugador", "Pro", "Riesgo Churn", "Nuevo"].map(t => {
                const on = (form.tags || []).includes(t);
                return <span key={t} className={`tag ${on ? "t-vip" : "t-norm"}`} style={{ cursor: "pointer", opacity: on ? 1 : .5 }} onClick={() => f("tags", on ? form.tags.filter(x => x !== t) : [...(form.tags || []), t])}>{t}</span>;
              })}
            </div>
          </div>
        </div>
        <div className="mo-f">
          <button className="btn btn-s" onClick={onClose}>Cancelar</button>
          <button className="btn btn-p" onClick={() => onSave(form)}>✓ Guardar</button>
        </div>
      </div>
    </div>
  );
}

// ─── CAMPAIGNS ────────────────────────────────────────────────────────────────
function CampaignsView({ contacts }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [step, setStep] = useState(1);
  const [notif, setNotif] = useState(null);
  const [draft, setDraft] = useState("");
  const [gen, setGen] = useState(false);
  const [form, setForm] = useState({ name: '', message: '', segment: 'Todos', scheduled_at: '' });

  const notify = msg => { setNotif(msg); setTimeout(() => setNotif(null), 3000); };

  const loadCampaigns = () => {
    fetch('/api/campaigns').then(r => r.json()).then(data => {
      setCampaigns(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  };

  useEffect(() => { loadCampaigns(); }, []);

  const generateDraft = async () => {
    setGen(true);
    const segmentContacts = form.segment === 'Todos' ? contacts : contacts.filter(c => c.segment === form.segment);
    const sampleContact = segmentContacts[0];
    try {
      const res = await fetch('/api/ai/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: sampleContact || { name: '{{nombre}}', language: 'ES', segment: form.segment },
          messages: [],
          context: `Campaña: ${form.name}. Segmento: ${form.segment}. Escribe un mensaje de marketing corto para Telegram.`
        }),
      });
      const { draft: d } = await res.json();
      setDraft(d || '');
      setForm(p => ({ ...p, message: d || '' }));
    } catch {
      setDraft('¡Hola, {{nombre}}! Te esperamos este fin de semana en Valle Verde ⛳ /menu');
      setForm(p => ({ ...p, message: '¡Hola, {{nombre}}! Te esperamos este fin de semana en Valle Verde ⛳ /menu' }));
    }
    setGen(false);
  };

  const createCampaign = async () => {
    if (!form.name || !form.message) { notify('Rellena nombre y mensaje'); return; }
    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      notify('✓ Campaña creada como borrador');
      setModal(false);
      setStep(1);
      setForm({ name: '', message: '', segment: 'Todos', scheduled_at: '' });
      setDraft('');
      loadCampaigns();
    }
  };

  const sendCampaign = async (id, name) => {
    notify(`⏳ Enviando "${name}"...`);
    const res = await fetch(`/api/campaigns/${id}/send`, { method: 'POST' });
    const data = await res.json();
    if (data.ok) {
      notify(`✓ Enviado a ${data.sent} contactos`);
      loadCampaigns();
    } else {
      notify(data.error || 'Error al enviar');
    }
  };

  const optedInCount = contacts.filter(c => c.opted_in && c.telegram_chat_id).length;

  return (
    <div className="content">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
        <span style={{ fontSize: 12, color: "var(--mist)" }}>{campaigns.length} campañas · {optedInCount} contactos con Telegram activo</span>
        <button className="btn btn-p btn-sm" onClick={() => setModal(true)}>📣 Nueva campaña</button>
      </div>

      {loading && <div className="shimmer" style={{ height: 80, borderRadius: "var(--r)", marginBottom: 9 }} />}

      {!loading && campaigns.length === 0 && (
        <div className="empty-state">
          <div style={{ fontSize: 32 }}>📣</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Sin campañas aún</div>
          <div style={{ fontSize: 12 }}>Crea tu primera campaña de Telegram</div>
          <button className="btn btn-p" onClick={() => setModal(true)}>📣 Nueva campaña</button>
        </div>
      )}

      {campaigns.map(c => (
        <div key={c.id} className="ci">
          <div className="ci-h">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
              <div style={{ fontSize: 11, color: "var(--mist)", marginTop: 2 }}>👥 {c.segment || 'Todos'} · 📅 {c.created_at ? new Date(c.created_at).toLocaleDateString('es') : '—'}</div>
            </div>
            <span className={`cs cs-${c.status}`}>{c.status === 'sent' ? '✓ Enviada' : c.status === 'sending' ? '⏳ Enviando...' : '✏️ Borrador'}</span>
            {c.status === 'draft' && (
              <button className="btn btn-p btn-sm" onClick={() => sendCampaign(c.id, c.name)}>🚀 Lanzar</button>
            )}
          </div>
          <div className="cm">
            {[{ l: "Enviados", v: c.sent_count || 0, m: 100 }, { l: "Respuestas", v: c.reply_count || 0, m: c.sent_count || 1 }].map(m => (
              <div key={m.l}><div className="cmv">{m.v}</div><div className="cml">{m.l}</div><div className="cmbar"><div className="cmf" style={{ width: `${Math.min(Math.round((m.v / m.m) * 100), 100)}%` }} /></div></div>
            ))}
          </div>
          {c.message && (
            <div style={{ padding: "8px 13px", background: "var(--fw)", borderTop: "1px solid var(--fog)", fontSize: 11, color: "var(--ink)", lineHeight: 1.5, fontStyle: "italic" }}>
              "{c.message.slice(0, 120)}{c.message.length > 120 ? '...' : ''}"
            </div>
          )}
        </div>
      ))}

      {modal && (
        <div className="ov" onClick={() => setModal(false)}>
          <div className="mo" style={{ maxWidth: 530 }} onClick={e => e.stopPropagation()}>
            <div className="mo-h">
              <span className="mo-t">📣 Nueva campaña Telegram</span>
              <div style={{ display: "flex", gap: 7 }}>
                <span style={{ fontSize: 11, color: "var(--mist)" }}>Paso {step}/3</span>
                <button className="btn btn-g btn-sm" onClick={() => { setModal(false); setStep(1); }}>✕</button>
              </div>
            </div>
            <div className="mo-b">
              <div style={{ display: "flex", gap: 5, marginBottom: 17, alignItems: "center" }}>
                {["Segmento", "Mensaje", "Programar"].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, background: i + 1 === step ? "var(--pine)" : i + 1 < step ? "var(--mint)" : "var(--fog)", color: i + 1 <= step ? "white" : "var(--mist)" }}>{i + 1 < step ? "✓" : i + 1}</div>
                    <span style={{ fontSize: 11, color: i + 1 === step ? "var(--pine)" : "var(--mist)", fontWeight: i + 1 === step ? 600 : 400 }}>{s}</span>
                    {i < 2 && <span style={{ color: "var(--fog)" }}>›</span>}
                  </div>
                ))}
              </div>

              {step === 1 && <>
                <div className="fg"><label className="fl">Nombre de la campaña</label><input className="fi" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Oferta Fin de Semana" /></div>
                <div className="fg"><label className="fl">Segmento</label>
                  <select className="fs" value={form.segment} onChange={e => setForm(p => ({ ...p, segment: e.target.value }))}>
                    <option value="Todos">Todos ({contacts.filter(c => c.opted_in && c.telegram_chat_id).length} contactos)</option>
                    <option value="VIP">VIP ({contacts.filter(c => c.segment === 'VIP' && c.opted_in && c.telegram_chat_id).length})</option>
                    <option value="Normal">Normal ({contacts.filter(c => c.segment === 'Normal' && c.opted_in && c.telegram_chat_id).length})</option>
                    <option value="Lead">Leads ({contacts.filter(c => c.segment === 'Lead' && c.opted_in && c.telegram_chat_id).length})</option>
                    <option value="En Riesgo">En Riesgo ({contacts.filter(c => c.segment === 'En Riesgo' && c.opted_in && c.telegram_chat_id).length})</option>
                  </select>
                </div>
                <div className="aib" style={{ margin: 0 }}>
                  <div className="aib-l">ℹ️ Solo se enviará a contactos con Telegram activo y consentimiento</div>
                  <div className="aib-t">{optedInCount} contactos elegibles actualmente.</div>
                </div>
              </>}

              {step === 2 && <>
                <div className="aib">
                  <div className="aib-l">✦ Telegram — Sin templates ni aprobaciones</div>
                  <div className="aib-t">Usa {"{{nombre}}"} para personalizar. El bot enviará en nombre del club.</div>
                </div>
                <div className="fg">
                  <label className="fl">Mensaje</label>
                  <button className="btn btn-s btn-sm" onClick={generateDraft} disabled={gen} style={{ marginBottom: 7 }}>{gen ? "✦ Generando..." : "✦ Generar con IA"}</button>
                  <textarea className="fta" rows={5} placeholder="¡Hola, {{nombre}}! ..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
                </div>
              </>}

              {step === 3 && <>
                <div className="two-col">
                  <div className="fg"><label className="fl">Fecha (opcional)</label><input className="fi" type="date" value={form.scheduled_at} onChange={e => setForm(p => ({ ...p, scheduled_at: e.target.value }))} /></div>
                </div>
                <div className="aib">
                  <div className="aib-l">✦ Resumen</div>
                  <div className="aib-t"><strong>{form.name}</strong> → {form.segment} · {optedInCount} destinatarios potenciales</div>
                </div>
              </>}
            </div>
            <div className="mo-f">
              {step > 1 && <button className="btn btn-s" onClick={() => setStep(s => s - 1)}>← Anterior</button>}
              <button className="btn btn-g" onClick={() => { setModal(false); setStep(1); }}>Cancelar</button>
              {step < 3
                ? <button className="btn btn-p" onClick={() => setStep(s => s + 1)}>Siguiente →</button>
                : <button className="btn btn-gold" onClick={createCampaign}>💾 Guardar borrador</button>
              }
            </div>
          </div>
        </div>
      )}

      <Notif msg={notif} />
    </div>
  );
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
function AnalyticsView({ contacts }) {
  const leads = contacts.filter(c => c.category === 'Lead');
  const vip = contacts.filter(c => c.segment === 'VIP');
  const atRisk = contacts.filter(c => c.status === 'at-risk');
  const totalVisits = contacts.reduce((s, c) => s + (c.visits || 0), 0);
  const totalClv = contacts.reduce((s, c) => s + (c.clv || 0), 0);
  const totalMsgs = contacts.reduce((s, c) => s + (c.messages?.length || 0), 0);

  return (
    <div className="content">
      <div className="sg" style={{ marginBottom: 11 }}>
        {[
          { ic: "👥", v: String(contacts.length), l: "Contactos totales", s: `${leads.length} leads · ${vip.length} VIP`, c: "g" },
          { ic: "💬", v: String(totalMsgs), l: "Mensajes totales", s: "via Telegram", c: "go" },
          { ic: "📅", v: String(totalVisits), l: "Visitas registradas", s: "acumulado", c: "b" },
          { ic: "💰", v: `€${totalClv.toLocaleString()}`, l: "CLV estimado", s: "total cartera", c: "l" },
        ].map((s, i) => (
          <div key={i} className={`sc ${s.c}`}><div style={{ fontSize: 18 }}>{s.ic}</div><div className="sv">{s.v}</div><div className="sl">{s.l}</div><div className="sch up">{s.s}</div></div>
        ))}
      </div>

      <div className="two-col" style={{ marginBottom: 11 }}>
        <div className="card">
          <div className="ch"><span className="ct">🎯 Distribución por segmento</span></div>
          <div className="cb">
            {[
              { l: "Lead", n: leads.length, c: "var(--lead)" },
              { l: "Normal", n: contacts.filter(c => c.segment === 'Normal').length, c: "var(--mint)" },
              { l: "VIP", n: vip.length, c: "var(--gold)" },
              { l: "En Riesgo", n: atRisk.length, c: "var(--alert)" },
            ].map(s => (
              <div key={s.l} className="pr">
                <span style={{ fontSize: 11, color: "var(--mist)", width: 80, flexShrink: 0 }}>{s.l} ({s.n})</span>
                <div className="pb"><div className="pf" style={{ width: `${contacts.length ? Math.round((s.n / contacts.length) * 100) : 0}%`, background: s.c }} /></div>
                <span className="pv">{contacts.length ? Math.round((s.n / contacts.length) * 100) : 0}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="ch"><span className="ct">🌍 Por idioma</span></div>
          <div className="cb">
            {Object.entries(
              contacts.reduce((acc, c) => { const l = c.lang || 'ES'; acc[l] = (acc[l] || 0) + 1; return acc; }, {})
            ).sort((a, b) => b[1] - a[1]).map(([lang, n]) => (
              <div key={lang} className="pr">
                <span style={{ fontSize: 11, color: "var(--mist)", width: 50, flexShrink: 0 }}>{lang} ({n})</span>
                <div className="pb"><div className="pf" style={{ width: `${contacts.length ? Math.round((n / contacts.length) * 100) : 0}%`, background: "var(--info)" }} /></div>
                <span className="pv">{contacts.length ? Math.round((n / contacts.length) * 100) : 0}%</span>
              </div>
            ))}
            {contacts.length === 0 && <div className="empty-state" style={{ padding: 20 }}><div style={{ fontSize: 11 }}>Sin datos aún</div></div>}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="ch"><span className="ct">✦ Predicciones IA</span><AIPulse /></div>
        <div className="cb">
          {atRisk.length === 0 && leads.length === 0 && (
            <div className="empty-state" style={{ padding: 20 }}>
              <div style={{ fontSize: 12 }}>Añade más contactos para ver predicciones IA</div>
            </div>
          )}
          <div className="two-col">
            {atRisk.slice(0, 2).map(c => (
              <div key={c.id} className="pred-card">
                <div className="pred-h">
                  <div className="pred-score high">92</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: "var(--mist)" }}>Riesgo abandono — {c.visits || 0} visitas</div>
                  </div>
                </div>
                <div className="pred-action"><span style={{ fontSize: 10, fontWeight: 700, color: "var(--sage)" }}>✦ IA: </span><span style={{ fontSize: 11 }}>Ofrecer green fee gratuita como retención.</span></div>
              </div>
            ))}
            {leads.slice(0, 2).map(c => (
              <div key={c.id} className="pred-card">
                <div className="pred-h">
                  <div className="pred-score low">65</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: "var(--mist)" }}>Lead — potencial €{c.clv + 500}</div>
                  </div>
                </div>
                <div className="pred-action"><span style={{ fontSize: 10, fontWeight: 700, color: "var(--sage)" }}>✦ IA: </span><span style={{ fontSize: 11 }}>Activar secuencia nurturing personalizada.</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function SettingsView() {
  const [tab, setTab] = useState("chatbot");
  const [notif, setNotif] = useState(null);
  const save = () => { setNotif("✓ Guardado"); setTimeout(() => setNotif(null), 2000); };
  return (
    <div className="content">
      <div className="sl-wrap">
        <div className="snav">
          <div className="snav-inner">
            {[["chatbot", "🤖", "Chatbot"], ["leads", "🎯", "Leads"], ["frecuencia", "⏰", "Frecuencia"], ["rgpd", "🔒", "RGPD"]].map(([id, ic, l]) => (
              <button key={id} className={`snb ${tab === id ? "on" : ""}`} onClick={() => setTab(id)}><span style={{ fontSize: 15 }}>{ic}</span>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {tab === "chatbot" && (
            <div className="card">
              <div className="ch"><span className="ct">🤖 Chatbot IA</span></div>
              <div className="cb">
                <div className="fg"><label className="fl">Nombre del asistente</label><input className="fi" defaultValue="Bot — Golf Valle Verde" /></div>
                <div className="aib">
                  <div className="aib-l">✦ Capacidades activas</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 4 }}>
                    {["Detección de idioma", "Análisis de sentimiento", "Borradores IA personalizados", "Respuesta a /tarifas", "Guardado automático contactos", "Escalado a humano"].map(f => (
                      <label key={f} style={{ display: "flex", gap: 6, fontSize: 12, cursor: "pointer" }}><input type="checkbox" defaultChecked />{f}</label>
                    ))}
                  </div>
                </div>
                <button className="btn btn-p" onClick={save}>✓ Guardar</button>
              </div>
            </div>
          )}
          {tab === "leads" && (
            <div className="card">
              <div className="ch"><span className="ct">🎯 Leads & Nurturing</span></div>
              <div className="cb">
                <div className="fg"><label className="fl">Días hasta lead frío</label><input className="fi" type="number" defaultValue="14" style={{ maxWidth: 80 }} /></div>
                <div className="fg"><label className="fl">Puntuación mínima lead caliente</label><input className="fi" type="number" defaultValue="65" style={{ maxWidth: 80 }} /></div>
                <button className="btn btn-p" onClick={save}>✓ Guardar</button>
              </div>
            </div>
          )}
          {tab === "frecuencia" && (
            <div className="card">
              <div className="ch"><span className="ct">⏰ Frecuencia y silencio</span></div>
              <div className="cb">
                <div className="two-col">
                  <div className="fg"><label className="fl">Silencio desde</label><input className="fi" type="time" defaultValue="21:00" /></div>
                  <div className="fg"><label className="fl">Silencio hasta</label><input className="fi" type="time" defaultValue="09:00" /></div>
                </div>
                <div className="fg"><label className="fl">Máx. mensajes / contacto / semana</label><select className="fs"><option>1</option><option>2</option><option>3</option></select></div>
                <button className="btn btn-p" onClick={save}>✓ Guardar</button>
              </div>
            </div>
          )}
          {tab === "rgpd" && (
            <div className="card">
              <div className="ch"><span className="ct">🔒 RGPD y Privacidad</span></div>
              <div className="cb">
                {[["Consentimiento explícito", "Registrado con opted_in + fecha"], ["/stop activo", "Opt-out inmediato desde Telegram"], ["Retención 24 meses", "Anonimización automática"], ["PII protegido", "Datos personales no se envían a IA"]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", gap: 9, padding: "9px 0", borderBottom: "1px solid var(--fog)" }}>
                    <span>✅</span><div><div style={{ fontSize: 13, fontWeight: 600 }}>{k}</div><div style={{ fontSize: 11, color: "var(--mist)", marginTop: 2 }}>{v}</div></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Notif msg={notif} />
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function GolfCRM() {
  const [view, setView] = useState("dashboard");
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadContacts = useCallback(() => {
    return fetch('/api/contacts')
      .then(r => r.json())
      .then(data => {
        setContacts((Array.isArray(data) ? data : []).map(normalizeContact));
      })
      .catch(() => setContacts([]));
  }, []);

  useEffect(() => {
    loadContacts().finally(() => setLoading(false));
    // Poll every 30s
    const interval = setInterval(loadContacts, 30000);
    return () => clearInterval(interval);
  }, [loadContacts]);

  const navItems = [
    { id: "dashboard", ic: "📊", l: "Dashboard" },
    { id: "inbox", ic: "💬", l: "Bandeja", badge: contacts.reduce((s, c) => s + (c.messages?.filter(m => m.direction === 'in' && !m.read).length || 0), 0) },
    { id: "contacts", ic: "👥", l: "Contactos" },
    { id: "campaigns", ic: "📣", l: "Campañas" },
    { id: "analytics", ic: "📈", l: "Analítica" },
    { id: "settings", ic: "⚙️", l: "Ajustes" },
  ];

  const titles = {
    dashboard: { t: "Dashboard · Copiloto IA", s: `Club Golf Valle Verde · ${contacts.length} contactos` },
    inbox: { t: "Bandeja Telegram", s: `${contacts.filter(c => c.telegram_chat_id).length} conversaciones · Bot activo` },
    contacts: { t: "Contactos", s: `${contacts.length} registros · ${contacts.filter(c => c.category === 'Lead').length} leads activos` },
    campaigns: { t: "Campañas", s: "Telegram · Sin templates · Sin aprobaciones" },
    analytics: { t: "Analítica & Predicciones", s: "Datos reales · IA · Revenue Forecast" },
    settings: { t: "Configuración", s: "Chatbot · Leads · RGPD" },
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="sb">
          <div className="logo" onClick={() => setView("dashboard")}>⛳</div>
          {navItems.map(n => (
            <button key={n.id} className={`nb ${view === n.id ? "on" : ""}`} onClick={() => setView(n.id)} title={n.l}>
              {n.ic}
              {n.badge > 0 && view !== n.id && <span className="nbb">{n.badge}</span>}
            </button>
          ))}
          <div className="sbb"><div className="uav">LM</div></div>
        </div>
        <div className="main">
          <div className="topbar">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="tb-t">{titles[view]?.t}</div>
              <div className="tb-s">{loading ? "Cargando datos..." : titles[view]?.s}</div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <button className="btn btn-s btn-sm" onClick={loadContacts} title="Actualizar">🔄</button>
            </div>
          </div>
          {loading ? (
            <div className="content">
              {[1, 2, 3].map(i => <div key={i} className="shimmer" style={{ height: 80, borderRadius: "var(--r)", marginBottom: 9 }} />)}
            </div>
          ) : (
            <>
              {view === "dashboard" && <DashboardView contacts={contacts} onNav={setView} />}
              {view === "inbox" && <InboxView contacts={contacts} onRefresh={loadContacts} />}
              {view === "contacts" && <ContactsView contacts={contacts} onRefresh={loadContacts} />}
              {view === "campaigns" && <CampaignsView contacts={contacts} />}
              {view === "analytics" && <AnalyticsView contacts={contacts} />}
              {view === "settings" && <SettingsView />}
            </>
          )}
        </div>
        <nav className="bnav">
          {navItems.map(n => (
            <button key={n.id} className={`bnb ${view === n.id ? "on" : ""}`} onClick={() => setView(n.id)}>
              {n.badge > 0 && view !== n.id && <span className="bnbb">{n.badge}</span>}
              <span className="bnb-ic">{n.ic}</span>
              <span className="bnb-lb">{n.l}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
