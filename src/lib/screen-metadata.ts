import type { Metadata } from 'next';
import { projectOrNotFound } from './current-admin';

export interface ScreenMetadataProps {
  readonly params: Promise<{ readonly projectId: string }>;
}

export function screenMetadata(screen: string): (props: ScreenMetadataProps) => Promise<Metadata> {
  return async ({ params }) => {
    await projectOrNotFound((await params).projectId);
    return { title: `${screen} · Pyxis` };
  };
}
