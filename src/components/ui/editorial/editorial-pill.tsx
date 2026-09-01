import { cn } from "@/utils";

type EditorialPillProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "muted" | "invert";
};

export function EditorialPill({
  children,
  className,
  variant = "default",
}: EditorialPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold",
        variant === "default" && "bg-muted text-foreground/70",
        variant === "muted" &&
          "bg-muted/60 text-muted-foreground uppercase tracking-wider",
        variant === "invert" &&
          "border border-white/20 bg-white/10 text-white backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </span>
  );
}
