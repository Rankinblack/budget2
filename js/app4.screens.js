// Screens: Dashboard, Income, Expenses, Debt Snowball, Goals, Annual, Settings

// ============== Dashboard ==============
function DashboardScreen({
  state,
  money
}) {
  const {
    settings,
    income,
    expenses,
    debts,
    extraPay,
    goals
  } = state;
  const totalIncome = income.reduce((s, x) => s + (x.amount || 0), 0);
  const totalExpenses = expenses.reduce((s, x) => s + (x.amount || 0), 0);
  const net = totalIncome - totalExpenses;
  const savingsPct = totalIncome ? net / totalIncome : 0;
  const totalDebt = debts.reduce((s, x) => s + (x.balance || 0), 0);
  const minPayTotal = debts.reduce((s, x) => s + (x.minPay || 0), 0);

  // Expenses by group for donut
  const byGroup = EXPENSE_GROUPS.map(g => ({
    ...g,
    value: expenses.filter(e => e.group === g.id).reduce((s, x) => s + (x.amount || 0), 0)
  })).filter(g => g.value > 0);

  // Income breakdown
  const salaryTotal = income.filter(i => i.group === 'salary').reduce((s, x) => s + (x.amount || 0), 0);
  const otherTotal = income.filter(i => i.group === 'other').reduce((s, x) => s + (x.amount || 0), 0);

  // Zakat assist
  const zakatDue = totalIncome >= settings.zakatNisab ? totalIncome * 0.025 : 0;

  // Snowball preview: months to freedom
  const snowballMonths = snowballSchedule(debts, extraPay).monthsToFreedom;
  const savingsVsGoal = savingsPct / (settings.savingsGoalPct || 1);
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between flex-wrap gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[13px] text-ink-500 latin tracking-wide"
  }, settings.month, " \xB7 ", settings.year), /*#__PURE__*/React.createElement("h1", {
    className: "text-[28px] font-semibold text-ink-900 mt-1"
  }, "\u0623\u0647\u0644\u0627\u064B\u060C ", settings.name.split(' ')[0], " ", /*#__PURE__*/React.createElement("span", {
    className: "text-ink-400 font-normal"
  }, "\u2014 \u0647\u0630\u0627 \u0645\u0644\u062E\u0635\u0643 \u0627\u0644\u0645\u0627\u0644\u064A"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Pill, {
    tone: savingsPct >= settings.savingsGoalPct ? 'good' : 'warn'
  }, savingsPct >= settings.savingsGoalPct ? /*#__PURE__*/React.createElement(I.check, {
    className: "w-3 h-3"
  }) : /*#__PURE__*/React.createElement(I.bolt, {
    className: "w-3 h-3"
  }), "\u0645\u0639\u062F\u0644 \u0627\u062F\u062E\u0627\u0631 ", fmtPct(savingsPct), " \u0645\u0646 \u0647\u062F\u0641 ", fmtPct(settings.savingsGoalPct)), settings.islamicMode && /*#__PURE__*/React.createElement(Pill, {
    tone: "teal"
  }, /*#__PURE__*/React.createElement(I.mosque, {
    className: "w-3 h-3"
  }), " \u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0625\u0633\u0644\u0627\u0645\u064A"))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "\u0627\u0644\u062F\u062E\u0644 \u0627\u0644\u0634\u0647\u0631\u064A",
    en: "Income",
    tone: "ink",
    icon: /*#__PURE__*/React.createElement(I.income, {
      className: "w-4 h-4 text-teal-700"
    }),
    value: money.fmt(totalIncome),
    sub: `${income.filter(i => i.amount > 0).length} مصدر دخل نشط`,
    bar: /*#__PURE__*/React.createElement("div", {
      className: "mt-3"
    }, /*#__PURE__*/React.createElement(ProgressBar, {
      value: totalIncome / (totalIncome || 1),
      color: "#155E54"
    }))
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "\u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A",
    en: "Expenses",
    tone: "ink",
    icon: /*#__PURE__*/React.createElement(I.expense, {
      className: "w-4 h-4 text-rose2-500"
    }),
    value: money.fmt(totalExpenses),
    sub: `${fmtPct(totalIncome ? totalExpenses / totalIncome : 0)} من الدخل`,
    bar: /*#__PURE__*/React.createElement("div", {
      className: "mt-3"
    }, /*#__PURE__*/React.createElement(ProgressBar, {
      value: totalIncome ? totalExpenses / totalIncome : 0,
      color: "#B6493A",
      track: "#F1D2C9"
    }))
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "\u0635\u0627\u0641\u064A \u0627\u0644\u0627\u062F\u062E\u0627\u0631",
    en: "Net Savings",
    tone: net >= 0 ? 'good' : 'bad',
    icon: /*#__PURE__*/React.createElement(I.shield, {
      className: "w-4 h-4 text-amber2-600"
    }),
    value: money.fmt(net),
    sub: `هدفك ${fmtPct(settings.savingsGoalPct)}`,
    bar: /*#__PURE__*/React.createElement("div", {
      className: "mt-3"
    }, /*#__PURE__*/React.createElement(ProgressBar, {
      value: Math.min(savingsVsGoal, 1),
      color: savingsVsGoal >= 1 ? '#246B4D' : '#C99334',
      track: "#F5E3B7"
    }), /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] text-ink-500 mt-1"
    }, savingsVsGoal >= 1 ? 'تجاوزت هدفك ✦' : `${fmtPct(savingsVsGoal, 0)} من الهدف`))
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u062F\u064A\u0648\u0646",
    en: "Total Debt",
    tone: "ink",
    icon: /*#__PURE__*/React.createElement(I.debt, {
      className: "w-4 h-4 text-amber2-700"
    }),
    value: money.fmt(totalDebt),
    sub: `الحد الأدنى ${money.fmt(minPayTotal)} / شهر`,
    bar: /*#__PURE__*/React.createElement("div", {
      className: "mt-3 flex items-center justify-between"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-[11px] text-ink-500"
    }, "\u0627\u0644\u062A\u062D\u0631\u0631 \u062E\u0644\u0627\u0644"), /*#__PURE__*/React.createElement("span", {
      className: "text-[13px] font-semibold text-teal-700 tnum"
    }, snowballMonths || '—', " \u0634\u0647\u0631"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-12 gap-4"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "col-span-12 lg:col-span-7"
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    hint: "\u0641\u0639\u0644\u064A \u0645\u0642\u0627\u0628\u0644 \u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u062F\u062E\u0644",
    action: /*#__PURE__*/React.createElement(Pill, {
      tone: "neutral"
    }, byGroup.length, " \u0641\u0626\u0629")
  }, "\u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A \u062D\u0633\u0628 \u0627\u0644\u0641\u0626\u0629"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center"
  }, /*#__PURE__*/React.createElement(Donut, {
    size: 220,
    thickness: 26,
    gap: 3,
    data: byGroup.map(g => ({
      value: g.value,
      color: g.color
    })),
    centerLabel: "EXPENSES",
    centerValue: money.short(totalExpenses)
  })), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2.5"
  }, byGroup.sort((a, b) => b.value - a.value).map(g => {
    const pct = g.value / (totalExpenses || 1);
    const Icon = I[g.icon] || I.star;
    return /*#__PURE__*/React.createElement("div", {
      key: g.id,
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
      style: {
        background: `${g.color}14`,
        color: g.color
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      className: "w-4 h-4"
    })), /*#__PURE__*/React.createElement("div", {
      className: "flex-1 min-w-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between text-[13px]"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-ink-800 truncate"
    }, g.ar), /*#__PURE__*/React.createElement("span", {
      className: "tnum text-ink-700 ml-2"
    }, money.fmt(g.value))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 mt-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-1 flex-1 bg-sand-200 rounded-full overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-full rounded-full",
      style: {
        width: `${pct * 100}%`,
        background: g.color
      }
    })), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] text-ink-500 tnum w-9 text-left"
    }, fmtPct(pct, 0)))));
  })))), /*#__PURE__*/React.createElement(Card, {
    className: "col-span-12 lg:col-span-5"
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    hint: "\u0645\u0646 \u0627\u0644\u062F\u062E\u0644 \u0625\u0644\u0649 \u0627\u0644\u0645\u062A\u0628\u0642\u064A"
  }, "\u0631\u0633\u0645 \u062A\u062F\u0641\u0651\u0642 \u0627\u0644\u0646\u0642\u062F"), /*#__PURE__*/React.createElement(CashFlowBar, {
    income: totalIncome,
    expenses: totalExpenses,
    debt: expenses.filter(e => e.group === 'debts').reduce((s, x) => s + (x.amount || 0), 0),
    savings: Math.max(0, net),
    money: money
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-5 pt-5 border-t border-sand-200 grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-ink-500 mb-1"
  }, "\u0627\u0644\u0632\u0643\u0627\u0629 \u0627\u0644\u0648\u0627\u062C\u0628\u0629 (2.5%)"), /*#__PURE__*/React.createElement("div", {
    className: "text-lg font-semibold tnum text-ink-900"
  }, money.fmt(zakatDue)), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-ink-400 mt-0.5"
  }, totalIncome >= settings.zakatNisab ? 'بلغ النصاب' : `تحت النصاب (${money.fmt(settings.zakatNisab)})`)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-ink-500 mb-1"
  }, "\u0646\u0633\u0628\u0629 \u0627\u0644\u062F\u064A\u0646 \u0625\u0644\u0649 \u0627\u0644\u062F\u062E\u0644"), /*#__PURE__*/React.createElement("div", {
    className: "text-lg font-semibold tnum text-ink-900"
  }, fmtPct(totalIncome ? totalDebt / (totalIncome * 12) : 0, 1)), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-ink-400 mt-0.5"
  }, totalDebt / (totalIncome * 12 || 1) < 0.35 ? 'صحية' : 'مرتفعة — راجع')))), /*#__PURE__*/React.createElement(Card, {
    className: "col-span-12 lg:col-span-7"
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    hint: "\u0623\u0643\u0628\u0631 \u0666 \u0628\u0646\u0648\u062F \u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631",
    action: /*#__PURE__*/React.createElement(Pill, {
      tone: "neutral"
    }, "\u0634\u0647\u0631\u064A")
  }, "\u0623\u0643\u0628\u0631 \u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3"
  }, [...expenses].sort((a, b) => b.amount - a.amount).slice(0, 6).map((e, i) => {
    const g = EXPENSE_GROUPS.find(x => x.id === e.group);
    const pct = e.amount / (totalExpenses || 1);
    const Icon = g ? I[g.icon] : I.star;
    return /*#__PURE__*/React.createElement("div", {
      key: e.id,
      className: "flex items-center gap-3 p-3 rounded-xl border border-sand-200 hover:border-sand-300 transition bg-sand-50"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
      style: {
        background: `${g.color}14`,
        color: g.color
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      className: "w-4 h-4"
    })), /*#__PURE__*/React.createElement("div", {
      className: "flex-1 min-w-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-[13px] text-ink-900 truncate"
    }, e.ar), /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] text-ink-500"
    }, g.ar)), /*#__PURE__*/React.createElement("div", {
      className: "text-right"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-[14px] font-semibold tnum text-ink-900"
    }, money.fmt(e.amount)), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-ink-500"
    }, fmtPct(pct, 0))));
  }))), /*#__PURE__*/React.createElement(Card, {
    className: "col-span-12 lg:col-span-5"
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    hint: "\u0623\u0639\u0644\u0649 \u0664 \u0623\u0647\u062F\u0627\u0641 \u0646\u0634\u0637\u0629",
    action: /*#__PURE__*/React.createElement("button", {
      className: "text-[12px] text-teal-700 hover:underline"
    }, "\u0639\u0631\u0636 \u0643\u0644\u0647\u0627 \u2190")
  }, "\u062A\u0642\u062F\u0651\u0645 \u0627\u0644\u0623\u0647\u062F\u0627\u0641"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, goals.slice(0, 4).map(g => {
    const pct = g.target ? g.saved / g.target : 0;
    const Icon = I[g.icon] || I.star;
    return /*#__PURE__*/React.createElement("div", {
      key: g.id
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 mb-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
      style: {
        background: `${g.color}14`,
        color: g.color
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      className: "w-4 h-4"
    })), /*#__PURE__*/React.createElement("span", {
      className: "text-[13px] text-ink-800 flex-1"
    }, g.ar), /*#__PURE__*/React.createElement("span", {
      className: "text-[11px] tnum text-ink-500"
    }, money.short(g.saved), " ", /*#__PURE__*/React.createElement("span", {
      className: "text-ink-400"
    }, "/"), " ", money.short(g.target))), /*#__PURE__*/React.createElement(ProgressBar, {
      value: pct,
      color: g.color,
      track: "#ECE5D4",
      height: 6
    }));
  }))), /*#__PURE__*/React.createElement(Card, {
    className: "col-span-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-end justify-between mb-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-[15px] font-semibold text-ink-900"
  }, "\u0627\u0644\u0645\u062A\u062A\u0628\u0639 \u0627\u0644\u0633\u0646\u0648\u064A"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-ink-500 mt-0.5"
  }, "\u0627\u0644\u062F\u062E\u0644 \u0645\u0642\u0627\u0628\u0644 \u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A \u0639\u0644\u0649 \u0645\u062F\u0627\u0631 ", settings.year)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 text-[11px] text-ink-600"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2.5 h-2.5 rounded-sm bg-teal-600"
  }), "\u062F\u062E\u0644"), /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2.5 h-2.5 rounded-sm bg-rose2-500"
  }), "\u0645\u0635\u0631\u0648\u0641\u0627\u062A"))), /*#__PURE__*/React.createElement(BarsAnnual, {
    data: ANNUAL_SEED,
    money: money,
    height: 160
  }))));
}

