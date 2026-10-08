const LETTER = /\p{L}/u;

const TEXT_ATTRIBUTES = new Set([
  'alt',
  'aria-description',
  'aria-label',
  'aria-placeholder',
  'aria-roledescription',
  'aria-valuetext',
  'label',
  'placeholder',
  'subtitle',
  'title',
]);

function isWords(text, allowed) {
  const trimmed = text.trim();
  return LETTER.test(trimmed) && !allowed.has(trimmed);
}

function literalTexts(node) {
  switch (node.type) {
    case 'Literal':
      return typeof node.value === 'string' ? [node.value] : [];
    case 'TemplateLiteral':
      return node.quasis.map((quasi) => quasi.value.cooked ?? '');
    case 'ConditionalExpression':
      return [...literalTexts(node.consequent), ...literalTexts(node.alternate)];
    case 'LogicalExpression':
      return literalTexts(node.right);
    case 'JSXExpressionContainer':
      return literalTexts(node.expression);
    default:
      return [];
  }
}

function attributeName(node) {
  return node.name.type === 'JSXNamespacedName' ? node.name.name.name : node.name.name;
}

export const noLiteralJsxText = {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow interface text written in JSX instead of the dictionary' },
    schema: [
      {
        type: 'object',
        properties: { allow: { type: 'array', items: { type: 'string' } } },
        additionalProperties: false,
      },
    ],
    messages: {
      literalText:
        'Interface text comes from the dictionary (src/i18n/messages/en.ts) through getI18n(), getTranslator() or useT(), so every language can show it.',
    },
  },
  create(context) {
    const allowed = new Set(context.options[0]?.allow ?? []);
    const reportWords = (node, texts) => {
      if (texts.some((text) => isWords(text, allowed))) {
        context.report({ node, messageId: 'literalText' });
      }
    };
    return {
      JSXText(node) {
        reportWords(node, [node.value]);
      },
      JSXExpressionContainer(node) {
        if (node.parent.type !== 'JSXAttribute') {
          reportWords(node, literalTexts(node.expression));
        }
      },
      JSXAttribute(node) {
        if (node.value !== null && TEXT_ATTRIBUTES.has(attributeName(node))) {
          reportWords(node, literalTexts(node.value));
        }
      },
    };
  },
};
