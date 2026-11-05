'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { startTransition, useId, useOptimistic } from 'react';
import { useHoldNavigationWhile } from '@/components/shell/navigation-pending';
import { FIELD } from '@/components/ui/control-classes';
import { withChosenGoal } from '@/domain/goal-parameters';

export interface GoalChoice {
  readonly id: string;
  readonly name: string;
}

export interface GoalPickerProps {
  readonly goals: readonly GoalChoice[];
  readonly selected: string;
  readonly first: string;
  readonly label: string;
}

const SELECT = `select-field min-h-9 w-full min-w-0 cursor-pointer truncate rounded-input pr-8 pl-2.5 text-xs font-medium text-ink sm:text-caption ${FIELD}`;
const CHEVRON = 'M6 9l6 6 6-6';

export function GoalPicker({ goals, selected, first, label }: GoalPickerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = useId();
  const [shown, setShown] = useOptimistic(selected);
  const pending = shown !== selected;
  useHoldNavigationWhile(pending);

  const choose = (goalId: string) => {
    const query = withChosenGoal(searchParams.toString(), goalId, first);
    startTransition(() => {
      setShown(goalId);
      router.replace(query === '' ? pathname : `${pathname}?${query}`, { scroll: false });
    });
  };

  return (
    <div className="relative flex min-w-0 items-center gap-2" aria-busy={pending}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={shown}
        onChange={(event) => {
          choose(event.target.value);
        }}
        className={SELECT}
      >
        {goals.map((goal) => (
          <option key={goal.id} value={goal.id}>
            {goal.name}
          </option>
        ))}
      </select>
      <svg
        width={14}
        height={14}
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="select-chevron pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-muted"
      >
        <path
          d={CHEVRON}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
