// Main App — auth gate, account, month history, feature gating, routing

const {
  useState: useStateApp,
  useMemo: useMemoApp,
  useEffect: useEffectApp,
  useRef: useRefApp
} = React;
const CFG = window.APP_CONFIG || {};
const PROF = CFG.proFeatures || {};
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
const monthIndex = m => Math.max(0, MONTHS_AR.indexOf(m));
function shiftMonth(year, month, delta) {
  let i = monthIndex(month) + delta;
  let y = year;
  while (i < 0) {
    i += 12;
    y -= 1;
  }
  while (i > 11) {
    i -= 12;
    y += 1;
  }
  return {
    year: y,
    month: MONTHS_AR[i]
  };
}

// ============== Brand mark ==============
function BrandMark({
  size = 36
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "rounded-xl bg-teal-700 text-sand-50 flex items-center justify-center shrink-0",
    style: {
      width: size,
      height: size
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    style: {
      width: size * 0.55,
      height: size * 0.55
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 19 L12 5 L19 19 M8.5 12.5 H15.5",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })));
}

// ============== Loading splash ==============
function Splash({
  text = 'جارٍ التحميل…'
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex flex-col items-center justify-center gap-4 text-ink-500"
  }, /*#__PURE__*/React.createElement(BrandMark, {
    size: 56
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-sm"
  }, text));
}

// ============== Auth screen (cloud mode only) ==============
function AuthScreen() {
  const [mode, setMode] = useStateApp('signin'); // signin | signup
  const [email, setEmail] = useStateApp('');
  const [pw, setPw] = useStateApp('');
  const [busy, setBusy] = useStateApp(false);
  const [msg, setMsg] = useStateApp(null);
  const [err, setErr] = useStateApp(null);
  async function google() {
    setErr(null);
    try {
      await window.Backend.signInWithGoogle();
    } catch (e) {
      setErr(e.message || String(e));
    }
  }
  async function submit(e) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setBusy(true);
    try {
      if (mode === 'signup') {
        await window.Backend.signUpWithEmail(email.trim(), pw);
        setMsg('أنشئنا حسابك. إن طُلب تأكيد البريد، افتح الرابط المُرسَل ثم سجّل الدخول.');
      } else {
        await window.Backend.signInWithEmail(email.trim(), pw);
      }
    } catch (e2) {
      setErr(e2.message || String(e2));
    } finally {
      setBusy(false);
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex items-center justify-center px-4 py-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-[400px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center text-center mb-7"
  }, /*#__PURE__*/React.createElement(BrandMark, {
    size: 56
  }), /*#__PURE__*/React.createElement("h1", {
    className: "text-[24px] font-semibold text-ink-900 mt-4"
  }, "\u0645\u064A\u0632\u0627\u0646\u064A\u062A\u064A"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-ink-500 mt-1"
  }, "\u0633\u062C\u0651\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u062D\u0641\u0638 \u0645\u064A\u0632\u0627\u0646\u064A\u062A\u0643 \u0648\u0645\u062A\u0627\u0628\u0639\u0629 \u0623\u0634\u0647\u0631\u0643."), window.Backend.isDemo && /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-amber2-700 bg-amber2-50 border border-amber2-100 rounded-full px-3 py-1 mt-3"
  }, "\u0648\u0636\u0639 \u062A\u062C\u0631\u064A\u0628\u064A \xB7 \u0627\u0633\u062A\u062E\u062F\u0645 \u0623\u064A \u0628\u0631\u064A\u062F \u0648\u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631")), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("button", {
    onClick: google,
    className: "w-full h-11 rounded-lg border border-sand-200 bg-white hover:bg-sand-50 flex items-center justify-center gap-3 text-[14px] text-ink-800 transition"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 48 48"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#FFC107",
    d: "M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#FF3D00",
    d: "M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#4CAF50",
    d: "M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.9l-6.6 5.1C9.6 39.6 16.2 44 24 44z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#1976D2",
    d: "M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.3C41.3 36.4 44 30.7 44 24c0-1.3-.1-2.3-.4-3.5z"
  })), "\u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629 \u0639\u0628\u0631 Google"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 my-4 text-[11px] text-ink-400"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 h-px bg-sand-200"
  }), " \u0623\u0648 ", /*#__PURE__*/React.createElement("div", {
    className: "flex-1 h-px bg-sand-200"
  })), /*#__PURE__*/React.createElement("form", {
    onSubmit: submit,
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[12px] text-ink-600 mb-1.5"
  }, "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A"), /*#__PURE__*/React.createElement("input", {
    type: "email",
    required: true,
    value: email,
    onChange: e => setEmail(e.target.value),
    dir: "ltr",
    placeholder: "you@example.com",
    className: "w-full h-11 bg-sand-50 border border-sand-200 rounded-lg px-3 text-sm focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[12px] text-ink-600 mb-1.5"
  }, "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    required: true,
    minLength: 6,
    value: pw,
    onChange: e => setPw(e.target.value),
    dir: "ltr",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    className: "w-full h-11 bg-sand-50 border border-sand-200 rounded-lg px-3 text-sm focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
  })), err && /*#__PURE__*/React.createElement("div", {
    className: "text-[12px] text-rose2-600 bg-rose2-50 border border-rose2-100 rounded-lg px-3 py-2"
  }, err), msg && /*#__PURE__*/React.createElement("div", {
    className: "text-[12px] text-[#246B4D] bg-[#E6F1EB] border border-[#C9E3D4] rounded-lg px-3 py-2"
  }, msg), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: busy,
    className: "w-full h-11 rounded-lg bg-teal-700 text-white text-[14px] font-medium hover:bg-teal-800 transition disabled:opacity-60"
  }, busy ? '...' : mode === 'signin' ? 'تسجيل الدخول' : 'إنشاء حساب')), /*#__PURE__*/React.createElement("div", {
    className: "text-center text-[12px] text-ink-500 mt-4"
  }, mode === 'signin' ? 'ليس لديك حساب؟ ' : 'لديك حساب بالفعل؟ ', /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setErr(null);
      setMsg(null);
      setMode(mode === 'signin' ? 'signup' : 'signin');
    },
    className: "text-teal-700 font-medium hover:underline"
  }, mode === 'signin' ? 'أنشئ حساباً' : 'سجّل الدخول'))), /*#__PURE__*/React.createElement("p", {
    className: "text-center text-[11px] text-ink-400 mt-4"
  }, "\u0628\u064A\u0627\u0646\u0627\u062A\u0643 \u0645\u062D\u0641\u0648\u0638\u0629 \u0628\u0623\u0645\u0627\u0646 \u0641\u064A \u062D\u0633\u0627\u0628\u0643.")));
}

