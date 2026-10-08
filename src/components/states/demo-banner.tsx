const SOURCE_CODE_URL = 'https://github.com/samuelcsantana/pyxis-web';

export function DemoBanner() {
  return (
    <aside aria-label="Demo notice">
      <p
        role="note"
        className="bg-accent px-4 py-1.5 text-center text-xs font-medium text-accent-ink sm:py-2 sm:text-sm"
      >
        Demo data: invented numbers for two imaginary products. No real visitor is shown here.{' '}
        <a
          href={SOURCE_CODE_URL}
          className="font-semibold underline underline-offset-2 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink"
        >
          Source on GitHub
        </a>
      </p>
    </aside>
  );
}
