// src/App.jsx
// ─────────────────────────────────────────────────────────────
// SpendWise Ultimate — fully wired to Supabase
// Replaces all useState seed data with real DB calls
// ─────────────────────────────────────────────────────────────
import { useState } from 'react';
import {
  useAuth,
  useAccounts,
  useTransactions,
  useBudgets,
  useSavingsGoals,
  useSubscriptions,
  useWidgetConfig,
} from './hooks/useSpendWise';

// ── paste your full UI component code from spendwise-ultimate.jsx here ──
// Everything from GLOBAL_STYLE through all Screen components stays identical.
// Only the ROOT APP section at the bottom changes — shown below.

// ─────────────────────────────────────────────────────────────
// AUTH SCREEN  (shown when user is not logged in)
// ─────────────────────────────────────────────────────────────
const AUTH_STYLE = `
  .auth-wrap{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:32px 28px;}
  .auth-logo{font-size:48px;margin-bottom:8px;}
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
      <div className="auth-logo">💸</div>
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
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',gap:16}}>
      <div style={{fontSize:40}}>💸</div>
      <div style={{fontSize:14,color:'var(--t2)',fontWeight:600}}>Loading your finances...</div>
      <div style={{width:48,height:4,borderRadius:100,background:'var(--s3)',overflow:'hidden'}}>
        <div style={{width:'60%',height:'100%',background:'var(--indigo)',borderRadius:100,animation:'pulse 1s ease infinite'}}/>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ALL_WIDGETS definition (same as spendwise-ultimate.jsx)
// ─────────────────────────────────────────────────────────────
const ALL_WIDGETS = [
  {id:'net_worth',name:'Net Worth',def:true},
  {id:'bank_cards',name:'Bank Cards',def:true},
  {id:'credit_cards',name:'Credit Cards',def:true},
  {id:'monthly_ring',name:'Monthly Summary',def:true},
  {id:'quick_stats',name:'Quick Stats',def:true},
  {id:'spending_bars',name:'Spending Bars',def:true},
  {id:'savings_goals',name:'Savings Goals',def:true},
  {id:'subscriptions',name:'Subscriptions',def:true},
  {id:'cc_util',name:'CC Utilization',def:true},
  {id:'tax_summary',name:'Tax Summary',def:false},
  {id:'mileage',name:'Mileage Tracker',def:false},
  {id:'cash_flow',name:'Cash Flow',def:false},
  {id:'recent_tx',name:'Recent Transactions',def:true},
  {id:'bills_upcoming',name:'Upcoming Bills',def:true},
];
const DEFAULT_WIDGETS = Object.fromEntries(ALL_WIDGETS.map(w=>[w.id, w.def]));

// ─────────────────────────────────────────────────────────────
// ROOT APP — replaces the export default App() in spendwise-ultimate.jsx
// ─────────────────────────────────────────────────────────────
export default function App() {
  const { user, loading: authLoading, signUp, signIn, signOut } = useAuth();

  // All data hooks — only fire once user is authenticated
  const uid = user?.id;
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccounts(uid);
  const { transactions, addTransaction, deleteTransaction }     = useTransactions(uid);
  const { budgets, setBudget }                                  = useBudgets(uid);
  const { savings, addGoal, updateGoal, deleteGoal }            = useSavingsGoals(uid);
  const { subscriptions, addSubscription, deleteSubscription }  = useSubscriptions(uid);
  const { widgets, toggleWidget }                               = useWidgetConfig(uid, DEFAULT_WIDGETS);

  const [tab, setTab]           = useState('home');
  const [showAddTx, setShowAddTx] = useState(false);
  const [acctModal, setAcctModal] = useState(null);

  // ── Show auth loading spinner
  if (authLoading) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#06060F'}}>
        <LoadingScreen/>
      </div>
    );
  }

  // ── Show login if not authenticated
  if (!user) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',
        background:'radial-gradient(ellipse 80% 60% at 50% -5%,rgba(123,111,255,0.1) 0%,#000 65%)',padding:16}}>
        {/* Insert GLOBAL_STYLE here */}
        <div style={{width:393,height:852,background:'var(--bg)',borderRadius:52,overflow:'hidden',
          boxShadow:'0 0 0 1px rgba(255,255,255,0.07),0 80px 180px rgba(0,0,0,0.95)'}}>
          <AuthScreen onSignIn={signIn} onSignUp={signUp}/>
        </div>
      </div>
    );
  }

  // ── Handlers that map UI shape → DB shape
  const handleAddAccount = async (data) => {
    await addAccount({
      type:         data.type,
      name:         data.name,
      bank:         data.bank,
      balance:      data.balance,
      credit_limit: data.limit,      // credit cards only
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

  // Normalise DB account row → UI shape expected by components
  const uiAccounts = accounts.map(a => ({
    ...a,
    themeIdx: a.theme_idx,
    limit:    a.credit_limit,
  }));

  // ── Full phone UI (copy GLOBAL_STYLE + all screen components from spendwise-ultimate.jsx)
  // Then render:
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',
      background:'radial-gradient(ellipse 80% 60% at 50% -5%,rgba(123,111,255,0.1) 0%,#000 65%)',padding:16}}>
      {/* GLOBAL_STYLE goes here */}

      <div className="phone">
        {/* Dynamic island, status bar, etc — same as before */}

        <div className="scr">
          {tab==='home'      && <HomeScreen accounts={uiAccounts} transactions={transactions} budgets={budgets}
                                  savings={savings} subscriptions={subscriptions} widgets={widgets}
                                  onEditAcct={a=>setAcctModal(a)} onAddAcct={()=>setAcctModal('new')} setTab={setTab}/>}
          {tab==='accounts'  && <AccountsScreen accounts={uiAccounts} transactions={transactions}
                                  onEditAcct={a=>setAcctModal(a)} onAddAcct={()=>setAcctModal('new')}/>}
          {tab==='transactions' && <TxScreen transactions={transactions} accounts={uiAccounts}/>}
          {tab==='budget'    && <BudgetScreen transactions={transactions} budgets={budgets} onBudgetChange={setBudget}/>}
          {tab==='more'      && (
            /* Reports / Subscriptions / Customize tabs — same as before,
               pass deleteSubscription and addSubscription to SubsScreen */
            null
          )}
        </div>

        {/* Sign Out button — add to settings or profile area */}
        <button onClick={signOut} style={{position:'absolute',top:60,right:18,
          background:'rgba(244,63,94,0.1)',border:'none',borderRadius:10,
          padding:'6px 12px',color:'var(--red)',fontFamily:'var(--font)',fontSize:11,fontWeight:700,cursor:'pointer'}}>
          Sign Out
        </button>

        <div className="fab" onClick={()=>setShowAddTx(true)}>＋</div>

        {/* Bottom nav — same as before */}

        {showAddTx && (
          <AddTxModal accounts={uiAccounts} onClose={()=>setShowAddTx(false)} onAdd={addTransaction}/>
        )}

        {acctModal && (
          <AcctModal
            account={acctModal==='new' ? null : acctModal}
            onClose={()=>setAcctModal(null)}
            onSave={acctModal==='new' ? handleAddAccount : handleUpdateAccount}
            onDelete={deleteAccount}/>
        )}
      </div>
    </div>
  );
}
