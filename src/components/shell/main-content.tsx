import type { ComponentProps } from 'react';
import { CONTENT_ID } from './skip-link';

export type MainContentProps = Omit<ComponentProps<'main'>, 'id' | 'tabIndex'> & {
  readonly className: string;
};

const SKIP_TARGET = 'focus:outline-none';
const PROGRESS_WHILE_NAVIGATING =
  'relative before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-focus before:opacity-0 before:transition-opacity before:duration-150 motion-reduce:before:transition-none group-data-navigating/navigation:before:opacity-100 group-data-navigating/navigation:before:delay-100 group-data-navigating/navigation:before:motion-safe:animate-pulse';

export function MainContent({ className, ...props }: MainContentProps) {
  return (
    <main
      {...props}
      id={CONTENT_ID}
      tabIndex={-1}
      className={`${className} ${SKIP_TARGET} ${PROGRESS_WHILE_NAVIGATING}`}
    />
  );
}
