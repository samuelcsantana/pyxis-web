import { MadeWithPyxis } from '@/components/share/made-with-pyxis';
import { SharedLinkClosed } from '@/components/share/shared-link-closed';
import { getI18n } from '@/i18n/get-messages';

export default async function SharedLinkNotFound() {
  return (
    <div className="min-h-dvh bg-bg text-ink">
      <MadeWithPyxis i18n={await getI18n()} />
      <main id="content">
        <SharedLinkClosed />
      </main>
    </div>
  );
}
