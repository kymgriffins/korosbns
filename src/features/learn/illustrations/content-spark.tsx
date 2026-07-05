export function ContentSpark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 120" fill="none" className={className} aria-hidden>
      <rect x="24" y="28" width="48" height="64" rx="12" fill="hsl(var(--muted)/0.35)" stroke="hsl(var(--border))" />
      <rect x="56" y="20" width="48" height="64" rx="12" fill="hsl(var(--background))" stroke="hsl(var(--border))" />
      <rect x="88" y="32" width="48" height="64" rx="12" fill="hsl(var(--primary)/0.06)" stroke="hsl(var(--primary)/0.3)" strokeWidth="1.5" />
      <path d="M108 52l8 8-8 8" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
