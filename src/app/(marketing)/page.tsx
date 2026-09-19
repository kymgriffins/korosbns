import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  getFeaturedProjects,
  getHeroImage,
  getImpactStats,
  getLandingContent,
  getProgrammeCards,
} from "@/data/marketing";
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

export const metadata: Metadata = {
  title: "Budget Ndio Story | Kenya's Public Wealth, Made Clear",
  description:
    "Translating Kenya's complex national budget into clear, actionable civic narratives.",
  alternates: { canonical: "https://budgetndiostory.org/" },
};

export default function LandingPage() {
  const content = getLandingContent();
  const programmes = getProgrammeCards();
  const featured = getFeaturedProjects(3);
  const stats = getImpactStats();
  const impactStats = [
    { value: stats.productionCount, label: "Verified productions" },
    { value: stats.partnerCount, label: "Partner organisations" },
    { value: stats.programmeCount, label: "Active programmes" },
    { value: stats.bnsLedCount, label: "BNS-led projects" },
  ].filter((stat) => stat.value > 0);

  return (
    <>
      <section className="border-b">
        <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="flex flex-col items-start gap-6">
            <Badge variant="secondary">{content.heroNarrative.eyebrow}</Badge>
            <div className="flex flex-col gap-4">
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                {content.heroNarrative.title}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                {content.heroNarrative.lede}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/programmes">
                  Explore programmes
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={content.partnerCta.ctaHref}>{content.partnerCta.ctaLabel}</Link>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border bg-muted">
            <img
              src={getHeroImage()}
              alt="Budget Ndio Story community budget forum"
              className="aspect-[4/3] size-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-b bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:px-8">
          <div className="flex flex-col gap-3">
            <Badge variant="outline">{content.thesis.eyebrow}</Badge>
            <h2 className="text-3xl font-bold tracking-tight">{content.thesis.title}</h2>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-lg leading-8 text-muted-foreground">{content.thesis.body}</p>
            <p className="text-sm font-medium">{content.thesis.method}</p>
          </div>
        </div>
      </section>

      <section className="border-b py-16 sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-3">
              <Badge variant="outline">What we do</Badge>
              <h2 className="text-3xl font-bold tracking-tight">Programmes</h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/programmes">View all programmes</Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {programmes.map((programme) => (
              <Card key={programme.slug} className="overflow-hidden">
                <img
                  src={programme.thumbnail}
                  alt={programme.title}
                  className="aspect-video w-full object-cover"
                />
                <CardHeader>
                  <CardTitle>{programme.title}</CardTitle>
                  <CardDescription>{programme.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {programme.projectCount > 0
                      ? `${programme.projectCount} published ${programme.projectCount === 1 ? "project" : "projects"}`
                      : "Programme information and partnership details"}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline">
                    <Link href={`/programmes/${programme.slug}`}>
                      Explore {programme.title}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {impactStats.length > 0 && (
        <section className="border-b bg-muted/30">
          <div className="mx-auto grid max-w-7xl gap-px bg-border px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {impactStats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-2 bg-background py-8 sm:px-6">
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="border-b py-16 sm:py-24">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3">
              <Badge variant="outline">{content.featuredIntro.eyebrow}</Badge>
              <h2 className="max-w-3xl text-3xl font-bold tracking-tight">
                {content.featuredIntro.headline}
              </h2>
              <p className="max-w-3xl text-muted-foreground">{content.featuredIntro.lede}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {featured.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="aspect-video w-full object-cover"
                  />
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>
                      {project.subtitle || project.programmeLabel}
                    </CardDescription>
                  </CardHeader>
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

      <section className="py-16 sm:py-24">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-5 px-4 sm:px-6 lg:px-8">
          <Badge>{content.partnerCta.eyebrow}</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {content.partnerCta.title}
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground">
            {content.partnerCta.description}
          </p>
          <Button asChild size="lg">
            <Link href={content.partnerCta.ctaHref}>
              {content.partnerCta.ctaLabel}
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