// ---------- Cash flow bar (stacked horizontal) ----------
function CashFlowBar({
  income,
  expenses,
  debt,
  savings,
  money
}) {
  const otherExp = Math.max(0, expenses - debt);
  const total = income || 1;
  const seg = [{
    label: 'مصروفات معيشية',
    value: otherExp,
    color: '#B6493A'
  }, {
    label: 'أقساط وديون',
    value: debt,
    color: '#C99334'
  }, {
    label: 'صافي الادخار',
    value: savings,
    color: '#155E54'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[12px] text-ink-500"
  }, "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u062F\u062E\u0644"), /*#__PURE__*/React.createElement("span", {
    className: "text-2xl font-semibold tnum text-ink-900"
  }, money.fmt(income))), /*#__PURE__*/React.createElement("div", {
    className: "flex h-3 rounded-full overflow-hidden bg-sand-200"
  }, seg.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "h-full transition-all",
    style: {
      width: `${s.value / total * 100}%`,
      background: s.color
    },
    title: `${s.label} ${money.fmt(s.value)}`
  }))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5 pt-1"
  }, seg.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "flex items-center gap-2 text-[12px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2.5 h-2.5 rounded-sm shrink-0",
    style: {
      background: s.color
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-ink-700 flex-1"
  }, s.label), /*#__PURE__*/React.createElement("span", {
    className: "tnum text-ink-900"
  }, money.fmt(s.value)), /*#__PURE__*/React.createElement("span", {
    className: "text-ink-400 tnum w-10 text-left"
  }, fmtPct(s.value / total, 0))))));
}

