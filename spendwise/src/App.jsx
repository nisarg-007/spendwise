import { useState, useEffect } from 'react';
import {
  useAuth,
  useAccounts,
  useTransactions,
  useBudgets,
  useSavingsGoals,
  useSubscriptions,
  useWidgetConfig,
} from './hooks/useSpendWise';

// ─── GOOGLE FONTS + GLOBAL CSS ────────────────────────────────────────────────
const G = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
:root{
  --bg:#09090B;
  --s1:#18181B;
  --s2:#09090B;
  --s3:#27272A;
  --s4:#3F3F46;
  --border:rgba(255,255,255,0.06);
  --border2:rgba(255,255,255,0.12);
  --text:#FAFAFA;
  --t2:#A1A1AA;
  --t3:#52525B;
  --indigo:#E4E4E7;
  --violet:#D4D4D8;
  --cyan:#A1A1AA;
  --green:#10B981;
  --red:#EF4444;
  --amber:#F59E0B;
  --pink:#EC4899;
  --sky:#0EA5E9;
  --lime:#84CC16;
  --orange:#F97316;
  --font:'Plus Jakarta Sans',sans-serif;--mono:'JetBrains Mono',monospace;
  --r28:28px;--r20:20px;--r14:14px;--r8:8px;
}
body{background:var(--bg);font-family:var(--font);color:var(--text);overflow:hidden;}

/* ── LAYOUT ── */
.app-wrapper {
  min-height: 100vh; height: 100dvh; display: flex; align-items: center; justify-content: center;
  background: #09090B;
  padding: 16px;
}

.phone{
  width:393px;height:852px;
  background: #09090B;
  border-radius:40px;overflow:hidden;
  position:relative;display:flex;flex-direction:column;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 30px 100px rgba(0,0,0,0.8);
}
.island{
  position:absolute;top:14px;left:50%;transform:translateX(-50%);
  height:37px;background:#000;border-radius:22px;z-index:50;
  cursor:pointer;overflow:hidden;
  transition: width 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
              height 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
              border-radius 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
              top 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.6s ease;
  display:flex;align-items:center;justify-content:center;
}
.island.compact{width:126px;height:37px;border-radius:22px;}
.island.expanded{width:340px;height:170px;border-radius:28px;top:10px;}
.island-inner{
  display:flex;align-items:center;justify-content:space-between;
  width:100%;height:100%;padding:0 14px;gap:6px;
  transition:opacity 0.2s ease;
}
.island.expanded .island-inner{
  flex-direction:column;align-items:stretch;justify-content:flex-start;
  padding:14px 16px 12px;gap:0;
}
.island-compact-left{display:flex;align-items:center;gap:6px;}
.island-compact-right{display:flex;align-items:center;gap:4px;}
.island-dot{
  width:7px;height:7px;border-radius:50%;
  animation:islandPulse 2s ease-in-out infinite;
  flex-shrink:0;
}
@keyframes islandPulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(0.7);}}
.island-ticker{
  font-size:10px;font-weight:700;font-family:var(--mono);
  color:rgba(255,255,255,0.85);letter-spacing:-0.3px;
  white-space:nowrap;overflow:hidden;
}
.island-cam{
  width:11px;height:11px;border-radius:50%;
  background:radial-gradient(circle at 35% 35%, #1a1a3e, #000);
  border:1.5px solid #1a1a2e;
  flex-shrink:0;
}
/* Expanded sections */
.island-exp-header{
  display:flex;justify-content:space-between;align-items:center;
  margin-bottom:10px;
}
.island-exp-title{
  font-size:11px;font-weight:800;color:rgba(255,255,255,0.5);
  letter-spacing:1px;text-transform:uppercase;
}
.island-exp-close{
  font-size:10px;color:rgba(255,255,255,0.3);font-weight:600;
}
.island-exp-main{
  display:flex;align-items:center;gap:14px;margin-bottom:12px;
}
.island-exp-amount{
  font-size:28px;font-weight:900;font-family:var(--mono);
  color:#fff;letter-spacing:-1.5px;line-height:1;
}
.island-exp-badge{
  padding:3px 8px;border-radius:100px;font-size:9px;font-weight:800;
  display:inline-flex;align-items:center;gap:3px;
}
.island-exp-row{
  display:flex;justify-content:space-between;align-items:center;
  padding:5px 0;
}
.island-exp-label{
  font-size:10px;color:rgba(255,255,255,0.45);font-weight:600;
}
.island-exp-value{
  font-size:11px;font-weight:800;font-family:var(--mono);color:#fff;
}
.island-progress-track{
  width:100%;height:3px;background:rgba(255,255,255,0.08);
  border-radius:100px;overflow:hidden;margin-top:8px;
}
.island-progress-fill{
  height:100%;border-radius:100px;
  transition:width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.sbar{height:54px;display:flex;align-items:flex-end;padding:0 26px 10px;justify-content:space-between;flex-shrink:0;z-index:10;position:relative;}
.sbar-t{font-size:15px;font-weight:700;letter-spacing:-.3px;color:var(--text);}
.sbar-ic{display:flex;gap:4px;align-items:center;font-size:12px;color:var(--t2);}
.scr{flex:1;overflow-y:auto;overflow-x:hidden;scrollbar-width:none;}
.scr::-webkit-scrollbar{display:none;}

/* ── NAV ── */
.bnav{
  height:82px;
  background: #18181B;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display:flex;align-items:flex-start;padding-top:10px;flex-shrink:0;z-index:20;position:relative;
}
.ni{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;padding-top:2px;}
.ni-ic{width:30px;height:30px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;transition:all .2s;}
.ni.active .ni-ic{background:rgba(255, 255, 255, 0.06);}
.ni-lb{font-size:9px;font-weight:700;color:var(--t3);letter-spacing:.4px;transition:color .2s;text-transform:uppercase;}
.ni.active .ni-lb{color:var(--text);}

/* ── MOBILE RESPONSIVE TWEAKS ── */
@media (max-width: 480px) {
  .app-wrapper { padding: 0; background: var(--bg); }
  .phone { width: 100vw; height: 100dvh; border-radius: 0; box-shadow: none; border:none; }
  .island, .sbar { display: none !important; }
  .scr { padding-top: 0; }
  .bnav { padding-bottom: max(32px, calc(env(safe-area-inset-bottom) + 12px)); height: auto; padding-top: 10px; }
  .fab { bottom: max(106px, calc(92px + env(safe-area-inset-bottom))); }
  .di-glow { display: block !important; }
}

/* ── DYNAMIC ISLAND AMBIENT GLOW (mobile PWA only) ── */
.di-glow {
  display: none;
  position: sticky;
  top: 0;
  z-index: 40;
  width: 100%;
  pointer-events: none;
  background: linear-gradient(to bottom, var(--bg) 60%, transparent 100%);
  padding-bottom: 20px;
  margin-bottom: -20px;
}
.di-glow-bg {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  height: 80px;
  border-radius: 0 0 110px 110px;
  opacity: 0.45;
  animation: diGlowBreathe 4s ease-in-out infinite;
  filter: blur(28px);
  pointer-events: none;
}
@keyframes diGlowBreathe {
  0%, 100% { opacity: 0.3; transform: translateX(-50%) scale(1); }
  50% { opacity: 0.55; transform: translateX(-50%) scale(1.08); }
}
.di-glow-ring {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 140px;
  height: 42px;
  border-radius: 0 0 70px 70px;
  opacity: 0.22;
  filter: blur(8px);
  animation: diRingPulse 3s ease-in-out infinite 0.5s;
  pointer-events: none;
}
@keyframes diRingPulse {
  0%, 100% { opacity: 0.15; transform: translateX(-50%) scaleY(1); }
  50% { opacity: 0.3; transform: translateX(-50%) scaleY(1.3); }
}
.di-status-bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: calc(env(safe-area-inset-top, 47px) - 10px) 24px 8px;
  pointer-events: auto;
}
.di-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  animation: islandPulse 2s ease-in-out infinite;
  flex-shrink: 0;
}
.di-status-text {
  font-size: 11px;
  font-weight: 700;
  font-family: var(--mono);
  color: var(--text);
  opacity: 0.5;
  letter-spacing: -0.3px;
}
.di-status-divider {
  width: 1px;
  height: 10px;
  background: var(--border2);
  opacity: 0.4;
}
.di-particles {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 80px;
  pointer-events: none;
}
.di-particle {
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  opacity: 0;
  animation: diFloat 6s ease-in-out infinite;
}
.di-particle:nth-child(1) { left: 32%; top: 48px; animation-delay: 0s; }
.di-particle:nth-child(2) { left: 68%; top: 44px; animation-delay: 1.2s; }
.di-particle:nth-child(3) { left: 46%; top: 46px; animation-delay: 2.4s; }
.di-particle:nth-child(4) { left: 58%; top: 50px; animation-delay: 3.6s; }
.di-particle:nth-child(5) { left: 38%; top: 45px; animation-delay: 4.8s; }
@keyframes diFloat {
  0% { opacity: 0; transform: translateY(0) scale(0.5); }
  15% { opacity: 0.75; transform: translateY(-12px) scale(1); }
  50% { opacity: 0.35; transform: translateY(-28px) scale(0.8); }
  100% { opacity: 0; transform: translateY(-46px) scale(0.3); }
}

/* ── FAB ── */
.fab{position:absolute;bottom:94px;right:16px;width:52px;height:52px;border-radius:17px;
  background: #FAFAFA; display:flex;align-items:center;justify-content:center;
  font-size:24px;box-shadow:0 8px 24px rgba(0,0,0,0.3);color:#09090B;cursor:pointer;z-index:50;transition:all .15s;}
.fab:active{transform:scale(.9);}

/* ── PAGE HEADER ── */
.ph{padding:12px 18px 8px;display:flex;align-items:center;justify-content:space-between;}
.ph-t{font-size:28px;font-weight:900;letter-spacing:-1.2px;color:var(--text);}
.av{width:38px;height:38px;border-radius:13px;background:#27272A;
  display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:900;}

/* ── CARDS ── */
.card{
  background: var(--s1);
  border: 1px solid var(--border);
  border-radius: var(--r20);
  padding: 18px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

/* ── PILLS ── */
.pill{display:inline-flex;align-items:center;gap:3px;padding:4px 10px;border-radius:100px;font-size:10px;font-weight:800;letter-spacing:.3px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.04);}

/* ── DIVIDER ── */
.div{height:1px;background:var(--border);margin:0 18px;}

/* ── SECTION HEAD ── */
.sh{display:flex;justify-content:space-between;align-items:center;padding:14px 18px 8px;}
.sh-t{font-size:15px;font-weight:800;letter-spacing:-.3px;color:var(--text);}
.sh-a{font-size:12px;color:var(--t2);font-weight:700;cursor:pointer;}

/* ── PROGRESS ── */
.pt{height:5px;background:rgba(255,255,255,0.05);border-radius:100px;overflow:hidden;}
.pf{height:100%;border-radius:100px;transition:width .8s cubic-bezier(0.16, 1, 0.3, 1);}

/* ── MODAL ── */
.ov{position:absolute;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(10px);z-index:200;display:flex;align-items:flex-end;}
.sheet{
  width:100%;
  background: #18181B;
  border-radius: 28px 28px 0 0;
  padding: 16px 18px 36px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  animation: slideUp .28s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 88%;
  overflow-y: auto;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.3);
}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.hdl{width:36px;height:4px;background:rgba(255,255,255,0.1);border-radius:100px;margin:0 auto 16px;}
.st{font-size:20px;font-weight:900;letter-spacing:-.6px;margin-bottom:14px;color:var(--text);}

.inp{
  width:100%;
  background: #09090B;
  border: 1.5px solid var(--border);
  border-radius: var(--r14);
  padding: 12px 14px;
  color: var(--text);
  font-family: var(--font);
  font-size: 14px;
  outline: none;
  transition: all .2s;
  margin-bottom: 10px;
}
.inp:focus{border-color:var(--indigo);background:rgba(255,255,255,0.02);}
.inp::placeholder{color:var(--t3);}
.ilb{font-size:10px;font-weight:800;color:var(--t2);margin-bottom:5px;letter-spacing:.5px;text-transform:uppercase;}

.btn-p{width:100%;padding:14px;background:#FAFAFA;border:none;border-radius:var(--r14);
  color:#09090B;font-family:var(--font);font-size:14px;font-weight:800;cursor:pointer;
  box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:all .15s;margin-top:6px;}
.btn-p:active{transform:scale(.98);}
.btn-s{width:100%;padding:12px;background:transparent;border:1px solid var(--border);border-radius:var(--r14);
  color:var(--t2);font-family:var(--font);font-size:13px;font-weight:700;cursor:pointer;transition:all .15s;margin-top:8px;}
.btn-del{width:100%;padding:12px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.18);
  border-radius:var(--r14);color:var(--red);font-family:var(--font);font-size:13px;font-weight:700;cursor:pointer;margin-top:8px;}

.ttog{display:flex;background:#09090B;border-radius:var(--r14);padding:4px;margin-bottom:12px;border:1px solid var(--border);}
.tbtn{flex:1;padding:10px;border-radius:11px;border:none;background:transparent;color:var(--t3);
  font-family:var(--font);font-size:12px;font-weight:800;cursor:pointer;transition:all .2s;}
.tbtn.ae{background:rgba(239,68,68,.12);color:var(--red);}
.tbtn.ai{background:rgba(16,185,129,.12);color:var(--green);}

.sel-row{display:flex;gap:7px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none;margin-bottom:10px;}
.sel-row::-webkit-scrollbar{display:none;}
.chip{padding:7px 13px;border-radius:100px;border:1.5px solid var(--border);background:var(--s2);
  color:var(--t2);font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all .15s;flex-shrink:0;}
.chip.on{border-color:var(--text);background:rgba(255,255,255,.08);color:var(--text);}

.cgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:12px;}
.cbtn{display:flex;flex-direction:column;align-items:center;gap:3px;padding:9px 3px;
  border-radius:var(--r14);border:1.5px solid var(--border);background:var(--s2);cursor:pointer;transition:all .15s;}
.cbtn.on{border-color:var(--text);background:rgba(255,255,255,.05);}
.cbtn-lb{font-size:8px;color:var(--t3);font-weight:700;text-align:center;}
.cbtn.on .cbtn-lb{color:var(--text);}

/* ── NUMPAD ── */
.npad{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:12px 0;}
.npb{padding:14px;background:var(--s2);border:1px solid var(--border);border-radius:var(--r14);
  font-family:var(--mono);font-size:20px;font-weight:600;color:var(--text);cursor:pointer;text-align:center;transition:all .1s;}
.npb:active{background:var(--s3);transform:scale(.95);}
.amtd{font-size:40px;font-weight:900;letter-spacing:-2px;text-align:center;padding:14px;background:var(--s2);
  border:2px solid var(--indigo);border-radius:var(--r14);min-height:76px;display:flex;align-items:center;
  justify-content:center;font-family:var(--mono);margin-bottom:12px;}

/* ── TOGGLE ── */
.tgsw{width:44px;height:26px;border-radius:100px;position:relative;cursor:pointer;transition:background .2s;flex-shrink:0;}
.tgsw.on{background:var(--green);}
.tgsw.off{background:rgba(255,255,255,0.08);}
.tgk{width:20px;height:20px;border-radius:50%;background:#fff;position:absolute;top:3px;transition:left .2s;box-shadow:0 2px 6px rgba(0,0,0,0.3);}
.tgsw.on .tgk{left:21px;}
.tgsw.off .tgk{left:3px;}

/* ── TX ROW ── */
.txr{display:flex;align-items:center;gap:12px;padding:12px 18px;cursor:pointer;transition:background .15s;border-radius:var(--r14);}
.txr:active{background:rgba(255,255,255,0.03);}
.txic{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}
.txin{flex:1;min-width:0;}
.txno{font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text);}
.txsb{font-size:10px;color:var(--t3);margin-top:2px;display:flex;align-items:center;gap:5px;flex-wrap:wrap;}
.txam{font-size:14px;font-weight:800;font-family:var(--mono);}
.abadge{font-size:8px;padding:2px 6px;border-radius:100px;background:rgba(255,255,255,0.04);color:var(--t2);font-weight:700;flex-shrink:0;border:1px solid rgba(255,255,255,0.03);}
.recbadge{font-size:8px;padding:2px 6px;border-radius:100px;background:rgba(245,158,11,0.12);color:var(--amber);font-weight:700;}
.taxbadge{font-size:8px;padding:2px 6px;border-radius:100px;background:rgba(16,185,129,0.12);color:var(--green);font-weight:700;}

/* ── BANK CARD ── */
.bcard{min-width:272px;height:158px;border-radius:20px;position:relative;overflow:hidden;cursor:pointer;transition:transform .15s;flex-shrink:0;margin-right:12px;}
.bcard:active{transform:scale(.97);}

/* ── STAT CELL ── */
.scell{
  background: var(--s1);
  border: 1px solid var(--border);
  border-radius: var(--r20);
  padding: 14px;
}
.slb{font-size:9px;color:var(--t3);font-weight:800;text-transform:uppercase;letter-spacing:.6px;margin-bottom:6px;}
.sval{font-size:20px;font-weight:900;letter-spacing:-1px;font-family:var(--mono);color:var(--text);}

/* ── RING ── */
.rw{position:relative;flex-shrink:0;}
.ri{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}

/* ── ANIMATIONS ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.au{animation:fadeUp .38s ease both;}
.d1{animation-delay:.05s}.d2{animation-delay:.1s}.d3{animation-delay:.15s}.d4{animation-delay:.2s}.d5{animation-delay:.25s}.d6{animation-delay:.3s}

@keyframes scrollReveal {
  from {
    opacity: 0.1;
    transform: translateY(35px) scale(0.96);
    filter: blur(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

@supports (animation-timeline: view()) {
  .au {
    animation: scrollReveal linear both !important;
    animation-timeline: view() !important;
    animation-range: entry 2% cover 25% !important;
  }
}

/* ── FEATURE TAG ── */
.ftag{font-size:9px;padding:2px 7px;border-radius:100px;font-weight:800;letter-spacing:.3px;}
.ftag-p{background:rgba(255,255,255,0.08);color:var(--text);}
.ftag-f{background:rgba(16,185,129,0.12);color:var(--green);}

/* ── BUDGET ITEM ── */
.bi{
  background: var(--s1);
  border: 1px solid var(--border);
  border-radius: var(--r14);
  padding: 14px;
}

/* ── WIDGET ROW ── */
.wr{
  display: flex;
  align-items: center;
  gap: 11px;
  background: var(--s1);
  border: 1px solid var(--border);
  border-radius: var(--r20);
  padding: 13px;
}
.wic{width:40px;height:40px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:18px;}

/* ── SEARCH BAR ── */
.sbar-inp{
  width:100%;
  background: var(--s1);
  border: 1.5px solid var(--border);
  border-radius: var(--r14);
  padding: 10px 14px 10px 36px;
  color: var(--text);
  font-family: var(--font);
  font-size: 13px;
  outline: none;
  transition: all .2s;
}
.sbar-inp:focus{border-color:var(--indigo);background:rgba(255,255,255,0.02);}
.sbar-inp::placeholder{color:var(--t3);}
.sbar-wrap{position:relative;margin:0 18px 12px;}
.sbar-ico{position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:14px;color:var(--t3);}

/* ── SUBSCRIPTION CARD ── */
.subc{display:flex;align-items:center;gap:12px;padding:12px 18px;border-radius:var(--r14);cursor:pointer;}
.subc:active{background:rgba(255,255,255,0.025);}
.subic{width:42px;height:42px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}

/* ── REPORT CARD ── */
.rcard{background:var(--s1);border:1px solid var(--border);border-radius:var(--r14);padding:14px;margin-bottom:10px;}

/* ── COLOR DOTS ── */
.cdot{width:30px;height:30px;border-radius:9px;cursor:pointer;transition:all .15s;border:2px solid transparent;}
.cdot.sel{border-color:white;}

