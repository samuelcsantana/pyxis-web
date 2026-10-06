import type { Metadata } from 'next';
import { LogoMark } from '@/components/brand/logo-mark';
import { SignInForm } from '@/components/sign-in/sign-in-form';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { isDemoMode } from '@/lib/api-config';
import { chosenTheme } from '@/lib/theme-cookie';
import { DEMO_SIGN_IN_CODE } from '@/services/auth/mock-auth-service';

export const metadata: Metadata = { title: 'Sign in · Pyxis' };

const SHIELD_ICON = 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z M9 12l2 2 4-4';

export interface SignInPageProps {
  readonly searchParams: Promise<Readonly<Record<string, string | string[] | undefined>>>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { expired } = await searchParams;
  return (
    <div className="flex min-h-dvh flex-col items-center bg-bg px-4 pt-6 pb-10 text-ink">
      <div className="flex w-full max-w-6xl justify-end">
        <ThemeToggle initialTheme={await chosenTheme()} />
      </div>
      <main className="flex w-full grow flex-col items-center justify-center gap-7 py-8">
        <div className="flex flex-col items-center gap-3.5">
          <LogoMark size={56} />
          <span className="text-[26px] font-bold tracking-tight">Pyxis</span>
        </div>
        <SignInForm
          sessionExpired={expired === '1'}
          demoCode={isDemoMode() ? DEMO_SIGN_IN_CODE : undefined}
        />
        <p className="flex items-center gap-2 text-center text-[13px] text-muted">
          <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
            <path
              d={SHIELD_ICON}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Privacy-first product analytics · no cookies on your visitors, no personal data
        </p>
      </main>
    </div>
  );
}
