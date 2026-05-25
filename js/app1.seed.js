// Sample seed data matching the structure of ميزانيتي_Pro.xlsx
// Bilingual labels (Arabic | English) like the original.

const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const CURRENCIES = [{
  code: 'SAR',
  name: 'ريال سعودي',
  symbol: 'ر.س',
  usd: 3.75
}, {
  code: 'AED',
  name: 'درهم إماراتي',
  symbol: 'د.إ',
  usd: 3.67
}, {
  code: 'KWD',
  name: 'دينار كويتي',
  symbol: 'د.ك',
  usd: 0.31
}, {
  code: 'QAR',
  name: 'ريال قطري',
  symbol: 'ر.ق',
  usd: 3.64
}, {
  code: 'EGP',
  name: 'جنيه مصري',
  symbol: 'ج.م',
  usd: 49
}, {
  code: 'JOD',
  name: 'دينار أردني',
  symbol: 'د.أ',
  usd: 0.71
}, {
  code: 'USD',
  name: 'دولار أمريكي',
  symbol: '$',
  usd: 1.00
}];
const INITIAL_SETTINGS = {
  name: 'سارة الغامدي',
  currency: 'SAR',
  month: 'يناير',
  year: 2026,
  savingsGoalPct: 0.20,
  zakatNisab: 15000,
  islamicMode: true
};
const INCOME_SEED = [{
  id: 'i1',
  group: 'salary',
  ar: 'الراتب الأساسي',
  en: 'Basic Salary',
  cat: 'راتب',
  amount: 18000
}, {
  id: 'i2',
  group: 'salary',
  ar: 'بدل السكن',
  en: 'Housing Allowance',
  cat: 'بدلات',
  amount: 3000
}, {
  id: 'i3',
  group: 'salary',
  ar: 'بدل النقل',
  en: 'Transport Allowance',
  cat: 'بدلات',
  amount: 800
}, {
  id: 'i4',
  group: 'salary',
  ar: 'بدل الاتصالات',
  en: 'Telecom Allowance',
  cat: 'بدلات',
  amount: 300
}, {
  id: 'i5',
  group: 'salary',
  ar: 'أعمال إضافية / بونص',
  en: 'Bonus / OT',
  cat: 'راتب',
  amount: 1200
}, {
  id: 'i6',
  group: 'other',
  ar: 'أعمال جانبية / فري لانس',
  en: 'Freelance',
  cat: 'إضافي',
  amount: 2500
}, {
  id: 'i7',
  group: 'other',
  ar: 'ريع عقاري',
  en: 'Rental Income',
  cat: 'استثمار',
  amount: 2200
}, {
  id: 'i8',
  group: 'other',
  ar: 'أرباح وعوائد',
  en: 'Dividends',
  cat: 'استثمار',
  amount: 600
}, {
  id: 'i9',
  group: 'other',
  ar: 'مساعدات عائلية',
  en: 'Family Support',
  cat: 'أخرى',
  amount: 0
}, {
  id: 'i10',
  group: 'other',
  ar: 'أخرى',
  en: 'Other',
  cat: 'أخرى',
  amount: 0
}];
const EXPENSE_GROUPS = [{
  id: 'housing',
  ar: 'السكن والمرافق',
  en: 'Housing & Utilities',
  icon: 'home',
  color: '#155E54'
}, {
  id: 'transport',
  ar: 'المواصلات',
  en: 'Transportation',
  icon: 'car',
  color: '#2E6E9C'
}, {
  id: 'food',
  ar: 'الطعام والمشتريات',
  en: 'Food & Groceries',
  icon: 'cart',
  color: '#A87723'
}, {
  id: 'family',
  ar: 'الأسرة والمجتمع',
  en: 'Family & Social',
  icon: 'heart',
  color: '#9B3C7A'
}, {
  id: 'tech',
  ar: 'الاتصالات والترفيه',
  en: 'Tech & Entertainment',
  icon: 'wifi',
  color: '#4D6C2F'
}, {
  id: 'debts',
  ar: 'الأقساط والزكاة',
  en: 'Payments & Zakat',
  icon: 'mosque',
  color: '#7C4B2E'
}, {
  id: 'other',
  ar: 'أخرى ومدخرات',
  en: 'Other & Savings',
  icon: 'star',
  color: '#5E5E5E'
}];
const EXPENSE_SEED = [
// Housing
{
  id: 'e1',
  group: 'housing',
  ar: 'الإيجار / قسط البيت',
  en: 'Rent / Mortgage',
  cat: 'سكن',
  amount: 4500
}, {
  id: 'e2',
  group: 'housing',
  ar: 'الكهرباء',
  en: 'Electricity',
  cat: 'مرافق',
  amount: 380
}, {
  id: 'e3',
  group: 'housing',
  ar: 'الماء',
  en: 'Water',
  cat: 'مرافق',
  amount: 120
}, {
  id: 'e4',
  group: 'housing',
  ar: 'الإنترنت',
  en: 'Internet',
  cat: 'مرافق',
  amount: 350
}, {
  id: 'e5',
  group: 'housing',
  ar: 'الصيانة',
  en: 'Maintenance',
  cat: 'سكن',
  amount: 200
},
// Transport
{
  id: 'e6',
  group: 'transport',
  ar: 'وقود السيارة',
  en: 'Fuel',
  cat: 'مواصلات',
  amount: 600
}, {
  id: 'e7',
  group: 'transport',
  ar: 'قسط السيارة',
  en: 'Car Payment',
  cat: 'أقساط',
  amount: 1450
}, {
  id: 'e8',
  group: 'transport',
  ar: 'تأمين السيارة',
  en: 'Car Insurance',
  cat: 'تأمين',
  amount: 220
}, {
  id: 'e9',
  group: 'transport',
  ar: 'تاكسي / أوبر',
  en: 'Taxi / Uber',
  cat: 'مواصلات',
  amount: 180
},
// Food
{
  id: 'e10',
  group: 'food',
  ar: 'البقالة والسوبرماركت',
  en: 'Groceries',
  cat: 'طعام',
  amount: 2200
}, {
  id: 'e11',
  group: 'food',
  ar: 'المطاعم',
  en: 'Dining Out',
  cat: 'طعام',
  amount: 850
}, {
  id: 'e12',
  group: 'food',
  ar: 'طلبات التوصيل',
  en: 'Food Delivery',
  cat: 'طعام',
  amount: 420
},
// Family
{
  id: 'e13',
  group: 'family',
  ar: 'دعم الوالدين',
  en: 'Support for Parents',
  cat: 'عائلة',
  amount: 2000
}, {
  id: 'e14',
  group: 'family',
  ar: 'التعليم والمدارس',
  en: 'Education',
  cat: 'عائلة',
  amount: 1500
}, {
  id: 'e15',
  group: 'family',
  ar: 'أفراح وتبرعات',
  en: 'Weddings / Gifts',
  cat: 'اجتماعي',
  amount: 250
}, {
  id: 'e16',
  group: 'family',
  ar: 'رعاية صحية',
  en: 'Healthcare',
  cat: 'صحة',
  amount: 180
},
// Tech
{
  id: 'e17',
  group: 'tech',
  ar: 'الجوال',
  en: 'Mobile Plan',
  cat: 'اتصالات',
  amount: 180
}, {
  id: 'e18',
  group: 'tech',
  ar: 'اشتراكات',
  en: 'Subscriptions',
  cat: 'ترفيه',
  amount: 240
}, {
  id: 'e19',
  group: 'tech',
  ar: 'ملابس وتسوق',
  en: 'Clothes / Shopping',
  cat: 'تسوق',
  amount: 600
},
// Debts / Zakat
{
  id: 'e20',
  group: 'debts',
  ar: 'أقساط بنكية',
  en: 'Bank Loan Payments',
  cat: 'أقساط',
  amount: 950
}, {
  id: 'e21',
  group: 'debts',
  ar: 'BNPL (Tabby/Tamara)',
  en: 'BNPL',
  cat: 'أقساط',
  amount: 320
}, {
  id: 'e22',
  group: 'debts',
  ar: 'زكاة المال',
  en: 'Zakat',
  cat: 'زكاة',
  amount: 0
}, {
  id: 'e23',
  group: 'debts',
  ar: 'صدقة وخيرية',
  en: 'Sadaqa / Charity',
  cat: 'خيرية',
  amount: 400
},
// Other
{
  id: 'e24',
  group: 'other',
  ar: 'مدخرات وطوارئ',
  en: 'Savings / Emergency',
  cat: 'مدخرات',
  amount: 2000
}, {
  id: 'e25',
  group: 'other',
  ar: 'أخرى',
  en: 'Other',
  cat: 'أخرى',
  amount: 150
}];
const DEBTS_SEED = [{
  id: 'd1',
  name: 'مرابحة السيارة',
  en: 'Auto Murabaha',
  type: 'مرابحة سيارة',
  balance: 25000,
  ratePct: 0.04,
  minPay: 700
}, {
  id: 'd2',
  name: 'قرض شخصي',
  en: 'Personal Finance',
  type: 'مرابحة شخصية',
  balance: 15000,
  ratePct: 0.08,
  minPay: 500
}, {
  id: 'd3',
  name: 'بطاقة ائتمانية',
  en: 'Credit Card',
  type: 'بطاقة ائتمانية',
  balance: 5000,
  ratePct: 0.18,
  minPay: 250
}, {
  id: 'd4',
  name: 'قرض عائلي',
  en: 'Family Loan',
  type: 'قرض عائلي',
  balance: 8000,
  ratePct: 0.00,
  minPay: 400
}];
const EXTRA_PAYMENT = 500;
const GOALS_SEED = [{
  id: 'g1',
  ar: 'صندوق الطوارئ',
  en: 'Emergency Fund',
  target: 50000,
  saved: 18500,
  icon: 'shield',
  color: '#155E54'
}, {
  id: 'g2',
  ar: 'دفعة أولى سيارة',
  en: 'Car Down Payment',
  target: 30000,
  saved: 9200,
  icon: 'car',
  color: '#2E6E9C'
}, {
  id: 'g3',
  ar: 'رحلة / إجازة',
  en: 'Trip / Vacation',
  target: 10000,
  saved: 6400,
  icon: 'plane',
  color: '#A87723'
}, {
  id: 'g4',
  ar: 'حفل زواج',
  en: 'Wedding',
  target: 60000,
  saved: 12000,
  icon: 'sparkle',
  color: '#9B3C7A'
}, {
  id: 'g5',
  ar: 'دفعة أولى منزل',
  en: 'Home Down Payment',
  target: 200000,
  saved: 42000,
  icon: 'home',
  color: '#0E4940'
}, {
  id: 'g6',
  ar: 'حج / عمرة',
  en: 'Hajj / Umrah',
  target: 25000,
  saved: 8500,
  icon: 'mosque',
  color: '#7C4B2E'
}];

