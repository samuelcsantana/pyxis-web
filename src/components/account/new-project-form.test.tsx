import { act, fireEvent, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { CLIENT_NAMESPACES, pickNamespaces } from '@/i18n/messages';
import { en } from '@/i18n/messages/en';
import { MessagesProvider } from '@/i18n/messages-provider';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CreateProjectOutcome, ProjectChanges } from '@/domain/project-management';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { installHref } from '@/components/shell/screens';
import { CREATE_PROJECT_MIN_BUSY_MS, FALLBACK_TIME_ZONE, NewProjectForm } from './new-project-form';

const assign = vi.fn();

const TIMEZONES = ['America/Sao_Paulo', 'Europe/Lisbon', 'UTC'];

async function settle(milliseconds = CREATE_PROJECT_MIN_BUSY_MS) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds);
  });
}

function field(name: string) {
  return screen.getByRole('textbox', { name });
}

function renderForm(create: (changes: ProjectChanges) => Promise<CreateProjectOutcome>) {
  return renderWithMessages(
    <NewProjectForm timezones={TIMEZONES} projectLimit={3} create={create} />,
  );
}

describe('NewProjectForm', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    assign.mockClear();
    vi.stubGlobal('location', { assign });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("starts in the browser's time zone, creates the project and goes to its installation", async () => {
    const create = vi.fn<(changes: ProjectChanges) => Promise<CreateProjectOutcome>>(() =>
      Promise.resolve({ kind: 'created', project: { projectId: 'p2', publicKey: 'pyxis_pk_x' } }),
    );
    renderWithMessages(
      <NewProjectForm
        timezones={TIMEZONES}
        projectLimit={3}
        create={create}
        localTimeZone={() => 'Europe/Lisbon'}
      />,
    );
    expect(screen.getByRole('combobox', { name: 'Time zone' })).toHaveValue('Europe/Lisbon');

    fireEvent.change(field('Project name'), { target: { value: ' My shop ' } });
    fireEvent.change(field('Site address'), { target: { value: 'shop.example.com/' } });
    fireEvent.change(field('Conversion event (optional)'), {
      target: { value: 'signup_completed' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create project' }));
    expect(screen.getByRole('button', { name: 'Creating…' })).toBeDisabled();
    await settle();

    expect(create).toHaveBeenCalledWith({
      name: 'My shop',
      allowedOrigins: ['https://shop.example.com'],
      timezone: 'Europe/Lisbon',
      conversionEvent: 'signup_completed',
    });
    expect(assign).toHaveBeenCalledWith('/p2/install');
  });

  it('falls back to UTC for a zone it does not list, and keeps the zone chosen', () => {
    renderWithMessages(
      <NewProjectForm
        timezones={TIMEZONES}
        projectLimit={3}
        create={() => Promise.resolve({ kind: 'invalid' })}
        localTimeZone={() => 'Mars/Olympus'}
      />,
    );
    const select = screen.getByRole('combobox', { name: 'Time zone' });

    expect(select).toHaveValue(FALLBACK_TIME_ZONE);
    fireEvent.change(select, { target: { value: 'America/Sao_Paulo' } });
    expect(select).toHaveValue('America/Sao_Paulo');
  });

  it('names each problem under its field and sends nothing', async () => {
    const create = vi.fn<(changes: ProjectChanges) => Promise<CreateProjectOutcome>>();
    renderForm(create);

    fireEvent.change(field('Conversion event (optional)'), { target: { value: 'Sign Up' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create project' }));
    await settle(16);

    expect(create).not.toHaveBeenCalled();
    expect(field('Project name')).toHaveAccessibleDescription('Give the project a name.');
    expect(field('Project name')).toHaveFocus();
    expect(field('Site address')).toHaveAccessibleDescription('Write the address of the site.');
    expect(field('Conversion event (optional)')).toHaveAccessibleDescription(
      expect.stringContaining('Use lower-case letters') as string,
    );
  });

  it('refuses a name over the limit, a site it cannot read and a zone it does not know', async () => {
    renderWithMessages(
      <NewProjectForm
        timezones={[...TIMEZONES, 'Nowhere/Land']}
        projectLimit={3}
        create={() => Promise.resolve({ kind: 'invalid' })}
      />,
    );

    fireEvent.change(field('Project name'), { target: { value: 'x'.repeat(101) } });
    fireEvent.change(field('Site address'), { target: { value: 'ftp://shop.example.com' } });
    fireEvent.change(screen.getByRole('combobox', { name: 'Time zone' }), {
      target: { value: 'Nowhere/Land' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create project' }));
    await settle(16);

    expect(field('Project name')).toHaveAccessibleDescription('Use at most 100 characters.');
    expect(field('Site address')).toHaveAccessibleDescription(
      expect.stringContaining('Write the address as scheme and host') as string,
    );
    expect(screen.getByRole('combobox', { name: 'Time zone' })).toHaveAccessibleDescription(
      'Choose a time zone from the list.',
    );
  });

  it.each([
    ['limitReached', 'The account already has its 3 projects.'],
    ['subscriptionRequired', 'This account has no running subscription'],
    ['invalid', 'These settings were refused.'],
  ] as const)('explains a %s answer and stays', async (kind, text) => {
    renderForm(() => Promise.resolve({ kind }));

    fireEvent.change(field('Project name'), { target: { value: 'Shop' } });
    fireEvent.change(field('Site address'), { target: { value: 'https://shop.example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create project' }));
    await settle();

    expect(screen.getByRole('alert')).toHaveTextContent(text);
    expect(assign).not.toHaveBeenCalled();
    fireEvent.change(field('Project name'), { target: { value: 'Shop 2' } });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('says the project was not created when the call fails', async () => {
    renderForm(() => Promise.reject(new Error('503')));

    fireEvent.change(field('Project name'), { target: { value: 'Shop' } });
    fireEvent.change(field('Site address'), { target: { value: 'https://shop.example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create project' }));
    await settle();

    expect(screen.getByRole('alert')).toHaveTextContent('The project was not created.');
  });

  it("reads the browser's own zone when given no other", () => {
    renderForm(() => Promise.resolve({ kind: 'invalid' }));

    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    expect(screen.getByRole('combobox', { name: 'Time zone' })).toHaveValue(
      TIMEZONES.includes(zone) ? zone : FALLBACK_TIME_ZONE,
    );
  });

  it('renders UTC on the server, before the browser can say its zone', () => {
    const html = renderToString(
      <MessagesProvider locale="en" messages={pickNamespaces(en, CLIENT_NAMESPACES)}>
        <NewProjectForm
          timezones={TIMEZONES}
          projectLimit={3}
          create={() => Promise.resolve({ kind: 'invalid' })}
          localTimeZone={() => 'Europe/Lisbon'}
        />
      </MessagesProvider>,
    );

    expect(html).toMatch(/<option value="UTC" selected="">/);
  });

  it('escapes the project id in the installation address', () => {
    expect(installHref('p/2')).toBe('/p%2F2/install');
  });
});
