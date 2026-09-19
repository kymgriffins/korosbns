import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import {
  getProgrammeContent,
  getProjectsByProgramme,
  type ProgrammeContent,
} from "@/data/marketing";
import { programmeCtaClassName } from "@/content";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type ProgrammePageProps = {
  slug: string;
};

function getYouTubeEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const videoId = parsed.hostname.includes("youtu.be")
      ? parsed.pathname.slice(1)
      : parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).at(-1);
    return videoId
      ? `https://www.youtube-nocookie.com/embed/${videoId}`
      : url;
  } catch {
    return url;
  }
}

function FeaturedMedia({ media }: { media: NonNullable<ProgrammeContent["featuredMedia"]> }) {
  if (media.type === "youtube") {
    return (
      <iframe
        src={getYouTubeEmbedUrl(media.url)}
        title={media.title || "Programme video"}
        className="aspect-video w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (media.type === "image") {
    return (
      <img
        src={media.url}
        alt={media.title || "Programme evidence"}
        className="aspect-video w-full object-cover"
      />
    );
  }

  return (
    <video
      src={media.url}
      poster={media.poster}
      className="aspect-video w-full bg-black object-cover"
      controls
      playsInline
      preload="metadata"
    >
      Your browser does not support embedded video.
    </video>
  );
}

export function ProgrammePage({ slug }: ProgrammePageProps) {
  const programme = getProgrammeContent(slug);

  if (!programme) {
    notFound();
  }

  const projects = getProjectsByProgramme(slug);
  const primaryCta = programme.cta;
  const secondaryCta = programme.secondaryCta;

  return (
    <>
      <section className="border-b bg-muted/30">
        <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="flex flex-col items-start gap-6">
            <Badge variant="secondary">{programme.eyebrow}</Badge>
            <div className="flex flex-col gap-4">
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                {programme.name}
              </h1>
              <p className="max-w-2xl text-xl font-medium text-foreground">
                {programme.headline}
              </p>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {programme.body}
              </p>
            </div>
            {(primaryCta || secondaryCta) && (
              <div className="flex flex-wrap gap-3">
                {primaryCta && (
                  <Button
                    asChild
                    size="lg"
                    className={programmeCtaClassName(primaryCta)}
                  >
                    <Link href={primaryCta.href}>
                      {primaryCta.label}
                      <ArrowRight data-icon="inline-end" />
                    </Link>
                  </Button>
                )}
                {secondaryCta && (
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className={programmeCtaClassName(secondaryCta)}
                  >
                    <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
          <div className="overflow-hidden rounded-2xl border bg-muted">
            <img
              src={programme.visual.hero}
              alt={programme.visual.heroAlt}
              className="aspect-[4/3] size-full object-cover"
            />
          </div>
        </div>
      </section>

      {programme.stats.length > 0 && (
        <section className="border-b">
          <div className="mx-auto grid max-w-7xl gap-px bg-border px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
            {programme.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-2 bg-background py-8 sm:px-6">
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="border-b py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:px-8">
          <div className="flex flex-col gap-3">
            <Badge variant="outline">What we do</Badge>
            <h2 className="text-3xl font-bold tracking-tight">The programme</h2>
          </div>
          <div className="flex flex-col gap-6">
            <p className="text-lg leading-8 text-muted-foreground">
              {programme.whatWeDo || programme.body}
            </p>
            {programme.highlight && (
              <>
                <Separator />
                <p className="text-lg font-medium leading-8">{programme.highlight}</p>
              </>
            )}
            {programme.audience && (
              <p className="text-sm leading-6 text-muted-foreground">
                <span className="font-medium text-foreground">For: </span>
                {programme.audience}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="border-b bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3">
            <Badge variant="outline">Delivery</Badge>
            <h2 className="text-3xl font-bold tracking-tight">What the programme delivers</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {programme.deliverables.map((deliverable) => (
              <Card key={deliverable.title}>
                <CardHeader>
                  <CardTitle>{deliverable.title}</CardTitle>
                  <CardDescription>{deliverable.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {programme.featuredMedia && (
        <section className="border-b py-16 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:px-8">
            <div className="flex flex-col gap-3">
              <Badge variant="outline">Featured evidence</Badge>
              <h2 className="text-3xl font-bold tracking-tight">
                {programme.featuredMedia.title || "Programme evidence"}
              </h2>
              {programme.featuredMedia.caption && (
                <p className="text-sm leading-6 text-muted-foreground">
                  {programme.featuredMedia.caption}
                </p>
              )}
            </div>
            <div className="overflow-hidden rounded-2xl border bg-muted">
              <FeaturedMedia media={programme.featuredMedia} />
            </div>
          </div>
        </section>
      )}

      {programme.pillars.length > 0 && (
        <section className="border-b bg-muted/30 py-16 sm:py-24">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3">
              <Badge variant="outline">Focus</Badge>
              <h2 className="text-3xl font-bold tracking-tight">Programme pillars</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {programme.pillars.map((pillar) => (
                <Card key={pillar.title}>
                  <CardHeader>
                    <CardTitle>{pillar.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {pillar.body}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-b py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
            <div className="flex flex-col">
              {programme.process.map((step, index) => (
                <div key={step.title} className="grid grid-cols-[2rem_1fr] gap-4 border-b py-5 last:border-b-0">
                  <span className="text-sm font-medium text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {programme.visual.gallery.map((image) => (
              <div key={image.src} className="overflow-hidden rounded-2xl border bg-muted first:sm:col-span-2">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="aspect-[4/3] size-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="border-b bg-muted/30 py-16 sm:py-24">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3">
              <Badge variant="outline">Evidence</Badge>
              <h2 className="text-3xl font-bold tracking-tight">Published work</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.slice(0, 6).map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="aspect-video w-full object-cover"
                  />
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    {project.organisationName && (
                      <CardDescription>{project.organisationName}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {project.subtitle && (
                      <p className="text-sm leading-6 text-muted-foreground">
                        {project.subtitle}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline">
                      <Link href={project.href}>View project</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {programme.faqs.length > 0 && (
        <section className="border-b py-16 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:px-8">
            <div className="flex flex-col gap-3">
              <Badge variant="outline">Questions</Badge>
              <h2 className="text-3xl font-bold tracking-tight">
                Frequently asked questions
              </h2>
            </div>
            <Accordion type="single" collapsible>
              {programme.faqs.map((faq, index) => (
                <AccordionItem key={faq.q} value={`faq-${index + 1}`}>
                  <AccordionTrigger>{faq.q}</AccordionTrigger>
                  <AccordionContent>
                    <p className="leading-6 text-muted-foreground">{faq.a}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      <section className="py-16 sm:py-24">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Work with {programme.name}
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Ask about programme partnerships, evidence, commissions, or participation.
          </p>
          <Button asChild size="lg">
            <Link href={`/contact?programme=${programme.slug}`}>
              Contact the team
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
