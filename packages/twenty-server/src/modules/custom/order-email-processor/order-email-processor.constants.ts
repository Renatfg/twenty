export const ORDER_EMAIL_EVENT = 'order-email-processor.messages-saved';

export const KLIENT_OBJECT_NAME = 'klient';

// Matches "заказ" as a standalone word: surrounded by anything that is not
// a Unicode letter, digit, or underscore. Catches "Заказ", "новый заказ #1",
// but NOT "заказчик", "перезаказ", "заказы".
export const ORDER_KEYWORD_REGEX =
  /(^|[^\p{L}\p{N}_])заказ([^\p{L}\p{N}_]|$)/iu;

// Russian-style phones (+7… / 8…) with optional spaces, dashes, parens.
// Requires at least 10 digits total to avoid catching small numbers.
export const PHONE_REGEX =
  /(?:\+7|\b8)[\s\-()]*\d(?:[\s\-()]*\d){9}/u;

// First http(s) URL in the body.
export const URL_REGEX = /https?:\/\/[^\s<>"'`)]+/u;

// Heuristics for extracting a person name from email body. First match wins.
export const NAME_FROM_BODY_REGEXES: RegExp[] = [
  /(?:меня\s+зовут|имя\s*[:\-])\s+([А-ЯЁA-Z][\p{L}'\-]+(?:\s+[А-ЯЁA-Z][\p{L}'\-]+){0,2})/iu,
  /с\s+уважением,?\s*([А-ЯЁA-Z][\p{L}'\-]+(?:\s+[А-ЯЁA-Z][\p{L}'\-]+){0,2})/iu,
];
