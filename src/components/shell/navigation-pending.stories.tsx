import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import { MainContent } from './main-content';
import {
  NavigationPendingProvider,
  NavigationRegion,
  useHoldNavigationWhile,
} from './navigation-pending';

function HeldNavigation({ pending }: { readonly pending: boolean }) {
  useHoldNavigationWhile(pending);
  return null;
}

function ScreenContent({ navigating }: { readonly navigating: boolean }) {
  return (
    <NavigationPendingProvider>
      <HeldNavigation pending={navigating} />
      <NavigationRegion className="flex flex-col">
        <MainContent className="flex w-[min(100%,48rem)] flex-col gap-4 p-4">
          <section aria-labelledby="visits-heading" className={PANEL}>
            <h2 id="visits-heading" className={PANEL_TITLE}>
              Visits
            </h2>
            <p className="text-3xl font-semibold tabular-nums">1,284</p>
            <p className="text-sm text-muted">In the last 30 days</p>
          </section>
        </MainContent>
      </NavigationRegion>
    </NavigationPendingProvider>
  );
}

const meta = {
  title: 'Shell/Content while navigating',
  component: ScreenContent,
  tags: ['autodocs'],
  args: { navigating: true },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ScreenContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Navigating: Story = {};

export const AtRest: Story = { args: { navigating: false } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
