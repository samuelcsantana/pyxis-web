import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InstallGuide } from '@/components/install/install-guide';
import type { Admin } from '@/domain/admin';
import type { ProjectSettings } from '@/domain/project-settings';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import InstallPage, { generateMetadata } from './page';

const SETTINGS: ProjectSettings = {
  id: 'p-store',
  accountId: 'a1',
  role: 'owner',
  name: 'Demo Store',
  timezone: 'UTC',
  conversionEvent: null,
  currency: 'BRL',
  cityEnabled: false,
  visitorsEnabled: false,
  allowedOrigins: ['https://store.example.com'],
  createdAt: '2026-11-20T12:00:00.000Z',
  firstEventAt: null,
  lastEventAt: null,
  eventRetentionMonths: 13,
  publicKeys: [{ id: 'k1', key: 'pyxis_pk_store', createdAt: '2026-11-20T12:00:00.000Z' }],
  secretKeys: [],
  deletionHeldAt: null,
};

const state = vi.hoisted<{ settings: () => Promise<ProjectSettings> }>(() => ({
  settings: () => Promise.reject(new Error('settings not set')),
}));

const navigation = vi.hoisted(() => ({ search: '' }));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({
    currentAdmin: (): Promise<Admin> =>
      Promise.resolve({
        email: 'owner@example.com',
        projects: [{ id: 'p-store', name: 'Demo Store', timezone: 'UTC', conversionEvent: null }],
      }),
    settings: () => state.settings(),
  }),
}));

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
  headers: () => Promise.resolve(new Headers()),
}));

