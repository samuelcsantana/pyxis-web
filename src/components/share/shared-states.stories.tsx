import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { english } from '@/test-utils/english';
import { MadeWithPyxis } from './made-with-pyxis';
import { SharedEmptyPeriod } from './shared-empty-period';
import { SharedLinkClosed } from './shared-link-closed';

function SharedStates() {
  return (
    <div className="min-h-dvh bg-bg text-ink">
      <MadeWithPyxis i18n={english} />
      <SharedLinkClosed />
      <div className="p-4 sm:px-8">
        <SharedEmptyPeriod widerPeriodHref="/share/x?range=30d" i18n={english} />
      </div>
    </div>
  );
}

const meta = {
  title: 'Share/Shared page states',
  component: SharedStates,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SharedStates>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Portuguese: Story = { parameters: { locale: 'pt-BR' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
