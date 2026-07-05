export function DocumentsStack({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 120" fill="none" className={className} aria-hidden>
      <rect x="28" y="52" width="72" height="52" rx="10" fill="hsl(var(--muted)/0.5)" stroke="hsl(var(--border))" />
      <rect x="44" y="38" width="72" height="52" rx="10" fill="hsl(var(--background))" stroke="hsl(var(--border))" />
      <rect x="60" y="24" width="72" height="52" rx="10" fill="hsl(var(--primary)/0.06)" stroke="hsl(var(--primary)/0.35)" strokeWidth="1.5" />
      <rect x="72" y="40" width="36" height="4" rx="2" fill="hsl(var(--primary)/0.35)" />
      <rect x="72" y="50" width="48" height="3" rx="1.5" fill="hsl(var(--muted-foreground)/0.2)" />
      <rect x="72" y="58" width="40" height="3" rx="1.5" fill="hsl(var(--muted-foreground)/0.15)" />
    </svg>
  );
}