// ============== Income ==============
function IncomeScreen({
  state,
  setState,
  money
}) {
  const total = state.income.reduce((s, x) => s + (x.amount || 0), 0);
  const salaryTotal = state.income.filter(i => i.group === 'salary').reduce((s, x) => s + (x.amount || 0), 0);
  const otherTotal = state.income.filter(i => i.group === 'other').reduce((s, x) => s + (x.amount || 0), 0);
  const groups = [{
    id: 'salary',
    ar: 'الراتب والبدلات',
    en: 'Salary & Allowances',
    color: '#155E54'
  }, {
    id: 'other',
    ar: 'دخل إضافي',
    en: 'Other Income',
    color: '#C99334'
  }];
  function update(id, key, val) {
    setState(s => ({
      ...s,
      income: s.income.map(i => i.id === id ? {
        ...i,
        [key]: val
      } : i)
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between flex-wrap gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-[26px] font-semibold text-ink-900"
  }, "\u0627\u0644\u062F\u062E\u0644 \u0627\u0644\u0634\u0647\u0631\u064A ", /*#__PURE__*/React.createElement("span", {
    className: "text-ink-400 font-normal text-base latin"
  }, "\xB7 Monthly Income")), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-ink-500 mt-1"
  }, "\u0633\u062C\u0651\u0644 \u062C\u0645\u064A\u0639 \u0645\u0635\u0627\u062F\u0631 \u062F\u062E\u0644\u0643. \u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A \u064A\u062A\u062D\u062F\u0651\u062B \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B.")), /*#__PURE__*/React.createElement(Card, {
    padded: false,
    className: "px-5 py-3 flex items-center gap-5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-ink-500"
  }, "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u062F\u062E\u0644"), /*#__PURE__*/React.createElement("div", {
    className: "text-xl font-semibold tnum text-teal-700"
  }, money.fmt(total))), /*#__PURE__*/React.createElement("div", {
    className: "h-8 w-px bg-sand-200"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-ink-500"
  }, "\u0631\u0627\u062A\u0628"), /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-medium tnum text-ink-800"
  }, money.fmt(salaryTotal))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-ink-500"
  }, "\u0625\u0636\u0627\u0641\u064A"), /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-medium tnum text-ink-800"
  }, money.fmt(otherTotal))))), groups.map(g => {
    const items = state.income.filter(i => i.group === g.id);
    const sub = items.reduce((s, x) => s + (x.amount || 0), 0);
    return /*#__PURE__*/React.createElement(Card, {
      key: g.id,
      padded: false
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between px-5 py-4 border-b border-sand-200"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "w-2 h-7 rounded-full",
      style: {
        background: g.color
      }
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      className: "text-[15px] font-semibold text-ink-900"
    }, g.ar), /*#__PURE__*/React.createElement("p", {
      className: "text-[11px] latin text-ink-400"
    }, g.en))), /*#__PURE__*/React.createElement("div", {
      className: "text-right"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] text-ink-500"
    }, "\u0627\u0644\u0645\u062C\u0645\u0648\u0639 \u0627\u0644\u0641\u0631\u0639\u064A"), /*#__PURE__*/React.createElement("div", {
      className: "text-base font-semibold tnum text-ink-900"
    }, money.fmt(sub)))), /*#__PURE__*/React.createElement("div", {
      className: "divide-y divide-sand-200"
    }, items.map(i => /*#__PURE__*/React.createElement("div", {
      key: i.id,
      className: "grid grid-cols-12 gap-3 items-center px-5 py-3 hover:bg-sand-50/60 transition"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-span-12 sm:col-span-5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-[13px] text-ink-900"
    }, i.ar), /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] latin text-ink-400"
    }, i.en)), /*#__PURE__*/React.createElement("div", {
      className: "col-span-6 sm:col-span-3"
    }, /*#__PURE__*/React.createElement(Pill, {
      tone: "neutral"
    }, i.cat)), /*#__PURE__*/React.createElement("div", {
      className: "col-span-6 sm:col-span-4"
    }, /*#__PURE__*/React.createElement(MoneyInput, {
      value: i.amount,
      onChange: v => update(i.id, 'amount', v),
      sym: money.sym
    }))))), /*#__PURE__*/React.createElement("div", {
      className: "px-5 py-3 border-t border-sand-200"
    }, /*#__PURE__*/React.createElement("button", {
      className: "inline-flex items-center gap-1.5 text-[12px] text-teal-700 hover:text-teal-800"
    }, /*#__PURE__*/React.createElement(I.plus, {
      className: "w-3.5 h-3.5"
    }), " \u0625\u0636\u0627\u0641\u0629 \u0628\u0646\u062F \u062C\u062F\u064A\u062F")));
  }));
}

