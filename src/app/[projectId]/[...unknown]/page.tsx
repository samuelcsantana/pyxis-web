import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NOT_FOUND_TITLE } from '@/components/states/not-found-panel';

export const metadata: Metadata = { title: NOT_FOUND_TITLE };

export default function UnknownScreen(): never {
  notFound();
}
