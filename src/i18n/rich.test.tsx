import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { rich, type RichSlots } from './rich';

const SLOTS: RichSlots = {
  code: (text) => <code>{text}</code>,
  strong: (text) => <strong>{text}</strong>,
  email: () => <strong>owner@demo-store.example</strong>,
};

function html(template: string, slots: RichSlots = SLOTS): string {
  return render(<p>{rich(template, slots)}</p>).container.innerHTML;
}

describe('rich', () => {
  it('returns a message without tags as its text', () => {
    expect(rich('No event arrived in this period.', SLOTS)).toEqual([
      'No event arrived in this period.',
    ]);
    expect(rich('', SLOTS)).toEqual([]);
  });

  it('fills a tag around text with the element its slot builds', () => {
    expect(html('Run <code>admin:grant</code> for your email.')).toBe(
      '<p>Run <code>admin:grant</code> for your email.</p>',
    );
  });

  it('fills a closed tag with no text, so data never passes through the template', () => {
    expect(html('If <email/> can sign in, a code is on its way.')).toBe(
      '<p>If <strong>owner@demo-store.example</strong> can sign in, a code is on its way.</p>',
    );
  });

  it('keeps the order of the message, so a language can move the element', () => {
    expect(html('<email/> can sign in.')).toBe(
      '<p><strong>owner@demo-store.example</strong> can sign in.</p>',
    );
    expect(html('Sign in as <email/>')).toBe(
      '<p>Sign in as <strong>owner@demo-store.example</strong></p>',
    );
    expect(html('<code>a</code><strong>b</strong>')).toBe(
      '<p><code>a</code><strong>b</strong></p>',
    );
  });

  it('refuses a tag that no slot fills', () => {
    expect(() => rich('Press <kbd>Enter</kbd>.', SLOTS)).toThrow(
      'The message "Press <kbd>Enter</kbd>." has a <kbd> tag and no slot fills it.',
    );
    expect(() => rich('<constructor/>', SLOTS)).toThrow('no slot fills it');
  });

  it('refuses a tag that is not closed, or closed by another name', () => {
    expect(() => rich('Run <code>admin:grant for your email.', SLOTS)).toThrow(
      'has a tag that is not closed',
    );
    expect(() => rich('Run <code>admin:grant</strong>.', SLOTS)).toThrow(
      'has a tag that is not closed',
    );
    expect(() => rich('<code>a</code> and </code>', SLOTS)).toThrow('has a tag that is not closed');
  });
});