// ============== Expenses ==============
function ExpensesScreen({
  state,
  setState,
  money
}) {
  const total = state.expenses.reduce((s, x) => s + (x.amount || 0), 0);
  const totalIncome = state.income.reduce((s, x) => s + (x.amount || 0), 0);
  function update(id, key, val) {
    setState(s => ({
      ...s,
      expenses: s.expenses.map(i => i.id === id ? {
        ...i,
        [key]: val
      } : i)
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between flex-wrap gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-[26px] font-semibold text-ink-900"
  }, "\u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A \u0627\u0644\u0634\u0647\u0631\u064A\u0629 ", /*#__PURE__*/React.createElement("span", {
    className: "text-ink-400 font-normal text-base latin"
  }, "\xB7 Monthly Expenses")), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-ink-500 mt-1"
  }, "\u0633\u062C\u0651\u0644 \u0643\u0644 \u0628\u0646\u0648\u062F\u0643 \u0628\u0627\u0644\u062A\u0641\u0635\u064A\u0644 \u2014 \u0645\u0642\u0633\u0651\u0645\u0629 \u0625\u0644\u0649 \u0667 \u0641\u0626\u0627\u062A.")), /*#__PURE__*/React.createElement(Card, {
    padded: false,
    className: "px-5 py-3 flex items-center gap-5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-ink-500"
  }, "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A"), /*#__PURE__*/React.createElement("div", {
    className: "text-xl font-semibold tnum text-rose2-500"
  }, money.fmt(total))), /*#__PURE__*/React.createElement("div", {
    className: "h-8 w-px bg-sand-200"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-ink-500"
  }, "\u0645\u0646 \u0627\u0644\u062F\u062E\u0644"), /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-medium tnum text-ink-800"
  }, fmtPct(totalIncome ? total / totalIncome : 0))))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-2 gap-4"
  }, EXPENSE_GROUPS.map(g => {
    const items = state.expenses.filter(e => e.group === g.id);
    const sub = items.reduce((s, x) => s + (x.amount || 0), 0);
    const Icon = I[g.icon] || I.star;
    const pct = total ? sub / total : 0;
    return /*#__PURE__*/React.createElement(Card, {
      key: g.id,
      padded: false
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between px-5 py-4 border-b border-sand-200"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "w-10 h-10 rounded-xl flex items-center justify-center",
      style: {
        background: `${g.color}14`,
        color: g.color
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      className: "w-5 h-5"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      className: "text-[15px] font-semibold text-ink-900"
    }, g.ar), /*#__PURE__*/React.createElement("p", {
      className: "text-[11px] latin text-ink-400"
    }, g.en))), /*#__PURE__*/React.createElement("div", {
      className: "text-right"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-[15px] font-semibold tnum text-ink-900"
    }, money.fmt(sub)), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-ink-500 tnum"
    }, fmtPct(pct, 0), " \u0645\u0646 \u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A"))), /*#__PURE__*/React.createElement("div", {
      className: "px-5 pt-3 pb-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-1.5 rounded-full bg-sand-200 overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-full rounded-full",
      style: {
        width: `${pct * 100}%`,
        background: g.color
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "divide-y divide-sand-200 px-1"
    }, items.map(e => /*#__PURE__*/React.createElement("div", {
      key: e.id,
      className: "grid grid-cols-12 gap-2 items-center px-4 py-2.5 hover:bg-sand-50/60 transition"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-span-7 min-w-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-[13px] text-ink-900 truncate"
    }, e.ar), /*#__PURE__*/React.createElement("div", {
      className: "text-[10.5px] latin text-ink-400 truncate"
    }, e.en, " \xB7 ", e.cat)), /*#__PURE__*/React.createElement("div", {
      className: "col-span-5"
    }, /*#__PURE__*/React.createElement(MoneyInput, {
      value: e.amount,
      onChange: v => update(e.id, 'amount', v),
      sym: money.sym
    }))))), /*#__PURE__*/React.createElement("div", {
      className: "px-5 py-3 border-t border-sand-200"
    }, /*#__PURE__*/React.createElement("button", {
      className: "inline-flex items-center gap-1.5 text-[12px] text-teal-700 hover:text-teal-800"
    }, /*#__PURE__*/React.createElement(I.plus, {
      className: "w-3.5 h-3.5"
    }), " \u0625\u0636\u0627\u0641\u0629 \u0628\u0646\u062F")));
  })));
}

