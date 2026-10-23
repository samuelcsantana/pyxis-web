import { ScreenLoading } from '@/components/states/screen-loading';
import { getI18n } from '@/i18n/get-messages';

export default async function VisitsLoading() {
  return <ScreenLoading screen="visits" i18n={await getI18n()} />;
}
