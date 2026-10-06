import type { Channel } from '@/domain/acquisition';

export interface ChannelColor {
  readonly fill: string;
  readonly swatch: string;
}

export const CHANNEL_COLORS: Readonly<Record<Channel, ChannelColor>> = {
  paid: { fill: 'var(--color-accent)', swatch: 'bg-accent' },
  email: { fill: 'var(--color-ok)', swatch: 'bg-ok' },
  social: { fill: 'var(--color-teal)', swatch: 'bg-teal' },
  campaign: { fill: 'var(--color-warn)', swatch: 'bg-warn' },
  organic: { fill: 'var(--color-sky)', swatch: 'bg-sky' },
  referral: { fill: 'var(--color-slate)', swatch: 'bg-slate' },
  direct: { fill: 'var(--color-violet)', swatch: 'bg-violet' },
};
