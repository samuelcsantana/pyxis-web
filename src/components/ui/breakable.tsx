import { Fragment } from 'react';
import { identifierSegments, slashSegments } from '@/domain/identifier-segments';

export type BreakPoints = 'separators' | 'slashes';

export interface BreakableProps {
  readonly text: string;
  readonly breakAt?: BreakPoints;
}

const SEGMENTS_OF: Readonly<Record<BreakPoints, (text: string) => readonly string[]>> = {
  separators: identifierSegments,
  slashes: slashSegments,
};

export function Breakable({ text, breakAt = 'separators' }: BreakableProps) {
  return (
    <>
      {SEGMENTS_OF[breakAt](text).map((segment, index) => (
        <Fragment key={`${String(index)}-${segment}`}>
          {index === 0 ? null : <wbr />}
          {segment}
        </Fragment>
      ))}
    </>
  );
}
