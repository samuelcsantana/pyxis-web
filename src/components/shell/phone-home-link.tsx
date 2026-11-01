'use client';

import { LogoMark } from '@/components/brand/logo-mark';
import { FOCUS_RING } from '@/components/ui/control-classes';
import { useT } from '@/i18n/messages-provider';
import { useProjectChoices } from './project-choices';
import { FIRST_SCREEN, screenHref, screenLabelKey } from './screens';
import { ViewKeepingLink } from './view-keeping-link';

export function PhoneHomeLink() {
  const t = useT();
  const { currentProject } = useProjectChoices();
  return (
    <ViewKeepingLink
      href={screenHref(currentProject.id, FIRST_SCREEN)}
      className={`-ml-2 flex size-11 shrink-0 items-center justify-center rounded-control text-ink lg:hidden ${FOCUS_RING}`}
    >
      <LogoMark size={24} />
      <span className="sr-only">{t(screenLabelKey(FIRST_SCREEN))}</span>
    </ViewKeepingLink>
  );
}