// ============== Upgrade modal ==============
function UpgradeModal({
  open,
  onClose,
  onUpgrade,
  feature
}) {
  if (!open) return null;
  const names = {
    history: 'سجل الأشهر',
    export: 'النسخ الاحتياطي',
    annual: 'المتتبع السنوي',
    debt: 'حاسبة كرة الثلج'
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-[60] flex items-center justify-center px-4 bg-ink-900/50 backdrop-blur-sm",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-[400px]",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-11 h-11 rounded-xl bg-amber2-50 text-amber2-700 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(I.bolt, {
    className: "w-5 h-5"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-[16px] font-semibold text-ink-900"
  }, "\u0627\u0644\u062A\u0631\u0642\u064A\u0629 \u0625\u0644\u0649 Pro"), /*#__PURE__*/React.createElement("p", {
    className: "text-[12px] text-ink-500"
  }, feature ? `“${names[feature] || ''}” من مزايا Pro` : 'افتح كل المزايا'))), /*#__PURE__*/React.createElement("ul", {
    className: "mt-4 space-y-2 text-[13px] text-ink-700"
  }, [['history', 'سجل أشهر غير محدود وتنقّل بينها'], ['annual', 'المتتبع المالي السنوي'], ['debt', 'حاسبة سداد الديون (كرة الثلج)'], ['export', 'نسخ احتياطي/استيراد JSON']].filter(([k]) => PROF[k]).map(([k, t]) => /*#__PURE__*/React.createElement("li", {
    key: k,
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(I.check, {
    className: "w-4 h-4 text-teal-700 shrink-0"
  }), t))), /*#__PURE__*/React.createElement("div", {
    className: "mt-5 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[13px] text-ink-500"
  }, CFG.proPriceLabel || 'دفعة واحدة', " \xB7 \u0648\u0635\u0648\u0644 \u062F\u0627\u0626\u0645")), window.Backend.isDemo && /*#__PURE__*/React.createElement("div", {
    className: "mt-3 text-[11px] text-amber2-700 bg-amber2-50 border border-amber2-100 rounded-lg px-3 py-2"
  }, "\u0648\u0636\u0639 \u062A\u062C\u0631\u064A\u0628\u064A: \xAB\u0627\u0644\u062A\u0631\u0642\u064A\u0629\xBB \u062A\u0641\u062A\u062D \u0627\u0644\u0645\u0632\u0627\u064A\u0627 \u0641\u0648\u0631\u0627\u064B \u0628\u062F\u0648\u0646 \u062F\u0641\u0639 \u062D\u0642\u064A\u0642\u064A."), /*#__PURE__*/React.createElement("button", {
    onClick: onUpgrade,
    className: "mt-3 w-full h-11 rounded-lg bg-teal-700 text-white font-medium hover:bg-teal-800 transition"
  }, window.Backend.isDemo ? 'الترقية (تجريبي)' : 'الترقية الآن'), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "mt-2 w-full h-9 text-[13px] text-ink-500 hover:text-ink-700"
  }, "\u0644\u0627\u062D\u0642\u0627\u064B"))));
}

