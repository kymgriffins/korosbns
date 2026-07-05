export function AlertsPulse({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 120" fill="none" className={className} aria-hidden>
      <circle cx="80" cy="60" r="40" fill="hsl(var(--primary)/0.06)" />
      <circle cx="80" cy="60" r="28" stroke="hsl(var(--primary)/0.2)" strokeWidth="1" />
      <path
        d="M80 36c-8 0-14 6.5-14 14.5v8l-3 5h34l-3-5v-8C94 42.5 88 36 80 36z"
        fill="hsl(var(--primary)/0.15)"
        stroke="hsl(var(--primary)/0.4)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="80" cy="72" r="3" fill="hsl(var(--primary))" />
    </svg>
  );
}
