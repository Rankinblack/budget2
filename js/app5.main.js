// Main App — sidebar + header + routing

const {
  useState: useStateApp,
  useMemo: useMemoApp,
  useEffect: useEffectApp
} = React;
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "density": "comfy",
  "accent": "teal"
} /*EDITMODE-END*/;
const ACCENTS = {
  teal: {
    primary: '#0E4940',
    primary600: '#155E54',
    primary700: '#093832',
    name: 'تركواز'
  },
  amber: {
    primary: '#86591A',
    primary600: '#A87723',
    primary700: '#5F3E10',
    name: 'كهرماني'
  },
  navy: {
    primary: '#1B3A5C',
    primary600: '#244B72',
    primary700: '#0E2540',
    name: 'كحلي'
  },
  rose: {
    primary: '#7A2E25',
    primary600: '#943728',
    primary700: '#561A14',
    name: 'مرجاني'
  }
};
function App() {
  const [route, setRoute] = useStateApp('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useStateApp(false);
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  // ── Persistent state (localStorage) ──
  const STORAGE_KEY = 'budget-2026-state';
  const SAMPLE_STATE = () => ({
    settings: {
      ...INITIAL_SETTINGS
    },
    income: INCOME_SEED.map(x => ({
      ...x
    })),
    expenses: EXPENSE_SEED.map(x => ({
      ...x
    })),
    debts: DEBTS_SEED.map(x => ({
      ...x
    })),
    extraPay: EXTRA_PAYMENT,
    goals: GOALS_SEED.map(x => ({
      ...x
    }))
  });
  const [state, setState] = useStateApp(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return SAMPLE_STATE();
  });
  useEffectApp(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }, [state]);

  // ── Backup / Restore / Reset ──
  function exportJson() {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-${state.settings.month}-${state.settings.year}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function importJson() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.onchange = async e => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const txt = await file.text();
        const obj = JSON.parse(txt);
        if (!obj.settings || !obj.income || !obj.expenses) throw new Error('Invalid file');
        setState(obj);
      } catch (err) {
        alert('ملف غير صالح: ' + err.message);
      }
    };
    input.click();
  }
  function resetToSample() {
    if (confirm('استبدال البيانات الحالية بالبيانات التجريبية؟')) {
      setState(SAMPLE_STATE());
    }
  }
  function clearAll() {
    if (confirm('مسح جميع البيانات وبدء من الصفر؟')) {
      const empty = SAMPLE_STATE();
      empty.income.forEach(i => i.amount = 0);
      empty.expenses.forEach(e => e.amount = 0);
      empty.debts.forEach(d => {
        d.balance = 0;
        d.minPay = 0;
      });
      empty.goals.forEach(g => {
        g.target = 0;
        g.saved = 0;
      });
      empty.extraPay = 0;
      setState(empty);
    }
  }
  const money = useMemoApp(() => makeMoney(state.settings.currency), [state.settings.currency]);

  // Apply dark mode + accent
  useEffectApp(() => {
    document.documentElement.classList.toggle('theme-dark', tweaks.theme === 'dark');
    document.documentElement.classList.toggle('density-compact', tweaks.density === 'compact');
    const a = ACCENTS[tweaks.accent] || ACCENTS.teal;
    document.documentElement.style.setProperty('--accent', a.primary);
    document.documentElement.style.setProperty('--accent-600', a.primary600);
    document.documentElement.style.setProperty('--accent-700', a.primary700);
  }, [tweaks.theme, tweaks.accent, tweaks.density]);
  const nav = [{
    id: 'dashboard',
    label: STR.sections.dashboard,
    en: 'Dashboard',
    icon: I.dashboard
  }, {
    id: 'income',
    label: STR.sections.income,
    en: 'Income',
    icon: I.income
  }, {
    id: 'expenses',
    label: STR.sections.expenses,
    en: 'Expenses',
    icon: I.expense
  }, {
    id: 'debt',
    label: STR.sections.debt,
    en: 'Debt Snowball',
    icon: I.debt
  }, {
    id: 'goals',
    label: STR.sections.goals,
    en: 'Goals',
    icon: I.goals
  }, {
    id: 'annual',
    label: STR.sections.annual,
    en: 'Annual',
    icon: I.annual
  }, {
    id: 'settings',
    label: STR.sections.settings,
    en: 'Settings',
    icon: I.settings
  }];
  const Screen = {
    dashboard: DashboardScreen,
    income: IncomeScreen,
    expenses: ExpensesScreen,
    debt: DebtScreen,
    goals: GoalsScreen,
    annual: AnnualScreen,
    settings: SettingsScreen
  }[route];
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex relative",
    "data-screen-label": `Budget · ${nav.find(n => n.id === route).en}`
  }, mobileMenuOpen && /*#__PURE__*/React.createElement("div", {
    onClick: () => setMobileMenuOpen(false),
    className: "md:hidden fixed inset-0 bg-ink-900/40 z-30 backdrop-blur-sm"
  }), /*#__PURE__*/React.createElement("aside", {
    className: `
        fixed md:sticky top-0 right-0 bottom-0 md:bottom-auto
        w-[280px] md:w-[260px] shrink-0
        h-screen z-40
        bg-sand-50 border-l border-sand-200
        transition-transform duration-300 ease-out
        ${mobileMenuOpen ? 'drawer-open' : 'drawer-closed'}
        flex flex-col
      `
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-5 pt-6 pb-5 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-9 h-9 rounded-xl bg-teal-700 text-sand-50 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    className: "w-5 h-5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 19 L12 5 L19 19 M8.5 12.5 H15.5",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[15px] font-semibold text-ink-900 leading-none"
  }, "\u0645\u064A\u0632\u0627\u0646\u064A\u062A\u064A"), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] latin text-ink-400 tracking-wider mt-1"
  }, "MY BUDGET \xB7 PRO"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setMobileMenuOpen(false),
    className: "md:hidden w-8 h-8 rounded-lg hover:bg-sand-100 text-ink-500 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    className: "w-4 h-4"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12M18 6 6 18"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "px-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] uppercase tracking-wider text-ink-400 latin px-3 pb-2"
  }, "Menu"), /*#__PURE__*/React.createElement("nav", {
    className: "space-y-0.5"
  }, nav.map(n => {
    const active = n.id === route;
    const Icon = n.icon;
    return /*#__PURE__*/React.createElement("button", {
      key: n.id,
      onClick: () => {
        setRoute(n.id);
        setMobileMenuOpen(false);
      },
      className: `w-full text-right flex items-center gap-3 px-3 py-2.5 md:py-2 rounded-lg transition group
                    ${active ? 'bg-teal-700 text-white shadow-soft' : 'text-ink-700 hover:bg-sand-100'}`
    }, /*#__PURE__*/React.createElement(Icon, {
      className: `w-[18px] h-[18px] shrink-0 ${active ? '' : 'text-ink-500 group-hover:text-ink-700'}`
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-[13px] flex-1"
    }, n.label), /*#__PURE__*/React.createElement("span", {
      className: `text-[10px] latin ${active ? 'text-teal-100' : 'text-ink-400'}`
    }, n.en));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mt-auto px-3 pb-5"
  }, /*#__PURE__*/React.createElement(SidebarInsight, {
    state: state,
    money: money
  }))), /*#__PURE__*/React.createElement("main", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("header", {
    className: "sticky top-0 z-20 bg-sand-100/85 backdrop-blur border-b border-sand-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-[1400px] mx-auto px-4 md:px-8 py-3 md:py-3.5 flex items-center gap-3 md:gap-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setMobileMenuOpen(true),
    "aria-label": "\u0641\u062A\u062D \u0627\u0644\u0642\u0627\u0626\u0645\u0629",
    className: "md:hidden w-9 h-9 rounded-lg bg-white border border-sand-200 text-ink-700 flex items-center justify-center hover:bg-sand-50"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    className: "w-4 h-4"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 7h16M4 12h16M4 17h16"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "md:hidden text-[14px] font-semibold text-ink-900 truncate"
  }, nav.find(n => n.id === route).label), /*#__PURE__*/React.createElement("div", {
    className: "hidden md:flex items-center gap-2 text-[12px] text-ink-500"
  }, /*#__PURE__*/React.createElement("span", null, "\u0645\u064A\u0632\u0627\u0646\u064A\u062A\u064A"), /*#__PURE__*/React.createElement(I.chevron, {
    className: "w-3 h-3 -scale-x-100"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-ink-900 font-medium"
  }, nav.find(n => n.id === route).label)), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 max-w-md mx-auto hidden md:block"
  }, /*#__PURE__*/React.createElement(TInput, {
    placeholder: "\u0628\u062D\u062B \u0641\u064A \u0627\u0644\u0628\u0646\u0648\u062F...",
    icon: /*#__PURE__*/React.createElement(I.search, {
      className: "w-4 h-4"
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "md:mr-auto"
  }), /*#__PURE__*/React.createElement("div", {
    className: "hidden lg:flex items-center gap-2 px-3 h-9 bg-white border border-sand-200 rounded-lg text-[12px] text-ink-700"
  }, /*#__PURE__*/React.createElement(I.annual, {
    className: "w-3.5 h-3.5 text-ink-500"
  }), /*#__PURE__*/React.createElement("span", null, state.settings.month, " ", state.settings.year)), /*#__PURE__*/React.createElement("div", {
    className: "hidden md:flex items-center gap-1.5 px-3 h-9 bg-white border border-sand-200 rounded-lg text-[12px] text-ink-700"
  }, /*#__PURE__*/React.createElement("span", {
    className: "latin font-medium"
  }, money.code), /*#__PURE__*/React.createElement("span", {
    className: "text-ink-400"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, money.sym)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hidden lg:block text-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[12px] text-ink-900 font-medium leading-none"
  }, state.settings.name), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-ink-500 latin mt-0.5"
  }, "Personal account")), /*#__PURE__*/React.createElement("div", {
    className: "w-9 h-9 rounded-full bg-gradient-to-br from-teal-600 to-teal-800 text-white font-semibold flex items-center justify-center text-[13px] shrink-0"
  }, state.settings.name.split(' ').map(s => s[0]).join('').slice(0, 2))))), /*#__PURE__*/React.createElement("div", {
    className: "max-w-[1400px] mx-auto px-4 md:px-8 py-5 md:py-7 pb-24 md:pb-7"
  }, /*#__PURE__*/React.createElement(Screen, {
    state: state,
    setState: setState,
    money: money
  }))), /*#__PURE__*/React.createElement(window.TweaksPanel, {
    title: "Tweaks"
  }, /*#__PURE__*/React.createElement(window.TweakSection, {
    label: "\u0627\u0644\u0645\u0638\u0647\u0631"
  }, /*#__PURE__*/React.createElement(window.TweakRadio, {
    label: "\u0627\u0644\u0633\u0645\u0629",
    value: tweaks.theme,
    onChange: v => setTweak('theme', v),
    options: [{
      value: 'light',
      label: 'فاتح'
    }, {
      value: 'dark',
      label: 'داكن'
    }]
  }), /*#__PURE__*/React.createElement(window.TweakSelect, {
    label: "\u0644\u0648\u0646 \u0627\u0644\u062A\u0645\u064A\u064A\u0632",
    value: tweaks.accent,
    onChange: v => setTweak('accent', v),
    options: Object.entries(ACCENTS).map(([k, a]) => ({
      value: k,
      label: a.name
    }))
  }), /*#__PURE__*/React.createElement(window.TweakRadio, {
    label: "\u0627\u0644\u0643\u062B\u0627\u0641\u0629",
    value: tweaks.density,
    onChange: v => setTweak('density', v),
    options: [{
      value: 'comfy',
      label: 'مريحة'
    }, {
      value: 'compact',
      label: 'مكثفة'
    }]
  })), /*#__PURE__*/React.createElement(window.TweakSection, {
    label: "\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0633\u0631\u064A\u0639\u0629"
  }, /*#__PURE__*/React.createElement(window.TweakSelect, {
    label: "\u0627\u0644\u0639\u0645\u0644\u0629",
    value: state.settings.currency,
    onChange: v => setState(s => ({
      ...s,
      settings: {
        ...s.settings,
        currency: v
      }
    })),
    options: CURRENCIES.map(c => ({
      value: c.code,
      label: `${c.code} · ${c.name}`
    }))
  }), /*#__PURE__*/React.createElement(window.TweakSlider, {
    label: "\u0647\u062F\u0641 \u0627\u0644\u0627\u062F\u062E\u0627\u0631",
    min: 0,
    max: 60,
    step: 5,
    unit: "%",
    value: Math.round(state.settings.savingsGoalPct * 100),
    onChange: v => setState(s => ({
      ...s,
      settings: {
        ...s.settings,
        savingsGoalPct: v / 100
      }
    }))
  }), /*#__PURE__*/React.createElement(window.TweakToggle, {
    label: "\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0625\u0633\u0644\u0627\u0645\u064A",
    value: state.settings.islamicMode,
    onChange: v => setState(s => ({
      ...s,
      settings: {
        ...s.settings,
        islamicMode: v
      }
    }))
  })), /*#__PURE__*/React.createElement(window.TweakSection, {
    label: "\u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A"
  }, /*#__PURE__*/React.createElement(window.TweakButton, {
    label: "\uD83D\uDCE5 \u0646\u0633\u062E \u0627\u062D\u062A\u064A\u0627\u0637\u064A (JSON)",
    onClick: exportJson
  }), /*#__PURE__*/React.createElement(window.TweakButton, {
    label: "\uD83D\uDCE4 \u0627\u0633\u062A\u064A\u0631\u0627\u062F \u0645\u0646 \u0645\u0644\u0641",
    onClick: importJson
  }), /*#__PURE__*/React.createElement(window.TweakButton, {
    label: "\uD83D\uDD04 \u0625\u0639\u0627\u062F\u0629 \u0628\u064A\u0627\u0646\u0627\u062A \u062A\u062C\u0631\u064A\u0628\u064A\u0629",
    onClick: resetToSample
  }), /*#__PURE__*/React.createElement(window.TweakButton, {
    label: "\uD83D\uDDD1 \u0645\u0633\u062D \u0648\u0627\u0644\u0628\u062F\u0621 \u0645\u0646 \u0627\u0644\u0635\u0641\u0631",
    onClick: clearAll
  }))));
}
function SidebarInsight({
  state,
  money
}) {
  const inc = state.income.reduce((s, x) => s + (x.amount || 0), 0);
  const exp = state.expenses.reduce((s, x) => s + (x.amount || 0), 0);
  const net = inc - exp;
  const pct = inc ? net / inc : 0;
  const goal = state.settings.savingsGoalPct;
  const ratio = goal ? pct / goal : 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl p-4 border border-teal-100 bg-white relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute -top-8 -left-8 w-32 h-32 rounded-full",
    style: {
      background: 'radial-gradient(circle, rgba(21,94,84,.15), transparent 60%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-[11px] text-ink-500"
  }, /*#__PURE__*/React.createElement(I.bolt, {
    className: "w-3 h-3"
  }), /*#__PURE__*/React.createElement("span", null, "\u0646\u0628\u0636\u0629 \u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631")), /*#__PURE__*/React.createElement("div", {
    className: "mt-2 text-[20px] font-semibold tnum text-ink-900"
  }, money.fmt(net)), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-ink-500"
  }, "\u0635\u0627\u0641\u064A \u0628\u0639\u062F \u0643\u0644 \u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A"), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement(ProgressBar, {
    value: Math.min(1, Math.max(0, ratio)),
    color: ratio >= 1 ? '#246B4D' : '#C99334',
    height: 4,
    track: "#ECE5D4"
  })), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-ink-500 tnum"
  }, fmtPct(pct, 0))), /*#__PURE__*/React.createElement("div", {
    className: "mt-2 text-[10px] text-ink-500"
  }, ratio >= 1 ? 'تجاوزتِ هدفك ✦' : `تحتاجين ${fmtPct(goal - pct, 0)} لبلوغ الهدف`)));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));