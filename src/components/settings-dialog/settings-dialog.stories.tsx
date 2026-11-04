import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import { english } from '@/test-utils/english';
import { GeneralSection } from './general-section';
import { SettingsDialog } from './settings-dialog';
import type { SettingsDialogContent } from './settings-section-content';
import { closeSettings, forgetHowSettingsOpened, openSettings } from './settings-location';
import type { SettingsSection } from './settings-sections';

const EVERY_SECTION: readonly SettingsSection[] = [
  'general',
  'billing',
  'security',
  'tokens',
  'apps',
  'install',
  'project',
  'privacy',
  'keys',
  'people',
  'email',
  'data',
  'help',
];

function Panel({ title, body }: { readonly title: string; readonly body: string }) {
  return (
    <section className={PANEL}>
      <h2 className={PANEL_TITLE}>{title}</h2>
      <p className="text-sm">{body}</p>
    </section>
  );
}

const CONTENT: SettingsDialogContent = {
  sections: EVERY_SECTION,
  content: {
    general: (
      <GeneralSection
        email="owner@example.com"
        i18n={english}
        chooseLocale={fn(() => Promise.resolve())}
      />
    ),
    keys: (
      <div className="flex flex-col">
        <Panel title="Public keys" body="pyxis_pk_6f1d3c2a8b4e4f7a9c1d2e3f4a5b6c7d" />
        <Panel title="Secret keys" body="Created on Jan 3, 2025." />
      </div>
    ),
  },
};

const MEMBER_CONTENT: SettingsDialogContent = {
  ...CONTENT,
  sections: EVERY_SECTION.filter((section) => section !== 'data'),
};

const loaded = (content: SettingsDialogContent) => () => Promise.resolve(content);
const neverAnswers = () => new Promise<SettingsDialogContent>(() => undefined);
const fails = () => Promise.reject(new Error('The API answered 503'));

const opensOn = (section?: SettingsSection) => (): (() => void) => {
  openSettings(section);
  return () => {
    forgetHowSettingsOpened();
    closeSettings();
  };
};

const meta = {
  title: 'Settings/SettingsDialog',
  component: SettingsDialog,
  tags: ['autodocs'],
  args: { projectId: 'p-store', projectName: 'Demo Store', loadContent: loaded(CONTENT) },
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true, navigation: { pathname: '/p-store/overview' } },
  },
  beforeEach: opensOn('general'),
} satisfies Meta<typeof SettingsDialog>;

export default meta;
type Story = StoryObj<typeof meta>;
type Play = NonNullable<Story['play']>;

const showsTheGeneralSettings: Play = async () => {
  const dialog = within(document.body).getByRole('dialog', { name: 'Settings' });
  const settings = within(dialog);
  await expect(await settings.findByText('owner@example.com')).toBeVisible();
  await expect(settings.getByRole('link', { name: 'General' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(settings.getByRole('group', { name: 'Theme' })).toBeVisible();
};

export const General: Story = { play: showsTheGeneralSettings };

export const GeneralDark: Story = { globals: { theme: 'dark' }, play: showsTheGeneralSettings };

export const Keys: Story = {
  beforeEach: opensOn('keys'),
  play: async () => {
    const dialog = within(document.body).getByRole('dialog', { name: 'Settings' });
    await expect(await within(dialog).findByText('Public keys')).toBeVisible();
  },
};

export const Loading: Story = {
  args: { loadContent: neverAnswers },
  play: async () => {
    await expect(within(document.body).getByRole('status')).toHaveTextContent('Loading settings…');
  },
};

export const LoadingDark: Story = { ...Loading, globals: { theme: 'dark' } };

export const Failed: Story = {
  args: { loadContent: fails },
  play: async () => {
    const alert = await within(document.body).findByRole('alert');
    await expect(alert).toHaveTextContent('The settings could not be loaded.');
    await expect(within(alert).getByRole('button', { name: 'Try again' })).toBeEnabled();
  },
};

export const FailedDark: Story = { ...Failed, globals: { theme: 'dark' } };

export const ForAMember: Story = {
  args: { loadContent: loaded(MEMBER_CONTENT) },
  play: async () => {
    const dialog = within(document.body).getByRole('dialog', { name: 'Settings' });
    await within(dialog).findByText('owner@example.com');
    await expect(within(dialog).queryByRole('link', { name: 'Export and delete' })).toBeNull();
  },
};

export const AnEmptySection: Story = {
  beforeEach: opensOn('people'),
  play: async () => {
    const dialog = within(document.body).getByRole('dialog', { name: 'Settings' });
    await expect(within(dialog).getByRole('link', { name: 'People' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  },
};

export const OnAPhone: Story = {
  beforeEach: opensOn(),
  globals: { viewport: { value: 'mobile1' } },
  play: async () => {
    const dialog = within(document.body).getByRole('dialog', { name: 'Settings' });
    await userEvent.click(within(dialog).getByRole('link', { name: 'Keys' }));
    await expect(within(dialog).getByRole('button', { name: 'All settings' })).toBeVisible();
  },
};

export const OnAPhoneDark: Story = {
  ...OnAPhone,
  globals: { viewport: { value: 'mobile1' }, theme: 'dark' },
};

export const BrazilianPortuguese: Story = {
  globals: { locale: 'pt-BR' },
  play: async () => {
    await expect(
      within(document.body).getByRole('dialog', { name: 'Configurações' }),
    ).toBeVisible();
  },
};
