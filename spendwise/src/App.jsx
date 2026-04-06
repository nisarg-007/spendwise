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
  --bg:#06060F;--s1:#0E0E1C;--s2:#151528;--s3:#1C1C34;--s4:#242442;
  --border:rgba(255,255,255,0.055);--border2:rgba(255,255,255,0.11);
  --text:#F2F2FF;--t2:#8080BB;--t3:#454570;
  --indigo:#7B6FFF;--violet:#A855F7;--cyan:#22D3EE;
  --green:#10B981;--red:#F43F5E;--amber:#F59E0B;--pink:#EC4899;
  --sky:#0EA5E9;--lime:#84CC16;--orange:#F97316;
  --font:'Plus Jakarta Sans',sans-serif;--mono:'JetBrains Mono',monospace;
  --r28:28px;--r20:20px;--r14:14px;--r8:8px;
}
body{background:var(--bg);font-family:var(--font);color:var(--text);overflow:hidden;}

/* ── LAYOUT ── */
.app-wrapper {
  min-height: 100vh; height: 100dvh; display: flex; align-items: center; justify-content: center;
  background: radial-gradient(ellipse 80% 60% at 50% -5%,rgba(123,111,255,0.1) 0%,#000 65%);
  padding: 16px;
}
.phone{width:393px;height:852px;background:var(--bg);border-radius:52px;overflow:hidden;
  position:relative;display:flex;flex-direction:column;
  box-shadow:0 0 0 1px rgba(255,255,255,0.07),0 80px 180px rgba(0,0,0,0.95),inset 0 1px 0 rgba(255,255,255,0.04);}
.island{position:absolute;top:14px;left:50%;transform:translateX(-50%);width:126px;height:37px;background:#000;border-radius:22px;z-index:50;}
.sbar{height:54px;display:flex;align-items:flex-end;padding:0 26px 10px;justify-content:space-between;flex-shrink:0;z-index:10;position:relative;}
.sbar-t{font-size:15px;font-weight:700;letter-spacing:-.3px;}
.sbar-ic{display:flex;gap:4px;align-items:center;font-size:12px;color:var(--t2);}
.scr{flex:1;overflow-y:auto;overflow-x:hidden;scrollbar-width:none;}
.scr::-webkit-scrollbar{display:none;}

/* ── NAV ── */
.bnav{height:82px;background:rgba(8,8,20,0.97);backdrop-filter:blur(28px);border-top:1px solid var(--border);
  display:flex;align-items:flex-start;padding-top:10px;flex-shrink:0;z-index:20;position:relative;}
.ni{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;padding-top:2px;}
.ni-ic{width:30px;height:30px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;transition:all .2s;}
.ni.active .ni-ic{background:rgba(123,111,255,0.18);}
.ni-lb{font-size:9px;font-weight:700;color:var(--t2);letter-spacing:.4px;transition:color .2s;text-transform:uppercase;}
.ni.active .ni-lb{color:#A89FFF;}

/* ── MOBILE RESPONSIVE TWEAKS ── */
@media (max-width: 480px) {
  .app-wrapper { padding: 0; background: var(--bg); }
  .phone { width: 100vw; height: 100dvh; border-radius: 0; box-shadow: none; }
  .island, .sbar { display: none !important; }
  .scr { padding-top: max(55px, env(safe-area-inset-top)); }
  .bnav { padding-bottom: max(20px, env(safe-area-inset-bottom)); height: auto; padding-top: 10px; }
  .fab { bottom: max(94px, calc(80px + env(safe-area-inset-bottom))); }
}

/* ── FAB ── */
.fab{position:absolute;bottom:94px;right:16px;width:52px;height:52px;border-radius:17px;
  background:linear-gradient(135deg,#7B6FFF,#5048E5);display:flex;align-items:center;justify-content:center;
  font-size:24px;box-shadow:0 8px 28px rgba(123,111,255,0.45);cursor:pointer;z-index:50;transition:all .15s;}
.fab:active{transform:scale(.9);}

/* ── PAGE HEADER ── */
.ph{padding:12px 18px 8px;display:flex;align-items:center;justify-content:space-between;}
.ph-t{font-size:28px;font-weight:900;letter-spacing:-1.2px;}
.av{width:38px;height:38px;border-radius:13px;background:linear-gradient(135deg,#7B6FFF,#A855F7);
  display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:900;}

/* ── CARDS ── */
.card{background:var(--s1);border:1px solid var(--border);border-radius:var(--r20);padding:18px;position:relative;overflow:hidden;}
.card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.02) 0%,transparent 55%);pointer-events:none;}

/* ── PILLS ── */
.pill{display:inline-flex;align-items:center;gap:3px;padding:4px 10px;border-radius:100px;font-size:10px;font-weight:800;letter-spacing:.3px;}

/* ── DIVIDER ── */
.div{height:1px;background:var(--border);margin:0 18px;}

/* ── SECTION HEAD ── */
.sh{display:flex;justify-content:space-between;align-items:center;padding:14px 18px 8px;}
.sh-t{font-size:15px;font-weight:800;letter-spacing:-.3px;}
.sh-a{font-size:12px;color:#A89FFF;font-weight:700;cursor:pointer;}

/* ── PROGRESS ── */
.pt{height:5px;background:var(--s3);border-radius:100px;overflow:hidden;}
.pf{height:100%;border-radius:100px;transition:width .8s cubic-bezier(0.34,1.56,0.64,1);}

/* ── MODAL ── */
.ov{position:absolute;inset:0;background:rgba(0,0,0,0.8);backdrop-filter:blur(12px);z-index:200;display:flex;align-items:flex-end;}
.sheet{width:100%;background:var(--s1);border-radius:28px 28px 0 0;padding:16px 18px 36px;
  border-top:1px solid var(--border2);animation:slideUp .32s cubic-bezier(0.34,1.56,0.64,1);max-height:88%;overflow-y:auto;}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.hdl{width:36px;height:4px;background:var(--s4);border-radius:100px;margin:0 auto 16px;}
.st{font-size:20px;font-weight:900;letter-spacing:-.6px;margin-bottom:14px;}
.inp{width:100%;background:var(--s2);border:1.5px solid var(--border);border-radius:var(--r14);
  padding:12px 14px;color:var(--text);font-family:var(--font);font-size:14px;outline:none;transition:border-color .2s;margin-bottom:10px;}
.inp:focus{border-color:var(--indigo);}
.inp::placeholder{color:var(--t2);}
.ilb{font-size:10px;font-weight:800;color:var(--t2);margin-bottom:5px;letter-spacing:.5px;text-transform:uppercase;}
.btn-p{width:100%;padding:14px;background:linear-gradient(135deg,#7B6FFF,#5048E5);border:none;border-radius:var(--r14);
  color:#fff;font-family:var(--font);font-size:14px;font-weight:800;cursor:pointer;
  box-shadow:0 8px 24px rgba(123,111,255,0.35);transition:all .15s;margin-top:6px;}
.btn-p:active{transform:scale(.98);}
.btn-s{width:100%;padding:12px;background:var(--s3);border:1px solid var(--border2);border-radius:var(--r14);
  color:var(--t2);font-family:var(--font);font-size:13px;font-weight:700;cursor:pointer;transition:all .15s;margin-top:8px;}
.btn-del{width:100%;padding:12px;background:rgba(244,63,94,0.1);border:1px solid rgba(244,63,94,0.25);
  border-radius:var(--r14);color:var(--red);font-family:var(--font);font-size:13px;font-weight:700;cursor:pointer;margin-top:8px;}
.ttog{display:flex;background:var(--s2);border-radius:var(--r14);padding:4px;margin-bottom:12px;}
.tbtn{flex:1;padding:10px;border-radius:11px;border:none;background:transparent;color:var(--t2);
  font-family:var(--font);font-size:12px;font-weight:800;cursor:pointer;transition:all .2s;}
.tbtn.ae{background:rgba(244,63,94,.2);color:var(--red);}
.tbtn.ai{background:rgba(16,185,129,.2);color:var(--green);}
.sel-row{display:flex;gap:7px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none;margin-bottom:10px;}
.sel-row::-webkit-scrollbar{display:none;}
.chip{padding:7px 13px;border-radius:100px;border:1.5px solid var(--border);background:var(--s2);
  color:var(--t2);font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all .15s;flex-shrink:0;}
.chip.on{border-color:var(--indigo);background:rgba(123,111,255,.18);color:#C4BEFF;}
.cgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:12px;}
.cbtn{display:flex;flex-direction:column;align-items:center;gap:3px;padding:9px 3px;
  border-radius:var(--r14);border:1.5px solid var(--border);background:var(--s2);cursor:pointer;transition:all .15s;}
.cbtn.on{border-color:var(--indigo);background:rgba(123,111,255,.15);}
.cbtn-lb{font-size:8px;color:var(--t2);font-weight:700;text-align:center;}
.cbtn.on .cbtn-lb{color:#C4BEFF;}

/* ── NUMPAD ── */
.npad{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:12px 0;}
.npb{padding:14px;background:var(--s2);border:1px solid var(--border);border-radius:var(--r14);
  font-family:var(--mono);font-size:20px;font-weight:600;color:var(--text);cursor:pointer;text-align:center;transition:all .1s;}
.npb:active{background:var(--s3);transform:scale(.95);}
.amtd{font-size:40px;font-weight:900;letter-spacing:-2px;text-align:center;padding:14px;background:var(--s2);
  border:2px solid var(--indigo);border-radius:var(--r14);min-height:76px;display:flex;align-items:center;
  justify-content:center;font-family:var(--mono);margin-bottom:12px;box-shadow:0 0 0 4px rgba(123,111,255,0.1);}

/* ── TOGGLE ── */
.tgsw{width:44px;height:26px;border-radius:100px;position:relative;cursor:pointer;transition:background .2s;flex-shrink:0;}
.tgsw.on{background:var(--indigo);}
.tgsw.off{background:var(--s4);}
.tgk{width:20px;height:20px;border-radius:50%;background:#fff;position:absolute;top:3px;transition:left .2s;box-shadow:0 2px 6px rgba(0,0,0,0.3);}
.tgsw.on .tgk{left:21px;}
.tgsw.off .tgk{left:3px;}

/* ── TX ROW ── */
.txr{display:flex;align-items:center;gap:12px;padding:12px 18px;cursor:pointer;transition:background .15s;border-radius:var(--r14);}
.txr:active{background:var(--s2);}
.txic{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}
.txin{flex:1;min-width:0;}
.txno{font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.txsb{font-size:10px;color:var(--t2);margin-top:2px;display:flex;align-items:center;gap:5px;flex-wrap:wrap;}
.txam{font-size:14px;font-weight:800;font-family:var(--mono);}
.abadge{font-size:8px;padding:2px 6px;border-radius:100px;background:var(--s3);color:var(--t2);font-weight:700;flex-shrink:0;}
.recbadge{font-size:8px;padding:2px 6px;border-radius:100px;background:rgba(245,158,11,0.15);color:var(--amber);font-weight:700;}
.taxbadge{font-size:8px;padding:2px 6px;border-radius:100px;background:rgba(16,185,129,0.15);color:var(--green);font-weight:700;}

/* ── BANK CARD ── */
.bcard{min-width:272px;height:158px;border-radius:20px;position:relative;overflow:hidden;cursor:pointer;transition:transform .15s;flex-shrink:0;margin-right:12px;}
.bcard:active{transform:scale(.97);}

/* ── STAT CELL ── */
.scell{background:var(--s1);border:1px solid var(--border);border-radius:var(--r20);padding:14px;}
.slb{font-size:9px;color:var(--t2);font-weight:800;text-transform:uppercase;letter-spacing:.6px;margin-bottom:6px;}
.sval{font-size:20px;font-weight:900;letter-spacing:-1px;font-family:var(--mono);}

/* ── RING ── */
.rw{position:relative;flex-shrink:0;}
.ri{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}

/* ── ANIMATIONS ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.au{animation:fadeUp .38s ease both;}
.d1{animation-delay:.05s}.d2{animation-delay:.1s}.d3{animation-delay:.15s}.d4{animation-delay:.2s}.d5{animation-delay:.25s}.d6{animation-delay:.3s}

/* ── FEATURE TAG ── */
.ftag{font-size:9px;padding:2px 7px;border-radius:100px;font-weight:800;letter-spacing:.3px;}
.ftag-p{background:rgba(168,85,247,0.18);color:#C084FC;}
.ftag-f{background:rgba(16,185,129,0.15);color:var(--green);}

/* ── BUDGET ITEM ── */
.bi{background:var(--s2);border:1px solid var(--border);border-radius:var(--r14);padding:14px;}

/* ── WIDGET ROW ── */
.wr{display:flex;align-items:center;gap:11px;background:var(--s2);border:1px solid var(--border);border-radius:var(--r20);padding:13px;}
.wic{width:40px;height:40px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:18px;}

/* ── SEARCH BAR ── */
.sbar-inp{width:100%;background:var(--s2);border:1.5px solid var(--border);border-radius:var(--r14);
  padding:10px 14px 10px 36px;color:var(--text);font-family:var(--font);font-size:13px;outline:none;transition:border-color .2s;}
.sbar-inp:focus{border-color:var(--indigo);}
.sbar-inp::placeholder{color:var(--t3);}
.sbar-wrap{position:relative;margin:0 18px 12px;}
.sbar-ico{position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:14px;color:var(--t2);}

/* ── SUBSCRIPTION CARD ── */
.subc{display:flex;align-items:center;gap:12px;padding:12px 18px;border-radius:var(--r14);cursor:pointer;}
.subc:active{background:var(--s2);}
.subic{width:42px;height:42px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}

/* ── REPORT CARD ── */
.rcard{background:var(--s2);border:1px solid var(--border);border-radius:var(--r14);padding:14px;margin-bottom:10px;}

/* ── COLOR DOTS ── */
.cdot{width:30px;height:30px;border-radius:9px;cursor:pointer;transition:all .15s;border:2px solid transparent;}
.cdot.sel{border-color:white;}
`;

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
  {id:"ba1",type:"bank",name:"Chase Checking",bank:"Chase",balance:8420.50,themeIdx:0,last4:"4521",icon:"🏦"},
  {id:"ba2",type:"bank",name:"Wells Savings",bank:"Wells Fargo",balance:15200.00,themeIdx:3,last4:"8834",icon:"💰"},
  {id:"ba3",type:"bank",name:"Discover Checking",bank:"Discover",balance:3890.75,themeIdx:1,last4:"2291",icon:"🏧"},
  {id:"ba4",type:"bank",name:"Ally Savings",bank:"Ally Bank",balance:22100.00,themeIdx:4,last4:"6677",icon:"💎"},
  {id:"cc1",type:"credit",name:"Chase Sapphire",bank:"Chase",balance:1240.80,limit:10000,color:CC_COLORS[0],last4:"7832",icon:"💳"},
  {id:"cc2",type:"credit",name:"Amex Gold",bank:"Amex",balance:450.25,limit:15000,color:CC_COLORS[1],last4:"3390",icon:"⚜️"},
];

const INIT_TX = [
  {id:1,amount:42.5,category:"food",note:"Dinner at Nobu",date:"2025-03-28",type:"expense",accountId:"ba1",recurring:false,taxDeductible:false,tags:[]},
  {id:2,amount:3200,category:"other",note:"Monthly Salary",date:"2025-03-27",type:"income",accountId:"ba1",recurring:true,taxDeductible:false,tags:["salary"]},
  {id:3,amount:18.9,category:"transport",note:"Uber to Airport",date:"2025-03-27",type:"expense",accountId:"cc1",recurring:false,taxDeductible:true,tags:["work"]},
  {id:4,amount:129,category:"shopping",note:"New Sneakers",date:"2025-03-26",type:"expense",accountId:"cc2",recurring:false,taxDeductible:false,tags:[]},
  {id:5,amount:12.99,category:"entertainment",note:"Netflix",date:"2025-03-25",type:"expense",accountId:"ba2",recurring:true,taxDeductible:false,tags:["subscription"]},
  {id:6,amount:85,category:"health",note:"Gym Monthly",date:"2025-03-25",type:"expense",accountId:"cc1",recurring:true,taxDeductible:false,tags:["subscription","health"]},
  {id:7,amount:250,category:"bills",note:"Electricity",date:"2025-03-24",type:"expense",accountId:"ba1",recurring:true,taxDeductible:false,tags:["utility"]},
  {id:8,amount:500,category:"other",note:"Freelance Project",date:"2025-03-23",type:"income",accountId:"ba3",recurring:false,taxDeductible:false,tags:["freelance"]},
  {id:9,amount:34.5,category:"grocery",note:"Whole Foods",date:"2025-03-22",type:"expense",accountId:"ba2",recurring:false,taxDeductible:false,tags:[]},
  {id:10,amount:220,category:"travel",note:"Hotel Booking",date:"2025-03-20",type:"expense",accountId:"cc2",recurring:false,taxDeductible:true,tags:["work","travel"]},
  {id:11,amount:9.99,category:"entertainment",note:"Spotify",date:"2025-03-19",type:"expense",accountId:"ba1",recurring:true,taxDeductible:false,tags:["subscription"]},
  {id:12,amount:65,category:"dining",note:"Sushi Dinner",date:"2025-03-18",type:"expense",accountId:"cc1",recurring:false,taxDeductible:false,tags:[]},
  {id:13,amount:14.9,category:"fuel",note:"Shell Gas Station",date:"2025-03-17",type:"expense",accountId:"ba1",recurring:false,taxDeductible:false,tags:[]},
  {id:14,amount:1500,category:"other",note:"Rent Transfer",date:"2025-03-16",type:"expense",accountId:"ba1",recurring:true,taxDeductible:false,tags:["housing"]},
  {id:15,amount:49,category:"education",note:"Udemy Course",date:"2025-03-15",type:"expense",accountId:"cc1",recurring:false,taxDeductible:true,tags:["education"]},
];

const INIT_BUDGETS = {food:400,transport:200,shopping:300,health:250,entertainment:150,bills:600,travel:500,grocery:300,dining:200,fuel:100,education:100,other:200};

const INIT_SAVINGS = [
  {id:"sg1",name:"MacBook Pro",icon:"💻",target:3000,saved:1920,color:"#7B6FFF",deadline:"2025-06-01"},
  {id:"sg2",name:"Japan Trip",icon:"🗾",target:5000,saved:2800,color:"#10B981",deadline:"2025-09-01"},
  {id:"sg3",name:"Emergency Fund",icon:"🛡️",target:10000,saved:6500,color:"#F59E0B",deadline:"2025-12-31"},
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

// ─── BANK CARD VISUAL ─────────────────────────────────────────────────────────
function BankCardVis({a,onPress}){
  const isCC = a.type==="credit";
  const bg = isCC ? a.color : BANK_THEMES[a.themeIdx||0];
  const pct = isCC && a.limit ? a.balance/a.limit : 0;
  return (
    <div className="bcard" onClick={onPress} style={{background:bg}}>
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

// ─── SCREENS ──────────────────────────────────────────────────────────────────

function HomeScreen({accounts,transactions,budgets,savings,subscriptions,widgets,onEditAcct,onAddAcct,setTab,onSignOut,onPayBill}){
  const [showProfileMenu, setShowProfileMenu] = useState(false);
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
            <div style={{position:'absolute',top:48,right:0,background:'var(--s2)',border:'1px solid var(--border)',borderRadius:12,padding:8,zIndex:1000,boxShadow:'0 10px 40px rgba(0,0,0,0.8)',minWidth:140}}>
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

      {/* BANK CARDS */}
      {w.bank_cards && banks.length>0 && (
        <div className="au d1">
          <div className="sh"><div className="sh-t">🏦 Bank Accounts</div><div className="sh-a" onClick={onAddAcct}>+ Add</div></div>
          <div style={{display:"flex",overflowX:"auto",padding:"0 18px 4px",scrollbarWidth:"none"}}>
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
        <div className="au d2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,padding:"0 18px 14px"}}>
          {[
            {lb:"Savings Rate",v:`${savingsRate}%`,c:savingsRate>20?"var(--green)":"var(--amber)"},
            {lb:"Daily Avg",v:fmtK(expense/28),c:"var(--text)"},
            {lb:"Income",v:fmtK(income),c:"var(--green)"},
            {lb:"Expenses",v:fmtK(expense),c:"var(--red)"},
          ].map(s=>(
            <div key={s.lb} className="scell">
              <div className="slb">{s.lb}</div>
              <div className="sval" style={{color:s.c}}>{s.v}</div>
            </div>
          ))}
        </div>
      )}

      {/* MONTHLY RING */}
      {w.monthly_ring && (
        <div className="au d3" style={{margin:"0 18px 14px"}}>
          <div className="card">
            <div style={{fontSize:14,fontWeight:800,marginBottom:14}}>{new Date().toLocaleString('en-US',{month:'long',year:'numeric'})}</div>
            <div style={{display:"flex",alignItems:"center",gap:18}}>
              <Ring pct={expense/(income||1)} color={expense>income?"var(--red)":"var(--indigo)"} size={100} stroke={9}>
                <div style={{fontSize:15,fontWeight:900,fontFamily:"var(--mono)"}}>{Math.round((expense/(income||1))*100)}%</div>
                <div style={{fontSize:9,color:"var(--t2)"}}>spent</div>
              </Ring>
              <div style={{flex:1}}>
                {[
                  {lb:"Income",v:income,c:"var(--green)",ic:"▲"},
                  {lb:"Expense",v:expense,c:"var(--red)",ic:"▼"},
                  {lb:"Saved",v:Math.max(0,income-expense),c:"var(--cyan)",ic:"●"},
                  {lb:"Deductible",v:taxDeductible,c:"var(--violet)",ic:"🧾"},
                ].map(r=>(
                  <div key={r.lb} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <span style={{color:r.c,fontSize:9}}>{r.ic}</span>
                      <span style={{fontSize:12,color:"var(--t2)",fontWeight:600}}>{r.lb}</span>
                    </div>
                    <span style={{fontSize:13,fontWeight:800,fontFamily:"var(--mono)",color:r.c}}>{fmt(r.v)}</span>
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
          <div className="card">
            <div style={{fontSize:13,fontWeight:800,marginBottom:14}}>Weekly Spend</div>
            <div style={{display:"flex",alignItems:"flex-end",gap:5,height:72}}>
              {weekBars.map((v,i)=>(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                  <div style={{width:"100%",height:`${(v/wMax)*64}px`,borderRadius:"5px 5px 0 0",
                    background:i===6?"linear-gradient(180deg,var(--indigo),#3730a3)":"var(--s3)",
                    transition:"height .7s cubic-bezier(0.34,1.56,0.64,1)",minHeight:3}}/>
                  <div style={{fontSize:8,color:"var(--t2)",fontWeight:600}}>{days[i]}</div>
                </div>
              ))}
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
    </div>
  );
}

// ─── ACCOUNTS SCREEN ──────────────────────────────────────────────────────────
function AccountsScreen({accounts,transactions,onEditAcct,onAddAcct,onPayBill,onAddInterest}){
  const KNOWN_HYSA = ['capital one','capitalone','ally','marcus','discover','american express','amex','synchrony','cit'];
  const hasAPY = (a) => a.type==='bank' && KNOWN_HYSA.some(n=>(a.bank||a.name||'').toLowerCase().includes(n));
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
          const eligible = hasAPY(a);
          const bankKey = Object.entries({'capital one':3.20,'capitalone':3.20,'ally':4.30,'marcus':4.20,'discover':4.10,'american express':4.20,'amex':4.20,'synchrony':4.50,'cit':4.50})
            .find(([n]) => (a.bank||a.name||'').toLowerCase().includes(n));
          const apyPct = bankKey ? bankKey[1] : null;
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
                    {eligible && (
                      <button onClick={(e)=>{e.stopPropagation();onAddInterest(a);}} style={{background:'rgba(16,185,129,0.25)',border:'1px solid rgba(16,185,129,0.4)',color:'#10B981',padding:'4px 10px',borderRadius:8,fontSize:10,fontWeight:800,cursor:'pointer',whiteSpace:'nowrap'}}>
                        + Interest {apyPct ? `(${apyPct}%)` : ''}
                      </button>
                    )}
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
function TxScreen({transactions,accounts,onEditTx}){
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
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          {showTax&&<span className="ftag ftag-p">TAX</span>}
          <div style={{fontSize:13,fontWeight:700,fontFamily:"var(--mono)",color:totalFiltered>=0?"var(--green)":"var(--red)"}}>{totalFiltered>=0?"+":""}{fmt(totalFiltered)}</div>
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
function CustomizeScreen({widgets,onToggle}){
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
      <div className="au d1" style={{margin:"0 18px 16px",background:"linear-gradient(135deg,rgba(123,111,255,0.08),rgba(34,211,238,0.04))",border:"1px solid rgba(123,111,255,0.18)",borderRadius:16,padding:"13px 15px"}}>
        <div style={{fontSize:12,fontWeight:800,color:"#C4BEFF",marginBottom:4}}>✨ Customize your Dashboard</div>
        <div style={{fontSize:11,color:"var(--t2)",lineHeight:1.6}}>Toggle any widget on or off. Changes show instantly on your Home tab.</div>
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
  const [autoDetected,setAutoDetected]=useState(false);

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
    if(v==="⌫"){setAmount(a=>a.slice(0,-1));return;}
    if(amount.replace(".","").length>=7) return;
    setAmount(a=>a+v);
  };

  const doAdd=()=>{
    const val=parseFloat(amount);
    if(!val||val<=0||!accountId) return;
    const finalCategory = type === "income" ? "other" : category;
    const finalNote = note || (type === "income" ? "Income" : CATS.find(c=>c.id===category).lb);
    onAdd({amount:val,category:finalCategory,note:finalNote,type,date:new Date().toISOString().slice(0,10),accountId,recurring,taxDeductible:taxDed,tags:tags?tags.split(",").map(t=>t.trim()).filter(Boolean):[]});
    onClose();
  };

  return (
    <div className="ov" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="hdl"/>
        <div className="st">New Transaction</div>
        <div className="ttog">
          <button className={`tbtn ${type==="expense"?"ae":""}`} onClick={()=>setType("expense")}>▼ Expense</button>
          <button className={`tbtn ${type==="income"?"ai":""}`} onClick={()=>setType("income")}>▲ Income</button>
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
        {type === "expense" && (
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
        <input className="inp" placeholder="Note... (try 'Netflix' or 'Uber')" value={note} onChange={e=>setNote(e.target.value)}/>
        {autoDetected && type==="expense" && (
          <div style={{fontSize:10,color:'var(--cyan)',marginTop:-8,marginBottom:8,paddingLeft:4}}>✨ Auto-detected: {(CATS.find(c=>c.id===category)||{}).lb}</div>
        )}
        <input className="inp" placeholder="Tags (comma separated): work, travel..." value={tags} onChange={e=>setTags(e.target.value)}/>

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
        <button className="btn-p" style={{marginTop: type === 'income' ? 14 : 0}} onClick={doAdd}>Add {type==="income"?"Income":"Expense"}</button>
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
  const [confirmDel, setConfirmDel] = useState(false);

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
      amount: val, category: finalCategory, note: finalNote, type,
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
        <input className="inp" placeholder="Note..." value={note} onChange={e => setNote(e.target.value)}/>
        <input className="inp" placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)}/>
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
          <button className="btn-del" onClick={() => setConfirmDel(true)}>Delete Transaction</button>
        ) : (
          <button className="btn-del" style={{background:'rgba(244,63,94,0.25)',fontWeight:900}} onClick={() => {onDelete(tx);onClose();}}>⚠ Confirm Delete — Cannot Undo</button>
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
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions(uid);
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

  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t);},[]);

  // Auth loading spinner or missing user fallback
  if (authLoading || !user) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#06060F'}}>
        <style>{G}</style>
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

  // ── MONTHLY INTEREST ──
  // Capital One 360 Performance Savings: 3.20% APY (as of Apr 2026)
  // Generic HYSA default: 4.50% APY
  const BANK_RATES = {
    'capital one': 0.0320,
    'capitalone':  0.0320,
    'ally':        0.0430,
    'marcus':      0.0420,
    'discover':    0.0410,
    'american express': 0.0420,
    'amex':        0.0420,
    'synchrony':   0.0450,
    'cit':         0.0450,
  };
  const getAPY = (bankName) => {
    if (!bankName) return null;
    const key = bankName.toLowerCase();
    for (const [name, rate] of Object.entries(BANK_RATES)) {
      if (key.includes(name)) return rate;
    }
    return null; // only apply to known HYSA banks
  };
  const handleAddInterest = async (acct) => {
    const apy = getAPY(acct.bank || acct.name);
    if (!apy || acct.type !== 'bank') return;
    const monthlyRate = apy / 12;
    const interest = parseFloat((acct.balance * monthlyRate).toFixed(2));
    if (interest <= 0) return;
    const today = new Date().toISOString().slice(0,10);
    await addTransaction({amount: interest, category:'other', note:`Monthly Interest (${(apy*100).toFixed(2)}% APY)`, type:'income', date:today, accountId:acct.id, tags:['interest']});
    await updateAccount(acct.id, { balance: acct.balance + interest });
  };

  const handleEditTx = async (txId, changes) => {
    await updateTransaction(txId, changes);
  };

  const handleDeleteTx = async (tx) => {
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
  };

  // Normalise DB account row to UI shape
  const uiAccounts = accounts.map(a => ({
    ...a,
    themeIdx: a.theme_idx ?? a.themeIdx,
    limit:    a.credit_limit ?? a.limit,
  }));

  const timeStr=time.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:false});

  const TABS=[
    {id:"home",ic:"⬟",lb:"Home"},
    {id:"accounts",ic:"◈",lb:"Accounts"},
    {id:"transactions",ic:"≡",lb:"History"},
    {id:"budget",ic:"◎",lb:"Budget"},
    {id:"more",ic:"⊞",lb:"More"},
  ];

  return (
    <div className="app-wrapper">
      <style>{G}</style>
      <div className="phone">
        <div className="island"/>
        <div className="sbar">
          <div className="sbar-t">{timeStr}</div>
          <div className="sbar-ic"><span>▲▲▲▲</span><span style={{marginLeft:4}}>WiFi</span><span style={{marginLeft:4}}>🔋</span></div>
        </div>

        <div className="scr">
          {tab==="home"&&<HomeScreen accounts={uiAccounts} transactions={transactions} budgets={budgets} savings={savings} subscriptions={subscriptions} widgets={widgets} onEditAcct={a=>setAcctModal(a)} onAddAcct={()=>setAcctModal("new")} setTab={setTab} onSignOut={signOut} onPayBill={setPayCcModal}/>}
          {tab==="accounts"&&<AccountsScreen accounts={uiAccounts} transactions={transactions} onEditAcct={a=>setAcctModal(a)} onAddAcct={()=>setAcctModal("new")} onPayBill={setPayCcModal} onAddInterest={handleAddInterest}/>}
          {tab==="transactions"&&<TxScreen transactions={transactions} accounts={uiAccounts} onEditTx={tx=>setEditTxModal(tx)}/>}
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
              {moreSub==="customize"&&<CustomizeScreen widgets={widgets} onToggle={toggleWidget}/>}
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
          {TABS.map(t=>(
            <div key={t.id} className={`ni ${tab===t.id?"active":""}`} onClick={()=>{setTab(t.id);setShowFabMenu(false);}}>
              <div className="ni-ic">{t.ic}</div>
              <div className="ni-lb">{t.lb}</div>
            </div>
          ))}
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
