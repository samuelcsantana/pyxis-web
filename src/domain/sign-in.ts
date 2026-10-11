export type SignInFieldProblem = 'emailMissing' | 'emailMalformed' | 'codeIncomplete';

const EMAIL_ADDRESS =
  /^(?:[A-Za-z0-9_'+-]+\.)*[A-Za-z0-9_'+-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9-]*\.)+[A-Za-z]{2,}$/;

export function emailProblem(email: string): SignInFieldProblem | null {
  const trimmed = email.trim();
  if (trimmed === '') {
    return 'emailMissing';
  }
  return EMAIL_ADDRESS.test(trimmed) ? null : 'emailMalformed';
}

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;

export function countdownLabel(milliseconds: number): string {
  const seconds = Math.max(0, Math.ceil(milliseconds / MILLISECONDS_PER_SECOND));
  const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
  return `${String(minutes)}:${String(seconds % SECONDS_PER_MINUTE).padStart(2, '0')}`;
}

export function codeProblem(code: string, length: number): SignInFieldProblem | null {
  return code.length < length ? 'codeIncomplete' : null;
}
