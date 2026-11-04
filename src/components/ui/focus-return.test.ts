import { afterEach, describe, expect, it } from 'vitest';
import { closeTheMenuAround, focusReturnTargetOf, returnFocusTo } from './focus-return';

afterEach(() => {
  document.body.replaceChildren();
});

function menuWithAnItem() {
  const menu = document.createElement('details');
  const summary = document.createElement('summary');
  const item = document.createElement('button');
  menu.append(summary, item);
  document.body.append(menu);
  return { summary, item };
}

describe('focus return', () => {
  it('sends the focus back to the menu button when the opener sat inside a menu', () => {
    const { summary, item } = menuWithAnItem();

    expect(focusReturnTargetOf(item)).toBe(summary);
  });

  it('sends the focus back to the opener itself when it stood alone', () => {
    const opener = document.createElement('button');
    document.body.append(opener);

    expect(focusReturnTargetOf(opener)).toBe(opener);
  });

  it('closes the menu an element sits in, and nothing when it sits in none', () => {
    const { item } = menuWithAnItem();
    const menu = item.closest('details');
    if (menu === null) {
      throw new Error('no menu');
    }
    menu.open = true;
    const alone = document.createElement('button');
    document.body.append(alone);

    closeTheMenuAround(item);
    closeTheMenuAround(alone);

    expect(menu.open).toBe(false);
  });

  it('focuses the target that is still on the page', () => {
    const opener = document.createElement('button');
    document.body.append(opener);

    returnFocusTo(opener);

    expect(document.activeElement).toBe(opener);
  });

  it('leaves the focus alone when there is no target or it left the page', () => {
    const elsewhere = document.createElement('button');
    document.body.append(elsewhere);
    elsewhere.focus();

    returnFocusTo(null);
    returnFocusTo(document.createElement('button'));

    expect(document.activeElement).toBe(elsewhere);
  });
});
