export function ForumWave({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 120" fill="none" className={className} aria-hidden>
      <rect x="12" y="20" width="96" height="56" rx="14" fill="hsl(var(--primary)/0.08)" stroke="hsl(var(--border))" />
      <rect x="52" y="44" width="96" height="56" rx="14" fill="hsl(var(--background))" stroke="hsl(var(--primary)/0.35)" strokeWidth="1.5" />
      <circle cx="72" cy="62" r="10" fill="hsl(var(--primary)/0.15)" />
      <rect x="88" y="58" width="44" height="6" rx="3" fill="hsl(var(--muted-foreground)/0.2)" />
      <rect x="88" y="70" width="32" height="6" rx="3" fill="hsl(var(--muted-foreground)/0.12)" />
    </svg>
  );
}
