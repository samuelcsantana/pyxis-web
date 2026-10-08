import { Fragment, type ReactNode } from 'react';

export type RichSlots = Readonly<Record<string, (text: string) => ReactNode>>;

const TAG = /<([a-z][a-zA-Z]*)(?:\/>|>([^<]*)<\/\1>)/g;
const STRAY_TAG = /<\/?[a-zA-Z]/;

interface Progress {
  readonly nodes: readonly ReactNode[];
  readonly from: number;
}

function textBetween(template: string, start: number, end: number): readonly string[] {
  const text = template.slice(start, end);
  if (STRAY_TAG.test(text)) {
    throw new Error(`The message "${template}" has a tag that is not closed.`);
  }
  return text === '' ? [] : [text];
}

function fill(
  template: string,
  slots: ReadonlyMap<string, RichSlots[string]>,
  match: RegExpExecArray,
) {
  const name = String(match[1]);
  const slot = slots.get(name);
  if (slot === undefined) {
    throw new Error(`The message "${template}" has a <${name}> tag and no slot fills it.`);
  }
  return slot(match[2] ?? '');
}

export function rich(template: string, slots: RichSlots): ReactNode[] {
  const fillers = new Map(Object.entries(slots));
  const { nodes, from } = [...template.matchAll(TAG)].reduce<Progress>(
    (progress, match, index) => ({
      nodes: [
        ...progress.nodes,
        ...textBetween(template, progress.from, match.index),
        <Fragment key={index}>{fill(template, fillers, match)}</Fragment>,
      ],
      from: match.index + match[0].length,
    }),
    { nodes: [], from: 0 },
  );
  return [...nodes, ...textBetween(template, from, template.length)];
}
