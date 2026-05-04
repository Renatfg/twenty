import {
  NAME_FROM_BODY_REGEXES,
  ORDER_KEYWORD_REGEX,
  PHONE_REGEX,
  URL_REGEX,
} from 'src/modules/custom/order-email-processor/order-email-processor.constants';

export const subjectMentionsOrder = (subject: string | null): boolean => {
  if (!subject) return false;

  return ORDER_KEYWORD_REGEX.test(subject);
};

export const extractFirstPhone = (text: string | null): string | null => {
  if (!text) return null;
  const match = text.match(PHONE_REGEX);

  if (!match) return null;

  // Normalize: keep only digits and a leading '+'.
  const raw = match[0];
  const digits = raw.replace(/[^\d]/g, '');

  if (digits.length < 10) return null;

  return raw.startsWith('+') ? `+${digits}` : digits;
};

export const extractFirstUrl = (text: string | null): string | null => {
  if (!text) return null;
  const match = text.match(URL_REGEX);

  return match ? match[0] : null;
};

export const extractNameFromBody = (text: string | null): string | null => {
  if (!text) return null;

  for (const regex of NAME_FROM_BODY_REGEXES) {
    const match = text.match(regex);

    if (match?.[1]) return match[1].trim();
  }

  return null;
};

// Pick a sensible name: body heuristic first, then sender's display name,
// then the local part of the email (e.g. "ivan" from "ivan@example.com").
export const pickClientName = ({
  body,
  displayName,
  email,
}: {
  body: string | null;
  displayName: string | null | undefined;
  email: string | null | undefined;
}): string => {
  const fromBody = extractNameFromBody(body);

  if (fromBody) return fromBody;

  const trimmedDisplayName = displayName?.trim();

  if (trimmedDisplayName) return trimmedDisplayName;

  if (email) {
    const localPart = email.split('@')[0] ?? email;

    return localPart;
  }

  return 'Без имени';
};
