import {
  extractFirstPhone,
  extractPreorderFormFields,
  subjectMentionsOrder,
} from 'src/modules/custom/order-email-processor/utils/parse-email-content.util';

describe('subjectMentionsOrder', () => {
  it.each([
    ['Заказ Magnum Vega 65 — Иван Иванов', true],
    ['Заказ', true],
    ['заказы за неделю', false],
    ['заказчик пишет', false],
    ['Hello world', false],
    [null, false],
    ['', false],
  ])('returns %p for subject "%s"', (subject, expected) => {
    expect(subjectMentionsOrder(subject as string | null)).toBe(expected);
  });
});

describe('extractFirstPhone', () => {
  it('strips formatting and keeps the leading +', () => {
    expect(extractFirstPhone('звоните +7 (999) 123-45-67 пожалуйста')).toBe(
      '+79991234567',
    );
  });

  it('returns null when text has no phone', () => {
    expect(extractFirstPhone('никаких номеров')).toBeNull();
  });
});

describe('extractPreorderFormFields', () => {
  const validBody = [
    '--- VEGA-PREORDER-FORM v1 ---',
    'Модель: Vega 65',
    'Имя: Иван Иванов',
    'Email: ivan@example.com',
    'Телефон: +7 (999) 123-45-67',
    'Город: Москва',
    'Компания: ООО Альфа',
    '',
    'Комментарий:',
    'Хочу принтер к лету',
    '',
    '--- VEGA-PREORDER-FORM v1 ---',
  ].join('\n');

  it('parses real customer fields out of a marker-bracketed body', () => {
    expect(extractPreorderFormFields(validBody)).toEqual({
      email: 'ivan@example.com',
      name: 'Иван Иванов',
      phone: '+79991234567',
      model: 'Vega 65',
    });
  });

  it('lowercases the email', () => {
    const body = validBody.replace('ivan@example.com', 'IVAN@Example.COM');

    expect(extractPreorderFormFields(body)?.email).toBe('ivan@example.com');
  });

  it('returns null when the marker is absent', () => {
    const body = validBody.replace(/--- VEGA-PREORDER-FORM v1 ---/g, '');

    expect(extractPreorderFormFields(body)).toBeNull();
  });

  it('returns null when email is missing', () => {
    const body = validBody.replace(/^Email:.*$/m, '');

    expect(extractPreorderFormFields(body)).toBeNull();
  });

  it('returns null when email is malformed', () => {
    const body = validBody.replace('ivan@example.com', 'not-an-email');

    expect(extractPreorderFormFields(body)).toBeNull();
  });

  it('returns null when name is missing', () => {
    const body = validBody.replace(/^Имя:.*$/m, 'Имя:');

    expect(extractPreorderFormFields(body)).toBeNull();
  });

  it('returns phone=null when phone field is too short', () => {
    const body = validBody.replace('+7 (999) 123-45-67', '12345');

    expect(extractPreorderFormFields(body)?.phone).toBeNull();
  });

  it('handles the optional model being absent', () => {
    const body = validBody.replace(/^Модель:.*$/m, '');

    expect(extractPreorderFormFields(body)?.model).toBeNull();
  });

  it('returns null for empty input', () => {
    expect(extractPreorderFormFields(null)).toBeNull();
    expect(extractPreorderFormFields('')).toBeNull();
  });
});
