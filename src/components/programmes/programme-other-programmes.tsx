import { EditorialImageCard, EditorialSectionHeader } from "@/components/ui/editorial";
import { PROGRAMMES, programmeHref, type ProgrammeSlug } from "@/content";
import { SECTION_SHELL_INNER, SECTION_SHELL_PADDING } from "@/layouts/section-shell";
import { cn } from "@/utils";

type Props = {
  currentSlug: ProgrammeSlug;
  className?: string;
};

/** Marwa "More to explore" — other programme cards linking to dedicated pages. */
export function ProgrammeOtherProgrammes({ currentSlug, className }: Props) {
  const others = PROGRAMMES.filter((p) => p.slug !== currentSlug);

  if (others.length === 0) return null;

  return (
    <section
      className={cn(SECTION_SHELL_PADDING, "border-t border-border/30 bg-background", className)}
      aria-labelledby="other-programmes-heading"
    >
      <div className={SECTION_SHELL_INNER}>
        <EditorialSectionHeader
          eyebrow="Programmes"
          title="Other programmes"
          description="Explore the rest of our civic ecosystem — national tracking, county depth, training, and production."
          titleAs="h2"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {others.map((programme, index) => (
            <EditorialImageCard
              key={programme.slug}
              href={programmeHref(programme.slug)}
              imageSrc={programme.visual.hero}
              imageAlt={programme.visual.heroAlt}
              title={programme.headline}
              meta={programme.name}
              priority={index === 0}
              aspectClassName="aspect-[4/5] sm:aspect-[3/4]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
