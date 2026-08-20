/**
 * Deterministic B2B Customer Trade Names Dictionary & Generator
 * Maps technical customer IDs (e.g. C_773326, CUST-008, C_937594) to realistic Iranian textile mill / factory names.
 */

const KNOWN_CUSTOMER_NAMES: Record<string, string> = {
  'C_937594': 'نساجی نگین بافت کاشان',
  'C_245948': 'ریسندگی و بافندگی اطلس یزد',
  'C_633661': 'صنایع پارچه تریکو البرز',
  'C_535756': 'بافندگی پرنیان مشهد',
  'C_683666': 'نساجی تار و پود اصفهان',
  'C_773326': 'صنایع نساجی سبلان پارچه',
  'C_948070': 'ریسندگی بهارستان قزوین',
  'C_101842': 'پارچه‌بافی کیان تبریز',
  'C_672706': 'نساجی زرین تبار قم',
  'C_746892': 'تکمیل و رنگرزی ماهان',
  'C_980957': 'صنایع الیاف و نخ فلات',
  'C_169974': 'بافندگی دیبا تریکو',
  'CUST-001': 'نساجی نگین بافت کاشان',
  'CUST-002': 'ریسندگی و بافندگی اطلس یزد',
  'CUST-003': 'صنایع پارچه تریکو البرز',
  'CUST-004': 'بافندگی پرنیان مشهد',
  'CUST-005': 'نساجی تار و پود اصفهان',
  'CUST-006': 'ریسندگی بهارستان قزوین',
  'CUST-007': 'پارچه‌بافی کیان تبریز',
  'CUST-008': 'صنایع نساجی سبلان پارچه',
  'CUST-009': 'نساجی زرین تبار قم',
  'CUST-010': 'تکمیل و رنگرزی ماهان',
  'CUST-011': 'صنایع الیاف و نخ فلات',
  'CUST-012': 'بافندگی دیبا تریکو',
  'CUST-013': 'نساجی مهربافت گیلان',
  'CUST-014': 'تریکو بافان الوند',
  'CUST-015': 'ریسندگی ممتاز سمنان',
};

const PREFIXES = [
  'نساجی',
  'ریسندگی',
  'بافندگی',
  'صنایع نساجی',
  'پارچه‌بافی',
  'تریکو',
  'تکمیل پارچه',
];

const BRAND_NAMES = [
  'نگین',
  'اطلس',
  'سپهر',
  'پرتو',
  'زرین',
  'دیبا',
  'سبلان',
  'مهربافت',
  'کیان',
  'پرنیان',
  'فلات',
  'پویان',
  'تندیس',
  'روشن',
  'الوند',
];

const CITIES = [
  'کاشان',
  'یزد',
  'اصفهان',
  'مشهد',
  'تبریز',
  'قزوین',
  'البرز',
  'قم',
  'سمنان',
  'گیلان',
];

export function getCustomerTradeName(customerId: string | null | undefined): string {
  if (!customerId) return 'مشتری نامشخص';
  if (KNOWN_CUSTOMER_NAMES[customerId]) {
    return KNOWN_CUSTOMER_NAMES[customerId];
  }

  // Deterministic hash-based name generator
  let hash = 0;
  for (let i = 0; i < customerId.length; i++) {
    hash = (hash << 5) - hash + customerId.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const prefix = PREFIXES[absHash % PREFIXES.length];
  const brand = BRAND_NAMES[(absHash >> 3) % BRAND_NAMES.length];
  const city = CITIES[(absHash >> 6) % CITIES.length];

  return `${prefix} ${brand} ${city}`;
}
