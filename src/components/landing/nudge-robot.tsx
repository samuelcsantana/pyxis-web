const ID = 'pyxis-robot';
const url = (name: string): string => `url(#${ID}-${name})`;

interface Stop {
  readonly offset: string;
  readonly color: string;
}

function Stops({ stops }: { readonly stops: readonly Stop[] }) {
  return stops.map((stop) => (
    <stop key={stop.offset} offset={stop.offset} stopColor={`var(--robot-${stop.color})`} />
  ));
}

function Glow({ name, blur }: { readonly name: string; readonly blur: number }) {
  return (
    <filter id={`${ID}-${name}`} x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation={blur} result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  );
}

function Fingers({ side }: { readonly side: 'left' | 'right' }) {
  const paths =
    side === 'left'
      ? ['M31 200 C28 206, 30 212, 34 213', 'M38 201 C37 207, 39 213, 42 214']
      : ['M189 200 C192 206, 190 212, 186 213', 'M182 201 C183 207, 181 213, 178 214'];
  const thumb =
    side === 'left' ? 'M45 199 C47 204, 46 209, 44 211' : 'M175 199 C173 204, 174 209, 176 211';
  return (
    <>
      {paths.map((d) => (
        <path key={d} d={d} stroke={url('head')} strokeWidth={5} strokeLinecap="round" />
      ))}
      <path d={thumb} stroke={url('head')} strokeWidth={4.5} strokeLinecap="round" />
    </>
  );
}

