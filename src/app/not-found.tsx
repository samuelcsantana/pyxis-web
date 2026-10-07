import Link from 'next/link';
import { EmptyState } from '@/components/states/empty-state';
import { FOCUS_RING } from '@/components/ui/control-classes';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4 py-16">
      <EmptyState title="Nothing here">
        <p>This page does not exist, or the project is not one you may read.</p>
        <Link
          href="/"
          className={`self-start text-sky-ink underline underline-offset-2 hover:text-ink ${FOCUS_RING}`}
        >
          Go to your projects
        </Link>
      </EmptyState>
    </main>
  );
}
