import { ScreenLoading } from '@/components/states/screen-loading';
import { getI18n } from '@/i18n/get-messages';

export default async function FeaturesLoading() {
  return <ScreenLoading screen="features" i18n={await getI18n()} />;
}