// ============== Account screen (cloud mode) ==============
function AccountScreen({
  user,
  isPro,
  onUpgrade,
  onSignOut
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6 max-w-[640px]"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-[26px] font-semibold text-ink-900"
  }, "\u062D\u0633\u0627\u0628\u064A ", /*#__PURE__*/React.createElement("span", {
    className: "text-ink-400 font-normal text-base latin"
  }, "\xB7 Account")), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-ink-500 mt-1"
  }, "\u0625\u062F\u0627\u0631\u0629 \u062D\u0633\u0627\u0628\u0643 \u0648\u0627\u0634\u062A\u0631\u0627\u0643\u0643.")), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 rounded-full bg-gradient-to-br from-teal-600 to-teal-800 text-white font-semibold flex items-center justify-center text-[16px]"
  }, (user.name || user.email || '؟').slice(0, 1).toUpperCase()), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[15px] font-semibold text-ink-900 truncate"
  }, user.name || 'مستخدم'), /*#__PURE__*/React.createElement("div", {
    className: "text-[12px] text-ink-500 latin truncate"
  }, user.email)), /*#__PURE__*/React.createElement("div", {
    className: "mr-auto"
  }, isPro ? /*#__PURE__*/React.createElement(Pill, {
    tone: "good"
  }, /*#__PURE__*/React.createElement(I.check, {
    className: "w-3 h-3"
  }), " Pro") : /*#__PURE__*/React.createElement(Pill, {
    tone: "neutral"
  }, "\u0645\u062C\u0627\u0646\u064A")))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionLabel, {
    hint: isPro ? 'لديك وصول كامل' : 'افتح كل المزايا بدفعة واحدة'
  }, "\u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643"), isPro ? /*#__PURE__*/React.createElement("div", {
    className: "text-[13px] text-ink-700 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(I.check, {
    className: "w-4 h-4 text-teal-700"
  }), " \u0623\u0646\u062A \u0645\u0634\u062A\u0631\u0643 \u0641\u064A Pro \u2014 \u0634\u0643\u0631\u0627\u064B \u0644\u0643!") : /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between gap-3 flex-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[13px] text-ink-600"
  }, CFG.proPriceLabel || 'دفعة واحدة', " \xB7 \u0648\u0635\u0648\u0644 \u062F\u0627\u0626\u0645 \u0644\u0643\u0644 \u0627\u0644\u0645\u0632\u0627\u064A\u0627"), /*#__PURE__*/React.createElement("button", {
    onClick: onUpgrade,
    className: "h-10 px-4 rounded-lg bg-teal-700 text-white text-[13px] font-medium hover:bg-teal-800"
  }, "\u0627\u0644\u062A\u0631\u0642\u064A\u0629 \u0625\u0644\u0649 Pro"))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionLabel, null, "\u0627\u0644\u062C\u0644\u0633\u0629"), /*#__PURE__*/React.createElement("button", {
    onClick: onSignOut,
    className: "h-10 px-4 rounded-lg border border-sand-200 bg-white hover:bg-sand-50 text-[13px] text-ink-700"
  }, "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C")));
}