// ============== Debt Snowball ==============
function snowballSchedule(debts, extraPay) {
  // simulate up to 84 months, smallest balance first
  const sorted = [...debts].filter(d => d.balance > 0).sort((a, b) => a.balance - b.balance);
  let bals = sorted.map(d => d.balance);
  const rates = sorted.map(d => (d.ratePct || 0) / 12);
  const mins = sorted.map(d => d.minPay || 0);
  const monthlyTotals = [bals.reduce((s, b) => s + b, 0)];
  const perDebt = [bals.slice()];
  let months = 0;
  let bonus = extraPay;
  for (let m = 1; m <= 84; m++) {
    let extra = bonus;
    // accrue + pay min
    for (let i = 0; i < bals.length; i++) {
      if (bals[i] <= 0) continue;
      bals[i] = bals[i] * (1 + rates[i]);
      const pay = Math.min(mins[i], bals[i]);
      bals[i] -= pay;
    }
    // snowball: apply extra to smallest remaining
    for (let i = 0; i < bals.length && extra > 0; i++) {
      if (bals[i] <= 0) continue;
      const pay = Math.min(extra, bals[i]);
      bals[i] -= pay;
      extra -= pay;
      break;
    }
    // collect freed-up mins as extra payment for next month
    bonus = extraPay + mins.reduce((s, _, idx) => s + (bals[idx] <= 0 ? mins[idx] : 0), 0);
    const totalLeft = bals.reduce((s, b) => s + b, 0);
    monthlyTotals.push(totalLeft);
    perDebt.push(bals.slice());
    if (totalLeft <= 0.5 && !months) {
      months = m;
    }
    if (totalLeft <= 0.5) break;
  }
  return {
    monthsToFreedom: months || null,
    series: monthlyTotals,
    perDebt,
    sortedDebts: sorted
  };
}
function DebtScreen({
  state,
  setState,
  money
}) {
  const {
    debts,
    extraPay,
    settings
  } = state;
  function update(id, key, val) {
    setState(s => ({
      ...s,
      debts: s.debts.map(d => d.id === id ? {
        ...d,
        [key]: val
      } : d)
    }));
  }
  const sched = snowballSchedule(debts, extraPay);
  const totalDebt = debts.reduce((s, d) => s + (d.balance || 0), 0);
  const totalMin = debts.reduce((s, d) => s + (d.minPay || 0), 0);
  const intrLabel = settings.islamicMode ? 'الربح %' : 'الفائدة %';

  // interest-only (no extra payment) months
  const minOnly = snowballSchedule(debts, 0);
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-[26px] font-semibold text-ink-900"
  }, "\u062D\u0627\u0633\u0628\u0629 \u0643\u0631\u0629 \u0627\u0644\u062B\u0644\u062C ", /*#__PURE__*/React.createElement("span", {
    className: "text-ink-400 font-normal text-base latin"
  }, "\xB7 Debt Snowball")), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-ink-500 mt-1"
  }, "\u0623\u062F\u062E\u0644 \u0642\u0631\u0648\u0636\u0643 \u0648\u0634\u0627\u0647\u062F \u062E\u0637\u0629 \u0627\u0644\u0633\u062F\u0627\u062F \u0627\u0644\u0643\u0627\u0645\u0644\u0629. \u0627\u0644\u0637\u0631\u064A\u0642\u0629: \u0627\u0628\u062F\u0623 \u0628\u0623\u0635\u063A\u0631 \u0631\u0635\u064A\u062F \u0623\u0648\u0644\u0627\u064B.")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-4 gap-4"
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u062F\u064A\u0648\u0646",
    en: "Total Debt",
    value: money.fmt(totalDebt),
    tone: "ink",
    icon: /*#__PURE__*/React.createElement(I.debt, {
      className: "w-4 h-4 text-amber2-700"
    })
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "\u0627\u0644\u062F\u0641\u0639\u0629 \u0627\u0644\u0643\u0644\u064A\u0629",
    en: "Monthly Payment",
    value: money.fmt(totalMin + extraPay),
    sub: `الحد الأدنى + ${money.fmt(extraPay)} إضافي`,
    tone: "ink",
    icon: /*#__PURE__*/React.createElement(I.income, {
      className: "w-4 h-4 text-teal-700"
    })
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "\u0634\u0647\u0648\u0631 \u062D\u062A\u0649 \u0627\u0644\u062A\u062D\u0631\u0631",
    en: "Months to Freedom",
    value: sched.monthsToFreedom ? `${sched.monthsToFreedom}` : '84+',
    sub: "\u0628\u0637\u0631\u064A\u0642\u0629 \u0643\u0631\u0629 \u0627\u0644\u062B\u0644\u062C",
    tone: "good",
    icon: /*#__PURE__*/React.createElement(I.bolt, {
      className: "w-4 h-4 text-teal-700"
    })
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "\u0628\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649 \u0641\u0642\u0637",
    en: "Min-pay only",
    value: minOnly.monthsToFreedom ? `${minOnly.monthsToFreedom}` : '84+',
    sub: "\u0628\u062F\u0648\u0646 \u062F\u0641\u0639\u0629 \u0625\u0636\u0627\u0641\u064A\u0629",
    tone: "warn",
    icon: /*#__PURE__*/React.createElement(I.info, {
      className: "w-4 h-4 text-amber2-700"
    })
  })), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-end justify-between mb-3 flex-wrap gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-[15px] font-semibold text-ink-900"
  }, "\u0645\u0633\u0627\u0631 \u0633\u062F\u0627\u062F \u0627\u0644\u062F\u064A\u0648\u0646"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-ink-500 mt-0.5"
  }, "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0631\u0635\u064A\u062F \u0627\u0644\u0645\u062A\u0628\u0642\u064A \u0634\u0647\u0631\u064A\u0627\u064B")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-[12px] text-ink-600"
  }, "\u062F\u0641\u0639\u0629 \u0625\u0636\u0627\u0641\u064A\u0629 \u0634\u0647\u0631\u064A\u0629"), /*#__PURE__*/React.createElement("div", {
    className: "w-44"
  }, /*#__PURE__*/React.createElement(MoneyInput, {
    value: extraPay,
    onChange: v => setState(s => ({
      ...s,
      extraPay: v
    })),
    sym: money.sym
  })))), /*#__PURE__*/React.createElement(PayoffSpark, {
    series: sched.series,
    color: "#155E54"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-[11px] text-ink-500 mt-1 latin px-1"
  }, /*#__PURE__*/React.createElement("span", null, "\u0627\u0644\u0634\u0647\u0631 0"), /*#__PURE__*/React.createElement("span", null, "\u0627\u0644\u0634\u0647\u0631 ", Math.min(84, sched.series.length - 1)))), /*#__PURE__*/React.createElement(Card, {
    padded: false
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between px-5 py-4 border-b border-sand-200"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-[15px] font-semibold text-ink-900"
  }, "\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062F\u064A\u0648\u0646"), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-ink-500"
  }, "\u0631\u062A\u0651\u0628\u0647\u0627 \u0645\u0646 \u0627\u0644\u0623\u0635\u063A\u0631 \u0625\u0644\u0649 \u0627\u0644\u0623\u0643\u0628\u0631 \u0631\u0635\u064A\u062F\u0627\u064B \u0644\u0644\u062D\u0635\u0648\u0644 \u0639\u0644\u0649 \u0623\u062B\u0631 \u0643\u0631\u0629 \u0627\u0644\u062B\u0644\u062C")), /*#__PURE__*/React.createElement("button", {
    className: "inline-flex items-center gap-1.5 text-[12px] text-teal-700 hover:text-teal-800"
  }, /*#__PURE__*/React.createElement(I.plus, {
    className: "w-3.5 h-3.5"
  }), " \u0625\u0636\u0627\u0641\u0629 \u062F\u064A\u0646")), /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-[13px]"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "text-ink-500 text-[11px] uppercase tracking-wider"
  }, /*#__PURE__*/React.createElement("th", {
    className: "text-right py-3 px-5 font-medium"
  }, "\u0627\u0644\u062F\u064A\u0646"), /*#__PURE__*/React.createElement("th", {
    className: "text-right py-3 px-5 font-medium"
  }, "\u0627\u0644\u0646\u0648\u0639"), /*#__PURE__*/React.createElement("th", {
    className: "text-right py-3 px-5 font-medium"
  }, "\u0627\u0644\u0631\u0635\u064A\u062F"), /*#__PURE__*/React.createElement("th", {
    className: "text-right py-3 px-5 font-medium"
  }, intrLabel), /*#__PURE__*/React.createElement("th", {
    className: "text-right py-3 px-5 font-medium"
  }, "\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649"), /*#__PURE__*/React.createElement("th", {
    className: "text-right py-3 px-5 font-medium"
  }, "\u0627\u0644\u0623\u062B\u0631"))), /*#__PURE__*/React.createElement("tbody", {
    className: "divide-y divide-sand-200"
  }, [...debts].sort((a, b) => a.balance - b.balance).map((d, idx) => {
    const tone = idx === 0 ? '#155E54' : idx === 1 ? '#C99334' : '#B6493A';
    const monthlyInterest = d.balance * d.ratePct / 12;
    return /*#__PURE__*/React.createElement("tr", {
      key: d.id,
      className: "hover:bg-sand-50/60"
    }, /*#__PURE__*/React.createElement("td", {
      className: "py-3 px-5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "w-7 h-7 rounded-lg text-[12px] font-semibold flex items-center justify-center",
      style: {
        background: `${tone}14`,
        color: tone
      }
    }, idx + 1), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "text-ink-900"
    }, d.name), /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] latin text-ink-400"
    }, d.en)))), /*#__PURE__*/React.createElement("td", {
      className: "py-3 px-5"
    }, /*#__PURE__*/React.createElement(Pill, {
      tone: "neutral"
    }, d.type)), /*#__PURE__*/React.createElement("td", {
      className: "py-3 px-5 w-40"
    }, /*#__PURE__*/React.createElement(MoneyInput, {
      value: d.balance,
      onChange: v => update(d.id, 'balance', v),
      sym: money.sym
    })), /*#__PURE__*/React.createElement("td", {
      className: "py-3 px-5 w-32"
    }, /*#__PURE__*/React.createElement("div", {
      className: "relative"
    }, /*#__PURE__*/React.createElement("input", {
      type: "number",
      step: "0.5",
      value: (d.ratePct * 100).toFixed(1),
      onChange: e => update(d.id, 'ratePct', (Number(e.target.value) || 0) / 100),
      className: "w-full h-9 bg-sand-50 border border-sand-200 rounded-lg pl-3 pr-7 text-sm tnum focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100",
      dir: "ltr",
      style: {
        textAlign: 'right'
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 text-[12px]"
    }, "%"))), /*#__PURE__*/React.createElement("td", {
      className: "py-3 px-5 w-40"
    }, /*#__PURE__*/React.createElement(MoneyInput, {
      value: d.minPay,
      onChange: v => update(d.id, 'minPay', v),
      sym: money.sym
    })), /*#__PURE__*/React.createElement("td", {
      className: "py-3 px-5 text-ink-600 tnum text-[12px]"
    }, settings.islamicMode ? 'ربح' : 'فائدة', " ~ ", money.fmt(monthlyInterest, 0), "/\u0634\u0647\u0631"));
  })), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", {
    className: "bg-sand-50 font-semibold text-ink-900"
  }, /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-5"
  }, "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A"), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-5"
  }), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-5 tnum"
  }, money.fmt(totalDebt)), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-5"
  }), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-5 tnum"
  }, money.fmt(totalMin)), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-5"
  })))))));
}

