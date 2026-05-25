/* ====================================================================
   Backend — single abstraction over LOCAL (localStorage) and CLOUD
   (Supabase) modes. The React app only talks to window.Backend and
   never needs to know which mode is active.
   ==================================================================== */
(function () {
  const CFG = window.APP_CONFIG || {};
  const hasCloud = !!(CFG.supabaseUrl && CFG.supabaseAnonKey && window.supabase);
  const MODE = hasCloud ? "cloud" : "local";

  // ---- tiny debounce ----
  function debounce(fn, ms) {
    let t;
    const wrapped = (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
    wrapped.flush = (...a) => { clearTimeout(t); fn(...a); };
    return wrapped;
  }

  // ---- default global settings ----
  function defaultSettings() {
    const s = window.INITIAL_SETTINGS ? { ...window.INITIAL_SETTINGS } : {};
    return { ...s, theme: "light", accent: "teal", density: "comfy" };
  }
  // ---- a fresh month's data from the seed ----
  function seedMonth() {
    return {
      income:   (window.INCOME_SEED   || []).map(x => ({ ...x })),
      expenses: (window.EXPENSE_SEED  || []).map(x => ({ ...x })),
      debts:    (window.DEBTS_SEED    || []).map(x => ({ ...x })),
      extraPay: window.EXTRA_PAYMENT != null ? window.EXTRA_PAYMENT : 0,
      goals:    (window.GOALS_SEED    || []).map(x => ({ ...x })),
    };
  }
  function emptyMonth() {
    const m = seedMonth();
    m.income.forEach(i => i.amount = 0);
    m.expenses.forEach(e => e.amount = 0);
    m.debts.forEach(d => { d.balance = 0; d.minPay = 0; });
    m.goals.forEach(g => { g.target = 0; g.saved = 0; });
    m.extraPay = 0;
    return m;
  }

  // =====================================================================
  // LOCAL backend
  // =====================================================================
  const Local = (() => {
    const PK = "budget-profile";
    const monthKey = (y, m) => `budget-month-${y}-${m}`;
    function readProfile() {
      try {
        const raw = localStorage.getItem(PK);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      // migrate a pre-existing single-blob state, if any
      try {
        const old = localStorage.getItem("budget-2026-state");
        if (old) {
          const o = JSON.parse(old);
          const settings = { ...defaultSettings(), ...(o.settings || {}) };
          const prof = { settings, plan: "pro" };
          localStorage.setItem(PK, JSON.stringify(prof));
          localStorage.setItem(monthKey(settings.year, settings.month),
            JSON.stringify({ income:o.income, expenses:o.expenses, debts:o.debts, extraPay:o.extraPay, goals:o.goals }));
          return prof;
        }
      } catch (e) {}
      const prof = { settings: defaultSettings(), plan: "pro" }; // local = full access
      localStorage.setItem(PK, JSON.stringify(prof));
      return prof;
    }
    return {
      async getUser() { return { id: "local", email: null, name: "أنت", local: true }; },
      onAuthChange() { return () => {}; },
      async getProfile() { return readProfile(); },
      async saveProfile(settings) {
        const p = readProfile(); p.settings = { ...p.settings, ...settings };
        localStorage.setItem(PK, JSON.stringify(p)); return p;
      },
      async isPro() { return true; },
      async listMonths() {
        const out = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          const mm = k && k.match(/^budget-month-(\d+)-(.+)$/);
          if (mm) out.push({ year: Number(mm[1]), month: mm[2] });
        }
        return out;
      },
      async loadMonth(y, m) {
        try { const raw = localStorage.getItem(monthKey(y, m)); if (raw) return JSON.parse(raw); } catch (e) {}
        return null;
      },
      async saveMonth(y, m, data) { localStorage.setItem(monthKey(y, m), JSON.stringify(data)); },
      async deleteMonth(y, m) { localStorage.removeItem(monthKey(y, m)); },
      async signInWithGoogle() { throw new Error("local-mode"); },
      async signInWithEmail() { throw new Error("local-mode"); },
      async signUpWithEmail() { throw new Error("local-mode"); },
      async signOut() {},
      async startCheckout() { throw new Error("local-mode"); },
    };
  })();

  // =====================================================================
  // CLOUD backend (Supabase)
  // =====================================================================
  const Cloud = (() => {
    const sb = hasCloud ? window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey) : null;
    let listeners = [];
    if (sb) sb.auth.onAuthStateChange((_e, session) => {
      const u = session ? session.user : null;
      listeners.forEach(cb => cb(u));
    });
    function uName(u) {
      return (u && (u.user_metadata?.full_name || u.user_metadata?.name)) || (u && u.email) || "";
    }
    async function ensureProfile(u) {
      const { data } = await sb.from("profiles").select("*").eq("id", u.id).maybeSingle();
      if (data) return data;
      const prof = { id: u.id, settings: { ...defaultSettings(), name: uName(u) }, plan: "free" };
      await sb.from("profiles").upsert(prof);
      return prof;
    }
    return {
      async getUser() {
        const { data } = await sb.auth.getUser();
        const u = data ? data.user : null;
        return u ? { id: u.id, email: u.email, name: uName(u) } : null;
      },
      onAuthChange(cb) { listeners.push(cb); return () => { listeners = listeners.filter(x => x !== cb); }; },
      async getProfile() {
        const { data: ud } = await sb.auth.getUser();
        if (!ud || !ud.user) return null;
        return ensureProfile(ud.user);
      },
      async saveProfile(settings) {
        const { data: ud } = await sb.auth.getUser();
        if (!ud || !ud.user) return null;
        const cur = await ensureProfile(ud.user);
        const next = { ...cur, settings: { ...cur.settings, ...settings } };
        await sb.from("profiles").upsert({ id: ud.user.id, settings: next.settings });
        return next;
      },
      async isPro() {
        const p = await this.getProfile();
        return !!p && p.plan === "pro";
      },
      async listMonths() {
        const { data: ud } = await sb.auth.getUser();
        if (!ud || !ud.user) return [];
        const { data } = await sb.from("budgets").select("year,month").eq("user_id", ud.user.id);
        return data || [];
      },
      async loadMonth(y, m) {
        const { data: ud } = await sb.auth.getUser();
        if (!ud || !ud.user) return null;
        const { data } = await sb.from("budgets").select("data")
          .eq("user_id", ud.user.id).eq("year", y).eq("month", m).maybeSingle();
        return data ? data.data : null;
      },
      async saveMonth(y, m, payload) {
        const { data: ud } = await sb.auth.getUser();
        if (!ud || !ud.user) return;
        await sb.from("budgets").upsert(
          { user_id: ud.user.id, year: y, month: m, data: payload, updated_at: new Date().toISOString() },
          { onConflict: "user_id,year,month" }
        );
      },
      async deleteMonth(y, m) {
        const { data: ud } = await sb.auth.getUser();
        if (!ud || !ud.user) return;
        await sb.from("budgets").delete().eq("user_id", ud.user.id).eq("year", y).eq("month", m);
      },
      async signInWithGoogle() {
        return sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.href.split("#")[0] } });
      },
      async signInWithEmail(email, password) {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
      },
      async signUpWithEmail(email, password) {
        const { error } = await sb.auth.signUp({ email, password });
        if (error) throw error;
      },
      async signOut() { await sb.auth.signOut(); },
      async startCheckout() {
        const { data: sess } = await sb.auth.getSession();
        const token = sess && sess.session ? sess.session.access_token : null;
        const res = await fetch(CFG.checkoutFunctionUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
          body: JSON.stringify({ returnUrl: window.location.href.split("#")[0] }),
        });
        if (!res.ok) throw new Error("Checkout failed (" + res.status + ")");
        const { url } = await res.json();
        if (url) window.location.href = url;
      },
    };
  })();

  const impl = MODE === "cloud" ? Cloud : Local;

  // ---- public surface with a debounced save ----
  const _saveMonth = debounce((y, m, d) => impl.saveMonth(y, m, d), 800);
  const _saveProfile = debounce((s) => impl.saveProfile(s), 800);

  window.Backend = {
    mode: MODE,
    isCloud: MODE === "cloud",
    seedMonth, emptyMonth, defaultSettings,
    getUser: (...a) => impl.getUser(...a),
    onAuthChange: (cb) => impl.onAuthChange(cb),
    getProfile: () => impl.getProfile(),
    saveProfile: (s) => { _saveProfile(s); },
    saveProfileNow: (s) => impl.saveProfile(s),
    isPro: () => impl.isPro(),
    listMonths: () => impl.listMonths(),
    loadMonth: (y, m) => impl.loadMonth(y, m),
    saveMonth: (y, m, d) => { _saveMonth(y, m, d); },
    saveMonthNow: (y, m, d) => impl.saveMonth(y, m, d),
    deleteMonth: (y, m) => impl.deleteMonth(y, m),
    signInWithGoogle: () => impl.signInWithGoogle(),
    signInWithEmail: (e, p) => impl.signInWithEmail(e, p),
    signUpWithEmail: (e, p) => impl.signUpWithEmail(e, p),
    signOut: () => impl.signOut(),
    startCheckout: () => impl.startCheckout(),
  };
})();
