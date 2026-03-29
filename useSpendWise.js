// src/hooks/useSpendWise.js
// ─────────────────────────────────────────────────────────────
// All data operations wrapped in clean hooks.
// Import and use these in your App component.
// ─────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

// ── AUTH HOOK ─────────────────────────────────────────────────
export function useAuth() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, loading, signUp, signIn, signOut };
}

// ── ACCOUNTS HOOK ─────────────────────────────────────────────
export function useAccounts(userId) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading]   = useState(true);

  const fetch = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    if (!error) setAccounts(data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  const addAccount = async (acct) => {
    const { data, error } = await supabase
      .from('accounts')
      .insert({ ...acct, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    setAccounts(prev => [...prev, data]);
    return data;
  };

  const updateAccount = async (id, changes) => {
    const { data, error } = await supabase
      .from('accounts')
      .update(changes)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw error;
    setAccounts(prev => prev.map(a => a.id === id ? data : a));
  };

  const deleteAccount = async (id) => {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw error;
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  return { accounts, loading, addAccount, updateAccount, deleteAccount, refetch: fetch };
}

// ── TRANSACTIONS HOOK ─────────────────────────────────────────
export function useTransactions(userId) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);

  const fetch = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });
    if (!error) setTransactions(data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  const addTransaction = async (tx) => {
    // Map camelCase to snake_case for DB
    const row = {
      user_id:        userId,
      account_id:     tx.accountId,
      type:           tx.type,
      amount:         tx.amount,
      category:       tx.category,
      note:           tx.note,
      date:           tx.date,
      recurring:      tx.recurring || false,
      tax_deductible: tx.taxDeductible || false,
      tags:           tx.tags || [],
    };
    const { data, error } = await supabase
      .from('transactions')
      .insert(row)
      .select()
      .single();
    if (error) throw error;
    // Normalise back to camelCase for the UI
    const norm = normalizeTx(data);
    setTransactions(prev => [norm, ...prev]);
    return norm;
  };

  const deleteTransaction = async (id) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw error;
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Normalize DB snake_case → UI camelCase
  const normalizeTx = (row) => ({
    ...row,
    accountId:     row.account_id,
    taxDeductible: row.tax_deductible,
    createdAt:     row.created_at,
  });

  return {
    transactions: transactions.map(normalizeTx),
    loading,
    addTransaction,
    deleteTransaction,
    refetch: fetch,
  };
}

// ── BUDGETS HOOK ──────────────────────────────────────────────
export function useBudgets(userId) {
  const currentMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
  const [budgets, setBudgets] = useState({});
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('month', currentMonth);
    if (!error) {
      const map = {};
      (data || []).forEach(b => { map[b.category] = b.amount; });
      setBudgets(map);
    }
    setLoading(false);
  }, [userId, currentMonth]);

  useEffect(() => { fetch(); }, [fetch]);

  // Upsert a single category budget
  const setBudget = async (category, amount) => {
    const { error } = await supabase
      .from('budgets')
      .upsert(
        { user_id: userId, category, amount, month: currentMonth },
        { onConflict: 'user_id,category,month' }
      );
    if (error) throw error;
    setBudgets(prev => ({ ...prev, [category]: amount }));
  };

  return { budgets, loading, setBudget, refetch: fetch };
}

// ── SAVINGS GOALS HOOK ────────────────────────────────────────
export function useSavingsGoals(userId) {
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at');
    if (!error) setSavings(data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  const addGoal = async (goal) => {
    const { data, error } = await supabase
      .from('savings_goals')
      .insert({ ...goal, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    setSavings(prev => [...prev, data]);
  };

  const updateGoal = async (id, changes) => {
    const { data, error } = await supabase
      .from('savings_goals')
      .update(changes)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    setSavings(prev => prev.map(g => g.id === id ? data : g));
  };

  const deleteGoal = async (id) => {
    const { error } = await supabase
      .from('savings_goals')
      .delete()
      .eq('id', id);
    if (error) throw error;
    setSavings(prev => prev.filter(g => g.id !== id));
  };

  return { savings, loading, addGoal, updateGoal, deleteGoal };
}

// ── SUBSCRIPTIONS HOOK ────────────────────────────────────────
export function useSubscriptions(userId) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading]             = useState(true);

  const fetch = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('next_due');
    if (!error) setSubscriptions(data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  const addSubscription = async (sub) => {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({ ...sub, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    setSubscriptions(prev => [...prev, data]);
  };

  const deleteSubscription = async (id) => {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id);
    if (error) throw error;
    setSubscriptions(prev => prev.filter(s => s.id !== id));
  };

  return { subscriptions, loading, addSubscription, deleteSubscription };
}

// ── WIDGET CONFIG HOOK ────────────────────────────────────────
export function useWidgetConfig(userId, defaults) {
  const [widgets, setWidgets] = useState(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const { data } = await supabase
        .from('widget_config')
        .select('config')
        .eq('user_id', userId)
        .single();
      if (data?.config) setWidgets({ ...defaults, ...data.config });
      setLoading(false);
    })();
  }, [userId]);

  const toggleWidget = async (id) => {
    const next = { ...widgets, [id]: !widgets[id] };
    setWidgets(next);
    await supabase
      .from('widget_config')
      .upsert({ user_id: userId, config: next, updated_at: new Date().toISOString() },
               { onConflict: 'user_id' });
  };

  return { widgets, loading, toggleWidget };
}