// ============== Goals ==============
function GoalsScreen({
  state,
  setState,
  money
}) {
  const {
    goals,
    income,
    expenses
  } = state;
  const monthlySavings = Math.max(0, income.reduce((s, x) => s + (x.amount || 0), 0) - expenses.reduce((s, x) => s + (x.amount || 0), 0));
  function update(id, key, val) {
    setState(s => ({
      ...s,
      goals: s.goals.map(g => g.id === id ? {
        ...g,
        [key]: val
      } : g)
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between flex-wrap gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-[26px] font-semibold text-ink-900"
  }, "\u0627\u0644\u0623\u0647\u062F\u0627\u0641 \u0627\u0644\u0645\u0627\u0644\u064A\u0629 ", /*#__PURE__*/React.createElement("span", {
    className: "text-ink-400 font-normal text-base latin"
  }, "\xB7 Financial Goals")), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-ink-500 mt-1"
  }, "\u062D\u062F\u0651\u062F \u0623\u0647\u062F\u0627\u0641\u0643 \u0648\u062A\u0627\u0628\u0639 \u062A\u0642\u062F\u0651\u0645\u0643 \u0643\u0644 \u0634\u0647\u0631.")), /*#__PURE__*/React.createElement(Card, {
    padded: false,
    className: "px-5 py-3 flex items-center gap-5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-ink-500"
  }, "\u0642\u062F\u0631\u062A\u0643 \u0639\u0644\u0649 \u0627\u0644\u0627\u062F\u062E\u0627\u0631"), /*#__PURE__*/React.createElement("div", {
    className: "text-xl font-semibold tnum text-teal-700"
  }, money.fmt(monthlySavings), "/\u0634\u0647\u0631")), /*#__PURE__*/React.createElement("button", {
    className: "inline-flex items-center gap-1.5 text-[12px] bg-teal-700 text-white h-9 px-3 rounded-lg hover:bg-teal-800"
  }, /*#__PURE__*/React.createElement(I.plus, {
    className: "w-3.5 h-3.5"
  }), " \u0647\u062F\u0641 \u062C\u062F\u064A\u062F"))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
  }, goals.map(g => {
    const remaining = Math.max(0, g.target - g.saved);
    const pct = g.target ? g.saved / g.target : 0;
    const months = monthlySavings ? Math.ceil(remaining / monthlySavings) : null;
    const Icon = I[g.icon] || I.star;
    return /*#__PURE__*/React.createElement(Card, {
      key: g.id,
      className: "relative"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start justify-between"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-11 h-11 rounded-xl flex items-center justify-center",
      style: {
        background: `${g.color}14`,
        color: g.color
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      className: "w-5 h-5"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "text-[14px] font-semibold text-ink-900"
    }, g.ar), /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] latin text-ink-400"
    }, g.en))), /*#__PURE__*/React.createElement(Ring, {
      value: pct,
      color: g.color,
      size: 48,
      thickness: 5
    })), /*#__PURE__*/React.createElement("div", {
      className: "mt-4 flex items-baseline justify-between"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] text-ink-500"
    }, "\u0627\u0644\u0645\u064F\u062F\u0651\u062E\u0631"), /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] text-ink-500 tnum"
    }, fmtPct(pct, 0))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-baseline gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-[22px] font-semibold tnum text-ink-900"
    }, money.fmt(g.saved)), /*#__PURE__*/React.createElement("span", {
      className: "text-[12px] text-ink-400 tnum"
    }, "/ ", money.fmt(g.target))), /*#__PURE__*/React.createElement("div", {
      className: "mt-3"
    }, /*#__PURE__*/React.createElement(ProgressBar, {
      value: pct,
      color: g.color,
      track: "#ECE5D4",
      height: 6
    })), /*#__PURE__*/React.createElement("div", {
      className: "mt-4 flex items-center justify-between text-[11px]"
    }, /*#__PURE__*/React.createElement("div", {
      className: "space-y-0.5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-ink-500"
    }, "\u0627\u0644\u0645\u062A\u0628\u0642\u064A"), /*#__PURE__*/React.createElement("div", {
      className: "text-[13px] tnum text-ink-900"
    }, money.fmt(remaining))), /*#__PURE__*/React.createElement("div", {
      className: "space-y-0.5 text-right"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-ink-500"
    }, "\u0639\u0646\u062F \u0645\u062F\u062E\u0631\u0627\u062A\u0643 \u0627\u0644\u062D\u0627\u0644\u064A\u0629"), /*#__PURE__*/React.createElement("div", {
      className: "text-[13px] tnum text-ink-900"
    }, months !== null ? `${months} شهر` : '—'))), /*#__PURE__*/React.createElement("div", {
      className: "mt-4 pt-4 border-t border-sand-200 grid grid-cols-2 gap-2"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] text-ink-500 mb-1"
    }, "\u0647\u062F\u0641"), /*#__PURE__*/React.createElement(MoneyInput, {
      value: g.target,
      onChange: v => update(g.id, 'target', v),
      sym: money.sym,
      size: "md"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] text-ink-500 mb-1"
    }, "\u0627\u0644\u0645\u064F\u062F\u0651\u062E\u0631"), /*#__PURE__*/React.createElement(MoneyInput, {
      value: g.saved,
      onChange: v => update(g.id, 'saved', v),
      sym: money.sym,
      size: "md"
    }))));
  })));
}

