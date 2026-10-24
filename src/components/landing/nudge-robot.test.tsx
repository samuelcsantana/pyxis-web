import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NudgeRobot, ROBOT_ID_PREFIX } from './nudge-robot';

const PAINT_REFERENCE = /^url\(#(.+)\)$/;

function idsIn(element: Element): readonly string[] {
  return Array.from(element.querySelectorAll('[id]'), (node) => node.id);
}

function referencesIn(element: Element): readonly string[] {
  return Array.from(element.querySelectorAll('*')).flatMap((node) =>
    ['fill', 'stroke', 'filter']
      .map((attribute) => PAINT_REFERENCE.exec(node.getAttribute(attribute) ?? '')?.[1])
      .filter((id) => id !== undefined),
  );
}

describe('NudgeRobot', () => {
  it('names its gradients and glows after the nudge by default', () => {
    const { container } = render(<NudgeRobot />);

    const ids = idsIn(container);
    expect(ids).toContain(`${ROBOT_ID_PREFIX}-head`);
    expect(ids.every((id) => id.startsWith(`${ROBOT_ID_PREFIX}-`))).toBe(true);
  });

  it('paints only with gradients and glows it defines itself', () => {
    const { container } = render(<NudgeRobot idPrefix="card-robot" />);

    const ids = new Set(idsIn(container));
    const references = referencesIn(container);
    expect(references.length).toBeGreaterThan(0);
    expect(references.filter((reference) => !ids.has(reference))).toEqual([]);
  });

  it('repeats no id when two robots share a page', () => {
    const { container } = render(
      <>
        <NudgeRobot />
        <NudgeRobot idPrefix="card-robot" />
      </>,
    );

    const ids = idsIn(container);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
