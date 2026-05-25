/* ====================================================================
   Backend — abstraction over three modes:
     • local : no login, full access, localStorage   (config blank, demoMode off)
     • demo  : simulated login + simulated payment, localStorage (demoMode: true)
     • cloud : real Supabase Auth + DB + Stripe       (supabase keys filled)
   The React app only talks to window.Backend.
   ==================================================================== */
(function () {
  const CFG = window.APP_CONFIG || {};
  const hasCloud = !!(CFG.supabaseUrl && CFG.supabaseAnonKey && window.supabase);
  const isDemo   = !hasCloud && !!CFG.demoMode;
  const MODE = hasCloud ? "cloud" : isDemo ? "demo" : "local";

  function debounce(fn, ms) {
    let t;
    const w = (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
    w.flush = (...a) => { clearTimeout(t); fn(...a); };
    return w;
  }
  function defaultSettings() {
    const s = window.INITIAL_SETTINGS ? { ...window.INITIAL_SETTINGS } : {};
    return { ...s, theme: "light", accent: "teal", density: "comfy" };
  }
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
  // LOCAL / DEMO backend (localStorage). `opts.auth` adds a simulated login
  // layer; `opts.defaultPlan` sets the starting plan; in demo, checkout is
  // simulated (instant unlock) instead of redirecting to Stripe.
  // =====================================================================
  function makeLocal(opts) {
    const PK = "budget-profile";
    const UK = "budget-demo-user";
    const monthKey = (y, m) => `budget-month-${y}-${m}`;
    let listeners = [];
    const notify = (u) => listeners.forEach(cb => cb(u));

    function readUser() {
      if (!opts.auth) return { id: "local", email: null, name: "أنت", local: true };
      try { const raw = localStorage.getItem(UK); if (raw) return JSON.parse(raw); } catch (e) {}
      return null;
    }
    function writeUser(u) { localStorage.setItem(UK, JSON.stringify(u)); notify(u); }

    function readProfile() {
      try { const raw = localStorage.getItem(PK); if (raw) return JSON.parse(raw); } catch (e) {}
      // migrate an older single-blob state if present
      try {
        const old = localStorage.getItem("budget-2026-state");
        if (old) {
          const o = JSON.parse(old);
          const settings = { ...defaultSettings(), ...(o.settings || {}) };
          const prof = { settings, plan: opts.defaultPlan };
          localStorage.setItem(PK, JSON.stringify(prof));
          localStorage.setItem(monthKey(settings.year, settings.month), JSON.stringify(
            { income:o.income, expenses:o.expenses, debts:o.debts, extraPay:o.extraPay, goals:o.goals }));
          return prof;
        }
      } catch (e) {}
      const prof = { settings: defaultSettings(), plan: opts.defaultPlan };
      localStorage.setItem(PK, JSON.stringify(prof));
      return prof;
    }
    function writeProfile(p) { localStorage.setItem(PK, JSON.stringify(p)); }

    return {
      async getUser() { return readUser(); },
      onAuthChange(cb) { listeners.push(cb); return () => { listeners = listeners.filter(x => x !== cb); }; },
      async getProfile() { return readProfile(); },
      async saveProfile(settings) { const p = readProfile(); p.settings = { ...p.settings, ...settings }; writeProfile(p); return p; },
      async isPro() { return readProfile().plan === "pro"; },
      async listMonths() {
        const out = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i); const mm = k && k.match(/^budget-month-(\d+)-(.+)$/);
          if (mm) out.push({ year: Number(mm[1]), month: mm[2] });
        }
        return out;
      },
      async loadMonth(y, m) { try { const raw = localStorage.getItem(monthKey(y, m)); if (raw) return JSON.parse(raw); } catch (e) {} return null; },
      async saveMonth(y, m, d) { localStorage.setItem(monthKey(y, m), JSON.stringify(d)); },
      async deleteMonth(y, m) { localStorage.removeItem(monthKey(y, m)); },

      // ---- simulated auth (demo) ----
      async signInWithGoogle() {
        if (!opts.auth) throw new Error("no-auth");
        writeUser({ id: "demo-google", email: "demo.user@gmail.com", name: "مستخدم Google" });
      },
      async signUpWithEmail(email) {
        if (!opts.auth) throw new Error("no-auth");
        writeUser({ id: "demo-" + email, email, name: (email.split("@")[0] || "مستخدم") });
      },
      async signInWithEmail(email) {
        if (!opts.auth) throw new Error("no-auth");
        writeUser({ id: "demo-" + email, email, name: (email.split("@")[0] || "مستخدم") });
      },
      async signOut() { if (opts.auth) { localStorage.removeItem(UK); notify(null); } },

      // ---- simulated checkout (demo): instant unlock ----
      async startCheckout() {
        const p = readProfile(); p.plan = "pro"; writeProfile(p);
        return { simulated: true };
      },
    };
  }

  // =====================================================================
  // CLOUD backend (Supabase) — unchanged behaviour
  // =====================================================================
  function makeCloud() {
    const sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey);
    let listeners = [];
    sb.auth.onAuthStateChange((_e, session) => { listeners.forEach(cb => cb(session ? session.user : null)); });
    const uName = (u) => (u && (u.user_metadata?.full_name || u.user_metadata?.name)) || (u && u.email) || "";
    async function ensureProfile(u) {
      const { data } = await sb.from("profiles").select("*").eq("id", u.id).maybeSingle();
      if (data) return data;
      const prof = { id: u.id, settings: { ...defaultSettings(), name: uName(u) }, plan: "free" };
      await sb.from("profiles").upsert(prof);
      return prof;
    }
    return {
      async getUser() { const { data } = await sb.auth.getUser(); const u = data ? data.user : null; return u ? { id:u.id, email:u.email, name:uName(u) } : null; },
      onAuthChange(cb) { listeners.push(cb); return () => { listeners = listeners.filter(x => x !== cb); }; },
      async getProfile() { const { data: ud } = await sb.auth.getUser(); if (!ud || !ud.user) return null; return ensureProfile(ud.user); },
      async saveProfile(settings) { const { data: ud } = await sb.auth.getUser(); if (!ud || !ud.user) return null; const cur = await ensureProfile(ud.user); const next = { ...cur, settings: { ...cur.settings, ...settings } }; await sb.from("profiles").upsert({ id: ud.user.id, settings: next.settings }); return next; },
      async isPro() { const p = await this.getProfile(); return !!p && p.plan === "pro"; },
      async listMonths() { const { data: ud } = await sb.auth.getUser(); if (!ud || !ud.user) return []; const { data } = await sb.from("budgets").select("year,month").eq("user_id", ud.user.id); return data || []; },
      async loadMonth(y, m) { const { data: ud } = await sb.auth.getUser(); if (!ud || !ud.user) return null; const { data } = await sb.from("budgets").select("data").eq("user_id", ud.user.id).eq("year", y).eq("month", m).maybeSingle(); return data ? data.data : null; },
      async saveMonth(y, m, payload) { const { data: ud } = await sb.auth.getUser(); if (!ud || !ud.user) return; await sb.from("budgets").upsert({ user_id: ud.user.id, year: y, month: m, data: payload, updated_at: new Date().toISOString() }, { onConflict: "user_id,year,month" }); },
      async deleteMonth(y, m) { const { data: ud } = await sb.auth.getUser(); if (!ud || !ud.user) return; await sb.from("budgets").delete().eq("user_id", ud.user.id).eq("year", y).eq("month", m); },
      async signInWithGoogle() { return sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.href.split("#")[0] } }); },
      async signInWithEmail(email, password) { const { error } = await sb.auth.signInWithPassword({ email, password }); if (error) throw error; },
      async signUpWithEmail(email, password) { const { error } = await sb.auth.signUp({ email, password }); if (error) throw error; },
      async signOut() { await sb.auth.signOut(); },
      async startCheckout() {
        const { data: sess } = await sb.auth.getSession();
        const token = sess && sess.session ? sess.session.access_token : null;
        const res = await fetch(CFG.checkoutFunctionUrl, { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + token }, body: JSON.stringify({ returnUrl: window.location.href.split("#")[0] }) });
        if (!res.ok) throw new Error("Checkout failed (" + res.status + ")");
        const { url } = await res.json();
        if (url) window.location.href = url;
        return { redirected: true };
      },
    };
  }

  const impl = MODE === "cloud" ? makeCloud()
            : MODE === "demo"  ? makeLocal({ auth: true,  defaultPlan: "free" })
            :                    makeLocal({ auth: false, defaultPlan: "pro"  });

  const _saveMonth   = debounce((y, m, d) => impl.saveMonth(y, m, d), 800);
  const _saveProfile = debounce((s) => impl.saveProfile(s), 800);

  window.Backend = {
    mode: MODE,
    isCloud: MODE === "cloud",
    isDemo: MODE === "demo",
    requiresAuth: MODE === "cloud" || MODE === "demo",  // show login first
    gating: MODE === "cloud" || MODE === "demo",        // enforce free/pro split
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