// ============== Annual ==============
function AnnualScreen({
  state,
  money
}) {
  const data = ANNUAL_SEED;
  const totalInc = data.reduce((s, d) => s + d.income, 0);
  const totalExp = data.reduce((s, d) => s + d.expenses, 0);
  const totalSav = data.reduce((s, d) => s + d.savings, 0);
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-[26px] font-semibold text-ink-900"
  }, "\u0627\u0644\u0645\u062A\u062A\u0628\u0639 \u0627\u0644\u0645\u0627\u0644\u064A \u0627\u0644\u0633\u0646\u0648\u064A ", /*#__PURE__*/React.createElement("span", {
    className: "text-ink-400 font-normal text-base latin"
  }, "\xB7 Annual Tracker")), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-ink-500 mt-1"
  }, "\u0623\u062F\u0627\u0624\u0643 \u0627\u0644\u0645\u0627\u0644\u064A \u0639\u0644\u0649 \u0645\u062F\u0627\u0631 ", state.settings.year, ".")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-4"
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u062F\u062E\u0644 \u0627\u0644\u0633\u0646\u0648\u064A",
    en: "Annual Income",
    value: money.fmt(totalInc),
    tone: "ink",
    icon: /*#__PURE__*/React.createElement(I.income, {
      className: "w-4 h-4 text-teal-700"
    }),
    sub: `متوسط ${money.fmt(Math.round(totalInc / 12))}/شهر`
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A",
    en: "Annual Expenses",
    value: money.fmt(totalExp),
    tone: "ink",
    icon: /*#__PURE__*/React.createElement(I.expense, {
      className: "w-4 h-4 text-rose2-500"
    }),
    sub: `متوسط ${money.fmt(Math.round(totalExp / 12))}/شهر`
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0627\u062F\u062E\u0627\u0631",
    en: "Annual Savings",
    value: money.fmt(totalSav),
    tone: "good",
    icon: /*#__PURE__*/React.createElement(I.shield, {
      className: "w-4 h-4 text-amber2-600"
    }),
    sub: `معدّل ${fmtPct(totalSav / totalInc, 0)} من الدخل`
  })), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionLabel, {
    hint: "\u0627\u0644\u062F\u062E\u0644 (\u062A\u0631\u0643\u0648\u0627\u0632) \u0645\u0642\u0627\u0628\u0644 \u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A (\u0645\u0631\u062C\u0627\u0646\u064A)"
  }, "\u0627\u0644\u0631\u0633\u0645 \u0627\u0644\u0628\u064A\u0627\u0646\u064A \u0627\u0644\u0634\u0647\u0631\u064A"), /*#__PURE__*/React.createElement(BarsAnnual, {
    data: data,
    money: money,
    height: 240
  })), /*#__PURE__*/React.createElement(Card, {
    padded: false
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    hint: "\u0627\u0644\u0642\u064A\u0645 \u0628\u0622\u0644\u0627\u0641 \u0628\u0639\u0645\u0644\u062A\u0643"
  }, "\u062C\u062F\u0648\u0644 \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0634\u0647\u0631\u064A"), /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-[13px]"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "text-ink-500 text-[11px] uppercase tracking-wider border-b border-sand-200"
  }, /*#__PURE__*/React.createElement("th", {
    className: "text-right py-3 px-5 font-medium"
  }, "\u0627\u0644\u0634\u0647\u0631"), /*#__PURE__*/React.createElement("th", {
    className: "text-right py-3 px-5 font-medium"
  }, "\u062F\u062E\u0644"), /*#__PURE__*/React.createElement("th", {
    className: "text-right py-3 px-5 font-medium"
  }, "\u0645\u0635\u0631\u0648\u0641\u0627\u062A"), /*#__PURE__*/React.createElement("th", {
    className: "text-right py-3 px-5 font-medium"
  }, "\u0635\u0627\u0641\u064A"), /*#__PURE__*/React.createElement("th", {
    className: "text-right py-3 px-5 font-medium"
  }, "% \u0627\u0644\u0627\u062F\u062E\u0627\u0631"), /*#__PURE__*/React.createElement("th", {
    className: "text-right py-3 px-5 font-medium"
  }, "\u0646\u0633\u0628\u0629"))), /*#__PURE__*/React.createElement("tbody", {
    className: "divide-y divide-sand-200"
  }, data.map((d, i) => {
    const sav = d.savings;
    const savPct = d.income ? sav / d.income : 0;
    return /*#__PURE__*/React.createElement("tr", {
      key: i,
      className: "hover:bg-sand-50/60"
    }, /*#__PURE__*/React.createElement("td", {
      className: "py-2.5 px-5 text-ink-900"
    }, d.month), /*#__PURE__*/React.createElement("td", {
      className: "py-2.5 px-5 tnum text-ink-800"
    }, money.fmt(d.income)), /*#__PURE__*/React.createElement("td", {
      className: "py-2.5 px-5 tnum text-ink-800"
    }, money.fmt(d.expenses)), /*#__PURE__*/React.createElement("td", {
      className: `py-2.5 px-5 tnum font-medium ${sav >= 0 ? 'text-teal-700' : 'text-rose2-600'}`
    }, money.fmt(sav)), /*#__PURE__*/React.createElement("td", {
      className: "py-2.5 px-5 tnum text-ink-700"
    }, fmtPct(savPct, 0)), /*#__PURE__*/React.createElement("td", {
      className: "py-2.5 px-5 w-40"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-1.5 bg-sand-200 rounded-full overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-full rounded-full",
      style: {
        width: `${Math.max(0, Math.min(1, savPct)) * 100}%`,
        background: '#155E54'
      }
    }))));
  })), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", {
    className: "bg-sand-50 font-semibold text-ink-900"
  }, /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-5"
  }, "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A"), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-5 tnum"
  }, money.fmt(totalInc)), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-5 tnum"
  }, money.fmt(totalExp)), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-5 tnum"
  }, money.fmt(totalSav)), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-5 tnum"
  }, fmtPct(totalSav / totalInc, 0)), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-5"
  })))))));
}