// Annual tracker — 12 months of income / expenses / savings
const ANNUAL_SEED = (() => {
  const baseInc = 28800;
  const baseExp = 19900;
  // realistic-feeling drift around year
  const incVar = [1.00, 0.98, 1.02, 1.00, 1.05, 1.10, 1.08, 0.95, 1.00, 1.03, 1.06, 1.20]; // Dec bonus
  const expVar = [0.95, 0.92, 1.00, 1.04, 1.02, 1.10, 1.15, 1.05, 1.00, 1.02, 1.08, 1.18]; // summer & dec
  return MONTHS_AR.map((m, i) => {
    const income = Math.round(baseInc * incVar[i]);
    const expenses = Math.round(baseExp * expVar[i]);
    return {
      month: m,
      income,
      expenses,
      savings: income - expenses
    };
  });
})();

// Bilingual UI strings
const STR = {
  appName: 'ميزانيتي',
  appNameEn: 'My Budget',
  greeting: name => `أهلاً، ${name}`,
  sections: {
    dashboard: 'لوحة التحكم',
    income: 'الدخل',
    expenses: 'المصروفات',
    debt: 'كرة الثلج',
    goals: 'الأهداف',
    annual: 'المتتبع السنوي',
    settings: 'الإعدادات'
  }
};
Object.assign(window, {
  MONTHS_AR,
  CURRENCIES,
  INITIAL_SETTINGS,
  INCOME_SEED,
  EXPENSE_GROUPS,
  EXPENSE_SEED,
  DEBTS_SEED,
  EXTRA_PAYMENT,
  GOALS_SEED,
  ANNUAL_SEED,
  STR
});