vi.mock('next/navigation', () => ({
  redirect: (path: string) => {
    throw new Error(`redirect:${path}`);
  },
  notFound: () => {
    throw new Error('not-found');
  },
  useRouter: () => ({ refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(navigation.search),
}));

const PARAMS = { params: Promise.resolve({ projectId: 'p-store' }) };

describe('InstallPage', () => {
  beforeEach(() => {
    state.settings = () => Promise.resolve(SETTINGS);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('shows the snippets with the key and the API it talks to', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    renderWithMessages(await InstallPage(PARAMS));

    expect(screen.getByRole('heading', { level: 1, name: 'Install' })).toBeInTheDocument();
    expect(
      screen.getByText(
        /init\(\{ key: 'pyxis_pk_store', endpoint: 'https:\/\/api\.pyxis\.example\.com' \}\);$/m,
      ),
    ).toBeInTheDocument();
  });

  it('points the demo at the hosted API', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    renderWithMessages(await InstallPage(PARAMS));

    expect(screen.getAllByText(/https:\/\/api\.pyxis-analytics\.dev/).length).toBeGreaterThan(0);
  });

  it('is titled after the step and the project', async () => {
    await expect(generateMetadata(PARAMS)).resolves.toEqual({ title: 'Install · Demo Store' });
  });
});

describe('InstallGuide', () => {
  it('waits for the first event from the allowed origin', () => {
    render(<InstallGuide settings={SETTINGS} endpoint="https://api.example.com" i18n={english} />);

    const second = screen.getByRole('region', { name: '2. Open a page of your site' });
    expect(second).toHaveTextContent('Page views from https://store.example.com show up here');
    expect(within(second).getByRole('status')).toHaveTextContent('Waiting for the first event…');
    expect(screen.getAllByRole('button', { name: 'Copy' })).toHaveLength(5);
    expect(screen.queryByText(/Already connected Claude/)).not.toBeInTheDocument();
  });

  it('shows how to send revenue, in the project currency', () => {
    render(<InstallGuide settings={SETTINGS} endpoint="https://api.example.com" i18n={english} />);

    const first = screen.getByRole('region', { name: '1. Install Pyxis on your site' });
    expect(within(first).getByRole('heading', { name: 'Record revenue (optional)' })).toBeVisible();
    expect(first).toHaveTextContent("track('purchase', { revenue: 129.9 });");
    expect(first).toHaveTextContent('in the project’s currency (BRL · Brazilian Real)');
  });

  it('opens on installing it yourself, with the agent one tab away', () => {
    render(<InstallGuide settings={SETTINGS} endpoint="https://api.example.com" i18n={english} />);

    const first = screen.getByRole('region', { name: '1. Install Pyxis on your site' });
    expect(within(first).getByRole('tablist', { name: 'How to install' })).toBeInTheDocument();
    expect(
      within(first)
        .getAllByRole('tab')
        .map((tab) => tab.textContent),
    ).toEqual(['Yourself', 'With an AI agent', 'Google Tag Manager', 'Shopify', 'WordPress']);
    expect(within(first).getByRole('tab', { name: 'Yourself' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(within(first).getByRole('tabpanel', { name: 'Yourself' })).toHaveTextContent(
      'npm install pyxis-analytics',
    );
    expect(within(first).queryByRole('tabpanel', { name: 'With an AI agent' })).toBeNull();
  });

  it("hands an AI agent a request with the project's key, API and site, and says what it changes", async () => {
    render(<InstallGuide settings={SETTINGS} endpoint="https://api.example.com" i18n={english} />);

    await userEvent.click(screen.getByRole('tab', { name: 'With an AI agent' }));

    const agent = screen.getByRole('tabpanel', { name: 'With an AI agent' });
    expect(document.getElementById('install-agent-prompt')).toHaveTextContent(
      'Install Pyxis on this site following https://pyxis-analytics.dev/llms.txt. The project’s public key is pyxis_pk_store, the endpoint is https://api.example.com and the site is at https://store.example.com.',
    );
    expect(document.getElementById('install-agent-prompt')).toHaveTextContent(
      'list the files you changed and each event you created, with its name and properties, for me to review.',
    );
    expect(
      within(agent)
        .getAllByRole('listitem')
        .slice(0, 4)
        .map((item) => item.textContent),
    ).toEqual([
      '1Open your site’s repository in Claude Code, Cursor or another coding agent.',
      '2Paste the request above and let the agent work.',
      '3Review what it changed: the package, the init and the events it lists. Remove or rename what you do not want.',
      '4Publish the site and open one of its pages. Step 2, below, says when the first event arrives.',
    ]);
    const changes = within(agent).getByRole('group', { name: 'What the agent will change' });
    expect(within(changes).getAllByRole('listitem')).toHaveLength(4);
    expect(changes).toHaveTextContent(
      'The agent only changes the site’s code. It writes nothing to Pyxis.',
    );
    expect(within(agent).getByText('llms.txt').tagName).toBe('CODE');
    expect(within(agent).getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  });

  it('walks a site with Google Tag Manager through the template, with the key and the API filled in', async () => {
    render(<InstallGuide settings={SETTINGS} endpoint="https://api.example.com" i18n={english} />);

    await userEvent.click(screen.getByRole('tab', { name: 'Google Tag Manager' }));

    const tagManager = screen.getByRole('tabpanel', { name: 'Google Tag Manager' });
    expect(screen.queryByRole('tabpanel', { name: 'Yourself' })).toBeNull();
    expect(tagManager).toHaveTextContent(
      'If your site already loads Google Tag Manager, add Pyxis there, without changing the site’s code.',
    );
    expect(
      within(tagManager)
        .getAllByRole('listitem')
        .map((item) => item.firstChild?.textContent),
    ).toEqual(['1', '2', '3', '4', '5']);
    expect(within(tagManager).getAllByRole('listitem')[0]).toHaveTextContent(
      'In Tag Manager, open Templates › Tag Templates › Search Gallery and add Pyxis Analytics. If the gallery does not list it yet, download template.tpl and choose New › ⋮ › Import instead.',
    );
    expect(within(tagManager).getByRole('link', { name: 'template.tpl' })).toHaveAttribute(
      'href',
      'https://github.com/samuelcsantana/pyxis-gtm-template/blob/main/template.tpl',
    );
    expect(within(tagManager).getByText('Initialization - All Pages').tagName).toBe('B');
    expect(document.getElementById('install-tag-manager-key')).toHaveTextContent(
      /^pyxis_pk_store$/,
    );
    expect(within(tagManager).getByRole('button', { name: 'Copy' })).toBeInTheDocument();
    expect(tagManager).toHaveTextContent('The Endpoint field must hold https://api.example.com.');
    expect(within(tagManager).getByText('https://api.example.com').tagName).toBe('CODE');
    expect(tagManager).toHaveTextContent(
      'Publish the container with Submit › Publish. Step 2, below, says when the first event arrives.',
    );
    expect(tagManager).toHaveTextContent(
      'By default the template respects Consent Mode: while analytics_storage is denied, it loads nothing.',
    );
    expect(tagManager).toHaveTextContent(
      'Nuvemshop: paid plans accept the container ID in Configurações › Códigos externos › Google Tag Manager.',
    );
  });

  it('walks a Shopify store through the theme code, with the snippet and the store addresses', async () => {
    render(<InstallGuide settings={SETTINGS} endpoint="https://api.example.com" i18n={english} />);

    await userEvent.click(screen.getByRole('tab', { name: 'Shopify' }));

    const shopify = screen.getByRole('tabpanel', { name: 'Shopify' });
    expect(screen.queryByRole('tabpanel', { name: 'Google Tag Manager' })).toBeNull();
    expect(shopify).toHaveTextContent(
      'On a Shopify store, paste the snippet into the theme. It measures every page the theme shows, products and cart included.',
    );
    expect(
      within(shopify)
        .getAllByRole('listitem')
        .map((item) => item.lastChild?.textContent),
    ).toEqual([
      'In the Shopify admin, open Online Store, then ⋯ › Edit code on the current theme.',
      expect.stringContaining(
        'Open layout/theme.liquid, paste this snippet just before </body> and choose Save:',
      ),
      'In Settings, the allowed origins must hold the address where customers open the store, like https://www.yourstore.com. If the store also opens at https://yourstore.myshopify.com, add that one too.',
      'Open a page of the store. Step 2, below, says when the first event arrives.',
    ]);
    expect(within(shopify).getByText('</body>').tagName).toBe('CODE');
    expect(within(shopify).getByText('Online Store').tagName).toBe('B');
    expect(document.getElementById('install-shopify-script')).toHaveTextContent(
      "init({ key: 'pyxis_pk_store', endpoint: 'https://api.example.com' });",
    );
    expect(within(shopify).getByRole('button', { name: 'Copy' })).toBeInTheDocument();
    expect(within(shopify).getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/p-store/settings',
    );
    expect(shopify).toHaveTextContent(
      'Shopify runs no theme code in the checkout, so the checkout steps and the completed purchase are not measured.',
    );
    expect(shopify).toHaveTextContent(
      'Updating or switching the theme can drop this edit: check that the snippet is still in the new theme.',
    );
  });

  it('walks a WordPress site through a free header plugin, with the classic snippet', async () => {
    render(<InstallGuide settings={SETTINGS} endpoint="https://api.example.com" i18n={english} />);

    await userEvent.click(screen.getByRole('tab', { name: 'WordPress' }));

    const wordPress = screen.getByRole('tabpanel', { name: 'WordPress' });
    expect(screen.queryByRole('tabpanel', { name: 'Shopify' })).toBeNull();
    expect(wordPress).toHaveTextContent(
      'On a WordPress site, paste the snippet with a free plugin, without touching the theme.',
    );
    expect(
      within(wordPress)
        .getAllByRole('listitem')
        .map((item) => item.lastChild?.textContent),
    ).toEqual([
      'In the WordPress admin, open Plugins › Add Plugin, search for WPCode, then install and activate WPCode – Insert Headers and Footers. It is free.',
      expect.stringContaining(
        'Open Code Snippets › Header & Footer, paste this snippet in Header and choose Save Changes:',
      ),
      'In Settings, the allowed origins must hold the site’s address, the one WordPress shows in Settings › General › Site Address (URL), like https://www.yoursite.com.',
      'If the site uses a cache plugin, clear its cache. Then open a page of the site. Step 2, below, says when the first event arrives.',
    ]);
    expect(within(wordPress).getByText('Header & Footer').tagName).toBe('B');
    expect(within(wordPress).getByRole('link', { name: 'WPCode' })).toHaveAttribute(
      'href',
      'https://wordpress.org/plugins/insert-headers-and-footers/',
    );
    const snippet = document.getElementById('install-wordpress-script');
    expect(snippet).toHaveTextContent('/dist/pyxis.global.js"></script>');
    expect(snippet).toHaveTextContent(
      "pyxis.init({ key: 'pyxis_pk_store', endpoint: 'https://api.example.com' });",
    );
    expect(snippet).not.toHaveTextContent('type="module"');
    expect(within(wordPress).getByRole('button', { name: 'Copy' })).toBeInTheDocument();
    expect(within(wordPress).getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/p-store/settings',
    );
    expect(wordPress).toHaveTextContent(
      'If the site already loads Google Tag Manager, the Google Tag Manager tab works too, with no snippet.',
    );
    expect(wordPress).toHaveTextContent('must leave the two Pyxis scripts out.');
    expect(wordPress).toHaveTextContent('updating or switching the theme keeps it.');
    expect(wordPress).toHaveTextContent(
      'On WordPress.com, adding a plugin needs a plan that allows plugins.',
    );
  });

  it('suggests checking the first events with Claude, read-only and revocable in Settings', () => {
    render(<InstallGuide settings={SETTINGS} endpoint="https://api.example.com" i18n={english} />);

    const third = screen.getByRole('region', { name: '3. Check with Claude (optional)' });
    expect(within(third).getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/p-store/settings#settings-connections-heading',
    );
    expect(within(third).getByText('claude.ai/directory/pyxis').tagName).toBe('CODE');
    expect(document.getElementById('install-claude-code')).toHaveTextContent(
      'claude mcp add --transport http pyxis https://api.example.com/mcp',
    );
  });

  it('tells someone on a phone that installing happens on a computer, with the address to send', () => {
    render(<InstallGuide settings={SETTINGS} endpoint="https://api.example.com" i18n={english} />);

    const notice = screen.getByRole('group', { name: 'Installing happens on a computer' });
    expect(notice).toHaveClass('md:hidden');
    expect(notice).toHaveTextContent(window.location.href);
    expect(within(notice).getByRole('button', { name: 'Copy the address' })).toBeInTheDocument();
  });

  it('opens the dashboard once the first event arrived', () => {
    render(
      <InstallGuide
        settings={{
          ...SETTINGS,
          firstEventAt: '2026-11-20T12:01:00.000Z',
          lastEventAt: '2026-11-20T12:01:00.000Z',
        }}
        endpoint="https://api.example.com"
        i18n={english}
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent('The first event arrived.');
    expect(screen.getByRole('link', { name: 'Open the dashboard' })).toHaveAttribute(
      'href',
      '/p-store/overview',
    );
    expect(screen.getByText('Already connected Claude? Ask it:')).toBeInTheDocument();
    expect(document.getElementById('install-first-question')).toHaveTextContent(
      'How many visits did Demo Store get today, and where did they come from?',
    );
  });

  it('sends the owner of a project without a live key to Settings instead of a snippet', () => {
    render(
      <InstallGuide
        settings={{ ...SETTINGS, publicKeys: [], allowedOrigins: [] }}
        endpoint="https://api.example.com"
        i18n={english}
      />,
    );

    const first = screen.getByRole('region', { name: '1. Install Pyxis on your site' });
    expect(first).toHaveTextContent('This project has no live public key, so it is not measuring.');
    expect(first).toHaveTextContent('A revoked key never works again.');
    expect(within(first).getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/p-store/settings#settings-keys-heading',
    );
    expect(within(first).queryByRole('tablist')).not.toBeInTheDocument();
    expect(within(first).queryByRole('button', { name: 'Copy' })).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: '2. Open a page of your site' })).toHaveTextContent(
      'Page views from show up here',
    );
  });

  it('keeps the period and the filters it was opened with in its links to Settings and the dashboard', () => {
    navigation.search = 'range=today&device=mobile';
    const { unmount } = render(
      <InstallGuide
        settings={{ ...SETTINGS, publicKeys: [], allowedOrigins: [] }}
        endpoint="https://api.example.com"
        i18n={english}
      />,
    );

    const first = screen.getByRole('region', { name: '1. Install Pyxis on your site' });
    expect(within(first).getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/p-store/settings?range=today&device=mobile#settings-keys-heading',
    );
    const third = screen.getByRole('region', { name: '3. Check with Claude (optional)' });
    expect(within(third).getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/p-store/settings?range=today&device=mobile#settings-connections-heading',
    );
    unmount();

    render(
      <InstallGuide
        settings={{
          ...SETTINGS,
          firstEventAt: '2026-11-20T12:01:00.000Z',
          lastEventAt: '2026-11-20T12:01:00.000Z',
        }}
        endpoint="https://api.example.com"
        i18n={english}
      />,
    );
    navigation.search = '';

    expect(screen.getByRole('link', { name: 'Open the dashboard' })).toHaveAttribute(
      'href',
      '/p-store/overview?range=today&device=mobile',
    );
  });

  it("tells someone else that only the account's owner creates a key", () => {
    render(
      <InstallGuide
        settings={{ ...SETTINGS, role: 'member', publicKeys: [] }}
        endpoint="https://api.example.com"
        i18n={english}
      />,
    );

    const first = screen.getByRole('region', { name: '1. Install Pyxis on your site' });
    expect(first).toHaveTextContent("Only the account's owner can create one.");
    expect(within(first).queryByRole('link')).not.toBeInTheDocument();
  });
});
