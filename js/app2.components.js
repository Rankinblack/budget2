function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Shared components: formatters, icons, cards, donut, bars

const {
  useState,
  useMemo,
  useEffect,
  useRef
} = React;

// ---------- formatting ----------
function fmtN(n, dp = 0) {
  if (n === null || n === undefined || isNaN(n)) n = 0;
  const opts = {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp
  };
  return Number(n).toLocaleString('en-US', opts);
}
function fmtMoney(n, sym = 'ر.س', dp = 0) {
  return `${fmtN(n, dp)} ${sym}`;
}
function fmtPct(x, dp = 0) {
  if (!isFinite(x)) x = 0;
  return `${(x * 100).toFixed(dp)}%`;
}
function fmtSignedMoney(n, sym) {
  const s = n > 0 ? '+' : n < 0 ? '−' : '';
  return `${s}${fmtN(Math.abs(n))} ${sym}`;
}

// Currency formatter from a settings object
function makeMoney(currencyCode) {
  const c = CURRENCIES.find(x => x.code === currencyCode) || CURRENCIES[0];
  return {
    sym: c.symbol,
    code: c.code,
    fmt: (n, dp = 0) => fmtMoney(n, c.symbol, dp),
    short: n => {
      const v = Math.abs(n || 0);
      if (v >= 1e6) return `${(n / 1e6).toFixed(1)}م ${c.symbol}`;
      if (v >= 1e3) return `${(n / 1e3).toFixed(v >= 10e3 ? 0 : 1)}ك ${c.symbol}`;
      return `${fmtN(n)} ${c.symbol}`;
    }
  };
}

// ---------- icons (line, 1.5px) ----------
const I = {
  dashboard: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "7",
    height: "9",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "3",
    width: "7",
    height: "5",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "12",
    width: "7",
    height: "9",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "16",
    width: "7",
    height: "5",
    rx: "1.5"
  })),
  income: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M12 4v14m0 0 5-5m-5 5-5-5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 20h16"
  })),
  expense: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M12 20V6m0 0-5 5m5-5 5 5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 4h16"
  })),
  debt: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "14",
    r: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "13",
    cy: "11",
    r: "4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "7.5",
    r: "2.2"
  })),
  goals: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "5.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "2"
  })),
  annual: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "5",
    width: "18",
    height: "16",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 9h18M8 3v4M16 3v4"
  })),
  settings: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.65 8.85a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1.04-1.56V3a2 2 0 1 1 4 0v.09c0 .68.42 1.29 1.04 1.56a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87c.27.62.88 1.04 1.56 1.04H21a2 2 0 1 1 0 4h-.09A1.7 1.7 0 0 0 19.4 15Z"
  })),
  home: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z"
  })),
  car: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M5 13h14l-1.5-4.5A2 2 0 0 0 15.6 7H8.4a2 2 0 0 0-1.9 1.5L5 13Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 13h16v5H4z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8",
    cy: "18.5",
    r: "1.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "16",
    cy: "18.5",
    r: "1.5"
  })),
  cart: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M3 4h2l2.5 12h11l2-8H7"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "20",
    r: "1.4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17",
    cy: "20",
    r: "1.4"
  })),
  heart: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10Z"
  })),
  wifi: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M3.5 10c5-4.5 12-4.5 17 0M6 13.5c3.5-3 8.5-3 12 0M9 17c1.5-1.3 4.5-1.3 6 0"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "20",
    r: ".8",
    fill: "currentColor"
  })),
  mosque: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M4 20V13a8 8 0 0 1 16 0v7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 20h18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 20v-4a2 2 0 0 1 4 0v4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 3c.7 1.2.7 2.5 0 3.5"
  })),
  star: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "m12 3 2.7 5.7 6.3.9-4.6 4.4 1.1 6.2L12 17.3 6.5 20.2l1.1-6.2L3 9.6l6.3-.9L12 3Z"
  })),
  shield: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z"
  })),
  plane: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M3 12 21 5 14 21l-2-7-9-2Z"
  })),
  sparkle: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M12 3v18M3 12h18M6 6l12 12M18 6 6 18"
  })),
  plus: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M12 5v14M5 12h14"
  })),
  edit: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M4 20h4l11-11-4-4L4 16v4Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m14 5 4 4"
  })),
  trash: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 7v13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7"
  })),
  download: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M12 4v12m0 0 5-5m-5 5-5-5M4 20h16"
  })),
  search: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m20 20-3.5-3.5"
  })),
  arrow: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14M13 6l6 6-6 6"
  })),
  check: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "m5 12 4 4 10-10"
  })),
  bolt: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M13 3 4 14h7l-1 7 9-11h-7l1-7Z"
  })),
  moon: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"
  })),
  sun: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"
  })),
  chevron: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "m9 6 6 6-6 6"
  })),
  info: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 11v6m0-9.5h.01"
  }))
};

