import { signUpOfferOf } from '@/domain/sign-up';
import { isDemoMode } from '@/lib/api-config';
import { LLMS_TEXT_CONTENT_TYPE, llmsText } from '@/lib/llms-text';
import { bestEffortOpenSignUp } from '@/lib/landing-sign-up';
import { isOnLandingHost } from '@/lib/request-host';

const STATUS_NOT_FOUND = 404;

export async function GET(): Promise<Response> {
  if (!isDemoMode() || !(await isOnLandingHost())) {
    return new Response(null, { status: STATUS_NOT_FOUND });
  }
  const offer = signUpOfferOf(await bestEffortOpenSignUp());
  return new Response(llmsText(offer), { headers: { 'content-type': LLMS_TEXT_CONTENT_TYPE } });
}