// ============== Settings ==============
function SettingsScreen({
  state,
  setState,
  money
}) {
  const s = state.settings;
  function set(key, val) {
    setState(st => ({
      ...st,
      settings: {
        ...st.settings,
        [key]: val
      }
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-[26px] font-semibold text-ink-900"
  }, "\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A ", /*#__PURE__*/React.createElement("span", {
    className: "text-ink-400 font-normal text-base latin"
  }, "\xB7 Settings")), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-ink-500 mt-1"
  }, "\u0627\u0636\u0628\u0637 \u0645\u0644\u0641\u0643 \u0627\u0644\u0634\u062E\u0635\u064A \u0648\u0627\u0644\u0639\u0645\u0644\u0629 \u0648\u0627\u0644\u0634\u0647\u0631 \u0648\u0647\u062F\u0641 \u0627\u0644\u0627\u062F\u062E\u0627\u0631.")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionLabel, {
    hint: "\u0647\u0630\u0647 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u062A\u0638\u0647\u0631 \u0641\u064A \u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645"
  }, "\u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062E\u0635\u064A"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "\u0627\u0644\u0627\u0633\u0645"
  }, /*#__PURE__*/React.createElement(TInput, {
    value: s.name,
    onChange: v => set('name', v),
    placeholder: "\u0627\u0643\u062A\u0628 \u0627\u0633\u0645\u0643"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u0627\u0644\u0634\u0647\u0631"
  }, /*#__PURE__*/React.createElement("select", {
    value: s.month,
    onChange: e => set('month', e.target.value),
    className: "w-full h-9 bg-sand-50 border border-sand-200 rounded-lg px-3 text-sm focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
  }, MONTHS_AR.map(m => /*#__PURE__*/React.createElement("option", {
    key: m,
    value: m
  }, m)))), /*#__PURE__*/React.createElement(Field, {
    label: "\u0627\u0644\u0633\u0646\u0629"
  }, /*#__PURE__*/React.createElement(TInput, {
    type: "number",
    value: s.year,
    onChange: v => set('year', v)
  })))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionLabel, {
    hint: "\u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u0628\u0627\u0644\u063A \u062A\u064F\u0639\u0631\u0636 \u0628\u0647\u0630\u0647 \u0627\u0644\u0639\u0645\u0644\u0629"
  }, "\u0627\u0644\u0639\u0645\u0644\u0629 \u0648\u0627\u0644\u0645\u0646\u0637\u0642\u0629"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "\u0627\u0644\u0639\u0645\u0644\u0629"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-4 gap-2"
  }, CURRENCIES.map(c => {
    const active = c.code === s.currency;
    return /*#__PURE__*/React.createElement("button", {
      key: c.code,
      onClick: () => set('currency', c.code),
      className: `text-center p-2 rounded-lg border text-[12px] transition ${active ? 'bg-teal-700 text-white border-teal-700' : 'bg-sand-50 border-sand-200 hover:border-sand-300 text-ink-700'}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "font-semibold latin"
    }, c.code), /*#__PURE__*/React.createElement("div", {
      className: `text-[10px] mt-0.5 ${active ? 'text-teal-100' : 'text-ink-500'}`
    }, c.symbol));
  }))))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionLabel, {
    hint: "\u0646\u0633\u0628\u0629 \u0645\u0646 \u0635\u0627\u0641\u064A \u0627\u0644\u062F\u062E\u0644 \u062A\u0630\u0647\u0628 \u0644\u0644\u0627\u062F\u062E\u0627\u0631"
  }, "\u0647\u062F\u0641 \u0627\u0644\u0627\u062F\u062E\u0627\u0631"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement(Field, {
    label: `النسبة المستهدفة (${fmtPct(s.savingsGoalPct)})`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0",
    max: "0.6",
    step: "0.05",
    value: s.savingsGoalPct,
    onChange: e => set('savingsGoalPct', Number(e.target.value)),
    className: "w-full accent-teal-700"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-[10px] text-ink-400 latin tnum mt-1"
  }, /*#__PURE__*/React.createElement("span", null, "0%"), /*#__PURE__*/React.createElement("span", null, "30%"), /*#__PURE__*/React.createElement("span", null, "60%"))))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionLabel, {
    hint: "\u0644\u0644\u0645\u0633\u0644\u0645\u064A\u0646 \u2014 \u062A\u0638\u0647\u0631 \u0627\u0644\u0632\u0643\u0627\u0629 \u0648\u062A\u064F\u0633\u062A\u0628\u062F\u0644 '\u0627\u0644\u0641\u0627\u0626\u062F\u0629' \u0628\u0640'\u0627\u0644\u0631\u0628\u062D'"
  }, "\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0625\u0633\u0644\u0627\u0645\u064A\u0629"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "\u0646\u0635\u0627\u0628 \u0627\u0644\u0632\u0643\u0627\u0629"
  }, /*#__PURE__*/React.createElement(MoneyInput, {
    value: s.zakatNisab,
    onChange: v => set('zakatNisab', v),
    sym: money.sym
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0625\u0633\u0644\u0627\u0645\u064A"
  }, /*#__PURE__*/React.createElement(Toggle, {
    value: s.islamicMode,
    onChange: v => set('islamicMode', v),
    label: s.islamicMode ? 'مفعّل' : 'معطّل'
  })))), /*#__PURE__*/React.createElement(Card, {
    className: "lg:col-span-2"
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    hint: "\u0627\u0644\u0642\u064A\u0645 \u0627\u0644\u062A\u0642\u0631\u064A\u0628\u064A\u0629 \u0645\u0642\u0627\u0628\u0644 \u0627\u0644\u062F\u0648\u0644\u0627\u0631 \u0627\u0644\u0623\u0645\u0631\u064A\u0643\u064A"
  }, "\u0627\u0644\u0639\u0645\u0644\u0627\u062A \u0627\u0644\u0645\u062F\u0639\u0648\u0645\u0629"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 md:grid-cols-4 gap-3"
  }, CURRENCIES.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.code,
    className: "flex items-center justify-between p-3 rounded-lg bg-sand-50 border border-sand-200"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[13px] text-ink-900"
  }, c.name), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] latin text-ink-400"
  }, c.code, " \xB7 ", c.symbol)), /*#__PURE__*/React.createElement("div", {
    className: "text-[12px] tnum text-ink-600 latin"
  }, c.usd, " ", /*#__PURE__*/React.createElement("span", {
    className: "text-ink-400"
  }, "/USD"))))))));
}
function Field({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[12px] text-ink-600 mb-1.5"
  }, label), children);
}
function Toggle({
  value,
  onChange,
  label
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => onChange(!value),
    className: "inline-flex items-center gap-3 group"
  }, /*#__PURE__*/React.createElement("span", {
    className: `relative w-11 h-6 rounded-full transition ${value ? 'bg-teal-700' : 'bg-sand-300'}`
  }, /*#__PURE__*/React.createElement("span", {
    className: `absolute top-0.5 ${value ? 'right-0.5' : 'right-[22px]'} w-5 h-5 bg-white rounded-full shadow transition-all`
  })), /*#__PURE__*/React.createElement("span", {
    className: "text-[13px] text-ink-700"
  }, label));
}
Object.assign(window, {
  DashboardScreen,
  IncomeScreen,
  ExpensesScreen,
  DebtScreen,
  GoalsScreen,
  AnnualScreen,
  SettingsScreen,
  snowballSchedule
});