// ============== Locked screen (for gated routes) ==============
function LockedScreen({
  feature,
  onUpgrade
}) {
  const names = {
    annual: 'المتتبع السنوي',
    debt: 'حاسبة كرة الثلج'
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center justify-center text-center py-20 max-w-[420px] mx-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-14 h-14 rounded-2xl bg-amber2-50 text-amber2-700 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(I.bolt, {
    className: "w-7 h-7"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "text-[20px] font-semibold text-ink-900 mt-4"
  }, names[feature] || 'هذه الميزة', " \u0636\u0645\u0646 Pro"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-ink-500 mt-2"
  }, "\u0631\u0642\u0650\u0651 \u062D\u0633\u0627\u0628\u0643 \u0628\u062F\u0641\u0639\u0629 \u0648\u0627\u062D\u062F\u0629 \u0644\u0641\u062A\u062D \u0647\u0630\u0647 \u0627\u0644\u0645\u064A\u0632\u0629 \u0648\u0628\u0642\u064A\u0629 \u0645\u0632\u0627\u064A\u0627 Pro."), /*#__PURE__*/React.createElement("button", {
    onClick: onUpgrade,
    className: "mt-5 h-11 px-6 rounded-lg bg-teal-700 text-white font-medium hover:bg-teal-800"
  }, "\u0627\u0644\u062A\u0631\u0642\u064A\u0629 \u0627\u0644\u0622\u0646"));
}

// ============== Month switcher (header) ==============
function MonthSwitcher({
  year,
  month,
  canNavigate,
  onGo,
  onLockedClick
}) {
  const go = delta => {
    if (!canNavigate) {
      onLockedClick();
      return;
    }
    const t = shiftMonth(year, month, delta);
    onGo(t.year, t.month);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 px-1.5 h-9 bg-white border border-sand-200 rounded-lg text-[12px] text-ink-700"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => go(-1),
    "aria-label": "\u0627\u0644\u0634\u0647\u0631 \u0627\u0644\u0633\u0627\u0628\u0642",
    className: "w-6 h-6 rounded hover:bg-sand-100 flex items-center justify-center text-ink-500"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    className: "w-3.5 h-3.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m15 6-6 6 6 6"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "px-1.5 min-w-[92px] text-center tnum inline-flex items-center justify-center gap-1"
  }, !canNavigate && /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    className: "w-3 h-3 text-ink-400"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "5",
    y: "11",
    width: "14",
    height: "9",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 11V8a4 4 0 0 1 8 0v3"
  })), month, " ", year), /*#__PURE__*/React.createElement("button", {
    onClick: () => go(1),
    "aria-label": "\u0627\u0644\u0634\u0647\u0631 \u0627\u0644\u062A\u0627\u0644\u064A",
    className: "w-6 h-6 rounded hover:bg-sand-100 flex items-center justify-center text-ink-500"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    className: "w-3.5 h-3.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m9 6 6 6-6 6"
  }))));
}

