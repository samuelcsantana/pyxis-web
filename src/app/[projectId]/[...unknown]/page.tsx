import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslator } from '@/i18n/get-messages';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t('notFound.title') };
}

export default function UnknownScreen(): never {
  notFound();
}
