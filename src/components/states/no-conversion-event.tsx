export function NoConversionEvent() {
  return (
    <p className="text-caption leading-5 text-muted">
      No conversion event is set for this project, so conversions are not shown. The operator sets
      one with the API&apos;s{' '}
      <code className="font-mono text-xs whitespace-nowrap">project:update</code> command and its{' '}
      <code className="font-mono text-xs whitespace-nowrap">--conversion-event</code> option.
    </p>
  );
}