export function NudgeRobot() {
  return (
    <svg
      className="landing-robot-svg"
      viewBox="0 0 220 275"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${ID}-head`} cx="35%" cy="22%" r="75%">
          <Stops
            stops={[
              { offset: '0%', color: 'metal-1' },
              { offset: '28%', color: 'metal-2' },
              { offset: '70%', color: 'metal-3' },
              { offset: '100%', color: 'metal-4' },
            ]}
          />
        </radialGradient>
        <radialGradient id={`${ID}-body`} cx="32%" cy="25%" r="75%">
          <Stops
            stops={[
              { offset: '0%', color: 'metal-1' },
              { offset: '35%', color: 'metal-2' },
              { offset: '75%', color: 'metal-3' },
              { offset: '100%', color: 'metal-4' },
            ]}
          />
        </radialGradient>
        <linearGradient id={`${ID}-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stops
            stops={[
              { offset: '0%', color: 'gold-1' },
              { offset: '25%', color: 'gold-2' },
              { offset: '55%', color: 'gold-3' },
              { offset: '80%', color: 'gold-2' },
              { offset: '100%', color: 'gold-4' },
            ]}
          />
        </linearGradient>
        <radialGradient id={`${ID}-gold-orb`} cx="32%" cy="28%" r="70%">
          <Stops
            stops={[
              { offset: '0%', color: 'gold-1' },
              { offset: '30%', color: 'gold-2' },
              { offset: '72%', color: 'gold-3' },
              { offset: '100%', color: 'gold-4' },
            ]}
          />
        </radialGradient>
        <radialGradient id={`${ID}-silver-orb`} cx="30%" cy="28%" r="70%">
          <Stops
            stops={[
              { offset: '0%', color: 'silver-1' },
              { offset: '45%', color: 'silver-2' },
              { offset: '85%', color: 'silver-3' },
              { offset: '100%', color: 'silver-4' },
            ]}
          />
        </radialGradient>
        <linearGradient id={`${ID}-visor`} x1="0%" y1="0%" x2="0%" y2="100%">
          <Stops
            stops={[
              { offset: '0%', color: 'visor-1' },
              { offset: '45%', color: 'visor-2' },
              { offset: '100%', color: 'metal-4' },
            ]}
          />
        </linearGradient>
        <radialGradient id={`${ID}-led`} cx="50%" cy="50%" r="55%">
          <Stops
            stops={[
              { offset: '0%', color: 'led-1' },
              { offset: '45%', color: 'led-2' },
              { offset: '85%', color: 'led-3' },
              { offset: '100%', color: 'led-4' },
            ]}
          />
        </radialGradient>
        <linearGradient id={`${ID}-flame`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--robot-silver-1)" />
          <stop offset="35%" stopColor="var(--robot-led-2)" />
          <stop offset="75%" stopColor="var(--robot-gold-2)" />
          <stop offset="100%" stopColor="var(--robot-gold-2)" stopOpacity={0} />
        </linearGradient>
        <Glow name="led-glow" blur={4.5} />
        <Glow name="gold-glow" blur={3.5} />
      </defs>

      <g className="landing-robot-flame" filter={url('led-glow')}>
        <path d="M92 234 Q110 278 128 234 Z" fill={url('flame')} />
        <path d="M100 234 Q110 262 120 234 Z" fill="var(--robot-silver-1)" />
      </g>

      <rect
        x={92}
        y={122}
        width={36}
        height={16}
        rx={6}
        fill={url('body')}
        stroke="var(--robot-edge)"
      />
      <ellipse cx={110} cy={130} rx={18} ry={3} fill={url('gold')} opacity={0.75} />

      <g className="landing-robot-arm-left">
        <circle cx={54} cy={146} r={12} fill={url('body')} stroke={url('gold')} strokeWidth={2} />
        <rect
          x={34}
          y={148}
          width={22}
          height={32}
          rx={11}
          transform="rotate(14 45 164)"
          fill={url('body')}
        />
        <rect
          x={28}
          y={170}
          width={24}
          height={30}
          rx={10}
          transform="rotate(8 40 185)"
          fill={url('head')}
          stroke="var(--robot-edge)"
        />
        <rect
          x={27}
          y={191}
          width={24}
          height={5}
          rx={2.5}
          transform="rotate(8 39 193)"
          fill={url('gold')}
        />
        <Fingers side="left" />
      </g>

      <g className="landing-robot-arm-right">
        <circle cx={166} cy={146} r={12} fill={url('body')} stroke={url('gold')} strokeWidth={2} />
        <rect
          x={164}
          y={148}
          width={22}
          height={32}
          rx={11}
          transform="rotate(-14 175 164)"
          fill={url('body')}
        />
        <rect
          x={168}
          y={170}
          width={24}
          height={30}
          rx={10}
          transform="rotate(-8 180 185)"
          fill={url('head')}
          stroke="var(--robot-edge)"
        />
        <rect
          x={169}
          y={191}
          width={24}
          height={5}
          rx={2.5}
          transform="rotate(-8 181 193)"
          fill={url('gold')}
        />
        <Fingers side="right" />
      </g>

      <ellipse
        cx={110}
        cy={233}
        rx={24}
        ry={9}
        fill="var(--robot-metal-4)"
        stroke="var(--robot-edge)"
        strokeWidth={1.5}
      />

      <rect
        x={56}
        y={132}
        width={108}
        height={100}
        rx={34}
        fill={url('body')}
        stroke="var(--robot-edge)"
        strokeWidth={1.5}
      />
      <path
        d="M72 138 C90 134, 130 134, 148 138"
        stroke="var(--robot-shine)"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <path d="M57 202 Q110 210 163 202" stroke="var(--robot-metal-4)" strokeWidth={2.5} />

      <rect
        x={81}
        y={146}
        width={58}
        height={58}
        rx={15}
        fill="var(--robot-visor-2)"
        stroke={url('gold')}
        strokeWidth={2.5}
      />
      <line
        x1={96}
        y1={189}
        x2={124}
        y2={161}
        stroke="var(--robot-led-1)"
        strokeWidth={4}
        strokeLinecap="round"
        filter={url('led-glow')}
      />
      <line
        x1={96}
        y1={189}
        x2={124}
        y2={161}
        stroke="var(--robot-silver-2)"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <circle cx={96} cy={189} r={6} fill={url('silver-orb')} filter={url('led-glow')} />
      <circle cx={124} cy={161} r={6} fill={url('silver-orb')} filter={url('led-glow')} />
      <circle
        className="landing-robot-heart"
        cx={110}
        cy={175}
        r={9.5}
        fill={url('gold-orb')}
        filter={url('gold-glow')}
      />

      <g className="landing-robot-head">
        <ellipse
          cx={110}
          cy={40}
          rx={11}
          ry={4.5}
          fill={url('head')}
          stroke="var(--robot-edge)"
          strokeWidth={1.2}
        />
        <line
          x1={110}
          y1={40}
          x2={115}
          y2={20}
          stroke="var(--robot-silver-3)"
          strokeWidth={4}
          strokeLinecap="round"
        />
        <circle cx={116} cy={16} r={10.5} fill={url('gold-orb')} filter={url('gold-glow')} />
        <rect
          x={29}
          y={72}
          width={12}
          height={32}
          rx={6}
          fill={url('head')}
          stroke={url('gold')}
          strokeWidth={2}
        />
        <rect
          x={179}
          y={72}
          width={12}
          height={32}
          rx={6}
          fill={url('head')}
          stroke={url('gold')}
          strokeWidth={2}
        />
        <ellipse cx={186} cy={88} rx={2.5} ry={9} fill={url('gold-orb')} />
        <rect
          x={36}
          y={38}
          width={148}
          height={90}
          rx={36}
          fill={url('head')}
          stroke="var(--robot-edge)"
          strokeWidth={1.5}
        />
        <path
          d="M64 44 C92 40, 128 40, 156 44"
          stroke="var(--robot-shine)"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <rect
          x={49}
          y={51}
          width={122}
          height={64}
          rx={24}
          fill={url('visor')}
          stroke={url('gold')}
          strokeWidth={3.2}
        />
        <g className="landing-robot-eyes" filter={url('led-glow')}>
          <circle cx={84} cy={85} r={12} fill={url('led')} />
          <circle cx={136} cy={85} r={12} fill={url('led')} />
          <path d="M104 94 Q110 101 116 94 Z" fill={url('led')} />
        </g>
      </g>
    </svg>
  );
}
