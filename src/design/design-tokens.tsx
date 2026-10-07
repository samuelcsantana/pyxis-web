export const COLOR_TOKENS = [
  { name: 'bg', use: 'Page background' },
  { name: 'card', use: 'Cards, panels, inputs' },
  { name: 'line', use: 'Borders and dividers' },
  { name: 'grid', use: 'Chart grid lines' },
  { name: 'ink', use: 'Text, selected controls' },
  { name: 'muted', use: 'Secondary text' },
  { name: 'soft', use: 'Subtle fills' },
  { name: 'accent', use: 'Primary action, sidebar focus, the key number' },
  { name: 'accent-ink', use: 'Text on the accent' },
  { name: 'accent-hover', use: 'Primary button under the pointer' },
  { name: 'accent-pressed', use: 'Primary button pressed' },
  { name: 'ink-hover', use: 'Strong button under the pointer' },
  { name: 'ink-pressed', use: 'Strong button pressed' },
  { name: 'focus', use: 'Focus ring on content surfaces' },
  { name: 'sky', use: 'Chart series one' },
  { name: 'sky-ink', use: 'Text in sky' },
  { name: 'violet', use: 'Chart series two' },
  { name: 'violet-ink', use: 'Text in violet' },
  { name: 'teal', use: 'Chart series four' },
  { name: 'slate', use: 'Neutral series' },
  { name: 'ok', use: 'Success, positive change' },
  { name: 'ok-soft', use: 'Success background' },
  { name: 'bad', use: 'Errors, drop-offs, server errors' },
  { name: 'bad-soft', use: 'Error background' },
  { name: 'warn', use: 'Client errors (4xx)' },
  { name: 'warn-soft', use: 'Warning background' },
  { name: 'nav', use: 'Sidebar background, both themes' },
  { name: 'nav-raised', use: 'Sidebar cards and the project switcher' },
  { name: 'nav-hover', use: 'Sidebar item under the pointer' },
  { name: 'nav-active', use: 'Current or pressed sidebar item' },
  { name: 'nav-line', use: 'Sidebar dividers' },
  { name: 'nav-border', use: 'Sidebar borders and avatars' },
  { name: 'nav-text', use: 'Sidebar text' },
  { name: 'nav-muted', use: 'Sidebar captions and icons' },
  { name: 'nav-strong', use: 'Sidebar headings and the current item' },
] as const;

export const RADIUS_TOKENS = ['chip', 'control', 'input', 'card', 'panel', 'pill'] as const;

export const TYPE_SCALE = [
  { label: 'Display', className: 'text-5xl font-bold tracking-tight' },
  { label: 'Heading', className: 'text-2xl font-semibold tracking-tight' },
  { label: 'Body', className: 'text-base' },
  { label: 'Caption', className: 'text-sm text-muted' },
  { label: 'Data', className: 'font-mono text-sm' },
] as const;

export function DesignTokens() {
  return (
    <div className="flex max-w-4xl flex-col gap-10 p-6 text-ink">
      <section aria-labelledby="colors-heading" className="flex flex-col gap-4">
        <h2 id="colors-heading" className="text-lg font-semibold">
          Colors
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {COLOR_TOKENS.map((token) => (
            <li
              key={token.name}
              className="flex items-center gap-3 rounded-card border border-line bg-card p-3"
            >
              <span
                aria-hidden="true"
                className="size-10 shrink-0 rounded-control border border-line"
                style={{ background: `var(--color-${token.name})` }}
              />
              <span className="flex min-w-0 flex-col">
                <code className="font-mono text-sm">{token.name}</code>
                <span className="text-sm text-muted">{token.use}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="type-heading" className="flex flex-col gap-4">
        <h2 id="type-heading" className="text-lg font-semibold">
          Type
        </h2>
        <ul className="flex flex-col gap-3">
          {TYPE_SCALE.map((step) => (
            <li key={step.label} className={step.className}>
              {step.label}: 4,758 visits
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="radius-heading" className="flex flex-col gap-4">
        <h2 id="radius-heading" className="text-lg font-semibold">
          Radius
        </h2>
        <ul className="flex flex-wrap gap-4">
          {RADIUS_TOKENS.map((radius) => (
            <li key={radius} className="flex flex-col items-center gap-2">
              <span
                aria-hidden="true"
                className="size-14 border border-line bg-soft"
                style={{ borderRadius: `var(--radius-${radius})` }}
              />
              <code className="font-mono text-sm">{radius}</code>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
