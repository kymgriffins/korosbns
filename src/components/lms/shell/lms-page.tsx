/**
 * @sdp-provenance
 * intent: INTENT-001
 * capability: CAP-learning-shell
 * contracts: CTR-lms-shell@1.0.0
 * builder: SDP-Builder
 * date: 2026-07-07
 */
import { cn } from "@/utils";
import { LMS_LAYOUT } from "@/constants/lms-design-tokens";

type LmsPageProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "lesson";
};

export function LmsPage({ children, className, variant = "default" }: LmsPageProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 py-12 md:px-8 md:py-14 xl:px-12 xl:py-16",
        variant === "lesson" ? LMS_LAYOUT.lessonMaxWidthClass : LMS_LAYOUT.maxWidthClass,
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
    <section className={cn("space-y-6", className)}>
      {(title || description) && (
        <header className="space-y-3">
          {title ? (
            <h2 className="text-2xl font-semibold tracking-tight md:text-[2rem]">{title}</h2>
          ) : null}
          {description ? (
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{description}</p>
          ) : null}
        </header>
      )}
      {children}
    </section>
  );
}
