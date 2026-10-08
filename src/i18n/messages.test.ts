import { describe, expect, expectTypeOf, it } from 'vitest';
import {
  CLIENT_NAMESPACES,
  type ClientSourceMessages,
  pickNamespaces,
  type SourceMessages,
} from './messages';
import type { MessageKey } from './translate';

describe('messages', () => {
  it('keeps only the namespaces asked for', () => {
    const messages = { nav: { overview: 'Overview' }, meta: { description: 'Analytics' } };

    expect(pickNamespaces(messages, ['nav'])).toEqual({ nav: { overview: 'Overview' } });
    expect(pickNamespaces(messages, [])).toEqual({});
  });

  it('keeps the server-only metadata out of the messages sent to the browser', () => {
    expect(CLIENT_NAMESPACES).not.toContain('meta');
    expectTypeOf<'meta.description'>().toExtend<MessageKey<SourceMessages>>();
    expectTypeOf<'meta.description'>().not.toExtend<MessageKey<ClientSourceMessages>>();
  });
});
