import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { showcaseDigest } from '@/test-utils/landing-preview';
import { portuguese } from '@/test-utils/portuguese';
import { REPORT_ITEMS, WEEKLY_REPORT_ID, WeeklyReportSection } from './weekly-report-section';

function renderReport(i18n = english, digest = showcaseDigest(english)) {
  return render(<WeeklyReportSection i18n={i18n} digest={digest} />);
}

describe('WeeklyReportSection', () => {
  it('names itself by its title, under the weekly-report anchor', () => {
    renderReport();

    const section = screen.getByRole('region', { name: 'Every Monday, the week in your inbox' });
    expect(section).toHaveAttribute('id', WEEKLY_REPORT_ID);
    expect(section).toHaveTextContent('Without opening the dashboard and without asking anyone.');
  });

  it('shows the digest e-mail as it arrives: sender, subject, week and figures', () => {
    renderReport();

    const mail = screen.getByRole('figure', { name: 'An example of the weekly digest e-mail' });
    expect(mail).toHaveTextContent('PyxisMon, Oct 19');
    expect(within(mail).getByText('My site · Oct 12 – 18 · 642 visits')).toBeVisible();
    expect(within(mail).getByText('Weekly digest')).toBeVisible();
    const terms = within(mail).getAllByRole('term');
    expect(terms.map((term) => term.textContent)).toEqual([
      'Visits',
      'Identified users',
      'Converting visits',
      'Failed writes',
    ]);
    expect(within(mail).getByText('+4% vs. the week before (617)')).toHaveClass('text-ok');
    expect(within(mail).getByText('of 447 writes, 2.0%')).toHaveClass('text-bad');
    expect(within(mail).getByText('4.5% of visits')).toHaveClass('text-muted');
  });

  it('draws the visits of each day and lists the failing routes, then the button', () => {
    renderReport();

    const mail = screen.getByRole('figure');
    const days = within(mail).getAllByRole('listitem').slice(0, 7);
    expect(days.map((day) => day.textContent)).toEqual([
      '98Mon',
      '104Tue',
      '96Wed',
      '91Thu',
      '87Fri',
      '79Sat',
      '87Sun',
    ]);
    expect(days[1]?.querySelector('.bg-accent')).toHaveStyle({ height: '100%' });
    expect(within(mail).getByText('POST /payouts').nextElementSibling).toHaveTextContent(
      '3 of 14 failed',
    );
    expect(within(mail).getByText('Open the week in the dashboard')).toBeVisible();
    expect(within(mail).queryByRole('link')).toBeNull();
  });

  it('leaves out the failing routes when no write failed', () => {
    renderReport(english, { ...showcaseDigest(english), failingRoutes: [] });

    expect(screen.queryByText('Failing routes')).toBeNull();
  });

  it('says who gets the digest, and what else leaves the dashboard as a file', () => {
    renderReport();

    const titles = screen
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.textContent);
    expect(titles).toEqual([
      'On for every admin of the project',
      'A CSV of each screen',
      'Every event, in one file',
    ]);
    expect(titles).toHaveLength(REPORT_ITEMS.length);
    expect(screen.getByText(/that is how a broken install shows up/)).toBeVisible();
  });

  it('speaks Brazilian Portuguese on the Portuguese page', () => {
    renderReport(portuguese, showcaseDigest(portuguese));

    expect(
      screen.getByRole('region', { name: 'Toda segunda, a semana no seu e-mail' }),
    ).toBeInTheDocument();
    const mail = screen.getByRole('figure', { name: 'Um exemplo do e-mail do resumo semanal' });
    expect(within(mail).getByText('Meu site · 12 – 18 de out. · 642 visitas')).toBeVisible();
    expect(within(mail).getByText('Abrir a semana no painel')).toBeVisible();
  });
});
