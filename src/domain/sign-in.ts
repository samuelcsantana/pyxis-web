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

export function codeProblem(code: string, length: number): SignInFieldProblem | null {
  return code.length < length ? 'codeIncomplete' : null;
}
