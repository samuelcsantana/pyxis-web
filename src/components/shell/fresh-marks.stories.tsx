import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useEffect, useState } from 'react';
import { expect, within } from 'storybook/test';
import { FRESH_HIGHLIGHT, FreshCount, FreshVisit } from '@/components/ui/fresh-slots';
import { type FreshMark, type FreshMarks, FreshMarksView } from './fresh-marks';

interface ShownMarks extends FreshMarks {
  readonly show: (next: readonly FreshMark[]) => void;
}

function shownMarks(): ShownMarks {
  const listeners = new Set<() => void>();
  let marks: readonly FreshMark[] = [];
  return {
    read: () => undefined,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    marks: () => marks,
    show(next) {
      marks = next;
      for (const listener of listeners) {
        listener();
      }
    },
  };
}

const ROWS = [
  { path: '/dashboard', views: 1_952, grew: 3 },
  { path: '/pricing', views: 653, grew: 0 },
  { path: '/sign-up', views: 450, grew: 1_240 },
] as const;

function MarkedTable({ arrived }: { readonly arrived: boolean }) {
  const [source] = useState(shownMarks);
  useEffect(() => {
    const slots = [...document.querySelectorAll('[data-fresh-item]')];
    const counts = slots.flatMap((slot, index): FreshMark[] => {
      const grew = ROWS[index]?.grew ?? 0;
      return grew === 0 ? [] : [{ kind: 'count', slot, count: grew, arrived }];
    });
    const visits = [...document.querySelectorAll('[data-fresh-started]')].map(
      (slot): FreshMark => ({ kind: 'visit', slot, arrived }),
    );
    source.show([...counts, ...visits]);
  }, [source, arrived]);
  return (
    <div className="flex max-w-xl flex-col gap-4 bg-bg p-6 text-ink">
      <table className="w-full border-collapse rounded-card bg-card text-caption tabular-nums">
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.path} className={FRESH_HIGHLIGHT}>
              <th scope="row" className="px-4 py-2.5 text-left font-mono text-xs font-normal">
                {row.path}
              </th>
              <td className="px-4 py-2.5 text-right">
                <FreshCount
                  item={`page:${row.path}`}
                  value={row.views + row.grew}
                  className="mr-1.5"
                />
                {(row.views + row.grew).toLocaleString('en')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={`rounded-card bg-card px-4 py-2.5 ${FRESH_HIGHLIGHT}`}>
        Sat, Oct 24, 01:23
        <FreshVisit startedAt={1} className="ml-1.5" />
      </p>
      <FreshMarksView source={source} />
    </div>
  );
}

const meta = {
  title: 'Shell/FreshMarks',
  component: MarkedTable,
  args: { arrived: true },
} satisfies Meta<typeof MarkedTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const JustArrived: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('3 more since you last looked')).toBeInTheDocument();
    await expect(canvas.getByText('+1,240')).toBeInTheDocument();
    await expect(canvas.getByText('New')).toHaveAttribute('data-fresh-shown', 'arrived');
  },
};

export const ShownAgain: Story = { args: { arrived: false } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