/* ── PREMIUM STATS STYLING ── */
.glass-stat {
  background: var(--s1) !important;
  border: 1px solid var(--border) !important;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
}
.glass-stat:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.15) !important;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3) !important;
}
.ring-stat-row {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
.ring-stat-row:hover {
  transform: translateX(4px);
  background: rgba(255,255,255,0.03) !important;
}
.bar-container:hover .bar-value {
  opacity: 1 !important;
  transform: translateY(-5px) scale(1) !important;
}
.bar-container:hover .spend-bar {
  transform: scaleX(1.05);
  box-shadow: none !important;
  background: var(--indigo) !important;
}
`;

// ─── THEMES ──────────────────────────────────────────────────────────────────
const THEMES = [
  {
    id: "nordic_sage",
    name: "Nordic Sage",
    desc: "Warm organic off-black & sage green",
    bg: "#0C0F0E",
    s1: "#151B18",
    s2: "#0C0F0E",
    s3: "#242F29",
    s4: "#35443B",
    border: "rgba(255, 255, 255, 0.05)",
    border2: "rgba(255, 255, 255, 0.1)",
    text: "#EAE6E1",
    t2: "#8B958F",
    t3: "#4A534E",
    indigo: "#D4CEB8",
    violet: "#A7B5A6",
    cyan: "#A8D5BA",
    green: "#86EFAC",
    red: "#FCA5A5",
    amber: "#FCD34D",
    pink: "#FBCFE8",
    sky: "#BAE6FD",
    lime: "#D9F99D",
    orange: "#FED7AA",
    font: "'Plus Jakarta Sans', sans-serif"
  },
  {
    id: "swiss_grotesk",
    name: "Swiss Grotesk",
    desc: "Strict modular black, gray & white",
    bg: "#09090B",
    s1: "#18181B",
    s2: "#09090B",
    s3: "#27272A",
    s4: "#3F3F46",
    border: "rgba(255,255,255,0.06)",
    border2: "rgba(255,255,255,0.12)",
    text: "#FAFAFA",
    t2: "#A1A1AA",
    t3: "#52525B",
    indigo: "#E4E4E7",
    violet: "#D4D4D8",
    cyan: "#A1A1AA",
    green: "#10B981",
    red: "#EF4444",
    amber: "#F59E0B",
    pink: "#EC4899",
    sky: "#0EA5E9",
    lime: "#84CC16",
    orange: "#F97316",
    font: "'Plus Jakarta Sans', sans-serif"
  },
  {
    id: "obsidian_terracotta",
    name: "Obsidian Terracotta",
    desc: "Matte carbon & copper rust",
    bg: "#0A0A0A",
    s1: "#151515",
    s2: "#0A0A0A",
    s3: "#262626",
    s4: "#404040",
    border: "rgba(225, 127, 99, 0.08)",
    border2: "rgba(225, 127, 99, 0.16)",
    text: "#F4EFEA",
    t2: "#C2A398",
    t3: "#7A635B",
    indigo: "#E17F63",
    violet: "#D8A393",
    cyan: "#EBB1A0",
    green: "#34D399",
    red: "#F87171",
    amber: "#FBBF24",
    pink: "#F472B6",
    sky: "#60A5FA",
    lime: "#A3E635",
    orange: "#FB923C",
    font: "'Plus Jakarta Sans', sans-serif"
  },
  {
    id: "brutalist_steel",
    name: "Brutalist Steel",
    desc: "Bold high-contrast monochrome & mono",
    bg: "#000000",
    s1: "#111111",
    s2: "#000000",
    s3: "#222222",
    s4: "#333333",
    border: "#D4D4D8",
    border2: "#FFFFFF",
    text: "#FFFFFF",
    t2: "#D4D4D8",
    t3: "#71717A",
    indigo: "#FAFAFA",
    violet: "#E4E4E7",
    cyan: "#D4D4D8",
    green: "#A3E635",
    red: "#FB923C",
    amber: "#FACC15",
    pink: "#FB7185",
    sky: "#38BDF8",
    lime: "#A3E635",
    orange: "#FB923C",
    font: "'JetBrains Mono', monospace"
  },
  {
    id: "tokyo_midnight",
    name: "Tokyo Midnight",
    desc: "Deep navy indigo & rich lime slate",
    bg: "#090912",
    s1: "#131326",
    s2: "#090912",
    s3: "#1F1F3D",
    s4: "#2F2F5C",
    border: "rgba(163, 230, 53, 0.08)",
    border2: "rgba(163, 230, 53, 0.16)",
    text: "#F4F4F9",
    t2: "#7C7C9E",
    t3: "#444466",
    indigo: "#A3E635",
    violet: "#C084FC",
    cyan: "#22D3EE",
    green: "#34D399",
    red: "#FDA4AF",
    amber: "#FBBF24",
    pink: "#F472B6",
    sky: "#38BDF8",
    lime: "#A3E635",
    orange: "#FB923C",
    font: "'Plus Jakarta Sans', sans-serif"
  },
  {
    id: "champagne_espresso",
    name: "Champagne Luxury",
    desc: "Rich espresso & gold private bank",
    bg: "#0A0808",
    s1: "#151211",
    s2: "#0A0808",
    s3: "#26211F",
    s4: "#3C3431",
    border: "rgba(212, 175, 55, 0.08)",
    border2: "rgba(212, 175, 55, 0.18)",
    text: "#F7F4EF",
    t2: "#C5BBAE",
    t3: "#5A5248",
    indigo: "#D4AF37",
    violet: "#D4C28A",
    cyan: "#DECFA5",
    green: "#86EFAC",
    red: "#FCA5A5",
    amber: "#FBBF24",
    pink: "#F472B6",
    sky: "#60A5FA",
    lime: "#A3E635",
    orange: "#FB923C",
    font: "'Plus Jakarta Sans', sans-serif"
  },
  {
    id: "cybernetic_carbon",
    name: "Cybernetic Carbon",
    desc: "Industrial slate & warm copper",
    bg: "#070708",
    s1: "#131316",
    s2: "#070708",
    s3: "#202026",
    s4: "#2F2F38",
    border: "rgba(194, 125, 56, 0.08)",
    border2: "rgba(194, 125, 56, 0.16)",
    text: "#E4E4E7",
    t2: "#71717A",
    t3: "#3F3F46",
    indigo: "#C27D38",
    violet: "#D4D4D8",
    cyan: "#A1A1AA",
    green: "#10B981",
    red: "#EF4444",
    amber: "#F59E0B",
    pink: "#EC4899",
    sky: "#0EA5E9",
    lime: "#84CC16",
    orange: "#F97316",
    font: "'IBM Plex Sans', sans-serif"
  },
  {
    id: "pearl_mint",
    name: "Pearl Mint Glass",
    desc: "Frosted glass light mode",
    bg: "#F3F4F6",
    s1: "rgba(255, 255, 255, 0.8)",
    s2: "#F3F4F6",
    s3: "rgba(255, 255, 255, 0.4)",
    s4: "rgba(255, 255, 255, 0.6)",
    border: "rgba(31, 41, 55, 0.06)",
    border2: "rgba(31, 41, 55, 0.12)",
    text: "#1F2937",
    t2: "#4B5563",
    t3: "#9CA3AF",
    indigo: "#374151",
    violet: "#4B5563",
    cyan: "#1F2937",
    green: "#059669",
    red: "#D11F43",
    amber: "#D97706",
    pink: "#DB2777",
    sky: "#2563EB",
    lime: "#65A30D",
    orange: "#EA580C",
    font: "'Plus Jakarta Sans', sans-serif"
  },
  {
    id: "sage_alabaster",
    name: "Sage & Alabaster",
    desc: "Warm earthy light mode",
    bg: "#F5F5F0",
    s1: "#FFFFFF",
    s2: "#F5F5F0",
    s3: "#EBEBE5",
    s4: "#DFDFD6",
    border: "rgba(85, 107, 47, 0.08)",
    border2: "rgba(85, 107, 47, 0.16)",
    text: "#292929",
    t2: "#556B2F",
    t3: "#7F8C68",
    indigo: "#D97706",
    violet: "#B07D62",
    cyan: "#8A5C47",
    green: "#065F46",
    red: "#991B1B",
    amber: "#D97706",
    pink: "#BE185D",
    sky: "#1D4ED8",
    lime: "#4D7C0F",
    orange: "#C2410C",
    font: "'Plus Jakarta Sans', sans-serif"
  },
  {
    id: "sovereign_cobalt",
    name: "Sovereign Cobalt",
    desc: "Cobalt void & electric teal tech",
    bg: "#040714",
    s1: "#0B132B",
    s2: "#040714",
    s3: "#1C2541",
    s4: "#3A506B",
    border: "rgba(45, 212, 191, 0.08)",
    border2: "rgba(45, 212, 191, 0.16)",
    text: "#F1F5F9",
    t2: "#94A3B8",
    t3: "#475569",
    indigo: "#2DD4BF",
    violet: "#38BDF8",
    cyan: "#818CF8",
    green: "#34D399",
    red: "#F43F5E",
    amber: "#FBBF24",
    pink: "#F472B6",
    sky: "#38BDF8",
    lime: "#A3E635",
    orange: "#FB923C",
    font: "'Plus Jakarta Sans', sans-serif"
  }
];

// ─── DATA ────────────────────────────────────────────────────────────────────
const BANK_THEMES = [
  "linear-gradient(135deg,#0f0c29,#302b63,#24243e)",
  "linear-gradient(135deg,#0a0a2e,#1a1a6e,#0077b6)",
  "linear-gradient(135deg,#1a0533,#6b21a8,#a855f7)",
  "linear-gradient(135deg,#064e3b,#059669,#10b981)",
  "linear-gradient(135deg,#1c1100,#92400e,#f59e0b)",
  "linear-gradient(135deg,#1a0a00,#9a3412,#f97316)",
];
const CC_COLORS = ["#0f172a","#1e1b4b","#164e63","#14532d","#431407","#1a0000"];

const CATS = [
  {id:"food",lb:"Food",ic:"🍜",col:"#F43F5E"},
  {id:"transport",lb:"Transport",ic:"🚗",col:"#0EA5E9"},
  {id:"shopping",lb:"Shopping",ic:"🛍️",col:"#F59E0B"},
  {id:"health",lb:"Health",ic:"💊",col:"#10B981"},
  {id:"entertainment",lb:"Entertain",ic:"🎬",col:"#A855F7"},
  {id:"bills",lb:"Bills",ic:"⚡",col:"#F97316"},
  {id:"travel",lb:"Travel",ic:"✈️",col:"#22D3EE"},
  {id:"grocery",lb:"Grocery",ic:"🛒",col:"#84CC16"},
  {id:"dining",lb:"Dining",ic:"🍽️",col:"#EC4899"},
  {id:"fuel",lb:"Fuel",ic:"⛽",col:"#6366F1"},
  {id:"education",lb:"Education",ic:"📚",col:"#8B5CF6"},
  {id:"other",lb:"Other",ic:"💫",col:"#64748B"},
];

const INIT_ACCTS = [
  {id:"ba1",type:"bank",name:"Chase Checking",bank:"Chase",balance:0,themeIdx:0,last4:"4521",icon:"🏦"},
  {id:"ba2",type:"bank",name:"Wells Savings",bank:"Wells Fargo",balance:0,themeIdx:3,last4:"8834",icon:"💰"},
  {id:"ba3",type:"bank",name:"Discover Checking",bank:"Discover",balance:0,themeIdx:1,last4:"2291",icon:"🏧"},
  {id:"ba4",type:"bank",name:"Ally Savings",bank:"Ally Bank",balance:0,themeIdx:4,last4:"6677",icon:"💎"},
  {id:"cc1",type:"credit",name:"Chase Sapphire",bank:"Chase",balance:0,limit:10000,color:CC_COLORS[0],last4:"7832",icon:"💳"},
  {id:"cc2",type:"credit",name:"Amex Gold",bank:"Amex",balance:0,limit:15000,color:CC_COLORS[1],last4:"3390",icon:"⚜️"},
];

const INIT_TX = [];

const INIT_BUDGETS = {food:0,transport:0,shopping:0,health:0,entertainment:0,bills:0,travel:0,grocery:0,dining:0,fuel:0,education:0,other:0};

const INIT_SAVINGS = [
  {id:"sg1",name:"MacBook Pro",icon:"💻",target:0,saved:0,color:"#7B6FFF",deadline:"2025-06-01"},
  {id:"sg2",name:"Japan Trip",icon:"🗾",target:0,saved:0,color:"#10B981",deadline:"2025-09-01"},
  {id:"sg3",name:"Emergency Fund",icon:"🛡️",target:0,saved:0,color:"#F59E0B",deadline:"2025-12-31"},
];

const INIT_SUBS = [
  {id:"sub1",name:"Netflix",icon:"🎬",amount:12.99,cycle:"Monthly",nextDue:"2025-04-25",color:"#EF4444"},
  {id:"sub2",name:"Spotify",icon:"🎵",amount:9.99,cycle:"Monthly",nextDue:"2025-04-19",color:"#1DB954"},
  {id:"sub3",name:"Gym",icon:"💪",amount:85,cycle:"Monthly",nextDue:"2025-04-25",color:"#F59E0B"},
  {id:"sub4",name:"iCloud",icon:"☁️",amount:2.99,cycle:"Monthly",nextDue:"2025-04-22",color:"#60A5FA"},
  {id:"sub5",name:"AWS",icon:"🔧",amount:24.5,cycle:"Monthly",nextDue:"2025-04-28",color:"#FF9900"},
];

const ALL_WIDGETS = [
  {id:"net_worth",name:"Net Worth",desc:"Total balance across all accounts",ic:"💰",def:true,tag:"free"},
  {id:"health_score",name:"Financial Health Score",desc:"Overall financial health index & advice",ic:"🔮",def:true,tag:"premium"},
  {id:"bank_cards",name:"Bank Cards",desc:"Swipeable card carousel",ic:"🏦",def:true,tag:"free"},
  {id:"credit_cards",name:"Credit Cards",desc:"CC balances & utilization",ic:"💳",def:true,tag:"free"},
  {id:"monthly_ring",name:"Monthly Summary",desc:"Income vs expense ring chart",ic:"📊",def:true,tag:"free"},
  {id:"quick_stats",name:"Quick Stats",desc:"Savings rate, daily avg, counts",ic:"⚡",def:true,tag:"free"},
  {id:"spending_bars",name:"Spending Bars",desc:"Weekly spend bar chart",ic:"📈",def:true,tag:"free"},
  {id:"savings_goals",name:"Savings Goals",desc:"Progress toward your goals",ic:"🎯",def:true,tag:"premium"},
  {id:"subscriptions",name:"Subscriptions",desc:"Monthly recurring tracker",ic:"🔄",def:true,tag:"premium"},
  {id:"cc_util",name:"CC Utilization",desc:"Credit score impact meter",ic:"📉",def:true,tag:"premium"},
  {id:"tax_summary",name:"Tax Summary",desc:"Deductible expenses YTD",ic:"🧾",def:false,tag:"premium"},
  {id:"mileage",name:"Mileage Tracker",desc:"Trip distance & reimbursement",ic:"🚗",def:false,tag:"premium"},
  {id:"cash_flow",name:"Cash Flow",desc:"30-day income/expense bars",ic:"💸",def:false,tag:"premium"},
  {id:"recent_tx",name:"Recent Transactions",desc:"Last 5 transactions",ic:"📋",def:true,tag:"free"},
  {id:"bills_upcoming",name:"Upcoming Bills",desc:"Bills due in next 7 days",ic:"📅",def:true,tag:"premium"},
];

const fmt = n => "$" + Number(n).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtK = n => n >= 1000 ? "$"+(n/1000).toFixed(1)+"k" : "$"+Number(n).toFixed(0);

// ─── SVG RING ─────────────────────────────────────────────────────────────────
function Ring({pct,color,size=96,stroke=8,children}){
  const r=(size-stroke)/2, c=2*Math.PI*r, d=c*Math.min(Math.abs(pct),1);
  return (
    <div className="rw" style={{width:size,height:size}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1C1C34" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${d} ${c}`} strokeLinecap="round"
          style={{transition:"stroke-dasharray .9s cubic-bezier(0.34,1.56,0.64,1)"}}/>
      </svg>
      <div className="ri">{children}</div>
    </div>
  );
}

function Toggle({on,onToggle}){
  return <div className={`tgsw ${on?"on":"off"}`} onClick={onToggle}><div className="tgk"/></div>;
}

// ─── ANIMATED NUMBER COUNT-UP ────────────────────────────────────────────────
function AnimatedNumber({ value, formatter = (n) => n.toFixed(0), duration = 700, animateOnMount = true }) {
  const [displayValue, setDisplayValue] = useState(animateOnMount ? 0 : value);

  useEffect(() => {
    let start = null;
    const startVal = Number(displayValue) || 0;
    const endVal = Number(value) || 0;
    if (startVal === endVal) {
      setDisplayValue(endVal);
      return;
    }

    let animFrame;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const easedProgress = progress * (2 - progress); // Ease out quad
      const current = startVal + (endVal - startVal) * easedProgress;
      setDisplayValue(current);

      if (progress < 1) {
        animFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endVal);
      }
    };
    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [value]);

  return <>{formatter(displayValue)}</>;
}

// ─── FINANCIAL HEALTH ENGINE ──────────────────────────────────────────────────
function calculateFinancialHealthScore({ accounts = [], transactions = [], budgets = {}, savings = [] }) {
  const banks = accounts.filter(a => a.type === "bank");
  const ccs = accounts.filter(a => a.type === "credit");
  
  const totalBank = banks.reduce((s, a) => s + a.balance, 0);
  const totalCC = ccs.reduce((s, a) => s + a.balance, 0);
  const totalCCLimit = ccs.reduce((s, a) => s + (a.limit || 0), 0);
  
  // 1. Savings Rate Component (Max 30)
  const income = transactions.filter(t => t.type === "income" && !(t.tags && t.tags.includes('__transfer__'))).reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === "expense" && !(t.tags && t.tags.includes('__transfer__'))).reduce((s, t) => s + t.amount, 0);
  const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;
  
  let savingsRateScore = 0;
  if (savingsRate >= 20) savingsRateScore = 30;
  else if (savingsRate > 0) savingsRateScore = (savingsRate / 20) * 30;
  savingsRateScore = Math.max(0, Math.round(savingsRateScore));
  
  // 2. Budget Adherence Component (Max 25)
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthExpenses = transactions.filter(t => {
    if (t.type !== "expense" || (t.tags && t.tags.includes('__transfer__'))) return false;
    const txDate = new Date(t.date);
    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
  }).reduce((s, t) => s + t.amount, 0);
  
  const totalBudgetLimit = Object.values(budgets || {}).reduce((s, v) => s + v, 0);
  let budgetScore = 18; // baseline if no budget
  let budgetPct = 0;
  if (totalBudgetLimit > 0) {
    budgetPct = monthExpenses / totalBudgetLimit;
    if (budgetPct <= 0.75) budgetScore = 25;
    else if (budgetPct <= 1.0) budgetScore = 25 - ((budgetPct - 0.75) / 0.25) * 15;
    else budgetScore = Math.max(0, 10 - ((budgetPct - 1.0) / 0.5) * 10);
  }
  budgetScore = Math.round(budgetScore);
  
  // 3. CC Utilization Component (Max 20)
  let ccUtilScore = 20;
  let ccUtil = 0;
  if (ccs.length > 0) {
    ccUtil = totalCCLimit > 0 ? totalCC / totalCCLimit : 0;
    if (ccUtil <= 0.10) ccUtilScore = 20;
    else if (ccUtil <= 0.30) ccUtilScore = 20 - ((ccUtil - 0.10) / 0.20) * 5;
    else if (ccUtil <= 0.75) ccUtilScore = 15 - ((ccUtil - 0.30) / 0.45) * 10;
    else ccUtilScore = Math.max(0, 5 - ((ccUtil - 0.75) / 0.25) * 5);
  }
  ccUtilScore = Math.round(ccUtilScore);
  
  // 4. Savings Goals Component (Max 15)
  let goalsScore = 10; // baseline if no goals
  let goalsProgress = 0;
  if (savings.length > 0) {
    const totalProgress = savings.reduce((s, g) => s + (g.target > 0 ? g.saved / g.target : 0), 0);
    goalsProgress = totalProgress / savings.length;
    goalsScore = Math.round(goalsProgress * 15);
  }
  
  // 5. Liquid Capital / Cash Debt Coverage (Max 10)
  let capitalScore = 10;
  let capRatio = 0;
  if (totalCC > 0) {
    capRatio = totalBank / totalCC;
    if (capRatio >= 3.0) capitalScore = 10;
    else if (capRatio >= 1.0) capitalScore = 6 + ((capRatio - 1.0) / 2.0) * 4;
    else capitalScore = capRatio * 6;
  }
  capitalScore = Math.max(0, Math.round(capitalScore));
  
  const overallScore = Math.min(100, Math.max(0, savingsRateScore + budgetScore + ccUtilScore + goalsScore + capitalScore));
  
  return {
    overallScore,
    savingsRateScore,
    budgetScore,
    ccUtilScore,
    goalsScore,
    capitalScore,
    metrics: {
      savingsRate: Math.round(savingsRate),
      budgetPct: Math.round(budgetPct * 100),
      ccUtil: Math.round(ccUtil * 100),
      goalsProgress: Math.round(goalsProgress * 100),
      capRatio: Number(capRatio.toFixed(1))
    }
  };
}

