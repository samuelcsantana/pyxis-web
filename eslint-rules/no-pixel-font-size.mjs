const PIXEL_FONT_SIZE = /(?:^|[\s:!])text-\[(?:length:)?\d*\.?\d+px\]/;

function reportPixelSize(context, node, text) {
  if (PIXEL_FONT_SIZE.test(text)) {
    context.report({ node, messageId: 'pixelFontSize' });
  }
}

export const noPixelFontSize = {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow font sizes in pixels in Tailwind classes' },
    schema: [],
    messages: {
      pixelFontSize:
        'Font sizes in px ignore the reader’s default text size. Use a rem token from globals.css (text-micro, text-caption, text-callout, text-title, text-wordmark, text-figure, text-figure-lg) or a Tailwind size.',
    },
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value === 'string') {
          reportPixelSize(context, node, node.value);
        }
      },
      TemplateElement(node) {
        reportPixelSize(context, node, node.value.raw);
      },
    };
  },
};
