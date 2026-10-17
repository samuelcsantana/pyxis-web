import { landingBootScript } from '@/lib/landing-boot';

export interface LandingBootScriptProps {
  readonly nonce: string | undefined;
}

export function LandingBootScript({ nonce }: LandingBootScriptProps) {
  return <script nonce={nonce} dangerouslySetInnerHTML={{ __html: landingBootScript() }} />;
}
