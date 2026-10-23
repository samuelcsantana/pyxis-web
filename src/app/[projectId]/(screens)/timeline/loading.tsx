import { ScreenLoading } from '@/components/states/screen-loading';
import { getI18n } from '@/i18n/get-messages';

export default async function TimelineLoading() {
  return <ScreenLoading screen="timeline" i18n={await getI18n()} />;
}