// ---------- generic UI ----------
function Card({
  className = '',
  children,
  padded = true
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `bg-white border border-sand-200 rounded-2xl shadow-soft ${padded ? 'p-5' : ''} ${className}`
  }, children);
}
function SectionLabel({
  children,
  hint,
  action
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-end justify-between mb-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-[15px] font-semibold text-ink-900"
  }, children), hint && /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-ink-500 mt-0.5"
  }, hint)), action);
}
function Pill({
  tone = 'neutral',
  children,
  className = ''
}) {
  const tones = {
    neutral: 'bg-sand-100 text-ink-700 border-sand-200',
    good: 'bg-[#E6F1EB] text-[#246B4D] border-[#C9E3D4]',
    warn: 'bg-amber2-50 text-amber2-700 border-amber2-100',
    bad: 'bg-rose2-50 text-rose2-600 border-rose2-100',
    teal: 'bg-teal-50 text-teal-700 border-teal-100'
  };
  return /*#__PURE__*/React.createElement("span", {
    className: `inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${tones[tone]} ${className}`
  }, children);
}

// ---------- KPI stat card with mini bar ----------
function StatCard({
  label,
  en,
  value,
  sub,
  tone = 'ink',
  bar,
  icon,
  hint
}) {
  const toneRing = {
    ink: 'text-ink-900',
    good: 'text-[#246B4D]',
    bad: 'text-rose2-600',
    warn: 'text-amber2-700',
    teal: 'text-teal-700'
  };
  return /*#__PURE__*/React.createElement(Card, {
    className: "relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-ink-600"
  }, icon, /*#__PURE__*/React.createElement("span", {
    className: "text-[13px]"
  }, label), en && /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] latin text-ink-400"
  }, en)), /*#__PURE__*/React.createElement("div", {
    className: `mt-2 text-3xl font-semibold tnum ${toneRing[tone]}`
  }, value), sub && /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-ink-500 mt-1"
  }, sub)), hint), bar);
}

// ---------- progress bar ----------
function ProgressBar({
  value,
  color = '#0E4940',
  track = '#ECE5D4',
  height = 8,
  label,
  right
}) {
  const v = Math.max(0, Math.min(1, value || 0));
  return /*#__PURE__*/React.createElement("div", null, (label || right) && /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-[12px] text-ink-600 mb-1.5"
  }, /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("span", {
    className: "tnum"
  }, right)), /*#__PURE__*/React.createElement("div", {
    className: "w-full rounded-full overflow-hidden",
    style: {
      background: track,
      height
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full rounded-full transition-all duration-500",
    style: {
      width: `${v * 100}%`,
      background: color
    }
  })));
}

// ---------- donut chart (SVG) ----------
function Donut({
  data,
  size = 220,
  thickness = 24,
  centerLabel,
  centerValue,
  gap = 2
}) {
  const total = data.reduce((s, d) => s + (d.value || 0), 0) || 1;
  const r = size / 2 - thickness / 2 - 4;
  const c = 2 * Math.PI * r;
  let offset = 0;
  // For RTL feel, start at top (-90deg)
  return /*#__PURE__*/React.createElement("div", {
    className: "relative inline-flex items-center justify-center",
    style: {
      width: size,
      height: size
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    className: "-rotate-90"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    stroke: "#ECE5D4",
    strokeWidth: thickness,
    fill: "none"
  }), data.map((d, i) => {
    const len = d.value / total * c;
    const seg = Math.max(0, len - gap);
    const dasharray = `${seg} ${c - seg}`;
    const dashoffset = -offset;
    offset += len;
    return /*#__PURE__*/React.createElement("circle", {
      key: i,
      cx: size / 2,
      cy: size / 2,
      r: r,
      stroke: d.color,
      strokeWidth: thickness,
      fill: "none",
      strokeDasharray: dasharray,
      strokeDashoffset: dashoffset,
      strokeLinecap: "butt"
    });
  })), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 flex flex-col items-center justify-center text-center"
  }, centerLabel && /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-ink-500 uppercase tracking-wider latin"
  }, centerLabel), centerValue && /*#__PURE__*/React.createElement("div", {
    className: "text-[22px] font-semibold tnum text-ink-900 mt-0.5"
  }, centerValue)));
}

// ---------- bar chart for annual tracker (income vs expenses) ----------
function BarsAnnual({
  data,
  money,
  height = 200
}) {
  const max = Math.max(...data.map(d => Math.max(d.income, d.expenses))) * 1.1 || 1;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-end gap-3 px-1",
    style: {
      height
    }
  }, data.map((d, i) => {
    const hi = d.income / max * height;
    const he = d.expenses / max * height;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "flex-1 flex flex-col items-center gap-1 group"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-full flex items-end justify-center gap-1",
      style: {
        height
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-3 rounded-t-sm bg-teal-600/90 hover:bg-teal-700 transition-all relative",
      style: {
        height: hi
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "opacity-0 group-hover:opacity-100 transition absolute -top-7 left-1/2 -translate-x-1/2 bg-ink-900 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap tnum"
    }, money.short(d.income))), /*#__PURE__*/React.createElement("div", {
      className: "w-3 rounded-t-sm bg-rose2-500/90 hover:bg-rose2-600 transition-all",
      style: {
        height: he
      }
    })));
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3 px-1 mt-2"
  }, data.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "flex-1 text-center text-[10px] text-ink-500"
  }, d.month.slice(0, 3)))));
}