// ─── DYNAMIC ISLAND AMBIENT GLOW (mobile PWA) ────────────────────────────────
function DynamicIslandGlow({ transactions, budgets }) {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const todaySpend = transactions
    .filter(t => t.type === "expense" && t.date === todayStr && !(t.tags && t.tags.includes('__transfer__')))
    .reduce((s, t) => s + t.amount, 0);

  const monthExpenses = transactions
    .filter(t => {
      if (t.type !== "expense" || (t.tags && t.tags.includes('__transfer__'))) return false;
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, t) => s + t.amount, 0);

  const totalBudget = Object.values(budgets || {}).reduce((s, v) => s + v, 0);
  const budgetPct = totalBudget > 0 ? Math.min(1, monthExpenses / totalBudget) : 0;

  // Health: green (< 60%), amber (60-85%), red (> 85%)
  const health = budgetPct < 0.6 ? "good" : budgetPct < 0.85 ? "warn" : "over";
  const glowColor = health === "good" ? "rgba(16, 185, 129, 0.6)"
    : health === "warn" ? "rgba(245, 158, 11, 0.6)"
    : "rgba(239, 68, 68, 0.6)";
  const ringColor = health === "good" ? "rgba(16, 185, 129, 0.4)"
    : health === "warn" ? "rgba(245, 158, 11, 0.4)"
    : "rgba(239, 68, 68, 0.4)";
  const dotColor = health === "good" ? "#10B981" : health === "warn" ? "#F59E0B" : "#EF4444";
  const particleColor = health === "good" ? "#34D399" : health === "warn" ? "#FCD34D" : "#FCA5A5";

  const lastTx = [...transactions]
    .filter(t => t.type === "expense" && !(t.tags && t.tags.includes('__transfer__')))
    .sort((a, b) => b.id - a.id)[0];
  const lastCat = lastTx ? (CATS.find(c => c.id === lastTx.category) || CATS[CATS.length - 1]) : null;

  return (
    <div className="di-glow">
      {/* Ambient glow emanating from the island cutout */}
      <div className="di-glow-bg" style={{ background: `radial-gradient(ellipse, ${glowColor} 0%, transparent 70%)` }} />
      <div className="di-glow-ring" style={{ background: `radial-gradient(ellipse, ${ringColor} 0%, transparent 70%)` }} />

      {/* Floating particles */}
      <div className="di-particles">
        <div className="di-particle" style={{ background: particleColor }} />
        <div className="di-particle" style={{ background: particleColor }} />
        <div className="di-particle" style={{ background: particleColor }} />
        <div className="di-particle" style={{ background: particleColor }} />
        <div className="di-particle" style={{ background: particleColor }} />
      </div>

      {/* Compact status ticker below island */}
      <div className="di-status-bar">
        <div className="di-status-dot" style={{ background: dotColor }} />
        <span className="di-status-text">
          Today ${todaySpend > 0 ? fmtK(todaySpend) : "$0"}
        </span>
        <div className="di-status-divider" />
        <span className="di-status-text">
          {lastCat ? `${lastCat.ic} ${lastCat.lb}` : "No spend"}
        </span>
        {totalBudget > 0 && (
          <>
            <div className="di-status-divider" />
            <span className="di-status-text" style={{ color: dotColor, opacity: 0.8 }}>
              {Math.round(budgetPct * 100)}%
            </span>
          </>
        )}
      </div>
    </div>
  );
}

// ─── BANK CARD VISUAL ─────────────────────────────────────────────────────────
function BankCardVis({a,onPress}){
  const isCC = a.type==="credit";
  const bg = isCC ? a.color : BANK_THEMES[a.themeIdx||0];
  const pct = isCC && a.limit ? a.balance/a.limit : 0;
  return (
    <div className="bcard" onClick={onPress} style={{background:bg, scrollSnapAlign:"start"}}>
      <div style={{position:"absolute",right:-25,top:-25,width:130,height:130,borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>
      <div style={{position:"absolute",right:20,bottom:-35,width:90,height:90,borderRadius:"50%",background:"rgba(255,255,255,0.035)"}}/>
      {/* Chip */}
      <div style={{position:"absolute",top:18,left:18,width:32,height:24,borderRadius:5,background:"rgba(255,255,255,0.22)",border:"1px solid rgba(255,255,255,0.25)"}}/>
      <div style={{position:"absolute",top:16,right:16,fontSize:10,fontWeight:700,letterSpacing:1,opacity:.7,color:"#fff"}}>{a.bank.toUpperCase()}</div>
      {isCC && (
        <div style={{position:"absolute",top:54,left:18,right:18}}>
          <div style={{height:2.5,background:"rgba(255,255,255,0.12)",borderRadius:100,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct*100}%`,background:pct>.8?"#F43F5E":"#10B981",borderRadius:100}}/>
          </div>
          <div style={{fontSize:8,color:"rgba(255,255,255,0.4)",marginTop:2}}>{fmt(a.balance)} of {fmt(a.limit)}</div>
        </div>
      )}
      <div style={{position:"absolute",bottom:36,left:18,fontFamily:"var(--mono)",fontSize:12,letterSpacing:2,opacity:.85,color:"#fff"}}>•••• •••• •••• {a.last4}</div>
      <div style={{position:"absolute",bottom:16,left:18,fontSize:12,fontWeight:700,color:"#fff"}}>{a.name}</div>
      <div style={{position:"absolute",bottom:16,right:16,textAlign:"right"}}>
        <div style={{fontSize:8,opacity:.55,color:"#fff",textTransform:"uppercase",letterSpacing:.5}}>{isCC?"Due":"Balance"}</div>
        <div style={{fontSize:16,fontWeight:900,fontFamily:"var(--mono)",color:"#fff",letterSpacing:-.5}}>{fmtK(a.balance)}</div>
      </div>
    </div>
  );
}

// ─── HEALTH SCORE DETAILED BREAKDOWN MODAL ────────────────────────────────────
function HealthScoreModal({ health, onClose }) {
  const { overallScore, savingsRateScore, budgetScore, ccUtilScore, goalsScore, capitalScore, metrics } = health;

  const getRating = (s) => {
    if (s >= 90) return { text: "Excellent", col: "var(--green)", desc: "You are in superb financial shape! Keep it up." };
    if (s >= 75) return { text: "Good", col: "var(--cyan)", desc: "Great habits! A few optimizations can make it perfect." };
    if (s >= 50) return { text: "Fair", col: "var(--amber)", desc: "On the right track, but some areas need attention." };
    return { text: "Needs Review", col: "var(--red)", desc: "High financial stress. Let's take control of your expenses." };
  };

  const r = getRating(overallScore);

  return (
    <div className="ov" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: "90%", overflowY: "auto" }}>
        <div className="hdl" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 24 }}>🔮</span>
          <div className="st" style={{ marginBottom: 0 }}>Financial Health Pulse</div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 20 }}>
          Your score is calculated dynamically based on savings, utilization, budgets, and liquid capital.
        </div>

        {/* Hero Score Display */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: '20px 16px',
          marginBottom: 20,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Ambient Glow */}
          <div style={{
            position: 'absolute',
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${r.col}1a 0%, transparent 70%)`,
            pointerEvents: 'none'
          }} />
          
          <Ring pct={overallScore / 100} color={r.col} size={96} stroke={8}>
            <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "var(--mono)", color: "var(--text)" }}>
              <AnimatedNumber value={overallScore} />
            </div>
            <div style={{ fontSize: 9, color: "var(--t2)", textTransform: "uppercase", letterSpacing: 0.5 }}>Index</div>
          </Ring>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: "var(--t2)", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>Rating</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: r.col, marginBottom: 4 }}>{r.text}</div>
            <div style={{ fontSize: 11, color: "var(--t2)", lineHeight: 1.4 }}>{r.desc}</div>
          </div>
        </div>

        {/* Breakdown List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
          {/* 1. Savings Rate */}
          <div style={{ background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 16, padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>📈 Savings Rate ({metrics.savingsRate}%)</span>
              <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 800, color: 'var(--green)' }}>{savingsRateScore}/30 pts</span>
            </div>
            <div className="pt" style={{ height: 6 }}><div className="pf" style={{ width: `${(savingsRateScore / 30) * 100}%`, background: 'var(--green)' }} /></div>
            <div style={{ fontSize: 10, color: 'var(--t2)', marginTop: 8, lineHeight: 1.4 }}>
              {metrics.savingsRate >= 20 
                ? "✨ Superb! You are saving 20% or more of your income. This keeps your future secure."
                : `💡 Action: Your savings rate is ${metrics.savingsRate}%. Try saving 20% of your earnings to earn +${Math.round(30 - savingsRateScore)} points.`
              }
            </div>
          </div>

          {/* 2. Budget Adherence */}
          <div style={{ background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 16, padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>📊 Budget Adherence ({metrics.budgetPct}%)</span>
              <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 800, color: 'var(--indigo)' }}>{budgetScore}/25 pts</span>
            </div>
            <div className="pt" style={{ height: 6 }}><div className="pf" style={{ width: `${(budgetScore / 25) * 100}%`, background: 'var(--indigo)' }} /></div>
            <div style={{ fontSize: 10, color: 'var(--t2)', marginTop: 8, lineHeight: 1.4 }}>
              {metrics.budgetPct === 0 
                ? "💡 Action: You haven't set any budgets this month. Defining budgets will help organize expenses and earn +7 points!"
                : metrics.budgetPct <= 75 
                  ? "✨ Outstanding! You are staying well within your budget limits."
                  : metrics.budgetPct <= 100
                    ? `💡 Action: You've spent ${metrics.budgetPct}% of your budget. Spend less than 75% to earn maximum points.`
                    : "⚠️ Alert: You have exceeded your monthly budgets! Take steps to trim variable spending immediately."
              }
            </div>
          </div>

          {/* 3. CC Utilization */}
          <div style={{ background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 16, padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>💳 Debt Utilization ({metrics.ccUtil}%)</span>
              <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 800, color: 'var(--red)' }}>{ccUtilScore}/20 pts</span>
            </div>
            <div className="pt" style={{ height: 6 }}><div className="pf" style={{ width: `${(ccUtilScore / 20) * 100}%`, background: 'var(--red)' }} /></div>
            <div style={{ fontSize: 10, color: 'var(--t2)', marginTop: 8, lineHeight: 1.4 }}>
              {ccUtilScore === 20 
                ? "✨ Perfect! You have low or zero credit utilization, which keeps your credit profile clean."
                : `💡 Action: Your credit card utilization is at ${metrics.ccUtil}%. Pay down balances below 10% to claim +${Math.round(20 - ccUtilScore)} points.`
              }
            </div>
          </div>

          {/* 4. Goals Progress */}
          <div style={{ background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 16, padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>🎯 Savings Goals Progress ({metrics.goalsProgress}%)</span>
              <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 800, color: 'var(--amber)' }}>{goalsScore}/15 pts</span>
            </div>
            <div className="pt" style={{ height: 6 }}><div className="pf" style={{ width: `${(goalsScore / 15) * 100}%`, background: 'var(--amber)' }} /></div>
            <div style={{ fontSize: 10, color: 'var(--t2)', marginTop: 8, lineHeight: 1.4 }}>
              {goalsScore === 15 
                ? "✨ Fantastic! All your active savings goals are fully funded!"
                : `💡 Action: Your goals are ${metrics.goalsProgress}% complete. Save regularly to boost your goals score.`
              }
            </div>
          </div>

          {/* 5. Liquid Reserves */}
          <div style={{ background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 16, padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>🏦 Cash Reserves vs CC Debt ({metrics.capRatio}x)</span>
              <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 800, color: 'var(--cyan)' }}>{capitalScore}/10 pts</span>
            </div>
            <div className="pt" style={{ height: 6 }}><div className="pf" style={{ width: `${(capitalScore / 10) * 100}%`, background: 'var(--cyan)' }} /></div>
            <div style={{ fontSize: 10, color: 'var(--t2)', marginTop: 8, lineHeight: 1.4 }}>
              {capitalScore === 10 
                ? "✨ Solid! Your bank balances cover credit card debts 3 times over, providing strong liquidity."
                : `💡 Action: Bank balance covers ${metrics.capRatio}x of credit debt. Build emergency reserves or pay down debt to boost cash coverage.`
              }
            </div>
          </div>
        </div>

        <button className="btn-p" onClick={onClose}>Done</button>
      </div>
    </div>
  );
}

// ─── SCREENS ──────────────────────────────────────────────────────────────────

