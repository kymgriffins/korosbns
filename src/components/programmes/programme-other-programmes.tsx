import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  PROGRAMMES,
  PROGRAMME_CARD_BLURBS,
  programmeHref,
  type ProgrammeSlug,
} from "@/content";

type Props = {
  currentSlug: ProgrammeSlug;
  className?: string;
};

/** Keep-reading image rows — secondary to the active programme page. */
export function ProgrammeOtherProgrammes({ currentSlug, className }: Props) {
  const others = PROGRAMMES.filter((p) => p.slug !== currentSlug);

  if (others.length === 0) return null;

  return (
    <section className={`prog-other ${className ?? ""}`} aria-labelledby="other-programmes-heading">
      <p className="prog-index">Keep reading</p>
      <h2 id="other-programmes-heading" className="prog-h2">
        Other programmes
      </h2>
      <nav aria-label="Other programmes">
        <ul className="prog-other-grid">
          {others.map((programme) => (
            <li key={programme.slug}>
              <Link href={programmeHref(programme.slug)} className="group block">
                <div className="prog-other-media">
                  <Image
                    src={programme.visual.hero}
                    alt={programme.visual.heroAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <p className="prog-eyebrow mt-3">{programme.eyebrow}</p>
                <p className="prog-other-name">{programme.name}</p>
                <p className="prog-row-blurb mt-1 line-clamp-2">
                  {PROGRAMME_CARD_BLURBS[programme.slug]}
                </p>
                <span className="prog-row-cta">
                  Explore
                  <ArrowUpRight className="size-4" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
