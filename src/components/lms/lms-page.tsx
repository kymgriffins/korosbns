import { cn } from "@/utils";

type LmsPageProps = {
  children: React.ReactNode;
  className?: string;
  /** Lesson views use a narrower reading width */
  variant?: "default" | "lesson";
};

export function LmsPage({ children, className, variant = "default" }: LmsPageProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 py-6 md:px-6 md:py-8",
        variant === "lesson" ? "max-w-5xl" : "max-w-6xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function LmsSection({
  children,
  className,
  title,
  description,
}: {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}) {
  return (
    <section className={cn("space-y-4", className)}>
      {(title || description) && (
        <header className="space-y-1">
          {title ? (
            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h2>
          ) : null}
          {description ? (
            <p className="text-sm text-muted-foreground md:text-base">{description}</p>
          ) : null}
        </header>
      )}
      {children}
    </section>
  );
}
