import type { ReactNode } from 'react';
import { FOCUS_RING } from '@/components/ui/control-classes';
import { MainContent } from '@/components/shell/main-content';
import { BrandBackdrop } from './brand-backdrop';
import { LogoMark } from './logo-mark';
import { RAISED_CARDS } from './raised-cards';

export interface BrandedPageProps {
  readonly children: ReactNode;
  readonly logoHref?: string;
}

const LOGO = 'flex items-center gap-2.5 text-xl font-bold tracking-tight';

export function BrandedPage({ children, logoHref }: BrandedPageProps) {
  return (
    <div className="relative isolate">
      <BrandBackdrop />
      <MainContent
        className={`mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center gap-6 px-4 py-16 text-ink ${RAISED_CARDS}`}
      >
        {logoHref === undefined ? (
          <p className={LOGO}>
            <LogoMark size={32} />
            Pyxis
          </p>
        ) : (
          <a href={logoHref} className={`${LOGO} self-start ${FOCUS_RING}`}>
            <LogoMark size={32} />
            Pyxis
          </a>
        )}
        {children}
      </MainContent>
    </div>
  );
}