// ============== App ==============
function App({
  user,
  onSignOut
}) {
  const isCloud = window.Backend.isCloud;
  const requiresAuth = window.Backend.requiresAuth;
  const gatingOn = window.Backend.gating;
  const [route, setRoute] = useStateApp('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useStateApp(false);
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const [profile, setProfile] = useStateApp(null);
  const [monthData, setMonthData] = useStateApp(null);
  const [isPro, setIsPro] = useStateApp(!gatingOn); // local mode = full access
  const [booted, setBooted] = useStateApp(false);
  const [upgrade, setUpgrade] = useStateApp({
    open: false,
    feature: null
  });
  const skipSaveRef = useRefApp(true);

  // ── boot: load profile + current month ──
  useEffectApp(() => {
    let alive = true;
    (async () => {
      const prof = await window.Backend.getProfile();
      const settings = prof && prof.settings || window.Backend.defaultSettings();
      const pro = gatingOn ? prof && prof.plan === 'pro' : true;
      let md = await window.Backend.loadMonth(settings.year, settings.month);
      if (!md) {
        md = window.Backend.seedMonth();
        await window.Backend.saveMonthNow(settings.year, settings.month, md);
      }
      if (!alive) return;
      setProfile({
        settings,
        plan: prof ? prof.plan : 'free'
      });
      setIsPro(pro);
      setMonthData(md);
      setBooted(true);
      // sync tweaks (theme/accent/density) from saved settings
      ['theme', 'accent', 'density'].forEach(k => {
        if (settings[k]) setTweak(k, settings[k]);
      });
      requestAnimationFrame(() => {
        skipSaveRef.current = false;
      });
    })();
    return () => {
      alive = false;
    };
  }, []);

  // ── composed state (the shape every screen already expects) ──
  const state = useMemoApp(() => {
    if (!profile || !monthData) return null;
    return {
      settings: profile.settings,
      income: monthData.income,
      expenses: monthData.expenses,
      debts: monthData.debts,
      extraPay: monthData.extraPay,
      goals: monthData.goals
    };
  }, [profile, monthData]);
  const stateRef = useRefApp(state);
  stateRef.current = state;

  // ── setState shim: splits composed updates into profile.settings + monthData ──
  function setState(updater) {
    const cur = stateRef.current;
    const next = typeof updater === 'function' ? updater(cur) : updater;
    const curMY = cur.settings.year + '|' + cur.settings.month;
    const nextMY = next.settings.year + '|' + next.settings.month;
    if (nextMY !== curMY) {
      // month/year change is a "history" navigation — gated for free users
      if (PROF.history && !isPro) {
        setUpgrade({
          open: true,
          feature: 'history'
        });
        // keep month/year unchanged, but apply other settings edits
        applySettings({
          ...next.settings,
          year: cur.settings.year,
          month: cur.settings.month
        });
        applyMonth(next);
        return;
      }
      goToMonth(next.settings.year, next.settings.month, next.settings);
      return;
    }
    applySettings(next.settings);
    applyMonth(next);
  }
  function applySettings(settings) {
    setProfile(p => ({
      ...p,
      settings
    }));
  }
  function applyMonth(next) {
    setMonthData({
      income: next.income,
      expenses: next.expenses,
      debts: next.debts,
      extraPay: next.extraPay,
      goals: next.goals
    });
  }
  async function goToMonth(year, month, settingsOverride) {
    const cur = stateRef.current;
    // persist the month we're leaving
    await window.Backend.saveMonthNow(cur.settings.year, cur.settings.month, {
      income: cur.income,
      expenses: cur.expenses,
      debts: cur.debts,
      extraPay: cur.extraPay,
      goals: cur.goals
    });
    const baseSettings = settingsOverride || cur.settings;
    const newSettings = {
      ...baseSettings,
      year,
      month
    };
    setProfile(p => ({
      ...p,
      settings: newSettings
    }));
    let md = await window.Backend.loadMonth(year, month);
    if (!md) {
      // start a new month as a copy of the one we left (structure + amounts)
      md = {
        income: cur.income.map(x => ({
          ...x
        })),
        expenses: cur.expenses.map(x => ({
          ...x
        })),
        debts: cur.debts.map(x => ({
          ...x
        })),
        extraPay: cur.extraPay,
        goals: cur.goals.map(x => ({
          ...x
        }))
      };
    }
    setMonthData(md);
  }

  // ── autosave ──
  useEffectApp(() => {
    if (skipSaveRef.current || !state) return;
    window.Backend.saveMonth(state.settings.year, state.settings.month, {
      income: state.income,
      expenses: state.expenses,
      debts: state.debts,
      extraPay: state.extraPay,
      goals: state.goals
    });
  }, [monthData]);
  useEffectApp(() => {
    if (skipSaveRef.current || !profile) return;
    window.Backend.saveProfile(profile.settings);
  }, [profile && profile.settings]);

  // persist tweaks into settings so theme/accent/density survive across devices
  useEffectApp(() => {
    if (skipSaveRef.current || !profile) return;
    setProfile(p => ({
      ...p,
      settings: {
        ...p.settings,
        theme: tweaks.theme,
        accent: tweaks.accent,
        density: tweaks.density
      }
    }));
  }, [tweaks.theme, tweaks.accent, tweaks.density]);
  const money = useMemoApp(() => makeMoney(state ? state.settings.currency : 'SAR'), [state && state.settings.currency]);

  // theme / accent / density
  useEffectApp(() => {
    document.documentElement.classList.toggle('theme-dark', tweaks.theme === 'dark');
    document.documentElement.classList.toggle('density-compact', tweaks.density === 'compact');
    const a = ACCENTS[tweaks.accent] || ACCENTS.teal;
    document.documentElement.style.setProperty('--accent', a.primary);
    document.documentElement.style.setProperty('--accent-600', a.primary600);
    document.documentElement.style.setProperty('--accent-700', a.primary700);
  }, [tweaks.theme, tweaks.accent, tweaks.density]);

  // ── gating helper ──
  const gated = key => gatingOn && PROF[key] && !isPro;
  const openUpgrade = feature => setUpgrade({
    open: true,
    feature
  });
  async function doUpgrade() {
    try {
      const r = await window.Backend.startCheckout();
      if (r && r.simulated) {
        // demo mode: unlocked instantly
        const pro = await window.Backend.isPro();
        setIsPro(pro);
        setProfile(p => ({
          ...p,
          plan: pro ? 'pro' : p.plan
        }));
        setUpgrade({
          open: false,
          feature: null
        });
      }
    } catch (e) {
      alert('تعذّر بدء الدفع: ' + (e.message || e));
    }
  }

  // ── backup / restore / reset (export gated) ──
  function exportJson() {
    if (gated('export')) {
      openUpgrade('export');
      return;
    }
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
    if (gated('export')) {
      openUpgrade('export');
      return;
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.onchange = async e => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const obj = JSON.parse(await file.text());
        if (!obj.settings || !obj.income || !obj.expenses) throw new Error('ملف غير صالح');
        setState(obj);
      } catch (err) {
        alert('ملف غير صالح: ' + err.message);
      }
    };
    input.click();
  }
  function resetToSample() {
    if (confirm('استبدال بيانات هذا الشهر بالبيانات التجريبية؟')) setMonthData(window.Backend.seedMonth());
  }
  function clearAll() {
    if (confirm('مسح بيانات هذا الشهر؟')) setMonthData(window.Backend.emptyMonth());
  }
  if (!booted || !state) return /*#__PURE__*/React.createElement(Splash, null);
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
    icon: I.debt,
    pro: 'debt'
  }, {
    id: 'goals',
    label: STR.sections.goals,
    en: 'Goals',
    icon: I.goals
  }, {
    id: 'annual',
    label: STR.sections.annual,
    en: 'Annual',
    icon: I.annual,
    pro: 'annual'
  }, {
    id: 'settings',
    label: STR.sections.settings,
    en: 'Settings',
    icon: I.settings
  }];
  if (requiresAuth) nav.push({
    id: 'account',
    label: 'حسابي',
    en: 'Account',
    icon: I.settings
  });
  function renderScreen() {
    if (route === 'account') return /*#__PURE__*/React.createElement(AccountScreen, {
      user: user,
      isPro: isPro,
      onUpgrade: () => openUpgrade(null),
      onSignOut: onSignOut
    });
    const item = nav.find(n => n.id === route) || nav[0];
    if (item.pro && gated(item.pro)) return /*#__PURE__*/React.createElement(LockedScreen, {
      feature: item.pro,
      onUpgrade: () => openUpgrade(item.pro)
    });
    const S = {
      dashboard: DashboardScreen,
      income: IncomeScreen,
      expenses: ExpensesScreen,
      debt: DebtScreen,
      goals: GoalsScreen,
      annual: AnnualScreen,
      settings: SettingsScreen
    }[route];
    return /*#__PURE__*/React.createElement(S, {
      state: state,
      setState: setState,
      money: money
    });
  }
  const activeItem = nav.find(n => n.id === route) || nav[0];
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex relative",
    "data-screen-label": `Budget · ${activeItem.en}`
  }, mobileMenuOpen && /*#__PURE__*/React.createElement("div", {
    onClick: () => setMobileMenuOpen(false),
    className: "md:hidden fixed inset-0 bg-ink-900/40 z-30 backdrop-blur-sm"
  }), /*#__PURE__*/React.createElement("aside", {
    className: `fixed md:sticky top-0 right-0 bottom-0 md:bottom-auto w-[280px] md:w-[260px] shrink-0 h-screen z-40 bg-sand-50 border-l border-sand-200 transition-transform duration-300 ease-out ${mobileMenuOpen ? 'drawer-open' : 'drawer-closed'} flex flex-col`
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-5 pt-6 pb-5 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement(BrandMark, null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
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
    const locked = n.pro && gated(n.pro);
    return /*#__PURE__*/React.createElement("button", {
      key: n.id,
      onClick: () => {
        setRoute(n.id);
        setMobileMenuOpen(false);
      },
      className: `w-full text-right flex items-center gap-3 px-3 py-2.5 md:py-2 rounded-lg transition group ${active ? 'bg-teal-700 text-white shadow-soft' : 'text-ink-700 hover:bg-sand-100'}`
    }, /*#__PURE__*/React.createElement(Icon, {
      className: `w-[18px] h-[18px] shrink-0 ${active ? '' : 'text-ink-500 group-hover:text-ink-700'}`
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-[13px] flex-1"
    }, n.label), locked ? /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.6",
      className: `w-3 h-3 ${active ? 'text-teal-100' : 'text-ink-400'}`
    }, /*#__PURE__*/React.createElement("rect", {
      x: "5",
      y: "11",
      width: "14",
      height: "9",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 11V8a4 4 0 0 1 8 0v3"
    })) : /*#__PURE__*/React.createElement("span", {
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
  }, activeItem.label), /*#__PURE__*/React.createElement("div", {
    className: "hidden md:flex items-center gap-2 text-[12px] text-ink-500"
  }, /*#__PURE__*/React.createElement("span", null, "\u0645\u064A\u0632\u0627\u0646\u064A\u062A\u064A"), /*#__PURE__*/React.createElement(I.chevron, {
    className: "w-3 h-3 -scale-x-100"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-ink-900 font-medium"
  }, activeItem.label)), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }), /*#__PURE__*/React.createElement(MonthSwitcher, {
    year: state.settings.year,
    month: state.settings.month,
    canNavigate: !(PROF.history && !isPro),
    onGo: (y, m) => goToMonth(y, m),
    onLockedClick: () => openUpgrade('history')
  }), /*#__PURE__*/React.createElement("div", {
    className: "hidden md:flex items-center gap-1.5 px-3 h-9 bg-white border border-sand-200 rounded-lg text-[12px] text-ink-700"
  }, /*#__PURE__*/React.createElement("span", {
    className: "latin font-medium"
  }, money.code), /*#__PURE__*/React.createElement("span", {
    className: "text-ink-400"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, money.sym)), /*#__PURE__*/React.createElement("button", {
    onClick: () => requiresAuth ? setRoute('account') : null,
    className: "flex items-center gap-2.5",
    "aria-label": "\u0627\u0644\u062D\u0633\u0627\u0628"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hidden lg:block text-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[12px] text-ink-900 font-medium leading-none"
  }, state.settings.name), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-ink-500 latin mt-0.5"
  }, requiresAuth ? isPro ? 'Pro account' : 'Free account' : 'Local')), /*#__PURE__*/React.createElement("div", {
    className: "w-9 h-9 rounded-full bg-gradient-to-br from-teal-600 to-teal-800 text-white font-semibold flex items-center justify-center text-[13px] shrink-0"
  }, (state.settings.name || '؟').split(' ').map(s => s[0]).join('').slice(0, 2))))), /*#__PURE__*/React.createElement("div", {
    className: "max-w-[1400px] mx-auto px-4 md:px-8 py-5 md:py-7 pb-24 md:pb-7"
  }, renderScreen())), /*#__PURE__*/React.createElement(UpgradeModal, {
    open: upgrade.open,
    feature: upgrade.feature,
    onClose: () => setUpgrade({
      open: false,
      feature: null
    }),
    onUpgrade: doUpgrade
  }), /*#__PURE__*/React.createElement(window.TweaksPanel, {
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
    label: "\uD83D\uDDD1 \u0645\u0633\u062D \u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631",
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

// ============== Root — auth gate ==============
function Root() {
  const requiresAuth = window.Backend.requiresAuth;
  const [ready, setReady] = useStateApp(false);
  const [user, setUser] = useStateApp(null);
  useEffectApp(() => {
    let off = () => {};
    (async () => {
      const u = await window.Backend.getUser();
      setUser(u);
      setReady(true);
      off = window.Backend.onAuthChange(async () => {
        setUser(await window.Backend.getUser());
      });
    })();
    return () => off();
  }, []);
  if (!ready) return /*#__PURE__*/React.createElement(Splash, null);
  if (requiresAuth && !user) return /*#__PURE__*/React.createElement(AuthScreen, null);
  return /*#__PURE__*/React.createElement(App, {
    key: user ? user.id : 'local',
    user: user,
    onSignOut: async () => {
      await window.Backend.signOut();
      setUser(null);
    }
  });
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(Root, null));