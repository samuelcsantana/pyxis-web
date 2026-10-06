export class UnauthenticatedError extends Error {
  constructor() {
    super('The session is missing, expired or revoked.');
    this.name = 'UnauthenticatedError';
  }
}

export class InvalidCodeError extends Error {
  constructor() {
    super('The sign-in code is wrong, expired or already used.');
    this.name = 'InvalidCodeError';
  }
}

export class RateLimitedError extends Error {
  constructor() {
    super('Too many attempts from this address.');
    this.name = 'RateLimitedError';
  }
}

export class ApiNotFoundError extends Error {
  constructor(readonly path: string) {
    super(`The Pyxis API knows nothing at ${path}.`);
    this.name = 'ApiNotFoundError';
  }
}

export class ApiRequestError extends Error {
  constructor(
    readonly path: string,
    readonly status: number,
  ) {
    super(`The Pyxis API answered ${String(status)} to ${path}.`);
    this.name = 'ApiRequestError';
  }
}
