import { Fragment } from 'react';
import { identifierSegments } from '@/domain/identifier-segments';

export interface BreakableProps {
  readonly text: string;
}

export function Breakable({ text }: BreakableProps) {
  return (
    <>
      {identifierSegments(text).map((segment, index) => (
        <Fragment key={`${String(index)}-${segment}`}>
          {index === 0 ? null : <wbr />}
          {segment}
        </Fragment>
      ))}
    </>
  );
}
