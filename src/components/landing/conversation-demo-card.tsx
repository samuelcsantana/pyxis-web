import { LogoMark } from '@/components/brand/logo-mark';
import { ConversationPlayer } from './conversation-demo';

export interface ConversationDemoLabels {
  readonly label: string;
  readonly connected: string;
  readonly replay: string;
  readonly you: string;
  readonly claude: string;
  readonly question: string;
  readonly used: string;
  readonly answer: string;
  readonly invented: string;
}

export interface ConversationDemoProps {
  readonly labels: ConversationDemoLabels;
  readonly tools: readonly string[];
}

export const PROTOCOL = 'Model Context Protocol';
const FLASH_ICON = 'M13 2 3 14h9l-1 8 10-12h-9l1-8z';
const ROLE = 'mb-1.5 text-micro font-bold tracking-[0.05em] uppercase';

export function ConversationDemo({ labels, tools }: ConversationDemoProps) {
  return (
    <ConversationPlayer
      tools={tools}
      answer={labels.answer}
      replay={labels.replay}
      header={
        <>
          <span className="grid size-7 shrink-0 place-items-center rounded-control border border-nav-line bg-nav">
            <LogoMark size={20} />
          </span>
          <figcaption id="ask-claude-example" className="text-sm font-semibold">
            {labels.label}
          </figcaption>
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-accent/30 bg-accent/12 px-2.5 py-0.5 text-micro font-semibold text-accent">
            <span
              aria-hidden="true"
              className="landing-demo-pulse size-1.5 rounded-pill bg-accent"
            />
            {labels.connected}
          </span>
        </>
      }
      question={
        <>
          <p className={`${ROLE} text-nav-muted`}>{labels.you}</p>
          <p className="rounded-card border border-nav-line bg-nav-raised px-4 py-3 text-sm leading-relaxed">
            {labels.question}
          </p>
        </>
      }
      used={
        <span className="flex items-center gap-1.5 text-caption font-medium text-nav-muted">
          <svg
            width={14}
            height={14}
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="text-accent"
          >
            <path d={FLASH_ICON} fill="none" stroke="currentColor" strokeWidth={2} />
          </svg>
          {labels.used}
        </span>
      }
      claude={<p className={`${ROLE} text-accent`}>{labels.claude}</p>}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-nav-line px-4 py-3 text-caption text-nav-muted sm:px-6">
          <span>{labels.invented}</span>
          <span className="font-medium text-nav-text">{PROTOCOL}</span>
        </div>
      }
    />
  );
}
