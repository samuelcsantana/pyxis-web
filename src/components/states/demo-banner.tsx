const SOURCE_CODE_URL = 'https://github.com/samuelcsantana/pyxis-web';

export function DemoBanner() {
  return (
    <p role="note" className="bg-accent px-4 py-2 text-center text-sm font-medium text-accent-ink">
      Demo data: invented numbers for two imaginary products. No real visitor is shown here.{' '}
      <a
        href={SOURCE_CODE_URL}
        className="font-semibold underline underline-offset-2 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink"
      >
        Source on GitHub
      </a>
    </p>
  );
}