// ---------- line/area sparkline for debt payoff ----------
function PayoffSpark({
  series,
  height = 130,
  color = '#0E4940'
}) {
  const w = 400;
  const max = Math.max(...series, 1);
  const pts = series.map((v, i) => {
    const x = i / (series.length - 1) * w;
    const y = height - v / max * (height - 8) - 4;
    return [x, y];
  });
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const fillPath = d + ` L ${w} ${height} L 0 ${height} Z`;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${w} ${height}`,
    className: "w-full",
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "payoffGrad",
    x1: "0",
    x2: "0",
    y1: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: color,
    stopOpacity: "0.22"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: color,
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("path", {
    d: fillPath,
    fill: "url(#payoffGrad)"
  }), /*#__PURE__*/React.createElement("path", {
    d: d,
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinejoin: "round",
    strokeLinecap: "round"
  }), pts.length > 0 && /*#__PURE__*/React.createElement("circle", {
    cx: pts[pts.length - 1][0],
    cy: pts[pts.length - 1][1],
    r: "3",
    fill: color
  }));
}

// ---------- ring (progress) ----------
function Ring({
  value,
  size = 44,
  thickness = 4,
  color = '#0E4940'
}) {
  const r = size / 2 - thickness / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value || 0));
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    className: "-rotate-90 shrink-0"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    stroke: "#ECE5D4",
    strokeWidth: thickness,
    fill: "none"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    stroke: color,
    strokeWidth: thickness,
    fill: "none",
    strokeDasharray: `${v * c} ${c}`,
    strokeLinecap: "round"
  }));
}

// ---------- editable currency input ----------
function MoneyInput({
  value,
  onChange,
  sym = 'ر.س',
  size = 'md',
  placeholder = '0'
}) {
  const sz = size === 'lg' ? 'h-11 text-base' : 'h-9 text-sm';
  return /*#__PURE__*/React.createElement("div", {
    className: `relative ${sz}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value === 0 ? '' : value,
    onChange: e => onChange(Number(e.target.value) || 0),
    placeholder: placeholder,
    className: `w-full bg-sand-50 border border-sand-200 rounded-lg pl-3 pr-10 tnum ${sz} text-ink-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition`,
    dir: "ltr",
    style: {
      textAlign: 'right'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 text-[12px] pointer-events-none"
  }, sym));
}

// ---------- generic text input ----------
function TInput({
  value,
  onChange,
  placeholder,
  size = 'md',
  icon,
  className = '',
  type = 'text'
}) {
  const sz = size === 'lg' ? 'h-11 text-base' : 'h-9 text-sm';
  return /*#__PURE__*/React.createElement("div", {
    className: `relative ${className}`
  }, icon && /*#__PURE__*/React.createElement("span", {
    className: "absolute right-3 top-1/2 -translate-y-1/2 text-ink-400"
  }, icon), /*#__PURE__*/React.createElement("input", {
    type: type,
    value: value ?? '',
    onChange: e => onChange(type === 'number' ? Number(e.target.value) || 0 : e.target.value),
    placeholder: placeholder,
    className: `w-full bg-sand-50 border border-sand-200 rounded-lg ${icon ? 'pr-9' : 'pr-3'} pl-3 ${sz} text-ink-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition`
  }));
}

// ---------- segmented control ----------
function Segmented({
  options,
  value,
  onChange,
  size = 'md'
}) {
  const sz = size === 'sm' ? 'text-[12px] h-8 px-3' : 'text-sm h-9 px-3.5';
  return /*#__PURE__*/React.createElement("div", {
    className: "inline-flex p-1 bg-sand-100 border border-sand-200 rounded-xl"
  }, options.map(o => {
    const active = o.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: o.value,
      onClick: () => onChange(o.value),
      className: `${sz} rounded-lg font-medium transition ${active ? 'bg-white text-ink-900 shadow-soft' : 'text-ink-600 hover:text-ink-900'}`
    }, o.label);
  }));
}
Object.assign(window, {
  fmtN,
  fmtMoney,
  fmtPct,
  fmtSignedMoney,
  makeMoney,
  Card,
  SectionLabel,
  Pill,
  StatCard,
  ProgressBar,
  Donut,
  BarsAnnual,
  PayoffSpark,
  Ring,
  MoneyInput,
  TInput,
  Segmented,
  I
});