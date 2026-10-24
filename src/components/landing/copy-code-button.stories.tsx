import type { Decorator, Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, spyOn, userEvent, within } from 'storybook/test';
import { CopyCodeButton } from './copy-code-button';
import '@/app/landing/[locale]/landing.css';

const inTheCornerOfACodeBlock: Decorator = (Story) => (
  <div className="relative w-96 rounded-card bg-nav py-4.5 pr-24 pl-5 font-mono text-sm text-nav-strong">
    <pre id="story-code" className="m-0">
      npm install pyxis-analytics
    </pre>
    <Story />
  </div>
);

const besideAnAddress: Decorator = (Story) => (
  <div className="flex w-96 flex-wrap items-center justify-between gap-3 rounded-card bg-nav py-2.5 pr-2.5 pl-5 font-mono text-sm text-nav-strong">
    <code id="story-email">hello@pyxis-analytics.dev</code>
    <Story />
  </div>
);

const onACard: Decorator = (Story) => (
  <div className="flex w-96 flex-col gap-3 rounded-card border border-line bg-card p-5 text-ink">
    <pre id="story-request" className="m-0 font-mono text-sm whitespace-pre-wrap">
      Install Pyxis on this site following https://pyxis-analytics.dev/llms.txt.
    </pre>
    <Story />
  </div>
);

const REQUEST_LABELS = {
  copy: 'Copy the request for your agent',
  copied: 'Request copied. Paste it into your agent',
  selected: 'Selected, press Ctrl+C',
};

const meta = {
  title: 'Landing/CopyCodeButton',
  component: CopyCodeButton,
  args: {
    code: 'npm install pyxis-analytics',
    targetId: 'story-code',
    labels: { copy: 'Copy', copied: 'Copied', selected: 'Selected, press Ctrl+C' },
  },
} satisfies Meta<typeof CopyCodeButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AtRest: Story = {
  decorators: [inTheCornerOfACodeBlock],
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Copy' })).toBeVisible();
  },
};

export const DarkTheme: Story = {
  decorators: [inTheCornerOfACodeBlock],
  globals: { theme: 'dark' },
};

export const BesideTheCode: Story = {
  args: { code: 'hello@pyxis-analytics.dev', targetId: 'story-email', placement: 'inline' },
  decorators: [besideAnAddress],
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Copy' })).toBeVisible();
  },
};

export const Prominent: Story = {
  args: {
    code: 'Install Pyxis on this site following https://pyxis-analytics.dev/llms.txt.',
    targetId: 'story-request',
    labels: REQUEST_LABELS,
    placement: 'inline',
    appearance: 'prominent',
  },
  decorators: [onACard],
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Copy the request for your agent' }),
    ).toBeVisible();
  },
};

export const ProminentInTheDarkTheme: Story = {
  ...Prominent,
  globals: { theme: 'dark' },
};

export const ProminentOnAPhone: Story = {
  ...Prominent,
  globals: { viewport: { value: 'mobile1' } },
};

export const ProminentCopied: Story = {
  ...Prominent,
  play: async ({ canvasElement }) => {
    const writeText = spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Copy the request for your agent' }));
    await expect(
      await canvas.findByRole('button', { name: 'Request copied. Paste it into your agent' }),
    ).toBeVisible();
    writeText.mockRestore();
  },
};
