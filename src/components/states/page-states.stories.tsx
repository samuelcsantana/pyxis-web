import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ReactNode } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { BuildAFunnel } from '@/components/funnel/build-a-funnel';
import { MainContent } from '@/components/shell/main-content';
import { LookUpPrompt, NoVisitsFound } from '@/components/timeline/timeline-empty-states';
import { serializeSteps } from '@/domain/funnel';
import { MockAuthService } from '@/services/auth/mock-auth-service';
import { DEMO_FUNNEL_STEPS } from '@/services/funnel/demo-funnel';
import { english } from '@/test-utils/english';
import { NoProjectsYet } from './no-projects-yet';

const meta = {
  title: 'Pages/States',
  parameters: { layout: 'fullscreen', nextjs: { appDirectory: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const NEW_ADMIN = 'new.analyst@example.com';

class FailingSignOut extends MockAuthService {
  override signOut(): Promise<void> {
    return Promise.reject(new Error('The API answered 503'));
  }
}

function HomeWithoutProjects({ authService }: { readonly authService: MockAuthService }) {
  return (
    <MainContent className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-4 px-4 py-16">
      <NoProjectsYet email={NEW_ADMIN} authService={authService} i18n={english} />
    </MainContent>
  );
}

function OnAScreen({ children }: { readonly children: ReactNode }) {
  return (
    <MainContent className="flex w-full max-w-310 flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12">
      {children}
    </MainContent>
  );
}

const namesTheAdmin: NonNullable<Story['play']> = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await expect(canvas.getByRole('heading', { level: 1, name: 'No projects yet' })).toBeVisible();
  await expect(canvas.getByText(NEW_ADMIN)).toBeVisible();
};

export const NoProjectsYetOnTheHome: Story = {
  render: () => <HomeWithoutProjects authService={new MockAuthService()} />,
  play: namesTheAdmin,
};

export const NoProjectsYetDark: Story = {
  render: () => <HomeWithoutProjects authService={new MockAuthService()} />,
  globals: { theme: 'dark' },
  play: namesTheAdmin,
};

export const NoProjectsYetSignOutFailed: Story = {
  render: () => <HomeWithoutProjects authService={new FailingSignOut()} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Sign out' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      'Could not sign out. Try again.',
    );
  },
};

const EXAMPLE_FUNNEL = `/demo/funnel?${new URLSearchParams({
  mode: 'visits',
  steps: serializeSteps(DEMO_FUNNEL_STEPS),
}).toString()}`;

const offersTheExample: NonNullable<Story['play']> = async ({ canvasElement }) => {
  const example = within(canvasElement).getByRole('link', {
    name: 'Start from an example funnel',
  });
  await expect(example).toHaveAttribute('href', EXAMPLE_FUNNEL);
};

export const BuildAFunnelOnTheFunnel: Story = {
  render: () => (
    <OnAScreen>
      <BuildAFunnel exampleHref={EXAMPLE_FUNNEL} />
    </OnAScreen>
  ),
  play: offersTheExample,
};

export const BuildAFunnelDark: Story = {
  ...BuildAFunnelOnTheFunnel,
  globals: { theme: 'dark' },
};

const DEMO_PERSON = { userId: 'u_7f3a', href: '/demo/timeline?user=u_7f3a' };

export const LookUpPromptInTheDemo: Story = {
  render: () => (
    <OnAScreen>
      <LookUpPrompt demoPerson={DEMO_PERSON} />
    </OnAScreen>
  ),
  play: async ({ canvasElement }) => {
    const person = within(canvasElement).getByRole('link', {
      name: 'Open the timeline of the demo person u_7f3a',
    });
    await expect(person).toHaveAttribute('href', DEMO_PERSON.href);
  },
};

export const LookUpPromptDark: Story = { ...LookUpPromptInTheDemo, globals: { theme: 'dark' } };

export const LookUpPromptOutsideTheDemo: Story = {
  render: () => (
    <OnAScreen>
      <LookUpPrompt demoPerson={null} />
    </OnAScreen>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('link')).toBeNull();
  },
};

export const NoVisitsFoundForAPerson: Story = {
  render: () => (
    <OnAScreen>
      <NoVisitsFound lookupTitle="User nobody_here" />
    </OnAScreen>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('heading', { name: 'No visits found for User nobody_here' }),
    ).toBeVisible();
  },
};

export const NoVisitsFoundDark: Story = {
  ...NoVisitsFoundForAPerson,
  globals: { theme: 'dark' },
};
