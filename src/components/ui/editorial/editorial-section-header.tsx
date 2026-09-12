import { cn } from "@/utils";
import { EditorialPill } from "./editorial-pill";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";

type EditorialSectionHeaderProps = {
  eyebrow?: string;
  eyebrowDot?: boolean;
  title: React.ReactNode;
  description?: string;
  className?: string;
  align?: "start" | "center";
  titleAs?: "h1" | "h2";
};

/**
 * Asymmetric section header - title left, lead right (Marwa editorial layout).
 */
export function EditorialSectionHeader({
  eyebrow,
  eyebrowDot = true,
  title,
  description,
  className,
  align = "start",
  titleAs = "h2",
}: EditorialSectionHeaderProps) {
  const TitleTag = titleAs;
  const isCentered = align === "center";

  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-4 md:mb-12",
        isCentered
          ? "items-center text-center"
          : "items-start justify-between md:flex-row md:items-end",
        className,
      )}
    >
      <div className={cn("max-w-2xl", isCentered && "mx-auto")}>
        {eyebrow ? (
          <EditorialPill dot={eyebrowDot} pulse={eyebrowDot} className="mb-4">
            {eyebrow}
          </EditorialPill>
        ) : null}
        <TitleTag className={T.sectionTitle}>{title}</TitleTag>
        {description && isCentered ? (
          <p className={cn(T.lead, "mx-auto mt-4 max-w-2xl")}>{description}</p>
        ) : null}
      </div>
      {description && !isCentered ? (
        <p className={cn(T.lead, "max-w-sm md:text-right")}>{description}</p>
      ) : null}
    </div>
  );
}
