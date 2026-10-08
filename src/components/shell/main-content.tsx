import type { ComponentProps } from 'react';
import { CONTENT_ID } from './skip-link';

export type MainContentProps = Omit<ComponentProps<'main'>, 'id' | 'tabIndex'> & {
  readonly className: string;
};

const SKIP_TARGET = 'focus:outline-none';

export function MainContent({ className, ...props }: MainContentProps) {
  return (
    <main {...props} id={CONTENT_ID} tabIndex={-1} className={`${className} ${SKIP_TARGET}`} />
  );
}
