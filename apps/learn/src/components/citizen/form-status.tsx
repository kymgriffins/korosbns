"use client";

/** Accessible status region for form success/error (replaces toast-only feedback). */
export function FormStatus({
  message,
  variant = "info",
}: {
  message: string;
  variant?: "info" | "success" | "error";
}) {
  if (!message) return null;

  const role = variant === "error" ? "alert" : "status";
  const className =
    variant === "error"
      ? "rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
      : variant === "success"
        ? "rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400"
        : "rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground";

  return (
    <p role={role} aria-live="polite" className={className}>
      {message}
    </p>
  );
}
