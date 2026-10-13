const FORWARDED_HOST_HEADER = 'x-forwarded-host';
const HOST_HEADER = 'host';

export function hostnameOf(host: string | null): string | undefined {
  if (host === null || host === '') {
    return undefined;
  }
  try {
    return new URL(`http://${host}`).hostname;
  } catch {
    return undefined;
  }
}

export function requestHostname(headers: Headers): string | undefined {
  return hostnameOf(headers.get(FORWARDED_HOST_HEADER) ?? headers.get(HOST_HEADER));
}
