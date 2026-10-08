import type { ReactNode } from 'react';
import { MainContent } from '@/components/shell/main-content';
import { LogoMark } from './logo-mark';

export interface BrandedPageProps {
  readonly children: ReactNode;
}

export function BrandedPage({ children }: BrandedPageProps) {
  return (
    <MainContent className="mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center gap-6 px-4 py-16 text-ink">
      <p className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
        <LogoMark size={32} />
        Pyxis
      </p>
      {children}
    </MainContent>
  );
}
