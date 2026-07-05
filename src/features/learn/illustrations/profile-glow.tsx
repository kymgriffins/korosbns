export function ProfileGlow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 120" fill="none" className={className} aria-hidden>
      <circle cx="80" cy="52" r="36" fill="hsl(var(--primary)/0.08)" />
      <circle cx="80" cy="52" r="28" stroke="hsl(var(--primary)/0.25)" strokeWidth="1.5" />
      <circle cx="80" cy="48" r="14" fill="hsl(var(--primary)/0.2)" />
      <rect x="56" y="78" width="48" height="24" rx="12" fill="hsl(var(--muted)/0.4)" stroke="hsl(var(--border))" />
    </svg>
  );
}
