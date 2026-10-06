import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { countedSteps, type FunnelStep, funnelRows } from '@/domain/funnel';
import { FunnelEditor } from './funnel-editor';
import { FunnelModes } from './funnel-modes';
import { FunnelSteps } from './funnel-steps';

const CALCULATOR: FunnelStep = { type: 'page', path: '/calculator' };
const RESULT: FunnelStep = { type: 'event', name: 'calculator_result_shown' };
const SIGN_UP: FunnelStep = { type: 'page', path: '/sign-up' };
const STEPS: readonly FunnelStep[] = [CALCULATOR, RESULT, SIGN_UP];

function editor(steps: readonly FunnelStep[] = STEPS, startOpen = true) {
  return render(
    <FunnelEditor
      initialSteps={steps}
      action="/p1/funnel"
      keep={{ range: '7d', mode: 'visit' }}
      startOpen={startOpen}
    />,
  );
}

function hiddenSteps(container: HTMLElement): unknown {
  const input = container.querySelector<HTMLInputElement>('input[name="steps"]');
  return JSON.parse(input?.value ?? 'null');
}

describe('FunnelSteps', () => {
  it('lists the steps in order with count, continuation and drop-off', () => {
    render(
      <FunnelSteps
        mode="visit"
        rows={funnelRows(
          countedSteps(STEPS, { steps: [{ count: 1940 }, { count: 1212 }, { count: 498 }] }),
        )}
      />,
    );

    const items = within(screen.getByRole('list', { name: 'Funnel' })).getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Opened /calculator/calculator1,940Start');
    expect(items[2]).toHaveTextContent('41.1% continued714 dropped');
    expect(screen.getByText('41.1% continued')).toHaveClass('text-bad');
    expect(screen.getByText(/Per visit/)).toBeInTheDocument();
  });

  it('explains how people are counted per person', () => {
    render(<FunnelSteps mode="user" rows={[]} />);

    expect(screen.getByText(/Per person/)).toBeInTheDocument();
  });
});

describe('FunnelModes', () => {
  it('links both modes and marks the current one', () => {
    render(
      <FunnelModes
        current="user"
        links={[
          { mode: 'visit', label: 'Per visit', href: '/p1/funnel?mode=visit' },
          { mode: 'user', label: 'Per person', href: '/p1/funnel?mode=user' },
        ]}
      />,
    );

    expect(screen.getByRole('link', { name: 'Per person' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'Per visit' })).not.toHaveAttribute('aria-current');
  });
});

describe('FunnelEditor', () => {
  it('opens and closes on demand, closed when a funnel is already shown', async () => {
    editor(STEPS, false);
    const toggle = screen.getByRole('button', { name: 'Edit steps' });

    expect(screen.queryByRole('button', { name: 'Apply' })).not.toBeInTheDocument();
    await userEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Close the editor' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
  });

  it('sends the steps with the period and the mode once every step is valid', () => {
    const { container } = editor();

    expect(screen.getByRole('button', { name: 'Apply' })).toBeEnabled();
    expect(hiddenSteps(container)).toEqual(STEPS);
    expect(container.querySelector('input[name="mode"]')).toHaveValue('visit');
    expect(screen.getByText('Apply to count these 3 steps.')).toBeInTheDocument();
  });

  it('says what is wrong with a step and holds Apply until it is fixed', async () => {
    editor();
    const path = screen.getByRole('textbox', { name: 'Step 1 page path' });

    await userEvent.clear(path);
    expect(screen.getByText('Fill in every step to apply.')).toBeInTheDocument();
    await userEvent.type(path, 'pricing');

    expect(path).toHaveAttribute('aria-invalid', 'true');
    expect(path).toHaveAccessibleDescription('A page path starts with "/".');
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
    expect(screen.getByText('Fix the highlighted steps to apply.')).toBeInTheDocument();
  });

  it('turns a step into an event step and back', async () => {
    const { container } = editor();
    const type = screen.getByRole('combobox', { name: 'Step 3 type' });

    await userEvent.selectOptions(type, 'event');
    const name = screen.getByRole('textbox', { name: 'Step 3 event name' });
    await userEvent.clear(name);
    await userEvent.type(name, 'signup_completed');

    expect(hiddenSteps(container)).toEqual([
      CALCULATOR,
      RESULT,
      { type: 'event', name: 'signup_completed' },
    ]);
    await userEvent.selectOptions(type, 'page');
    expect(screen.getByRole('textbox', { name: 'Step 3 page path' })).toHaveValue(
      'signup_completed',
    );
  });

  it('adds a step and focuses it, up to eight', async () => {
    editor();
    const add = screen.getByRole('button', { name: 'Add step' });

    await userEvent.click(add);

    expect(screen.getByRole('textbox', { name: 'Step 4 event name' })).toHaveFocus();
    for (let step = 5; step <= 8; step += 1) {
      await userEvent.click(add);
    }
    expect(add).toBeDisabled();
  });

  it('removes a step and moves the focus to the step that took its place', async () => {
    editor([...STEPS, { type: 'event', name: 'order_created' }]);

    await userEvent.click(screen.getByRole('button', { name: 'Remove step 2' }));

    expect(screen.getByRole('textbox', { name: 'Step 2 page path' })).toHaveValue('/sign-up');
    expect(screen.getByRole('button', { name: 'Remove step 2' })).toHaveFocus();

    await userEvent.click(screen.getByRole('button', { name: 'Remove step 3' }));
    expect(screen.getByRole('button', { name: 'Add step' })).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Remove step 1' })).toBeDisabled();
  });

  it('moves a step with the keyboard and keeps the focus on it', async () => {
    const { container } = editor();

    screen.getByRole('button', { name: 'Move step 1 down' }).focus();
    await userEvent.keyboard('{Enter}');

    expect(hiddenSteps(container)).toEqual([RESULT, CALCULATOR, SIGN_UP]);
    expect(screen.getByRole('button', { name: 'Move step 2 down' })).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    expect(hiddenSteps(container)).toEqual([RESULT, SIGN_UP, CALCULATOR]);
    expect(screen.getByRole('button', { name: 'Move step 3 up' })).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    expect(hiddenSteps(container)).toEqual([RESULT, CALCULATOR, SIGN_UP]);
    expect(screen.getByRole('button', { name: 'Move step 2 up' })).toHaveFocus();
  });
});