function HomeScreen({accounts,transactions,budgets,savings,subscriptions,widgets,onEditAcct,onAddAcct,setTab,onSignOut,onPayBill}){
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showHealthScore, setShowHealthScore] = useState(false);
  const health = calculateFinancialHealthScore({ accounts, transactions, budgets, savings });
  const banks = accounts.filter(a=>a.type==="bank");
  const ccs = accounts.filter(a=>a.type==="credit");
  const totalBank = banks.reduce((s,a)=>s+a.balance,0);
  const totalCC = ccs.reduce((s,a)=>s+a.balance,0);
  const totalCCLimit = ccs.reduce((s,a)=>s+(a.limit||0),0);
  const netWorth = totalBank - totalCC;
  const ccUtil = totalCCLimit>0 ? totalCC/totalCCLimit : 0;

  const income = transactions.filter(t=>t.type==="income" && !(t.tags&&t.tags.includes('__transfer__'))).reduce((s,t)=>s+t.amount,0);
  const expense = transactions.filter(t=>t.type==="expense" && !(t.tags&&t.tags.includes('__transfer__'))).reduce((s,t)=>s+t.amount,0);
  const savingsRate = income>0 ? Math.round(((income-expense)/income)*100) : 0;

  const taxDeductible = transactions.filter(t=>t.taxDeductible&&t.type==="expense").reduce((s,t)=>s+t.amount,0);

  // Forecasting logic
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const currentDay = now.getDate();

  const monthExpenses = transactions.filter(t => {
    if (t.type !== "expense") return false;
    const txDate = new Date(t.date);
    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
  }).reduce((s,t) => s + t.amount, 0);

  const dailyBurn = currentDay > 0 ? monthExpenses / currentDay : 0;
  const projectedSpend = dailyBurn * daysInMonth;
  const totalBudgetLimit = Object.values(budgets || {}).reduce((s, v) => s + v, 0);

  const recent = [...transactions].sort((a,b)=>b.id-a.id).slice(0,5);

  // Real weekly spend — last 7 days from actual transactions
  const today = new Date();
  const weekBars = Array.from({length:7},(_,i)=>{
    const d = new Date(today); d.setDate(d.getDate() - (6-i));
    const dStr = d.toISOString().slice(0,10);
    return transactions.filter(t=>t.type==="expense" && !(t.tags&&t.tags.includes('__transfer__')) && t.date===dStr).reduce((s,t)=>s+t.amount,0);
  });
  const wMax = Math.max(...weekBars,1);
  const days = Array.from({length:7},(_,i)=>{const d=new Date(today);d.setDate(d.getDate()-(6-i));return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()][0];});

  // Upcoming bills (next 7 days)
  const upcomingBills = subscriptions.filter(s=>{
    const due = new Date(s.nextDue), now = new Date();
    const diff = (due-now)/(1000*60*60*24);
    return diff>=0 && diff<=7;
  });

  // Real 8-week cash flow from transactions
  const cashFlow = Array.from({length:8},(_,i)=>{
    const weekEnd = new Date(today); weekEnd.setDate(weekEnd.getDate() - (7-i)*7 + 7);
    const weekStart = new Date(weekEnd); weekStart.setDate(weekStart.getDate() - 7);
    const wkTx = transactions.filter(t => {
      if (t.tags && t.tags.includes('__transfer__')) return false;
      const d = new Date(t.date);
      return d >= weekStart && d < weekEnd;
    });
    return {
      label: `W${i+1}`,
      inc: wkTx.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0),
      exp: wkTx.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0),
    };
  });
  const cfMax = Math.max(...cashFlow.flatMap(d=>[d.inc,d.exp]),1);

  const w = widgets;

  return (
    <div style={{paddingBottom:20}}>
      <div className="ph au">
        <div>
          <div style={{fontSize:12,color:"var(--t2)",fontWeight:600}}>Good evening, Nisarg 👋</div>
          <div className="ph-t">Dashboard</div>
        </div>
        <div style={{position:'relative'}}>
          <div className="av" onClick={() => setShowProfileMenu(!showProfileMenu)} style={{cursor:'pointer',background:'transparent',overflow:'hidden',padding:0}}>
            <img src="/logo.png" alt="SW" style={{width:'100%',height:'100%',borderRadius:13,objectFit:'cover'}}/>
          </div>
          {showProfileMenu && (
            <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:999}} onClick={() => setShowProfileMenu(false)}/>
          )}
          {showProfileMenu && (
            <div style={{position:'fixed',top:96,right:34,background:'var(--s2)',border:'1px solid var(--border)',borderRadius:12,padding:8,zIndex:1000,boxShadow:'0 10px 40px rgba(0,0,0,0.8)',minWidth:140}}>
              <button 
                onClick={onSignOut} 
                style={{width:'100%',padding:'10px 12px',background:'rgba(244,63,94,0.1)',border:'none',borderRadius:8,color:'var(--red)',fontFamily:'var(--font)',fontSize:13,fontWeight:700,cursor:'pointer',textAlign:'left'}}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* NET WORTH HERO */}
      {w.net_worth && (
        <div className="au d1" style={{margin:"0 18px 14px",background:"linear-gradient(135deg,#0B0B28 0%,#18125C 50%,#0B0B28 100%)",
          borderRadius:24,padding:"22px 24px",position:"relative",overflow:"hidden",
          border:"1px solid rgba(123,111,255,0.2)",boxShadow:"0 20px 60px rgba(123,111,255,0.15)"}}>
          <div style={{position:"absolute",top:-50,right:-50,width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(123,111,255,0.25) 0%,transparent 70%)"}}/>
          <div style={{position:"absolute",bottom:-40,left:-40,width:140,height:140,borderRadius:"50%",background:"radial-gradient(circle,rgba(34,211,238,0.08) 0%,transparent 70%)"}}/>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Total Net Worth</div>
          <div style={{fontSize:40,fontWeight:900,letterSpacing:-2,lineHeight:1,background:"linear-gradient(135deg,#fff,rgba(255,255,255,.55))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontFamily:"var(--mono)",marginBottom:14}}>
            {fmt(netWorth)}
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <span className="pill" style={{background:"rgba(16,185,129,0.12)",color:"#10B981"}}>🏦 {fmtK(totalBank)}</span>
            <span className="pill" style={{background:"rgba(244,63,94,0.12)",color:"#F43F5E"}}>💳 {fmtK(totalCC)} debt</span>
            <span className="pill" style={{background:"rgba(245,158,11,0.12)",color:"#F59E0B"}}>📈 {savingsRate}% saved</span>
          </div>
        </div>
      )}

      {/* END OF MONTH FORECAST WIDGET */}
      {w.net_worth && (
        <div className="au d1" style={{margin:"0 18px 14px",background:"var(--s2)",borderRadius:20,padding:"18px 20px",border:"1px solid var(--border)",position:"relative",overflow:"hidden"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <div style={{fontSize:18}}>🔮</div>
            <div style={{fontSize:14,fontWeight:800,color:"var(--text)"}}>Month-End Forecast</div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:14}}>
            <div>
              <div style={{fontSize:11,color:"var(--t2)",marginBottom:4}}>SPENT SO FAR</div>
              <div style={{fontSize:24,fontWeight:900,color:"var(--text)",fontFamily:"var(--mono)"}}>{fmt(monthExpenses)}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:11,color:"var(--t2)",marginBottom:4}}>PROJECTED</div>
              <div style={{fontSize:24,fontWeight:900,color: projectedSpend > (totalBudgetLimit||9999999) ? "var(--red)" : "var(--cyan)",fontFamily:"var(--mono)"}}>{fmt(projectedSpend)}</div>
            </div>
          </div>
          <div className="pt" style={{height:6,background:"var(--bg)",position:"relative"}}>
            <div className="pf" style={{width:`${Math.min(100,(currentDay/daysInMonth)*100)}%`,background:"var(--cyan)",opacity:0.4}}/>
            <div className="pf" style={{width:`${Math.min(100,(monthExpenses/(totalBudgetLimit||projectedSpend||1))*100)}%`,background:projectedSpend > (totalBudgetLimit||9999999)?"var(--red)":"var(--indigo)",position:"absolute",left:0,top:0}}/>
          </div>
          <div style={{fontSize:11,color:"var(--t2)",marginTop:12,lineHeight:1.4}}>
            You're spending about <strong style={{color:"var(--text)"}}>{fmt(dailyBurn)}/day</strong>. 
            At this rate, {totalBudgetLimit > 0 ? (
              projectedSpend > totalBudgetLimit 
                ? <span style={{color:"var(--red)"}}>you'll miss your set budget by {fmt(projectedSpend - totalBudgetLimit)}.</span>
                : <span style={{color:"var(--green)"}}>you'll beat your set budget by {fmt(totalBudgetLimit - projectedSpend)}!</span>
            ) : "this will be your total spend for the month."}
          </div>
        </div>
      )}

      {/* FINANCIAL HEALTH SCORE WIDGET */}
      {w.health_score && (
        <div className="au d1" 
          onClick={() => setShowHealthScore(true)}
          style={{
            margin:"0 18px 14px",
            background:"var(--s1)",
            border:"1px solid var(--border)",
            borderRadius:20,
            padding:"16px 18px",
            boxShadow:"0 10px 30px rgba(0,0,0,0.15)",
            cursor:"pointer",
            position:"relative",
            overflow:"hidden",
            transition:"all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Subtle Ambient light inside card */}
          <div style={{
            position:"absolute",
            top:-20,
            right:-20,
            width:120,
            height:120,
            borderRadius:"50%",
            background:`radial-gradient(circle, ${
              health.overallScore >= 90 ? "rgba(16, 185, 129, 0.12)" : 
              health.overallScore >= 75 ? "rgba(34, 211, 238, 0.12)" : 
              health.overallScore >= 50 ? "rgba(245, 158, 11, 0.12)" : 
              "rgba(239, 68, 68, 0.12)"
            } 0%, transparent 70%)`,
            pointerEvents:"none"
          }}/>
          
          <div style={{display:"flex", alignItems:"center", gap:16, position:"relative", zIndex:2}}>
            <Ring pct={health.overallScore / 100} 
              color={
                health.overallScore >= 90 ? "var(--green)" : 
                health.overallScore >= 75 ? "var(--cyan)" : 
                health.overallScore >= 50 ? "var(--amber)" : 
                "var(--red)"
              } 
              size={72} 
              stroke={6}
            >
              <div style={{fontSize:18, fontWeight:900, fontFamily:"var(--mono)", color:"var(--text)"}}>
                <AnimatedNumber value={health.overallScore} />
              </div>
              <div style={{fontSize:8, color:"var(--t2)", textTransform:"uppercase", letterSpacing:0.3}}>Index</div>
            </Ring>
            
            <div style={{flex:1}}>
              <div style={{fontSize:10, color:"var(--t2)", fontWeight:800, letterSpacing:1, textTransform:"uppercase", marginBottom:3}}>Financial Health Score</div>
              <div style={{
                fontSize:16, 
                fontWeight:900, 
                color: 
                  health.overallScore >= 90 ? "var(--green)" : 
                  health.overallScore >= 75 ? "var(--cyan)" : 
                  health.overallScore >= 50 ? "var(--amber)" : 
                  "var(--red)"
              }}>
                {
                  health.overallScore >= 90 ? "Excellent Pulse 🌟" : 
                  health.overallScore >= 75 ? "Looking Good 👍" : 
                  health.overallScore >= 50 ? "Fair Balance ⚖️" : 
                  "Needs Attention ⚠️"
                }
              </div>
              <div style={{fontSize:11, color:"var(--t2)", marginTop:4, lineHeight:1.3}}>
                {
                  health.overallScore >= 90 ? "Top-tier habits! Tap to view detailed breakdown & recommendations." :
                  health.overallScore >= 75 ? "Looking solid! Tap to see simple steps to score a perfect 100." :
                  health.overallScore >= 50 ? "Steady progress. Tap to view custom optimization plans." :
                  "High debt or high spend is dragging you down. Tap to fix it!"
                }
              </div>
            </div>
            <div style={{fontSize:16, color:"var(--t3)"}}>→</div>
          </div>
        </div>
      )}

      {/* BANK CARDS */}
      {w.bank_cards && banks.length>0 && (
        <div className="au d1">
          <div className="sh"><div className="sh-t">🏦 Bank Accounts</div><div className="sh-a" onClick={onAddAcct}>+ Add</div></div>
          <div style={{display:"flex",overflowX:"auto",padding:"0 18px 4px",scrollbarWidth:"none",scrollSnapType:"x mandatory",scrollBehavior:"smooth"}}>
            {banks.map(a=><BankCardVis key={a.id} a={a} onPress={()=>onEditAcct(a)}/>)}
          </div>
        </div>
      )}

      {/* CREDIT CARDS */}
      {w.credit_cards && ccs.length>0 && (
        <div className="au d2">
          <div className="sh"><div className="sh-t">💳 Credit Cards</div><div className="sh-a" onClick={onAddAcct}>+ Add</div></div>
          {ccs.map(cc=>{
            const p=cc.limit?cc.balance/cc.limit:0;
            return (
              <div key={cc.id} style={{padding:"12px 18px"}}>
                <div style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer",borderRadius:14}} onClick={()=>onEditAcct(cc)}>
                  <div style={{width:44,height:44,borderRadius:14,background:cc.color+"44",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{cc.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,marginBottom:5}}>{cc.name}</div>
                    <div className="pt"><div className="pf" style={{width:`${p*100}%`,background:p>.8?"var(--red)":p>.5?"var(--amber)":"var(--cyan)"}}/></div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:14,fontWeight:800,fontFamily:"var(--mono)",color:"var(--red)"}}>{fmt(cc.balance)}</div>
                    <div style={{fontSize:10,color:"var(--t2)",fontFamily:"var(--mono)"}}>of {fmt(cc.limit)}</div>
                  </div>
                </div>
                <div style={{display:"flex",justifyContent:"flex-end",marginTop:10}}>
                  <button onClick={(e)=>{e.stopPropagation();onPayBill(cc);}} style={{background:'rgba(123,111,255,0.18)',color:'#C4BEFF',border:'none',padding:'5px 12px',borderRadius:8,fontSize:10,fontWeight:800,cursor:'pointer'}}>Pay Bill</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QUICK STATS */}
      {w.quick_stats && (
        <div className="au d2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,padding:"0 18px 14px"}}>
          
          {/* Savings Rate Card */}
          <div className="scell glass-stat" style={{position:'relative', overflow:'hidden'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
              <div>
                <div className="slb">Savings Rate</div>
                <div className="sval" style={{color: savingsRate > 20 ? "var(--green)" : "var(--amber)"}}>{savingsRate}%</div>
              </div>
              <div style={{width: 32, height: 32, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14}}>📈</div>
            </div>
            <div className="pt" style={{height: 4, background: 'var(--s3)', marginTop: 10, borderRadius: 100}}>
              <div className="pf" style={{width: `${Math.max(0, Math.min(savingsRate, 100))}%`, background: savingsRate > 20 ? 'linear-gradient(90deg, var(--indigo), var(--green))' : 'linear-gradient(90deg, var(--amber), var(--orange))'}}/>
            </div>
            <div style={{fontSize: 9, color: 'var(--t2)', marginTop: 6}}>{savingsRate > 20 ? "Target achieved! 🎯" : "Increase to hit goals"}</div>
          </div>

          {/* Daily Avg Card */}
          <div className="scell glass-stat">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
              <div>
                <div className="slb">Daily Avg</div>
                <div className="sval" style={{color: 'var(--text)'}}>{fmtK(expense/28)}</div>
              </div>
              <div style={{width: 32, height: 32, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14}}>⚡</div>
            </div>
            <div style={{display:'flex', alignItems:'center', gap: 4, marginTop: 12}}>
              <span style={{fontSize: 9, color: 'var(--t2)'}}>Burn rate over 28 days</span>
            </div>
          </div>

          {/* Income Card */}
          <div className="scell glass-stat" style={{background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.04) 0%, rgba(6, 6, 15, 0.95) 100%)', border: '1px solid rgba(16, 185, 129, 0.15)'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
              <div>
                <div className="slb" style={{color: '#34d399'}}>Total Income</div>
                <div className="sval" style={{color: 'var(--green)'}}>{fmt(income)}</div>
              </div>
              <div style={{width: 30, height: 30, borderRadius: 10, background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green)', fontSize: 13}}>▲</div>
            </div>
            <div style={{fontSize: 9, color: 'var(--t2)', marginTop: 12}}>From salary & other sources</div>
          </div>

          {/* Expenses Card */}
          <div className="scell glass-stat" style={{background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.04) 0%, rgba(6, 6, 15, 0.95) 100%)', border: '1px solid rgba(244, 63, 94, 0.15)'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
              <div>
                <div className="slb" style={{color: '#f43f5e'}}>Total Expenses</div>
                <div className="sval" style={{color: 'var(--red)'}}>{fmt(expense)}</div>
              </div>
              <div style={{width: 30, height: 30, borderRadius: 10, background: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)', fontSize: 13}}>▼</div>
            </div>
            <div style={{fontSize: 9, color: 'var(--t2)', marginTop: 12}}>Total outflows recorded</div>
          </div>

        </div>
      )}

      {/* MONTHLY RING */}
      {w.monthly_ring && (
        <div className="au d3" style={{margin:"0 18px 14px"}}>
          <div className="card glass-stat" style={{position:'relative', overflow:'hidden'}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:800}}>Income & Expense Flow</div>
              <span className="pill" style={{background: 'rgba(255,255,255,0.03)', color: 'var(--t2)', fontSize: 10}}>{new Date().toLocaleString('en-US',{month:'long',year:'numeric'})}</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:24}}>
              <div style={{position:'relative', display:'flex', justifyContent:'center', alignItems:'center'}}>
                <Ring pct={expense/(income||1)} color={expense>income?"var(--red)":"var(--indigo)"} size={106} stroke={9}>
                  <div style={{fontSize:16,fontWeight:900,fontFamily:"var(--mono)"}}>{Math.round((expense/(income||1))*100)}%</div>
                  <div style={{fontSize:8,color:"var(--t2)",textTransform:'uppercase',letterSpacing:0.5,marginTop:1}}>spent</div>
                </Ring>
                <div style={{position:'absolute', width: 130, height: 130, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,111,255,0.06) 0%, transparent 70%)', pointerEvents:'none'}}/>
              </div>
              <div style={{flex:1}}>
                {[
                  {lb:"Income",v:income,c:"var(--green)",ic:"▲",bg:"rgba(16,185,129,0.08)"},
                  {lb:"Expense",v:expense,c:"var(--red)",ic:"▼",bg:"rgba(244,63,94,0.08)"},
                  {lb:"Saved",v:Math.max(0,income-expense),c:"var(--cyan)",ic:"●",bg:"rgba(34,211,238,0.08)"},
                  {lb:"Deductible",v:taxDeductible,c:"var(--violet)",ic:"🧾",bg:"rgba(168,85,247,0.08)"},
                ].map(r=>(
                  <div key={r.lb} className="ring-stat-row" style={{
                    display:"flex",
                    justifyContent:"space-between",
                    alignItems:"center",
                    marginBottom:8,
                    padding: '5px 8px',
                    borderRadius: 8,
                    background: r.bg,
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <span style={{color:r.c,fontSize:10}}>{r.ic}</span>
                      <span style={{fontSize:11,color:"var(--text)",fontWeight:600}}>{r.lb}</span>
                    </div>
                    <span style={{fontSize:12,fontWeight:800,fontFamily:"var(--mono)",color:r.c}}>{fmt(r.v)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SPENDING BARS */}
      {w.spending_bars && (
        <div className="au d3" style={{margin:"0 18px 14px"}}>
          <div className="card glass-stat" style={{position:'relative', overflow:'visible'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:800}}>Weekly Spend Trend</div>
              <span className="pill" style={{background:'rgba(123,111,255,0.1)', color:'#A89FFF'}}>{fmtK(weekBars.reduce((s,x)=>s+x,0))} total</span>
            </div>
            <div style={{display:"flex",alignItems:"flex-end",gap:8,height:90,paddingTop:14,position:'relative'}}>
              {weekBars.map((v,i)=>{
                const isToday = i === 6;
                const percentageHeight = (v/wMax)*68;
                return (
                  <div key={i} className="bar-container" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,position:'relative'}}>
                    {/* Tooltip on hover */}
                    <div className="bar-value" style={{
                      position: 'absolute',
                      bottom: percentageHeight + 10,
                      background: 'var(--s4)',
                      padding: '2px 5px',
                      borderRadius: 4,
                      fontSize: 8,
                      fontFamily: 'var(--mono)',
                      color: '#fff',
                      opacity: 0,
                      transform: 'translateY(5px) scale(0.9)',
                      transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
                      pointerEvents: 'none',
                      whiteSpace: 'nowrap',
                      border: '1px solid var(--border2)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                    }}>${Math.round(v)}</div>

                    <div className="spend-bar" style={{
                      width:"100%",
                      height:`${percentageHeight}px`,
                      borderRadius:"6px 6px 0 0",
                      background: isToday 
                        ? "linear-gradient(180deg, var(--indigo) 0%, var(--cyan) 100%)" 
                        : v > 0 
                          ? "linear-gradient(180deg, var(--s4) 0%, var(--s3) 100%)"
                          : "var(--s2)",
                      boxShadow: isToday ? "0 0 14px rgba(123,111,255,0.4)" : "none",
                      transition:"all 0.6s cubic-bezier(0.34,1.56,0.64,1)",
                      minHeight:3,
                      cursor: 'pointer'
                    }}/>
                    <div style={{fontSize:8,color:isToday?"#A89FFF":"var(--t2)",fontWeight:isToday?800:600,marginTop:2}}>{days[i]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CASH FLOW */}
      {w.cash_flow && (
        <div className="au d3" style={{margin:"0 18px 14px"}}>
          <div className="card">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontSize:13,fontWeight:800}}>Cash Flow — 30 Days</div>
              <span className="ftag ftag-p">PREMIUM</span>
            </div>
            <div style={{display:"flex",alignItems:"flex-end",gap:4,height:80}}>
              {cashFlow.map((d,i)=>(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                  <div style={{width:"100%",display:"flex",flexDirection:"column",gap:1}}>
                    <div style={{width:"100%",height:`${(d.inc/cfMax)*36}px`,borderRadius:"3px 3px 0 0",background:"rgba(16,185,129,0.35)",minHeight:2}}/>
                    <div style={{width:"100%",height:`${(d.exp/cfMax)*36}px`,borderRadius:"0 0 3px 3px",background:"rgba(244,63,94,0.35)",minHeight:2}}/>
                  </div>
                  <div style={{fontSize:7,color:"var(--t2)",fontWeight:600}}>{d.label}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:12,marginTop:8}}>
              <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:8,height:8,borderRadius:2,background:"rgba(16,185,129,0.5)"}}/><span style={{fontSize:10,color:"var(--t2)"}}>Income</span></div>
              <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:8,height:8,borderRadius:2,background:"rgba(244,63,94,0.5)"}}/><span style={{fontSize:10,color:"var(--t2)"}}>Expense</span></div>
            </div>
          </div>
        </div>
      )}

      {/* SAVINGS GOALS */}
      {w.savings_goals && (
        <div className="au d4">
          <div className="sh">
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div className="sh-t">🎯 Savings Goals</div>
              <span className="ftag ftag-p">PREMIUM</span>
            </div>
          </div>
          {savings.map(sg=>{
            const p=sg.saved/sg.target;
            return (
              <div key={sg.id} style={{margin:"0 18px 10px"}}>
                <div className="card" style={{border:`1px solid ${sg.color}22`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:40,height:40,borderRadius:12,background:sg.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{sg.icon}</div>
                      <div>
                        <div style={{fontSize:14,fontWeight:700}}>{sg.name}</div>
                        <div style={{fontSize:10,color:"var(--t2)",marginTop:1}}>Due {new Date(sg.deadline).toLocaleDateString("en-US",{month:"short",year:"numeric"})}</div>
                      </div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:16,fontWeight:900,fontFamily:"var(--mono)",color:sg.color}}>{Math.round(p*100)}%</div>
                      <div style={{fontSize:10,color:"var(--t2)"}}>{fmtK(sg.target-sg.saved)} left</div>
                    </div>
                  </div>
                  <div className="pt"><div className="pf" style={{width:`${p*100}%`,background:sg.color}}/></div>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize:11,color:"var(--t2)"}}>
                    <span style={{color:sg.color,fontWeight:700}}>{fmt(sg.saved)} saved</span>
                    <span>of {fmt(sg.target)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUBSCRIPTIONS */}
      {w.subscriptions && (
        <div className="au d4">
          <div className="sh">
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div className="sh-t">🔄 Subscriptions</div>
              <span className="ftag ftag-p">PREMIUM</span>
            </div>
            <div className="sh-a" onClick={()=>setTab("subscriptions")}>Manage</div>
          </div>
          <div style={{margin:"0 18px 14px",background:"var(--s2)",borderRadius:18,padding:"4px 0"}}>
            {subscriptions.slice(0,4).map(s=>(
              <div key={s.id} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:12}}>
                <div style={{width:36,height:36,borderRadius:11,background:s.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>{s.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700}}>{s.name}</div>
                  <div style={{fontSize:10,color:"var(--t2)"}}>{s.cycle} · next {new Date(s.nextDue).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div>
                </div>
                <div style={{fontSize:13,fontWeight:800,fontFamily:"var(--mono)",color:"var(--text)"}}>{fmt(s.amount)}</div>
              </div>
            ))}
            <div style={{padding:"8px 14px",borderTop:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:11,color:"var(--t2)"}}>Monthly total</span>
              <span style={{fontSize:14,fontWeight:800,fontFamily:"var(--mono)",color:"var(--amber)"}}>{fmt(subscriptions.reduce((s,x)=>s+x.amount,0))}</span>
            </div>
          </div>
        </div>
      )}

      {/* UPCOMING BILLS */}
      {w.bills_upcoming && upcomingBills.length>0 && (
        <div className="au d4">
          <div className="sh">
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div className="sh-t">📅 Due Soon</div>
              <span className="ftag ftag-p">PREMIUM</span>
            </div>
          </div>
          <div style={{margin:"0 18px 14px",background:"rgba(244,63,94,0.06)",border:"1px solid rgba(244,63,94,0.15)",borderRadius:16,padding:"4px 0"}}>
            {upcomingBills.map(b=>{
              const days=Math.ceil((new Date(b.nextDue)-new Date())/(1000*60*60*24));
              return (
                <div key={b.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px"}}>
                  <div style={{width:36,height:36,borderRadius:11,background:b.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>{b.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700}}>{b.name}</div>
                    <div style={{fontSize:10,color:"var(--red)"}}>Due in {days} day{days!==1?"s":""}</div>
                  </div>
                  <div style={{fontSize:13,fontWeight:800,fontFamily:"var(--mono)",color:"var(--red)"}}>{fmt(b.amount)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CC UTILIZATION */}
      {w.cc_util && ccs.length>0 && (
        <div className="au d4" style={{margin:"0 18px 14px"}}>
          <div className="card">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <div style={{fontSize:13,fontWeight:800}}>Credit Utilization</div>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <span className="ftag ftag-p">PREMIUM</span>
                <span className="pill" style={{background:ccUtil>.3?"rgba(244,63,94,0.15)":"rgba(16,185,129,0.15)",color:ccUtil>.3?"var(--red)":"var(--green)"}}>{Math.round(ccUtil*100)}%</span>
              </div>
            </div>
            <div style={{fontSize:11,color:"var(--t2)",marginBottom:10}}>{ccUtil<.3?"✅ Excellent — below 30% threshold":"⚠️ High — try to pay down before statement"}</div>
            <div className="pt" style={{height:8}}>
              <div className="pf" style={{width:`${ccUtil*100}%`,background:ccUtil>.3?"var(--red)":"var(--green)"}}/>
            </div>
            <div style={{fontSize:11,color:"var(--t2)",marginTop:8}}>{fmt(totalCC)} used of {fmt(totalCCLimit)} total limit</div>
          </div>
        </div>
      )}

      {/* TAX SUMMARY */}
      {w.tax_summary && (
        <div className="au d5" style={{margin:"0 18px 14px"}}>
          <div className="card" style={{background:"linear-gradient(135deg,#0a1628,#0f2846)",border:"1px solid rgba(14,165,233,0.2)"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:800,color:"var(--sky)"}}>🧾 Tax Deductibles YTD</div>
              <span className="ftag ftag-p">PREMIUM</span>
            </div>
            <div style={{fontSize:32,fontWeight:900,letterSpacing:-1.5,fontFamily:"var(--mono)",color:"var(--sky)",marginBottom:8}}>{fmt(taxDeductible)}</div>
            <div style={{fontSize:11,color:"rgba(14,165,233,0.6)"}}>
              {transactions.filter(t=>t.taxDeductible&&t.type==="expense").length} deductible transactions · Est. savings ~{fmt(taxDeductible*0.22)} at 22% bracket
            </div>
          </div>
        </div>
      )}

      {/* MILEAGE TRACKER */}
      {w.mileage && (
        <div className="au d5" style={{margin:"0 18px 14px"}}>
          <div className="card" style={{background:"linear-gradient(135deg,#0a1a0a,#0f3d1a)",border:"1px solid rgba(132,204,22,0.2)"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:800,color:"var(--lime)"}}>🚗 Mileage Tracker</div>
              <span className="ftag ftag-p">PREMIUM</span>
            </div>
            <div style={{display:"flex",gap:16}}>
              <div><div style={{fontSize:11,color:"rgba(132,204,22,0.6)"}}>Miles Logged</div><div style={{fontSize:24,fontWeight:900,fontFamily:"var(--mono)",color:"var(--lime)"}}>347 mi</div></div>
              <div><div style={{fontSize:11,color:"rgba(132,204,22,0.6)"}}>Reimbursable</div><div style={{fontSize:24,fontWeight:900,fontFamily:"var(--mono)",color:"var(--lime)"}}>{fmt(347*0.67)}</div></div>
            </div>
            <div style={{fontSize:10,color:"rgba(132,204,22,0.5)",marginTop:6}}>IRS rate: $0.67/mile · {new Date().getFullYear()} rate</div>
          </div>
        </div>
      )}

      {/* RECENT TRANSACTIONS */}
      {w.recent_tx && (
        <div className="au d5">
          <div className="sh"><div className="sh-t">Recent</div><div className="sh-a" onClick={()=>setTab("transactions")}>See all →</div></div>
          {recent.map(tx=>{
            const cat=CATS.find(c=>c.id===tx.category)||CATS[CATS.length-1];
            const acct=accounts.find(a=>a.id===tx.accountId);
            return (
              <div key={tx.id} className="txr">
                <div className="txic" style={{background:cat.col+"22"}}>{cat.ic}</div>
                <div className="txin">
                  <div className="txno">{tx.note}</div>
                  <div className="txsb">
                    <span>{cat.lb}</span>
                    {acct&&<span className="abadge">{acct.icon} {acct.name}</span>}
                    {tx.recurring&&<span className="recbadge">🔄 recurring</span>}
                    {tx.taxDeductible&&<span className="taxbadge">🧾 deductible</span>}
                  </div>
                </div>
                <div className="txam" style={{color:tx.type==="income"?"var(--green)":"var(--text)"}}>
                  {tx.type==="income"?"+":"-"}{fmt(tx.amount)}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showHealthScore && (
        <HealthScoreModal health={health} onClose={() => setShowHealthScore(false)} />
      )}
    </div>
  );
}

// ─── ACCOUNTS SCREEN ──────────────────────────────────────────────────────────
function AccountsScreen({accounts,transactions,onEditAcct,onAddAcct,onPayBill}){
  const banks=accounts.filter(a=>a.type==="bank");
  const ccs=accounts.filter(a=>a.type==="credit");
  const totalAssets=banks.reduce((s,a)=>s+a.balance,0);
  const totalDebt=ccs.reduce((s,a)=>s+a.balance,0);
  return (
    <div style={{paddingBottom:20}}>
      <div className="ph au">
        <div className="ph-t">Accounts</div>
        <div onClick={onAddAcct} style={{padding:"7px 14px",background:"rgba(123,111,255,0.18)",borderRadius:12,fontSize:12,fontWeight:800,color:"#C4BEFF",cursor:"pointer"}}>+ Add</div>
      </div>
      <div className="au d1" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,padding:"0 18px 14px"}}>
        <div className="scell"><div className="slb">Total Assets</div><div className="sval" style={{color:"var(--green)",fontSize:18}}>{fmtK(totalAssets)}</div></div>
        <div className="scell"><div className="slb">Total Debt</div><div className="sval" style={{color:"var(--red)",fontSize:18}}>{fmtK(totalDebt)}</div></div>
        <div className="scell" style={{gridColumn:"span 2"}}><div className="slb">Net Worth</div><div className="sval" style={{color:"#C4BEFF"}}>{fmt(totalAssets-totalDebt)}</div></div>
      </div>
      <div className="au d2">
        <div className="sh"><div className="sh-t">🏦 Bank Accounts ({banks.length})</div></div>
        {banks.map(a=>{
          const lastTx=[...transactions].filter(t=>t.accountId===a.id).sort((x,y)=>y.id-x.id)[0];
          return (
            <div key={a.id} style={{margin:"0 18px 10px",borderRadius:18,overflow:'visible',cursor:"pointer"}}>
              <div onClick={()=>onEditAcct(a)} style={{background:BANK_THEMES[a.themeIdx||0],padding:"16px 18px",position:"relative",borderRadius:18}}>
                <div style={{position:"absolute",right:-20,top:-20,width:110,height:110,borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.45)",letterSpacing:1,textTransform:"uppercase",marginBottom:3}}>···{a.last4} · {a.bank}</div>
                    <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:8}}>{a.name}</div>
                    <div style={{fontSize:26,fontWeight:900,letterSpacing:-1,fontFamily:"var(--mono)",color:"#fff"}}>{fmt(a.balance)}</div>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
                    <div style={{fontSize:26}}>{a.icon}</div>
                  </div>
                </div>
                {lastTx&&<div style={{marginTop:10,fontSize:10,color:"rgba(255,255,255,0.4)"}}>Last: {lastTx.type==="income"?"+":"-"}{fmt(lastTx.amount)} · {lastTx.note}</div>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="au d3">
        <div className="sh"><div className="sh-t">💳 Credit Cards ({ccs.length})</div></div>
        {ccs.map(cc=>{
          const p=cc.limit?cc.balance/cc.limit:0;
          return (
            <div key={cc.id} onClick={()=>onEditAcct(cc)} style={{margin:"0 18px 10px"}}>
              <div className="card" style={{border:`1px solid ${p>.8?"rgba(244,63,94,0.3)":"var(--border)"}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:42,height:42,borderRadius:14,background:cc.color+"44",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{cc.icon}</div>
                    <div>
                      <div style={{fontSize:14,fontWeight:700}}>{cc.name}</div>
                      <div style={{fontSize:10,color:"var(--t2)",marginTop:1}}>{cc.bank} · ···{cc.last4}</div>
                    </div>
                  </div>
                  <span className="pill" style={{background:p>.8?"rgba(244,63,94,0.15)":"rgba(16,185,129,0.15)",color:p>.8?"var(--red)":"var(--green)"}}>{Math.round(p*100)}% used</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                  <div><div style={{fontSize:9,color:"var(--t2)",marginBottom:2}}>BALANCE DUE</div><div style={{fontSize:20,fontWeight:900,fontFamily:"var(--mono)",color:"var(--red)"}}>{fmt(cc.balance)}</div></div>
                  <div style={{textAlign:"right"}}><div style={{fontSize:9,color:"var(--t2)",marginBottom:2}}>AVAILABLE</div><div style={{fontSize:20,fontWeight:900,fontFamily:"var(--mono)",color:"var(--green)"}}>{fmt(cc.limit-cc.balance)}</div></div>
                </div>
                <div className="pt" style={{height:6}}><div className="pf" style={{width:`${p*100}%`,background:p>.8?"var(--red)":p>.5?"var(--amber)":"var(--cyan)"}}/></div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginTop:6}}>
                  <div style={{fontSize:10,color:"var(--t2)"}}>Limit {fmt(cc.limit)} · {p<.3?"✅ Great score impact":"⚠️ Keep below 30%"}</div>
                  <button onClick={(e)=>{e.stopPropagation();onPayBill(cc);}} style={{background:'rgba(123,111,255,0.18)',color:'#C4BEFF',border:'none',padding:'6px 14px',borderRadius:8,fontSize:11,fontWeight:800,cursor:'pointer'}}>Pay Bill</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── TRANSACTIONS SCREEN ──────────────────────────────────────────────────────
function TxScreen({transactions,accounts,onEditTx,onClearHistory}){
  const [fType,setFType]=useState("all");
  const [fAcct,setFAcct]=useState("all");
  const [fCat,setFCat]=useState("all");
  const [search,setSearch]=useState("");
  const [showTax,setShowTax]=useState(false);

  let filtered=transactions;
  if(fType!=="all") filtered=filtered.filter(t=>t.type===fType);
  if(fAcct!=="all") filtered=filtered.filter(t=>t.accountId===fAcct);
  if(fCat!=="all") filtered=filtered.filter(t=>t.category===fCat);
  if(showTax) filtered=filtered.filter(t=>t.taxDeductible);
  if(search) filtered=filtered.filter(t=>t.note.toLowerCase().includes(search.toLowerCase()));

  const sorted=[...filtered].sort((a,b)=>b.id-a.id);
  const grouped={};
  sorted.forEach(tx=>{if(!grouped[tx.date])grouped[tx.date]=[];grouped[tx.date].push(tx);});

  const totalFiltered=sorted.reduce((s,t)=>s+(t.type==="income"?t.amount:-t.amount),0);

  return (
    <div style={{paddingBottom:20}}>
      <div className="ph au">
        <div className="ph-t">Transactions</div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {showTax&&<span className="ftag ftag-p">TAX</span>}
          <div style={{fontSize:13,fontWeight:700,fontFamily:"var(--mono)",color:totalFiltered>=0?"var(--green)":"var(--red)"}}>{totalFiltered>=0?"+":""}{fmt(totalFiltered)}</div>
          <button onClick={onClearHistory} style={{padding:"6px 12px",borderRadius:999,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",color:"white",fontSize:12,cursor:"pointer"}}>Clear History</button>
        </div>
      </div>

      {/* Search */}
      <div className="au d1 sbar-wrap">
        <div className="sbar-ico">🔍</div>
        <input className="sbar-inp" placeholder="Search transactions..." value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>

      {/* Filters */}
      <div className="au d1 sel-row" style={{padding:"0 18px 6px"}}>
        {[["all","All"],["expense","Expense"],["income","Income"]].map(([v,l])=>(
          <div key={v} className={`chip ${fType===v?"on":""}`} onClick={()=>setFType(v)}>{l}</div>
        ))}
        <div className={`chip ${showTax?"on":""}`} onClick={()=>setShowTax(!showTax)}>🧾 Tax</div>
      </div>
      <div className="au d2 sel-row" style={{padding:"0 18px 10px"}}>
        <div className={`chip ${fAcct==="all"?"on":""}`} onClick={()=>setFAcct("all")}>All Accts</div>
        {accounts.map(a=>(
          <div key={a.id} className={`chip ${fAcct===a.id?"on":""}`} onClick={()=>setFAcct(a.id)}>{a.icon} {a.name}</div>
        ))}
      </div>

      <div className="au d3">
        {Object.entries(grouped).map(([date,txs])=>{
          const dayTotal=txs.reduce((s,t)=>s+(t.type==="income"?t.amount:-t.amount),0);
          return (
            <div key={date}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 18px 4px"}}>
                <div style={{fontSize:10,fontWeight:800,color:"var(--t2)",letterSpacing:.5,textTransform:"uppercase"}}>
                  {new Date(date+"T12:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}
                </div>
                <div style={{fontSize:11,fontWeight:800,fontFamily:"var(--mono)",color:dayTotal>=0?"var(--green)":"var(--red)"}}>
                  {dayTotal>=0?"+":""}{fmt(dayTotal)}
                </div>
              </div>
              {txs.map(tx=>{
                const cat=CATS.find(c=>c.id===tx.category)||CATS[CATS.length-1];
                const acct=accounts.find(a=>a.id===tx.accountId);
                return (
                  <div key={tx.id} className="txr" style={{margin:"0 8px",cursor:'pointer'}} onClick={() => onEditTx && onEditTx(tx)}>
                    <div className="txic" style={{background:cat.col+"22"}}>{cat.ic}</div>
                    <div className="txin">
                      <div className="txno">{tx.note}</div>
                      <div className="txsb">
                        <span>{cat.lb}</span>
                        {acct&&<span className="abadge">{acct.icon} {acct.name}</span>}
                        {tx.recurring&&<span className="recbadge">🔄</span>}
                        {tx.taxDeductible&&<span className="taxbadge">🧾</span>}
                        {tx.tags&&tx.tags.map(t=><span key={t} className="abadge">#{t}</span>)}
                      </div>
                    </div>
                    <div className="txam" style={{color:tx.type==="income"?"var(--green)":"var(--text)"}}>
                      {tx.type==="income"?"+":"-"}{fmt(tx.amount)}
                    </div>
                  </div>
                );
              })}
              <div className="div" style={{marginTop:4}}/>
            </div>
          );
        })}
        {sorted.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:"var(--t2)",fontSize:13}}>No transactions found</div>}
      </div>
    </div>
  );
}

// ─── BUDGET SCREEN ────────────────────────────────────────────────────────────
function BudgetScreen({transactions,budgets,onBudgetChange}){
  const expenses=transactions.filter(t=>t.type==="expense");
  const [editing,setEditing]=useState(null);
  const [editVal,setEditVal]=useState("");

  const catData=CATS.map(c=>{
    const spent=expenses.filter(t=>t.category===c.id).reduce((s,t)=>s+t.amount,0);
    const budget=budgets[c.id]||0;
    const pct=budget>0?spent/budget:0;
    const status=pct>=1?"over":pct>=.8?"warn":"ok";
    return {...c,spent,budget,pct,status};
  }).filter(c=>c.budget>0||c.spent>0);

  const totalBudget=catData.reduce((s,c)=>s+c.budget,0);
  const totalSpent=catData.reduce((s,c)=>s+c.spent,0);
  const overallPct=totalBudget>0?totalSpent/totalBudget:0;

  return (
    <div style={{paddingBottom:20}}>
      <div className="ph au">
        <div className="ph-t">Budgets</div>
        <span className="pill" style={{background:overallPct>.8?"rgba(244,63,94,0.15)":"rgba(16,185,129,0.15)",color:overallPct>.8?"var(--red)":"var(--green)"}}>{Math.round(overallPct*100)}% used</span>
      </div>

      {/* Overall ring */}
      <div className="au d1" style={{margin:"0 18px 14px"}}>
        <div className="card" style={{display:"flex",alignItems:"center",gap:18}}>
          <Ring pct={overallPct} color={overallPct>1?"var(--red)":overallPct>.8?"var(--amber)":"var(--indigo)"} size={96} stroke={8}>
            <div style={{fontSize:16,fontWeight:900,fontFamily:"var(--mono)"}}>{Math.round(overallPct*100)}%</div>
            <div style={{fontSize:8,color:"var(--t2)"}}>of budget</div>
          </Ring>
          <div>
            <div style={{fontSize:11,color:"var(--t2)",marginBottom:3}}>Monthly Budget</div>
            <div style={{fontSize:26,fontWeight:900,letterSpacing:-1,fontFamily:"var(--mono)"}}>{fmt(totalBudget)}</div>
            <div style={{marginTop:8}}>
              <span className="pill" style={{background:"rgba(244,63,94,0.12)",color:"var(--red)",fontSize:10}}>Spent {fmt(totalSpent)}</span>
            </div>
            <div style={{fontSize:11,color:"var(--green)",marginTop:6,fontWeight:700}}>Remaining {fmt(Math.max(0,totalBudget-totalSpent))}</div>
          </div>
        </div>
      </div>

      {/* Budget items */}
      <div className="au d2" style={{padding:"0 18px",display:"flex",flexDirection:"column",gap:9}}>
        {catData.map(c=>(
          <div key={c.id} className="bi" style={{border:`1px solid ${c.status==="over"?"rgba(244,63,94,0.3)":c.status==="warn"?"rgba(245,158,11,0.25)":"var(--border)"}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span>{c.ic}</span><span style={{fontSize:13,fontWeight:700}}>{c.lb}</span>
                {c.status==="over"&&<span style={{fontSize:9,color:"var(--red)",fontWeight:800}}>OVER BUDGET</span>}
                {c.status==="warn"&&<span style={{fontSize:9,color:"var(--amber)",fontWeight:800}}>⚠ NEAR LIMIT</span>}
              </div>
              {editing===c.id?(
                <input value={editVal} type="number"
                  onChange={e=>setEditVal(e.target.value)}
                  onBlur={()=>{onBudgetChange(c.id,Number(editVal)||c.budget);setEditing(null);}}
                  onKeyDown={e=>{if(e.key==="Enter"){onBudgetChange(c.id,Number(editVal)||c.budget);setEditing(null);}}}
                  style={{width:80,background:"var(--s1)",border:"1px solid var(--indigo)",borderRadius:8,padding:"4px 8px",color:"var(--text)",fontFamily:"var(--mono)",fontSize:13,outline:"none"}}
                  autoFocus/>
              ):(
                <div onClick={()=>{setEditing(c.id);setEditVal(String(c.budget));}} style={{fontSize:12,color:"var(--t2)",fontFamily:"var(--mono)",cursor:"pointer",borderBottom:"1px dashed var(--t3)",paddingBottom:1}}>
                  {fmt(c.spent)} / {fmt(c.budget)}
                </div>
              )}
            </div>
            <div className="pt"><div className="pf" style={{width:`${Math.min(c.pct,1)*100}%`,background:c.status==="over"?"var(--red)":c.status==="warn"?"var(--amber)":c.col}}/></div>
          </div>
        ))}
      </div>
      <div style={{fontSize:11,color:"var(--t2)",textAlign:"center",padding:"12px 0"}}>Tap any amount to edit budget</div>
    </div>
  );
}

// ─── SUBSCRIPTIONS SCREEN ─────────────────────────────────────────────────────
function SubsScreen({subscriptions,setSubscriptions}){
  const total=subscriptions.reduce((s,x)=>s+x.amount,0);
  const [showAdd,setShowAdd]=useState(false);
  const [name,setName]=useState("");
  const [amount,setAmount]=useState("");
  const [icon,setIcon]=useState("📦");
  const [cycle,setCycle]=useState("Monthly");

  const icons=["🎬","🎵","💪","☁️","📦","🎮","📰","🔧","📧","🛡️","💊","🎓"];

  const addSub=()=>{
    if(!name||!amount) return;
    setSubscriptions(prev=>[...prev,{id:"sub_"+Date.now(),name,icon,amount:parseFloat(amount),cycle,nextDue:"2025-04-28",color:"#6366F1"}]);
    setName("");setAmount("");setShowAdd(false);
  };

  return (
    <div style={{paddingBottom:20}}>
      <div className="ph au">
        <div className="ph-t">Subscriptions</div>
        <span className="ftag ftag-p">PREMIUM</span>
      </div>

      {/* Summary */}
      <div className="au d1" style={{margin:"0 18px 14px",background:"linear-gradient(135deg,#1a0533,#3d1078)",borderRadius:20,padding:"18px 20px",border:"1px solid rgba(168,85,247,0.25)"}}>
        <div style={{fontSize:10,color:"rgba(168,85,247,0.6)",fontWeight:800,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Total Monthly</div>
        <div style={{fontSize:36,fontWeight:900,letterSpacing:-1.5,fontFamily:"var(--mono)",color:"#fff",marginBottom:8}}>{fmt(total)}</div>
        <div style={{display:"flex",gap:10}}>
          <span className="pill" style={{background:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.7)"}}>{subscriptions.length} active subs</span>
          <span className="pill" style={{background:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.7)"}}>~{fmt(total*12)}/year</span>
        </div>
      </div>

      <div className="au d2" style={{padding:"0 18px",display:"flex",flexDirection:"column",gap:8}}>
        {subscriptions.map(s=>{
          const due=new Date(s.nextDue),now=new Date();
          const days=Math.ceil((due-now)/(1000*60*60*24));
          return (
            <div key={s.id} style={{display:"flex",alignItems:"center",gap:12,background:"var(--s2)",border:"1px solid var(--border)",borderRadius:16,padding:"13px 14px"}}>
              <div style={{width:42,height:42,borderRadius:14,background:s.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{s.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700}}>{s.name}</div>
                <div style={{fontSize:10,color:"var(--t2)",marginTop:2}}>{s.cycle} · next {new Date(s.nextDue).toLocaleDateString("en-US",{month:"short",day:"numeric"})} {days<=3&&<span style={{color:"var(--red)",fontWeight:700}}>({days}d)</span>}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:14,fontWeight:800,fontFamily:"var(--mono)"}}>{fmt(s.amount)}</div>
                <div style={{fontSize:9,color:"var(--t2)",marginTop:1}}>/month</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{padding:"16px 18px 0"}}>
        <button className="btn-p" onClick={()=>setShowAdd(true)}>+ Add Subscription</button>
      </div>

      {showAdd&&(
        <div className="ov" onClick={()=>setShowAdd(false)}>
          <div className="sheet" onClick={e=>e.stopPropagation()}>
            <div className="hdl"/><div className="st">New Subscription</div>
            <div className="ilb">Name</div>
            <input className="inp" placeholder="Netflix, Gym, etc." value={name} onChange={e=>setName(e.target.value)}/>
            <div className="ilb">Amount/month</div>
            <input className="inp" type="number" placeholder="9.99" value={amount} onChange={e=>setAmount(e.target.value)}/>
            <div className="ilb">Icon</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
              {icons.map(ic=><div key={ic} onClick={()=>setIcon(ic)} style={{width:36,height:36,borderRadius:10,background:icon===ic?"rgba(123,111,255,0.3)":"var(--s3)",border:`1.5px solid ${icon===ic?"var(--indigo)":"transparent"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,cursor:"pointer"}}>{ic}</div>)}
            </div>
            <div className="ilb">Billing Cycle</div>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              {["Weekly","Monthly","Yearly"].map(c=><div key={c} className={`chip ${cycle===c?"on":""}`} onClick={()=>setCycle(c)}>{c}</div>)}
            </div>
            <button className="btn-p" onClick={addSub}>Add Subscription</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── REPORTS SCREEN ───────────────────────────────────────────────────────────
function ReportsScreen({transactions,accounts}){
  const [period,setPeriod]=useState("month");
  // Exclude internal transfers from all report calculations
  const isTransfer = t => t.tags && t.tags.includes('__transfer__');
  const realTx = transactions.filter(t => !isTransfer(t));
  const expenses=realTx.filter(t=>t.type==="expense");
  const income=realTx.filter(t=>t.type==="income");
  const totalExp=expenses.reduce((s,t)=>s+t.amount,0);
  const totalInc=income.reduce((s,t)=>s+t.amount,0);
  const taxDed=expenses.filter(t=>t.taxDeductible).reduce((s,t)=>s+t.amount,0);

  const byCategory=CATS.map(c=>{
    const spent=expenses.filter(t=>t.category===c.id).reduce((s,t)=>s+t.amount,0);
    return {...c,spent,pct:totalExp>0?spent/totalExp:0};
  }).filter(c=>c.spent>0).sort((a,b)=>b.spent-a.spent);

  // Donut
  let cum=0;
  const slices=byCategory.map(c=>{const a=c.pct*360,s=cum;cum+=a;return{...c,start:s,angle:a};});
  const conic=slices.length>0?slices.map(s=>`${s.col} ${s.start}deg ${s.start+s.angle}deg`).join(","):"var(--s3) 0deg 360deg";

  // Real 6-month chart from transactions
  const realMonths = Array.from({length:6},(_,i)=>{
    const d = new Date(); d.setMonth(d.getMonth() - (5-i));
    const m = d.getMonth(), y = d.getFullYear();
    const mTx = transactions.filter(t => {
      if (t.tags && t.tags.includes('__transfer__')) return false;
      const td = new Date(t.date);
      return td.getMonth()===m && td.getFullYear()===y;
    });
    return {
      label: d.toLocaleString('en-US',{month:'short'}),
      spend: mTx.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0),
      inc: mTx.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0),
    };
  });
  const mMax = Math.max(...realMonths.flatMap(m=>[m.spend,m.inc]),1);

  return (
    <div style={{paddingBottom:20}}>
      <div className="ph au">
        <div className="ph-t">Reports</div>
        <span className="ftag ftag-p">PREMIUM</span>
      </div>

      {/* Period selector */}
      <div className="au d1 sel-row" style={{padding:"0 18px 14px"}}>
        {[["week","This Week"],["month","This Month"],["quarter","Quarter"],["year","Year"]].map(([v,l])=>(
          <div key={v} className={`chip ${period===v?"on":""}`} onClick={()=>setPeriod(v)}>{l}</div>
        ))}
      </div>

      {/* Summary cards */}
      <div className="au d2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,padding:"0 18px 14px"}}>
        {[
          {lb:"Total Income",v:fmt(totalInc),c:"var(--green)"},
          {lb:"Total Expense",v:fmt(totalExp),c:"var(--red)"},
          {lb:"Net Savings",v:fmt(Math.max(0,totalInc-totalExp)),c:"var(--cyan)"},
          {lb:"Tax Deductible",v:fmt(taxDed),c:"var(--violet)"},
        ].map(s=>(
          <div key={s.lb} className="scell">
            <div className="slb">{s.lb}</div>
            <div style={{fontSize:16,fontWeight:900,letterSpacing:-0.8,fontFamily:"var(--mono)",color:s.c}}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Donut */}
      <div className="au d2" style={{margin:"0 18px 14px"}}>
        <div className="card">
          <div style={{fontSize:13,fontWeight:800,marginBottom:14}}>Spending Breakdown</div>
          <div style={{display:"flex",gap:16,alignItems:"center"}}>
            <div style={{position:"relative",flexShrink:0}}>
              <div style={{width:110,height:110,borderRadius:"50%",background:`conic-gradient(${conic})`}}>
                <div style={{position:"absolute",inset:22,background:"var(--s1)",borderRadius:"50%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <div style={{fontSize:14,fontWeight:900,fontFamily:"var(--mono)"}}>{fmtK(totalExp)}</div>
                  <div style={{fontSize:8,color:"var(--t2)"}}>total</div>
                </div>
              </div>
            </div>
            <div style={{flex:1}}>
              {byCategory.slice(0,6).map(c=>(
                <div key={c.id} style={{display:"flex",alignItems:"center",gap:7,marginBottom:7}}>
                  <div style={{width:7,height:7,borderRadius:2,background:c.col,flexShrink:0}}/>
                  <div style={{flex:1,fontSize:11,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.lb}</div>
                  <div style={{fontSize:10,color:"var(--t2)",fontFamily:"var(--mono)"}}>{fmt(c.spent)}</div>
                  <div style={{fontSize:10,color:"var(--t3)",fontFamily:"var(--mono)"}}>{Math.round(c.pct*100)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6-month chart */}
      <div className="au d3" style={{margin:"0 18px 14px"}}>
        <div className="card">
          <div style={{fontSize:13,fontWeight:800,marginBottom:14}}>6-Month Overview</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:5,height:90,marginBottom:8}}>
            {realMonths.map((m,i)=>(
              <div key={m.label+i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                <div style={{width:"100%",display:"flex",gap:2,alignItems:"flex-end"}}>
                  <div style={{flex:1,height:`${(m.inc/mMax)*76}px`,borderRadius:"3px 3px 0 0",background:"rgba(16,185,129,0.3)",minHeight:2}}/>
                  <div style={{flex:1,height:`${(m.spend/mMax)*76}px`,borderRadius:"3px 3px 0 0",background:i===5?"rgba(244,63,94,0.7)":"rgba(244,63,94,0.28)",minHeight:2}}/>
                </div>
                <div style={{fontSize:8,color:"var(--t2)",fontWeight:600}}>{m.label}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:12}}>
            {[["rgba(16,185,129,0.5)","Income"],["rgba(244,63,94,0.5)","Expense"]].map(([col,lb])=>(
              <div key={lb} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:8,height:8,borderRadius:2,background:col}}/><span style={{fontSize:10,color:"var(--t2)"}}>{lb}</span></div>
            ))}
          </div>
        </div>
      </div>

      {/* Top merchants */}
      <div className="au d4">
        <div className="sh"><div className="sh-t">Top Spending</div></div>
        {byCategory.slice(0,5).map((c,i)=>(
          <div key={c.id} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 18px"}}>
            <div style={{width:26,height:26,borderRadius:8,background:"var(--s3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"var(--t2)"}}>{i+1}</div>
            <div style={{width:34,height:34,borderRadius:11,background:c.col+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{c.ic}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>{c.lb}</div>
              <div className="pt" style={{width:"100%"}}><div className="pf" style={{width:`${c.pct*100}%`,background:c.col}}/></div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:13,fontWeight:800,fontFamily:"var(--mono)"}}>{fmt(c.spent)}</div>
              <div style={{fontSize:10,color:"var(--t2)"}}>{Math.round(c.pct*100)}%</div>
            </div>
          </div>
        ))}
      </div>

      {/* Export note */}
      <div style={{margin:"14px 18px 0",background:"var(--s2)",borderRadius:14,padding:"13px 16px",display:"flex",alignItems:"center",gap:12,border:"1px solid var(--border)"}}>
        <div style={{fontSize:24}}>📤</div>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:700}}>Export Report</div>
          <div style={{fontSize:11,color:"var(--t2)",marginTop:2}}>CSV / PDF export available in full app</div>
        </div>
        <span className="ftag ftag-p">PREMIUM</span>
      </div>
    </div>
  );
}

// ─── CUSTOMIZE SCREEN ─────────────────────────────────────────────────────────
function CustomizeScreen({widgets,onToggle,currentThemeId,onSelectTheme}){
  const free=ALL_WIDGETS.filter(w=>w.tag==="free");
  const prem=ALL_WIDGETS.filter(w=>w.tag==="premium");
  return (
    <div style={{paddingBottom:20}}>
      <div className="ph au">
        <div>
          <div style={{fontSize:11,color:"var(--t2)",fontWeight:700,marginBottom:2}}>Personalize</div>
          <div className="ph-t">Dashboard</div>
        </div>
        <span style={{fontSize:22}}>🎨</span>
      </div>
      
      {/* Theme Picker Selection Section */}
      <div className="sh"><div className="sh-t">🎨 Application Theme</div></div>
      <div className="au d1" style={{margin:"0 18px 14px",background:"rgba(255,255,255,0.03)",border:"1px solid var(--border)",borderRadius:16,padding:"13px 15px"}}>
        <div style={{fontSize:12,fontWeight:800,color:"var(--text)",marginBottom:4}}>Select Theme Style</div>
        <div style={{fontSize:11,color:"var(--t2)",lineHeight:1.6}}>Switch between 10 carefully designed layouts in just 1 click.</div>
      </div>
      
      <div className="au d2" style={{padding:"0 18px",display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
        {THEMES.map(t => {
          const isSelected = t.id === currentThemeId;
          return (
            <div key={t.id} 
              onClick={() => onSelectTheme(t.id)}
              style={{
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                padding: '12px 14px', 
                borderRadius: 16, 
                background: isSelected ? 'rgba(255,255,255,0.06)' : 'var(--s1)', 
                border: `1.5px solid ${isSelected ? 'var(--indigo)' : 'var(--border)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Color previews */}
              <div style={{display:'flex', gap:3, background: t.bg, padding: 6, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)'}}>
                <div style={{width: 10, height: 10, borderRadius: '50%', background: t.indigo}}/>
                <div style={{width: 10, height: 10, borderRadius: '50%', background: t.green}}/>
                <div style={{width: 10, height: 10, borderRadius: '50%', background: t.red}}/>
              </div>
              <div style={{flex: 1}}>
                <div style={{fontSize: 13, fontWeight: 700, color: 'var(--text)'}}>{t.name}</div>
                <div style={{fontSize: 10, color: 'var(--t2)', marginTop: 2}}>{t.desc}</div>
              </div>
              {isSelected && <span style={{fontSize: 14, color: 'var(--green)'}}>✓</span>}
            </div>
          );
        })}
      </div>

      <div className="sh"><div className="sh-t">Free Widgets</div><span className="ftag ftag-f">FREE</span></div>
      <div className="au d2" style={{padding:"0 18px",display:"flex",flexDirection:"column",gap:9}}>
        {free.map(w=>(
          <div key={w.id} className="wr">
            <div style={{fontSize:18,color:"var(--t2)"}}>⠿</div>
            <div className="wic" style={{background:"var(--s3)"}}>{w.ic}</div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700}}>{w.name}</div><div style={{fontSize:11,color:"var(--t2)",marginTop:1}}>{w.desc}</div></div>
            <Toggle on={!!widgets[w.id]} onToggle={()=>onToggle(w.id)}/>
          </div>
        ))}
      </div>

      <div className="sh" style={{marginTop:14}}><div className="sh-t">Premium Widgets</div><span className="ftag ftag-p">PREMIUM</span></div>
      <div className="au d3" style={{padding:"0 18px",display:"flex",flexDirection:"column",gap:9}}>
        {prem.map(w=>(
          <div key={w.id} className="wr">
            <div style={{fontSize:18,color:"var(--t2)"}}>⠿</div>
            <div className="wic" style={{background:"var(--s3)"}}>{w.ic}</div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700}}>{w.name}</div><div style={{fontSize:11,color:"var(--t2)",marginTop:1}}>{w.desc}</div></div>
            <Toggle on={!!widgets[w.id]} onToggle={()=>onToggle(w.id)}/>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ACCOUNT MODAL ────────────────────────────────────────────────────────────
function AcctModal({account,onClose,onSave,onDelete}){
  const isEdit=!!account;
  const [type,setType]=useState(account?.type||"bank");
  const [name,setName]=useState(account?.name||"");
  const [bank,setBank]=useState(account?.bank||"");
  const [balance,setBalance]=useState(account?String(account.balance):"");
  const [limit,setLimit]=useState(account?String(account.limit||""):"");
  const [last4,setLast4]=useState(account?.last4||"");
  const [themeIdx,setThemeIdx]=useState(account?.themeIdx||0);
  const [ccColor,setCcColor]=useState(account?.color||CC_COLORS[0]);
  const [icon,setIcon]=useState(account?.icon||(type==="bank"?"🏦":"💳"));

  const bIcons=["🏦","💰","🏧","💎","🏛️","💵"];
  const ccIcons=["💳","⚜️","🃏","💠","✨","🔷"];

  const doSave=()=>{
    if(!name||!balance) return;
    const base={name,bank,last4,icon,balance:parseFloat(balance)||0};
    if(type==="bank") onSave({...base,type:"bank",themeIdx});
    else onSave({...base,type:"credit",limit:parseFloat(limit)||5000,color:ccColor});
    onClose();
  };

  return (
    <div className="ov" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="hdl"/>
        <div className="st">{isEdit?"Edit Account":"Add Account"}</div>
        {!isEdit&&(
          <div className="ttog">
            <button className={`tbtn ${type==="bank"?"ai":""}`} onClick={()=>{setType("bank");setIcon("🏦");}}>🏦 Bank</button>
            <button className={`tbtn ${type==="credit"?"ae":""}`} onClick={()=>{setType("credit");setIcon("💳");}}>💳 Credit Card</button>
          </div>
        )}
        <div className="ilb">Account Name</div>
        <input className="inp" placeholder={type==="bank"?"e.g. Chase Checking":"e.g. Amex Gold"} value={name} onChange={e=>setName(e.target.value)}/>
        <div className="ilb">Bank / Issuer</div>
        <input className="inp" placeholder="Chase, Wells Fargo, Amex..." value={bank} onChange={e=>setBank(e.target.value)}/>
        <div style={{display:"flex",gap:10}}>
          <div style={{flex:1}}>
            <div className="ilb">{type==="bank"?"Balance":"Balance Due"}</div>
            <input className="inp" type="number" placeholder="0.00" value={balance} onChange={e=>setBalance(e.target.value)}/>
          </div>
          <div style={{flex:1}}>
            <div className="ilb">Last 4 Digits</div>
            <input className="inp" placeholder="1234" maxLength={4} value={last4} onChange={e=>setLast4(e.target.value)}/>
          </div>
        </div>
        {type==="credit"&&(<><div className="ilb">Credit Limit</div><input className="inp" type="number" placeholder="10000" value={limit} onChange={e=>setLimit(e.target.value)}/></>)}
        <div className="ilb">Icon</div>
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
          {(type==="bank"?bIcons:ccIcons).map(ic=>(
            <div key={ic} onClick={()=>setIcon(ic)} style={{width:36,height:36,borderRadius:11,background:icon===ic?"rgba(123,111,255,0.3)":"var(--s3)",border:`1.5px solid ${icon===ic?"var(--indigo)":"transparent"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,cursor:"pointer"}}>{ic}</div>
          ))}
        </div>
        <div className="ilb">{type==="bank"?"Card Theme":"Card Color"}</div>
        <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
          {type==="bank"?BANK_THEMES.map((t,i)=>(
            <div key={i} className={`cdot ${themeIdx===i?"sel":""}`} onClick={()=>setThemeIdx(i)} style={{background:t,width:32,height:32,borderRadius:10,cursor:"pointer"}}/>
          )):CC_COLORS.map((c,i)=>(
            <div key={i} className={`cdot ${ccColor===c?"sel":""}`} onClick={()=>setCcColor(c)} style={{background:c,width:32,height:32,borderRadius:10,cursor:"pointer"}}/>
          ))}
        </div>
        <button className="btn-p" onClick={doSave}>{isEdit?"Save Changes":"Add Account"}</button>
        {isEdit&&<button className="btn-del" onClick={()=>{onDelete(account.id);onClose();}}>Delete Account</button>}
      </div>
    </div>
  );
}

// ─── PAY CREDIT CARD MODAL ───────────────────────────────────────────────────
function PayCCModal({ accounts, creditCard, onClose, onPay }) {
  const [bankId, setBankId] = useState("");
  const [amount, setAmount] = useState(creditCard.balance.toString());

  const banks = accounts.filter(a => a.type === "bank" && a.balance > 0);

  useEffect(() => {
    if (banks.length > 0 && !bankId) setBankId(banks[0].id);
  }, [banks, bankId]);

  const handleNum=v=>{
    if(v==="."&&amount.includes(".")) return;
    if(v==="⌫"){setAmount(a=>a.slice(0,-1));return;}
    if(amount.replace(".","").length>=8) return;
    setAmount(a=>a+v);
  };

  const doPay = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0 || !bankId) return;
    onPay({ bankId, ccId: creditCard.id, amount: val });
    onClose();
  };

  if (banks.length === 0) {
    return (
      <div className="ov" onClick={onClose}>
        <div className="sheet" onClick={e=>e.stopPropagation()}>
          <div className="st">No Banks Available</div>
          <div style={{fontSize:13,color:'var(--t2)',textAlign:'center',marginBottom:20}}>You do not have any bank accounts with a positive balance to pay from.</div>
          <button className="btn-p" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ov" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="hdl"/>
        <div className="st">Pay Credit Card</div>
        <div style={{textAlign:'center', fontSize:14, color:'var(--t2)', marginBottom:10}}>
          Paying {creditCard.name} (Due: ${creditCard.balance})
        </div>
        <div className="amtd">
          <span style={{color:"var(--green)"}}>${amount||"0"}</span>
        </div>
        <div className="npad">
          {["1","2","3","4","5","6","7","8","9",".","0","⌫"].map(k=>(
            <button key={k} className="npb" style={{color:k==="⌫"?"var(--red)":k==="."?"var(--t2)":"var(--text)"}} onClick={()=>handleNum(k)}>{k}</button>
          ))}
        </div>
        <div className="ilb">From Bank Account</div>
        <div className="sel-row" style={{marginBottom:15}}>
          {banks.map(a=><div key={a.id} className={`chip ${bankId===a.id?"on":""}`} onClick={()=>setBankId(a.id)}>{a.icon} {a.name}</div>)}
        </div>
        <button className="btn-p" onClick={doPay}>Pay ${amount||"0"} to CC</button>
      </div>
    </div>
  );
}

// ─── ADD TRANSACTION MODAL ────────────────────────────────────────────────────
function AddTxModal({accounts,onClose,onAdd}){
  const [type,setType]=useState("expense");
  const [amount,setAmount]=useState("");
  const [category,setCategory]=useState("food");
  const [note,setNote]=useState("");
  const [accountId,setAccountId]=useState(accounts[0]?.id||"");
  const [recurring,setRecurring]=useState(false);
  const [taxDed,setTaxDed]=useState(false);
  const [tags,setTags]=useState("");
  const [date,setDate]=useState(new Date().toISOString().slice(0,10));
  const [autoDetected,setAutoDetected]=useState(false);
  
  // Splits State
  const [splits, setSplits] = useState([]);
  const totalAllocated = splits.reduce((s, x) => s + (parseFloat(x.amount) || 0), 0);
  const remainder = parseFloat(amount || 0) - totalAllocated;

  // Smart auto-categorization from note keywords
  const AUTO_CAT = {
    food:['food','lunch','dinner','breakfast','grocery','grub','mcdonald','chick-fil','chipotle','starbucks','coffee','restaurant','pizza','taco','burger','sushi','wendy','popeye','whataburger','panera','subway','domino','wingstop'],
    transport:['uber','lyft','gas','fuel','shell','chevron','exxon','parking','toll','metro','transit','bus','train','car wash','mechanic'],
    shopping:['amazon','walmart','target','costco','ikea','best buy','apple store','nike','clothes','shoes','fashion','mall'],
    entertainment:['netflix','hulu','disney','spotify','youtube','movie','concert','gaming','playstation','xbox','steam','twitch','theater','amc'],
    bills:['electric','water','internet','phone','att','verizon','t-mobile','utility','cable','wifi','cellular'],
    housing:['rent','mortgage','hoa','property tax','home','apartment','lease','maintenance','plumb','hvac','repair'],
    health:['doctor','hospital','pharmacy','cvs','walgreen','medicine','dental','gym','fitness','health','medical','insurance','clinic'],
    education:['tuition','school','college','university','course','udemy','book','textbook','coursera'],
    travel:['hotel','airbnb','flight','airline','airport','delta','united','southwest','vacation','luggage','travel','trip','resort'],
    fuel:['gas station','shell','chevron','exxon','bp','citgo','valero','marathon','sunoco','quiktrip','buc-ee','gasoline','diesel'],
    subscriptions:['subscription','membership','premium','annual','monthly fee','patreon','adobe','microsoft 365','icloud','dropbox'],
  };
  useEffect(()=>{
    if (!note || type === 'income') return;
    const lower = note.toLowerCase();
    for (const [cat, keywords] of Object.entries(AUTO_CAT)) {
      if (keywords.some(k => lower.includes(k))) {
        setCategory(cat);
        setAutoDetected(true);
        return;
      }
    }
    setAutoDetected(false);
  },[note, type]);

  const handleNum=v=>{
    if(v==="."&&amount.includes(".")) return;
    if(v==="⌫"){
      const nextAmt = amount.slice(0,-1);
      setAmount(nextAmt);
      // Reset splits if amount changes, as user needs to re-split
      if (splits.length > 0) setSplits([]);
      return;
    }
    if(amount.replace(".","").length>=7) return;
    const nextAmt = amount+v;
    setAmount(nextAmt);
    // Reset splits if amount changes, as user needs to re-split
    if (splits.length > 0) setSplits([]);
  };

  const doAdd=()=>{
    const val=parseFloat(amount);
    if(!val||val<=0||!accountId) return;
    
    if (splits.length > 0) {
      if (Math.abs(remainder) >= 0.01) return; // validate exact allocation match
      const splitTag = "split_" + Date.now();
      splits.forEach((s, idx) => {
        const finalCategory = s.category;
        const finalNote = `${note || "Split"} (${s.note || CATS.find(c=>c.id===s.category).lb}) [Split ${idx + 1}/${splits.length}]`;
        onAdd({
          amount: parseFloat(s.amount) || 0,
          category: finalCategory,
          note: finalNote,
          type,
          date,
          accountId,
          recurring,
          taxDeductible: taxDed,
          tags: [...(tags ? tags.split(",").map(t=>t.trim()).filter(Boolean) : []), splitTag]
        });
      });
    } else {
      const finalCategory = type === "income" ? "other" : category;
      const finalNote = note || (type === "income" ? "Income" : CATS.find(c=>c.id===category).lb);
      onAdd({amount:val,category:finalCategory,note:finalNote,type,date,accountId,recurring,taxDeductible:taxDed,tags:tags?tags.split(",").map(t=>t.trim()).filter(Boolean):[]});
    }
    onClose();
  };

  const isSaveDisabled = splits.length > 0 && Math.abs(remainder) >= 0.01;

  return (
    <div className="ov" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="hdl"/>
        <div className="st">New Transaction</div>
        <div className="ttog">
          <button className={`tbtn ${type==="expense"?"ae":""}`} onClick={()=>{setType("expense"); if(splits.length>0)setSplits([]);}}>▼ Expense</button>
          <button className={`tbtn ${type==="income"?"ai":""}`} onClick={()=>{setType("income"); setSplits([]);}}>▲ Income</button>
        </div>
        <div className="amtd">
          <span style={{color:type==="income"?"var(--green)":"var(--text)"}}>${amount||"0"}</span>
        </div>
        <div className="npad">
          {["1","2","3","4","5","6","7","8","9",".","0","⌫"].map(k=>(
            <button key={k} className="npb" style={{color:k==="⌫"?"var(--red)":k==="."?"var(--t2)":"var(--text)"}} onClick={()=>handleNum(k)}>{k}</button>
          ))}
        </div>
        <div className="ilb">Account</div>
        <div className="sel-row">
          {accounts.map(a=><div key={a.id} className={`chip ${accountId===a.id?"on":""}`} onClick={()=>setAccountId(a.id)}>{a.icon} {a.name}</div>)}
        </div>
        {type === "expense" && splits.length === 0 && (
          <>
            <div className="ilb">Category</div>
            <div className="cgrid">
              {CATS.map(c=>(
                <div key={c.id} className={`cbtn ${category===c.id?"on":""}`} onClick={()=>setCategory(c.id)}>
                  <span style={{fontSize:18}}>{c.ic}</span>
                  <span className="cbtn-lb">{c.lb}</span>
                </div>
              ))}
            </div>
          </>
        )}
        <div style={{display:'flex',gap:10}}>
          <div style={{flex:1}}>
            <div className="ilb">Date</div>
            <input type="date" className="inp" style={{colorScheme:'dark'}} value={date} max={new Date().toISOString().slice(0,10)} onChange={e=>setDate(e.target.value)}/>
          </div>
          <div style={{flex:2}}>
            <div className="ilb">Note</div>
            <input className="inp" placeholder="(try 'Netflix' or 'Uber')" value={note} onChange={e=>setNote(e.target.value)}/>
          </div>
        </div>
        {autoDetected && type==="expense" && splits.length === 0 && (
          <div style={{fontSize:10,color:'var(--cyan)',marginTop:-8,marginBottom:8,paddingLeft:4}}>✨ Auto-detected: {(CATS.find(c=>c.id===category)||{}).lb}</div>
        )}
        <input className="inp" placeholder="Tags (comma separated): work, travel..." value={tags} onChange={e=>setTags(e.target.value)}/>

        {type === "expense" && splits.length === 0 && (
          <div style={{textAlign:"center", margin:"4px 0 12px"}}>
            <span 
              onClick={() => {
                const initialVal = parseFloat(amount) || 0;
                if(initialVal <= 0) return;
                setSplits([
                  { category: category, amount: String((initialVal / 2).toFixed(2)), note: "" },
                  { category: "other", amount: String((initialVal / 2).toFixed(2)), note: "" }
                ]);
              }}
              style={{
                fontSize: 12, 
                color: "var(--indigo)", 
                fontWeight: 800, 
                cursor: parseFloat(amount) > 0 ? "pointer" : "not-allowed", 
                borderBottom: "1.5px dashed var(--indigo)",
                paddingBottom: 2,
                opacity: parseFloat(amount) > 0 ? 1 : 0.5
              }}
            >
              🥞 Split Receipt into Categories
            </span>
          </div>
        )}

        {/* Splits Manager UI */}
        {type === "expense" && splits.length > 0 && (
          <div style={{ background: "var(--s2)", border: "1px solid var(--border)", borderRadius: 18, padding: 14, marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text)" }}>🥞 Receipt Splits</span>
              <span 
                onClick={() => setSplits([])}
                style={{ fontSize: 11, color: "var(--red)", fontWeight: 800, cursor: "pointer" }}
              >
                Cancel Split
              </span>
            </div>

            {/* Sum Indicator */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              fontSize: 11, 
              fontWeight: 700, 
              color: "var(--t2)", 
              marginBottom: 12, 
              paddingBottom: 8, 
              borderBottom: "1px solid var(--border)"
            }}>
              <span>Total: <strong style={{color:"var(--text)"}}>${parseFloat(amount || 0).toFixed(2)}</strong></span>
              <span>Allocated: <strong style={{color: Math.abs(remainder) < 0.01 ? "var(--green)" : "var(--amber)"}}>${totalAllocated.toFixed(2)}</strong></span>
              <span>Left: <strong style={{color: Math.abs(remainder) < 0.01 ? "var(--green)" : "var(--red)"}}>${remainder.toFixed(2)}</strong></span>
            </div>

            {/* Scrollable list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 180, overflowY: "auto", paddingRight: 4 }}>
              {splits.map((s, idx) => (
                <div key={idx} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {/* Category Dropdown */}
                  <select 
                    value={s.category} 
                    onChange={e => {
                      const next = [...splits];
                      next[idx].category = e.target.value;
                      setSplits(next);
                    }}
                    style={{ 
                      background: "var(--s1)", 
                      border: "1.5px solid var(--border)", 
                      borderRadius: 10, 
                      padding: "6px 8px", 
                      color: "var(--text)", 
                      fontFamily: "var(--font)", 
                      fontSize: 11,
                      outline: "none"
                    }}
                  >
                    {CATS.map(c => <option key={c.id} value={c.id}>{c.ic} {c.lb}</option>)}
                  </select>

                  {/* Amount Input */}
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    value={s.amount} 
                    onChange={e => {
                      const next = [...splits];
                      next[idx].amount = e.target.value;
                      setSplits(next);
                    }}
                    style={{ 
                      width: 68, 
                      background: "var(--s1)", 
                      border: "1.5px solid var(--border)", 
                      borderRadius: 10, 
                      padding: "6px 8px", 
                      color: "var(--text)", 
                      fontFamily: "var(--mono)", 
                      fontSize: 11,
                      textAlign: "right",
                      outline: "none"
                    }}
                  />

                  {/* Note Input */}
                  <input 
                    type="text" 
                    placeholder="Item description..." 
                    value={s.note} 
                    onChange={e => {
                      const next = [...splits];
                      next[idx].note = e.target.value;
                      setSplits(next);
                    }}
                    style={{ 
                      flex: 1, 
                      background: "var(--s1)", 
                      border: "1.5px solid var(--border)", 
                      borderRadius: 10, 
                      padding: "6px 8px", 
                      color: "var(--text)", 
                      fontFamily: "var(--font)", 
                      fontSize: 11,
                      outline: "none"
                    }}
                  />

                  {/* Delete button */}
                  {splits.length > 2 && (
                    <span 
                      onClick={() => setSplits(splits.filter((_, i) => i !== idx))}
                      style={{ fontSize: 14, color: "var(--red)", cursor: "pointer", padding: "0 4px" }}
                    >
                      ×
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Add split CTA */}
            <div style={{ marginTop: 10, textAlign: "left" }}>
              <span 
                onClick={() => setSplits([...splits, { category: "other", amount: remainder > 0 ? String(remainder.toFixed(2)) : "0.00", note: "" }])}
                style={{ fontSize: 11, color: "var(--indigo)", fontWeight: 800, cursor: "pointer" }}
              >
                ＋ Add Split Item
              </span>
            </div>
          </div>
        )}

        {type === "expense" && (
          <div style={{display:"flex",gap:12,marginBottom:14}}>
            <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--s2)",borderRadius:12,padding:"10px 14px"}}>
              <div>
                <div style={{fontSize:12,fontWeight:700}}>🔄 Recurring</div>
                <div style={{fontSize:10,color:"var(--t2)"}}>Monthly auto</div>
              </div>
              <Toggle on={recurring} onToggle={()=>setRecurring(!recurring)}/>
            </div>
            <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--s2)",borderRadius:12,padding:"10px 14px"}}>
              <div>
                <div style={{fontSize:12,fontWeight:700}}>🧾 Tax</div>
                <div style={{fontSize:10,color:"var(--t2)"}}>Deductible</div>
              </div>
              <Toggle on={taxDed} onToggle={()=>setTaxDed(!taxDed)}/>
            </div>
          </div>
        )}
        <button 
          className="btn-p" 
          style={{marginTop: type === 'income' ? 14 : 0, opacity: isSaveDisabled ? 0.5 : 1, cursor: isSaveDisabled ? "not-allowed" : "pointer"}} 
          onClick={doAdd}
          disabled={isSaveDisabled}
        >
          {isSaveDisabled ? `Allocation Incomplete (Need $${remainder.toFixed(2)} more)` : `Add ${type==="income"?"Income":"Expense"}`}
        </button>
      </div>
    </div>
  );
}

// ─── TRANSFER MODAL ──────────────────────────────────────────────────────────
function TransferModal({accounts, onClose, onTransfer}) {
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [amount, setAmount] = useState("");

  const banks = accounts.filter(a => a.type === "bank");

  useEffect(() => {
    if (banks.length >= 2) {
      if (!fromId) setFromId(banks[0].id);
      if (!toId) setToId(banks[1]?.id || "");
    } else if (banks.length === 1 && !fromId) {
      setFromId(banks[0].id);
    }
  }, []);

  const handleNum = v => {
    if (v === "." && amount.includes(".")) return;
    if (v === "⌫") { setAmount(a => a.slice(0, -1)); return; }
    if (amount.replace(".", "").length >= 8) return;
    setAmount(a => a + v);
  };

  const doTransfer = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0 || !fromId || !toId || fromId === toId) return;
    const from = banks.find(b => b.id === fromId);
    if (from && val > from.balance) return;
    onTransfer({ fromId, toId, amount: val });
    onClose();
  };

  if (banks.length < 2) {
    return (
      <div className="ov" onClick={onClose}>
        <div className="sheet" onClick={e => e.stopPropagation()}>
          <div className="hdl"/>
          <div className="st">Need More Accounts</div>
          <div style={{fontSize:13,color:'var(--t2)',textAlign:'center',marginBottom:20}}>You need at least 2 bank accounts to make a transfer.</div>
          <button className="btn-p" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const fromAcct = banks.find(b => b.id === fromId);
  const effectiveToId = toId === fromId ? "" : toId;

  return (
    <div className="ov" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="hdl"/>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
          <span style={{fontSize:24}}>🔄</span>
          <div className="st" style={{marginBottom:0}}>Transfer Funds</div>
        </div>
        <div style={{fontSize:12,color:'var(--t2)',marginBottom:14}}>Move money between your bank accounts — no expense or income recorded.</div>

        <div className="amtd">
          <span style={{color:"var(--cyan)"}}>${amount || "0"}</span>
        </div>
        <div className="npad">
          {["1","2","3","4","5","6","7","8","9",".","0","⌫"].map(k => (
            <button key={k} className="npb" style={{color:k==="⌫"?"var(--red)":k==="."?"var(--t2)":"var(--text)"}} onClick={() => handleNum(k)}>{k}</button>
          ))}
        </div>

        <div className="ilb">FROM ACCOUNT</div>
        <div className="sel-row" style={{marginBottom:6}}>
          {banks.map(a => <div key={a.id} className={`chip ${fromId===a.id?"on":""}`} onClick={() => setFromId(a.id)}>{a.icon} {a.name}</div>)}
        </div>
        {fromAcct && <div style={{fontSize:11,color:'var(--t2)',marginBottom:12,paddingLeft:2}}>Available: {fmt(fromAcct.balance)}</div>}

        <div style={{textAlign:'center',fontSize:18,margin:'4px 0 8px',color:'var(--t2)'}}>↓</div>

        <div className="ilb">TO ACCOUNT</div>
        <div className="sel-row" style={{marginBottom:14}}>
          {banks.filter(a => a.id !== fromId).map(a => <div key={a.id} className={`chip ${effectiveToId===a.id?"on":""}`} onClick={() => setToId(a.id)}>{a.icon} {a.name}</div>)}
        </div>

        <button className="btn-p" style={{background:'linear-gradient(135deg,#22D3EE,#0EA5E9)'}} onClick={doTransfer}>Transfer ${amount || "0"}</button>
        <button className="btn-s" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

// ─── EDIT TRANSACTION MODAL ──────────────────────────────────────────────────
function EditTxModal({tx, accounts, onClose, onSave, onDelete}) {
  const [type, setType] = useState(tx.type);
  const [amount, setAmount] = useState(String(tx.amount));
  const [category, setCategory] = useState(tx.category);
  const [note, setNote] = useState(tx.note || "");
  const [accountId, setAccountId] = useState(tx.accountId || tx.account_id || "");
  const [recurring, setRecurring] = useState(tx.recurring || false);
  const [taxDed, setTaxDed] = useState(tx.taxDeductible || tx.tax_deductible || false);
  const [tags, setTags] = useState((tx.tags || []).join(", "));
  const [date, setDate] = useState((tx.date || new Date().toISOString()).slice(0,10));
  const [confirmDel, setConfirmDel] = useState(false);

  const isSplit = tx.tags?.some(t => t.startsWith('split_'));

  const handleNum = v => {
    if (v === "." && amount.includes(".")) return;
    if (v === "⌫") { setAmount(a => a.slice(0, -1)); return; }
    if (amount.replace(".", "").length >= 7) return;
    setAmount(a => a + v);
  };

  const doSave = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    const finalCategory = type === "income" ? "other" : category;
    const finalNote = note || (type === "income" ? "Income" : (CATS.find(c => c.id === category) || {}).lb || "Other");
    onSave(tx.id, {
      amount: val, category: finalCategory, note: finalNote, type, date,
      accountId, recurring, taxDeductible: taxDed,
      tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [],
    });
    onClose();
  };

  return (
    <div className="ov" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="hdl"/>
        <div className="st">Edit Transaction</div>
        
        {isSplit && (
          <div style={{
            background: "rgba(123, 111, 255, 0.08)",
            border: "1.5px dashed rgba(123, 111, 255, 0.25)",
            borderRadius: 14,
            padding: "10px 12px",
            marginBottom: 14,
            fontSize: 11,
            color: "#C4BEFF",
            lineHeight: 1.4
          }}>
            🥞 <strong>Split Receipt Component:</strong> This transaction is linked to other split items from the same receipt. Deleting it will delete all linked components to maintain balance integrity.
          </div>
        )}

        <div className="ttog">
          <button className={`tbtn ${type==="expense"?"ae":""}`} onClick={() => setType("expense")}>▼ Expense</button>
          <button className={`tbtn ${type==="income"?"ai":""}`} onClick={() => setType("income")}>▲ Income</button>
        </div>
        <div className="amtd">
          <span style={{color:type==="income"?"var(--green)":"var(--text)"}}>${amount || "0"}</span>
        </div>
        <div className="npad">
          {["1","2","3","4","5","6","7","8","9",".","0","⌫"].map(k => (
            <button key={k} className="npb" style={{color:k==="⌫"?"var(--red)":k==="."?"var(--t2)":"var(--text)"}} onClick={() => handleNum(k)}>{k}</button>
          ))}
        </div>
        <div className="ilb">Account</div>
        <div className="sel-row">
          {accounts.map(a => <div key={a.id} className={`chip ${accountId===a.id?"on":""}`} onClick={() => setAccountId(a.id)}>{a.icon} {a.name}</div>)}
        </div>
        {type === "expense" && (
          <>
            <div className="ilb">Category</div>
            <div className="cgrid">
              {CATS.map(c => (
                <div key={c.id} className={`cbtn ${category===c.id?"on":""}`} onClick={() => setCategory(c.id)}>
                  <span style={{fontSize:18}}>{c.ic}</span>
                  <span className="cbtn-lb">{c.lb}</span>
                </div>
              ))}
            </div>
          </>
        )}
        <div style={{display:'flex',gap:10}}>
          <div style={{flex:1}}>
            <div className="ilb">Date</div>
            <input type="date" className="inp" style={{colorScheme:'dark'}} value={date} max={new Date().toISOString().slice(0,10)} onChange={e=>setDate(e.target.value)}/>
          </div>
          <div style={{flex:2}}>
            <div className="ilb">Note</div>
            <input className="inp" placeholder="Note..." value={note} onChange={e=>setNote(e.target.value)}/>
          </div>
        </div>
        <div className="ilb">Tags</div>
        <input className="inp" placeholder="comma separated" value={tags} onChange={e => setTags(e.target.value)}/>
        {type === "expense" && (
          <div style={{display:"flex",gap:12,marginBottom:14}}>
            <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--s2)",borderRadius:12,padding:"10px 14px"}}>
              <div><div style={{fontSize:12,fontWeight:700}}>🔄 Recurring</div><div style={{fontSize:10,color:"var(--t2)"}}>Monthly auto</div></div>
              <Toggle on={recurring} onToggle={() => setRecurring(!recurring)}/>
            </div>
            <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--s2)",borderRadius:12,padding:"10px 14px"}}>
              <div><div style={{fontSize:12,fontWeight:700}}>🧾 Tax</div><div style={{fontSize:10,color:"var(--t2)"}}>Deductible</div></div>
              <Toggle on={taxDed} onToggle={() => setTaxDed(!taxDed)}/>
            </div>
          </div>
        )}
        <button className="btn-p" onClick={doSave}>Save Changes</button>
        {!confirmDel ? (
          <button className="btn-del" onClick={() => setConfirmDel(true)}>
            {isSplit ? "Delete Split Receipt" : "Delete Transaction"}
          </button>
        ) : (
          <button className="btn-del" style={{background:'rgba(244,63,94,0.25)',fontWeight:900}} onClick={() => {onDelete(tx);onClose();}}>
            {isSplit ? "⚠ Confirm Delete ALL Linked Splits" : "⚠ Confirm Delete — Cannot Undo"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// AUTH SCREEN  (shown when user is not logged in)
// ─────────────────────────────────────────────────────────────
const AUTH_STYLE = `
  .auth-wrap{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:32px 28px;}
  .auth-logo-wrap{position:relative;margin-bottom:12px;}
  .auth-logo-img{width:80px;height:80px;border-radius:22px;display:block;box-shadow:0 0 40px rgba(123,111,255,0.5),0 0 80px rgba(34,211,238,0.2);}
  .auth-logo-ring{position:absolute;inset:-6px;border-radius:28px;border:1.5px solid rgba(123,111,255,0.3);animation:logoRing 2s ease-in-out infinite;}
  @keyframes logoRing{0%,100%{opacity:0.3;transform:scale(1);}50%{opacity:0.8;transform:scale(1.04);}}
  .auth-title{font-size:28px;font-weight:900;letter-spacing:-1px;margin-bottom:4px;}
  .auth-sub{font-size:13px;color:var(--t2);margin-bottom:36px;text-align:center;}
  .auth-card{width:100%;background:var(--s1);border:1px solid var(--border2);border-radius:24px;padding:24px;}
  .auth-tabs{display:flex;background:var(--s2);border-radius:14px;padding:4px;margin-bottom:20px;}
  .auth-tab{flex:1;padding:10px;border-radius:11px;border:none;background:transparent;
    color:var(--t2);font-family:var(--font);font-size:13px;font-weight:800;cursor:pointer;transition:all .2s;}
  .auth-tab.active{background:var(--indigo);color:#fff;}
  .auth-err{background:rgba(244,63,94,0.1);border:1px solid rgba(244,63,94,0.25);border-radius:12px;
    padding:10px 14px;font-size:12px;color:var(--red);margin-bottom:12px;font-weight:600;}
  .auth-ok{background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25);border-radius:12px;
    padding:10px 14px;font-size:12px;color:var(--green);margin-bottom:12px;font-weight:600;}
`;

function AuthScreen({ onSignIn, onSignUp }) {
  const [mode, setMode]       = useState('signin');   // 'signin' | 'signup'
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setError(''); setSuccess('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      if (mode === 'signup') {
        await onSignUp(email, password);
        setSuccess('Account created! Check your email to confirm, then sign in.');
      } else {
        await onSignIn(email, password);
      }
    } catch (e) {
      setError(e.message || 'Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrap">
      <style>{AUTH_STYLE}</style>
      <div className="auth-logo-wrap">
        <img src="/logo.png" alt="SpendWise" className="auth-logo-img"/>
        <div className="auth-logo-ring"/>
      </div>
      <div className="auth-title">SpendWise</div>
      <div className="auth-sub">Your personal finance command center</div>

      <div className="auth-card">
        <div className="auth-tabs">
          <button className={`auth-tab ${mode==='signin'?'active':''}`} onClick={()=>setMode('signin')}>Sign In</button>
          <button className={`auth-tab ${mode==='signup'?'active':''}`} onClick={()=>setMode('signup')}>Sign Up</button>
        </div>

        {error   && <div className="auth-err">⚠ {error}</div>}
        {success && <div className="auth-ok">✓ {success}</div>}

        <div className="ilb">Email</div>
        <input className="inp" type="email" placeholder="you@example.com"
          value={email} onChange={e=>setEmail(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&handle()}/>

        <div className="ilb">Password</div>
        <input className="inp" type="password" placeholder="Min. 6 characters"
          value={password} onChange={e=>setPassword(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&handle()}/>

        <button className="btn-p" onClick={handle} disabled={loading} style={{opacity:loading?.6:1}}>
          {loading ? '...' : mode==='signin' ? 'Sign In →' : 'Create Account →'}
        </button>
      </div>

      <div style={{fontSize:11,color:'var(--t3)',marginTop:20,textAlign:'center',lineHeight:1.6}}>
        Your data is encrypted and private.<br/>Powered by Supabase + Postgres.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LOADING SCREEN
// ─────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',gap:20}}>
      <div style={{position:'relative'}}>
        <div style={{position:'absolute',inset:-12,borderRadius:36,background:'radial-gradient(circle,rgba(123,111,255,0.25) 0%,transparent 70%)',animation:'logoGlow 2s ease-in-out infinite'}}/>
        <img src="/logo.png" alt="SpendWise" style={{width:80,height:80,borderRadius:22,display:'block',boxShadow:'0 0 40px rgba(123,111,255,0.4)',animation:'logoPulse 2s ease-in-out infinite'}}/>
      </div>
      <div>
        <div style={{fontSize:22,fontWeight:900,letterSpacing:-0.8,textAlign:'center',marginBottom:4}}>SpendWise</div>
        <div style={{fontSize:13,color:'var(--t2)',fontWeight:500,textAlign:'center'}}>Loading your finances...</div>
      </div>
      <div style={{width:120,height:3,borderRadius:100,background:'var(--s3)',overflow:'hidden'}}>
        <div style={{height:'100%',background:'linear-gradient(90deg,var(--indigo),var(--cyan))',borderRadius:100,animation:'loadBar 1.6s ease-in-out infinite'}}/>
      </div>
      <style>{`
        @keyframes logoGlow{0%,100%{opacity:0.5;transform:scale(1);}50%{opacity:1;transform:scale(1.08);}}
        @keyframes logoPulse{0%,100%{transform:scale(1);}50%{transform:scale(1.04);}}
        @keyframes loadBar{0%{width:0%;margin-left:0;}50%{width:80%;margin-left:0;}100%{width:0%;margin-left:100%;}}
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT APP — wired to Supabase
// ─────────────────────────────────────────────────────────────
export default function App(){
  const { user, loading: authLoading, signOut } = useAuth();
  const uid = user?.id;
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccounts(uid);
  const { transactions, addTransaction, updateTransaction, deleteTransaction, clearTransactions } = useTransactions(uid);
  const { budgets, setBudget }                                  = useBudgets(uid);
  const { savings, addGoal, updateGoal, deleteGoal }            = useSavingsGoals(uid);
  const { subscriptions, addSubscription, deleteSubscription }  = useSubscriptions(uid);

  const initW={};
  ALL_WIDGETS.forEach(w=>{initW[w.id]=w.def;});
  const { widgets, toggleWidget } = useWidgetConfig(uid, initW);

  const [tab,setTab]=useState("home");
  const [showAddTx,setShowAddTx]=useState(false);
  const [acctModal,setAcctModal]=useState(null);
  const [payCcModal,setPayCcModal]=useState(null);
  const [time,setTime]=useState(new Date());
  const [moreSub,setMoreSub]=useState("reports");
  const [showFabMenu,setShowFabMenu]=useState(false);
  const [transferModal,setTransferModal]=useState(false);
  const [editTxModal,setEditTxModal]=useState(null);

  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem('spendwise_theme') || 'swiss_grotesk';
  });

  const handleSelectTheme = (newId) => {
    setThemeId(newId);
    localStorage.setItem('spendwise_theme', newId);
  };

  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t);},[]);

  const activeTheme = THEMES.find(t => t.id === themeId) || THEMES[0];

  // Auth loading spinner or missing user fallback
  if (authLoading || !user) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:activeTheme.bg}}>
        <style>{G}</style>
        <style>{`
          :root {
            --bg: ${activeTheme.bg} !important;
            --text: ${activeTheme.text} !important;
            --indigo: ${activeTheme.indigo} !important;
            --font: ${activeTheme.font || "'Plus Jakarta Sans', sans-serif"} !important;
          }
        `}</style>
        <LoadingScreen/>
      </div>
    );
  }

  // Handlers that map UI shape to DB shape
  const handleAddAccount = async (data) => {
    await addAccount({
      type:         data.type,
      name:         data.name,
      bank:         data.bank,
      balance:      data.balance,
      credit_limit: data.limit,
      last4:        data.last4,
      icon:         data.icon,
      theme_idx:    data.themeIdx,
      color:        data.color,
    });
  };

  const handleUpdateAccount = async (data) => {
    await updateAccount(acctModal.id, {
      name:         data.name,
      bank:         data.bank,
      balance:      data.balance,
      credit_limit: data.limit,
      last4:        data.last4,
      icon:         data.icon,
      theme_idx:    data.themeIdx,
      color:        data.color,
    });
  };

  const handlePayCC = async ({ bankId, ccId, amount }) => {
    // Both bank and CC get a transaction for the record
    await addTransaction({amount, category:'other', note:'Payment to CC', type:'expense', date:new Date().toISOString().slice(0,10), accountId:bankId});
    await addTransaction({amount, category:'other', note:'Payment from Bank', type:'income', date:new Date().toISOString().slice(0,10), accountId:ccId});
    
    // Decrease the balances directly
    const bank = uiAccounts.find(a=>a.id===bankId);
    if(bank){
      await updateAccount(bank.id, { balance: bank.balance - amount });
    }
    const cc = uiAccounts.find(a=>a.id===ccId);
    if(cc){
      await updateAccount(cc.id, { balance: cc.balance - amount });
    }
  };

  const handleAddTx = async (tx) => {
    await addTransaction(tx);
    const acct = uiAccounts.find(a => a.id === tx.accountId);
    if (acct) {
      let change = 0;
      if (acct.type === "bank") {
         change = (tx.type === "income" ? tx.amount : -tx.amount);
      } else {
         change = (tx.type === "income" ? -tx.amount : tx.amount);
      }
      await updateAccount(acct.id, { balance: acct.balance + change });
    }
  };

  const handleClearHistory = async () => {
    await clearTransactions();
  };

  const handleTransfer = async ({ fromId, toId, amount }) => {
    const from = uiAccounts.find(a => a.id === fromId);
    const to = uiAccounts.find(a => a.id === toId);
    const today = new Date().toISOString().slice(0,10);
    const toName = to?.name || 'account';
    const fromName = from?.name || 'account';
    // Log tagged transactions so they are excluded from Reports & stats
    await addTransaction({amount, category:'other', note:`Transfer → ${toName}`, type:'expense', date:today, accountId:fromId, tags:['__transfer__']});
    await addTransaction({amount, category:'other', note:`Transfer ← ${fromName}`, type:'income', date:today, accountId:toId, tags:['__transfer__']});
    if (from) await updateAccount(from.id, { balance: from.balance - amount });
    if (to) await updateAccount(to.id, { balance: to.balance + amount });
  };

  const handleEditTx = async (txId, changes) => {
    const originalTx = transactions.find(t => t.id === txId);
    if (originalTx) {
      const newAmount = changes.amount !== undefined ? changes.amount : originalTx.amount;
      const newType = changes.type !== undefined ? changes.type : originalTx.type;
      const newAccountId = changes.accountId !== undefined ? changes.accountId : originalTx.accountId;

      // 1. Calculate reversal for the original account
      const oldAcct = uiAccounts.find(a => a.id === originalTx.accountId);
      let oldBalanceChange = 0;
      if (oldAcct) {
        if (oldAcct.type === "bank") {
          oldBalanceChange = originalTx.type === "income" ? -originalTx.amount : originalTx.amount;
        } else {
          oldBalanceChange = originalTx.type === "income" ? originalTx.amount : -originalTx.amount;
        }
      }

      // 2. Calculate balance change for the new account
      const newAcct = uiAccounts.find(a => a.id === newAccountId);
      let newBalanceChange = 0;
      if (newAcct) {
        if (newAcct.type === "bank") {
          newBalanceChange = newType === "income" ? newAmount : -newAmount;
        } else {
          newBalanceChange = newType === "income" ? -newAmount : newAmount;
        }
      }

      // 3. Update the balances in Supabase and state
      if (oldAcct && newAcct && oldAcct.id === newAcct.id) {
        // Same account - apply both changes to it
        const totalChange = oldBalanceChange + newBalanceChange;
        await updateAccount(oldAcct.id, { balance: oldAcct.balance + totalChange });
      } else {
        // Different accounts
        if (oldAcct) {
          await updateAccount(oldAcct.id, { balance: oldAcct.balance + oldBalanceChange });
        }
        if (newAcct) {
          await updateAccount(newAcct.id, { balance: newAcct.balance + newBalanceChange });
        }
      }
    }
    await updateTransaction(txId, changes);
  };

  const handleDeleteTx = async (tx) => {
    const splitTag = tx.tags?.find(t => t.startsWith('split_'));
    if (splitTag) {
      const linked = transactions.filter(t => t.tags?.includes(splitTag));
      for (const lt of linked) {
        const acct = uiAccounts.find(a => a.id === (lt.accountId || lt.account_id));
        if (acct) {
          let reversal = 0;
          if (acct.type === "bank") {
            reversal = lt.type === "income" ? -lt.amount : lt.amount;
          } else {
            reversal = lt.type === "income" ? lt.amount : -lt.amount;
          }
          await updateAccount(acct.id, { balance: acct.balance + reversal });
        }
        await deleteTransaction(lt.id);
      }
    } else {
      const acct = uiAccounts.find(a => a.id === (tx.accountId || tx.account_id));
      if (acct) {
        let reversal = 0;
        if (acct.type === "bank") {
          reversal = tx.type === "income" ? -tx.amount : tx.amount;
        } else {
          reversal = tx.type === "income" ? tx.amount : -tx.amount;
        }
        await updateAccount(acct.id, { balance: acct.balance + reversal });
      }
      await deleteTransaction(tx.id);
    }
  };

  // Normalise DB account row to UI shape
  const uiAccounts = accounts.map(a => ({
    ...a,
    themeIdx: a.theme_idx ?? a.themeIdx,
    limit:    a.credit_limit ?? a.limit,
  }));

  const timeStr=time.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:false});

  // Theme-aware nav icon sets — each theme gets a distinct visual language
  const NAV_ICONS = {
    // Minimal geometric (default / swiss_grotesk)
    _default: {
      home:     (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
      accounts: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
      history:  (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
      budget:   (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.22-8.56"/><path d="M21 3v6h-6"/></svg>,
      more:     (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
    },
    // Brutalist — angular bold strokes
    brutalist_steel: {
      home:     (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="square"><path d="M3 10L12 3l9 7v11H3z"/><rect x="9" y="14" width="6" height="8"/></svg>,
      accounts: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="square"><rect x="2" y="5" width="20" height="14"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="14" x2="10" y2="14"/></svg>,
      history:  (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="square"><rect x="3" y="3" width="18" height="18"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="14" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>,
      budget:   (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="square"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
      more:     (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="square"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>,
    },
    // Rounded organic — sage/mint/nordic themes
    _organic: {
      home:     (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L4 9v12h5v-6a3 3 0 0 1 6 0v6h5V9z"/></svg>,
      accounts: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 5H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3z"/><circle cx="16" cy="12" r="2"/></svg>,
      history:  (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="9"/></svg>,
      budget:   (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 0 20"/><path d="M12 2v10l7 4"/></svg>,
      more:     (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>,
    },
    // Luxury gold — ornate double-stroke
    champagne_espresso: {
      home:     (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L3 9v12h7v-6h4v6h7V9z"/><path d="M12 5l6 5" opacity="0.4"/></svg>,
      accounts: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="3"/><line x1="2" y1="10" x2="22" y2="10"/><circle cx="17" cy="15" r="1.5" fill={c}/></svg>,
      history:  (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/><circle cx="12" cy="12" r="2" fill={c} opacity="0.3"/></svg>,
      budget:   (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
      more:     (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>,
    },
  };

  // Map themes to their icon set
  const iconSetMap = {
    swiss_grotesk: '_default', obsidian_terracotta: '_default', tokyo_midnight: '_default',
    cybernetic_carbon: '_default', sovereign_cobalt: '_default',
    brutalist_steel: 'brutalist_steel',
    nordic_sage: '_organic', pearl_mint: '_organic', sage_alabaster: '_organic',
    champagne_espresso: 'champagne_espresso',
  };
  const iconSetKey = iconSetMap[activeTheme.id] || '_default';
  const navIcons = NAV_ICONS[iconSetKey] || NAV_ICONS._default;

  const TABS=[
    {id:"home",    key:"home",     lb:"Home"},
    {id:"accounts",key:"accounts", lb:"Accounts"},
    {id:"transactions",key:"history",lb:"History"},
    {id:"budget",  key:"budget",   lb:"Budget"},
    {id:"more",    key:"more",     lb:"More"},
  ];

  return (
    <div className="app-wrapper">
      <style>{G}</style>
      <style>{`
        :root {
          --bg: ${activeTheme.bg} !important;
          --s1: ${activeTheme.s1} !important;
          --s2: ${activeTheme.s2} !important;
          --s3: ${activeTheme.s3} !important;
          --s4: ${activeTheme.s4} !important;
          --border: ${activeTheme.border} !important;
          --border2: ${activeTheme.border2} !important;
          --text: ${activeTheme.text} !important;
          --t2: ${activeTheme.t2} !important;
          --t3: ${activeTheme.t3} !important;
          --indigo: ${activeTheme.indigo} !important;
          --violet: ${activeTheme.violet} !important;
          --cyan: ${activeTheme.cyan} !important;
          --green: ${activeTheme.green} !important;
          --red: ${activeTheme.red} !important;
          --amber: ${activeTheme.amber} !important;
          --pink: ${activeTheme.pink} !important;
          --sky: ${activeTheme.sky} !important;
          --lime: ${activeTheme.lime} !important;
          --orange: ${activeTheme.orange} !important;
          --font: ${activeTheme.font || "'Plus Jakarta Sans', sans-serif"} !important;
        }
        .app-wrapper {
          background: ${activeTheme.bg} !important;
        }
        .phone {
          background: ${activeTheme.id === "pearl_mint" ? "rgba(255, 255, 255, 0.45)" : activeTheme.id === "sage_alabaster" ? "#FFFFFF" : activeTheme.bg} !important;
          backdrop-filter: ${activeTheme.id === "pearl_mint" ? "blur(30px)" : "none"} !important;
        }
        .bnav {
          background: ${activeTheme.s1} !important;
          border-top-color: ${activeTheme.border} !important;
        }
        .ni.active .ni-ic {
          background: ${activeTheme.id === "pearl_mint" || activeTheme.id === "sage_alabaster" ? "rgba(0,0,0,0.06)" : "rgba(255, 255, 255, 0.06)"} !important;
        }
      `}</style>
      <div className="phone">
        <div className="island"/>
        <div className="sbar">
          <div className="sbar-t">{timeStr}</div>
          <div className="sbar-ic"><span>▲▲▲▲</span><span style={{marginLeft:4}}>WiFi</span><span style={{marginLeft:4}}>🔋</span></div>
        </div>

        <div className="scr">
          <DynamicIslandGlow transactions={transactions} budgets={budgets} />
          {tab==="home"&&<HomeScreen accounts={uiAccounts} transactions={transactions} budgets={budgets} savings={savings} subscriptions={subscriptions} widgets={widgets} onEditAcct={a=>setAcctModal(a)} onAddAcct={()=>setAcctModal("new")} setTab={setTab} onSignOut={signOut} onPayBill={setPayCcModal}/>}
          {tab==="accounts"&&<AccountsScreen accounts={uiAccounts} transactions={transactions} onEditAcct={a=>setAcctModal(a)} onAddAcct={()=>setAcctModal("new")} onPayBill={setPayCcModal}/>}
          {tab==="transactions"&&<TxScreen transactions={transactions} accounts={uiAccounts} onEditTx={tx=>setEditTxModal(tx)} onClearHistory={handleClearHistory}/>}
          {tab==="budget"&&<BudgetScreen transactions={transactions} budgets={budgets} onBudgetChange={setBudget}/>}
          {tab==="more"&&(
            <div>
              <div className="ph au"><div className="ph-t">More</div></div>
              <div className="au d1 sel-row" style={{padding:"0 18px 12px"}}>
                {[["reports","📊 Reports"],["subscriptions","🔄 Subscriptions"],["customize","🎨 Customize"]].map(([v,l])=>(
                  <div key={v} className={`chip ${moreSub===v?"on":""}`} onClick={()=>setMoreSub(v)}>{l}</div>
                ))}
              </div>
              {moreSub==="reports"&&<ReportsScreen transactions={transactions} accounts={uiAccounts}/>}
              {moreSub==="subscriptions"&&<SubsScreen subscriptions={subscriptions} setSubscriptions={()=>{}}/>}
              {moreSub==="customize"&&<CustomizeScreen widgets={widgets} onToggle={toggleWidget} currentThemeId={themeId} onSelectTheme={handleSelectTheme}/>}
            </div>
          )}
        </div>

        {showFabMenu && <div style={{position:'absolute',inset:0,zIndex:49}} onClick={() => setShowFabMenu(false)}/>}
        {showFabMenu && (
          <div style={{position:'absolute',bottom:152,right:16,zIndex:55,background:'var(--s1)',border:'1px solid var(--border2)',borderRadius:20,padding:8,boxShadow:'0 12px 40px rgba(0,0,0,0.7)',minWidth:190,animation:'slideUp .25s cubic-bezier(0.34,1.56,0.64,1)'}}>
            <div onClick={() => {setShowAddTx(true);setShowFabMenu(false);}} style={{display:'flex',alignItems:'center',gap:10,padding:'12px 14px',borderRadius:12,cursor:'pointer'}}>
              <span style={{fontSize:18}}>💰</span>
              <div><div style={{fontSize:13,fontWeight:700,color:'var(--text)'}}>Add Transaction</div><div style={{fontSize:10,color:'var(--t2)'}}>Income or expense</div></div>
            </div>
            <div style={{height:1,background:'var(--border)',margin:'0 8px'}}/>
            <div onClick={() => {setTransferModal(true);setShowFabMenu(false);}} style={{display:'flex',alignItems:'center',gap:10,padding:'12px 14px',borderRadius:12,cursor:'pointer'}}>
              <span style={{fontSize:18}}>🔄</span>
              <div><div style={{fontSize:13,fontWeight:700,color:'var(--text)'}}>Transfer Funds</div><div style={{fontSize:10,color:'var(--t2)'}}>Between bank accounts</div></div>
            </div>
          </div>
        )}
        <div className="fab" onClick={() => setShowFabMenu(!showFabMenu)} style={showFabMenu ? {background:'linear-gradient(135deg,#F43F5E,#E11D48)',transform:'rotate(45deg)'} : {}}>＋</div>

        <div className="bnav">
          {TABS.map(t=>{
            const isActive = tab===t.id;
            const iconColor = isActive ? activeTheme.indigo : activeTheme.t3;
            return (
              <div key={t.id} className={`ni ${isActive?"active":""}`} onClick={()=>{setTab(t.id);setShowFabMenu(false);}}>
                <div className="ni-ic">{navIcons[t.key](iconColor)}</div>
                <div className="ni-lb" style={isActive ? {color: activeTheme.indigo} : {}}>{t.lb}</div>
              </div>
            );
          })}
        </div>

        {showAddTx&&<AddTxModal accounts={uiAccounts} onClose={()=>setShowAddTx(false)} onAdd={handleAddTx}/>}
        {acctModal&&<AcctModal account={acctModal==="new"?null:acctModal} onClose={()=>setAcctModal(null)} onSave={acctModal==="new"?handleAddAccount:handleUpdateAccount} onDelete={deleteAccount}/>}
        {payCcModal&&<PayCCModal creditCard={payCcModal} accounts={uiAccounts} onClose={()=>setPayCcModal(null)} onPay={handlePayCC}/>}
        {transferModal&&<TransferModal accounts={uiAccounts} onClose={()=>setTransferModal(false)} onTransfer={handleTransfer}/>}
        {editTxModal&&<EditTxModal tx={editTxModal} accounts={uiAccounts} onClose={()=>setEditTxModal(null)} onSave={handleEditTx} onDelete={handleDeleteTx}/>}
      </div>
    </div>
  );
}
