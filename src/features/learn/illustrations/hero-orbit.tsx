/** Abstract civic budget hero — soft gradients, no external assets */
export function HeroOrbit({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="learn-hero-a" x1="0" y1="0" x2="400" y2="280">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="learn-hero-b" x1="200" y1="40" x2="200" y2="240">
          <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0.08" />
          <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="140" rx="160" ry="100" fill="url(#learn-hero-a)" />
      <circle cx="200" cy="120" r="72" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.6" />
      <circle cx="200" cy="120" r="48" stroke="hsl(var(--primary))" strokeWidth="1.5" opacity="0.5" />
      <circle cx="200" cy="120" r="8" fill="hsl(var(--primary))" opacity="0.9" />
      <circle cx="128" cy="88" r="5" fill="hsl(var(--primary))" opacity="0.4" />
      <circle cx="278" cy="152" r="4" fill="hsl(var(--primary))" opacity="0.35" />
      <circle cx="168" cy="178" r="3.5" fill="hsl(var(--muted-foreground))" opacity="0.5" />
      <path
        d="M200 48 L200 92 M200 148 L200 192 M112 120 L156 120 M244 120 L288 120"
        stroke="hsl(var(--border))"
        strokeWidth="1"
        opacity="0.5"
      />
      <rect x="48" y="210" width="88" height="44" rx="12" fill="url(#learn-hero-b)" stroke="hsl(var(--border))" strokeWidth="1" />
      <rect x="264" y="210" width="88" height="44" rx="12" fill="url(#learn-hero-b)" stroke="hsl(var(--border))" strokeWidth="1" />
    </svg>
  );
}
