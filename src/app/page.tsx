import { LogoMark } from '@/components/brand/logo-mark';

const REPOSITORIES = [
  {
    name: 'pyxis-api',
    role: 'Ingestion and queries',
    href: 'https://github.com/samuelcsantana/pyxis-api',
  },
  {
    name: 'pyxis-sdk',
    role: 'Browser tracker',
    href: 'https://github.com/samuelcsantana/pyxis-sdk',
  },
  {
    name: 'pyxis-web',
    role: 'This dashboard',
    href: 'https://github.com/samuelcsantana/pyxis-web',
  },
] as const;

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-10 px-6 py-16">
      <header className="flex flex-col gap-5">
        <div className="flex items-center gap-3 text-ink">
          <LogoMark size={48} />
          <span className="text-4xl font-bold tracking-tight">Pyxis</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          Privacy-first product analytics
        </h1>
        <p className="max-w-prose text-base leading-7 text-muted">
          See how a product is used without cookies, without personal data and without sending
          anything to a third party. The dashboard is under construction.
        </p>
      </header>
      <nav aria-label="Project repositories">
        <ul className="grid gap-3 sm:grid-cols-3">
          {REPOSITORIES.map((repository) => (
            <li key={repository.name}>
              <a
                href={repository.href}
                className="flex flex-col gap-1 rounded-card border border-line bg-card p-4 transition-colors hover:border-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <span className="font-mono text-sm font-medium">{repository.name}</span>
                <span className="text-sm text-muted">{repository.role}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
