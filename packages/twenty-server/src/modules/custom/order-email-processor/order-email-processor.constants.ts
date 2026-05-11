export const ORDER_EMAIL_EVENT = 'order-email-processor.messages-saved';

export const KLIENT_OBJECT_NAME = 'klient';

// Matches "заказ" as a standalone word: surrounded by anything that is not
// a Unicode letter, digit, or underscore. Catches "Заказ", "новый заказ #1",
// but NOT "заказчик", "перезаказ", "заказы".
export const ORDER_KEYWORD_REGEX =
  /(^|[^\p{L}\p{N}_])заказ([^\p{L}\p{N}_]|$)/iu;

// Russian-style phones (+7… / 8…) with optional spaces, dashes, parens.
// Requires at least 10 digits total to avoid catching small numbers.
export const PHONE_REGEX = /(?:\+7|\b8)[\s\-()]*\d(?:[\s\-()]*\d){9}/u;

// First http(s) URL in the body.
export const URL_REGEX = /https?:\/\/[^\s<>"'`)]+/u;

// Heuristics for extracting a person name from email body. First match wins.
export const NAME_FROM_BODY_REGEXES: RegExp[] = [
  /(?:меня\s+зовут|имя\s*[:\-])\s+([А-ЯЁA-Z][\p{L}'\-]+(?:\s+[А-ЯЁA-Z][\p{L}'\-]+){0,2})/iu,
  /с\s+уважением,?\s*([А-ЯЁA-Z][\p{L}'\-]+(?:\s+[А-ЯЁA-Z][\p{L}'\-]+){0,2})/iu,
];

// Marker that the vega-preorder lander writes at the start AND end of every
// preorder email body. Presence of this marker switches us from regex
// guesswork to direct field parsing: real customer email/имя/phone come from
// the body, not the From envelope (which is the SMTP relay's own address).
export const PREORDER_FORM_MARKER = '--- VEGA-PREORDER-FORM v1 ---';

// `KEY: value` lines emitted by the form. `\s` would span newlines on
// missing-value lines and steal the next line's content — hence `[^\S\n]`
// (whitespace minus newline) for the inline padding.
export const PREORDER_FIELD_REGEXES = {
  email: /^Email:[^\S\n]*(.+?)[^\S\n]*$/im,
  name: /^Имя:[^\S\n]*(.+?)[^\S\n]*$/im,
  phone: /^Телефон:[^\S\n]*(.+?)[^\S\n]*$/im,
  model: /^Модель:[^\S\n]*(.+?)[^\S\n]*$/im,
} as const;
