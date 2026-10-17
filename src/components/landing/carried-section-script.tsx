import { carriedSectionScript } from '@/lib/carried-section';

export interface CarriedSectionScriptProps {
  readonly nonce: string | undefined;
}

export function CarriedSectionScript({ nonce }: CarriedSectionScriptProps) {
  return <script nonce={nonce} dangerouslySetInnerHTML={{ __html: carriedSectionScript() }} />;
}
