import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProgrammeCards, getProgrammeContentList } from "@/data/marketing";
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
  title: "Programmes | Budget Ndio Story",
  description:
    "Explore Budget Ndio Story programmes for national budget intelligence, county accountability, journalism, and evidence production.",
  alternates: { canonical: "https://budgetndiostory.org/programmes" },
};

export default function ProgrammesPage() {
  const programmes = getProgrammeContentList();
  const cards = getProgrammeCards();

  return (
    <>
      <section className="border-b bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-5 px-4 sm:px-6 lg:px-8">
          <Badge variant="secondary">Budget Ndio Story</Badge>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Programmes that follow public money from policy to delivery
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
            National budget tracking, county delivery verification, newsroom training,
            and evidence production share one public-interest evidence system.
          </p>
        </div>
      </section>

      <section className="border-b py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {programmes.map((programme) => {
            const card = cards.find((item) => item.slug === programme.slug);
            return (
              <Card key={programme.slug} className="overflow-hidden">
                <img
                  src={card?.thumbnail || programme.visual.hero}
                  alt={programme.visual.heroAlt}
                  className="aspect-video w-full object-cover"
                />
                <CardHeader>
                  <Badge className="w-fit" variant="outline">
                    {programme.eyebrow}
                  </Badge>
                  <CardTitle>{programme.name}</CardTitle>
                  <CardDescription>{programme.headline}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <p className="text-sm leading-6 text-muted-foreground">
                    {programme.whatWeDo || programme.body}
                  </p>
                  {card && card.projectCount > 0 && (
                    <p className="text-sm font-medium">
                      {card.projectCount} published {card.projectCount === 1 ? "project" : "projects"}
                    </p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link href={programme.href}>
                      Explore {programme.name}
                      <ArrowRight data-icon="inline-end" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-5 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Work with a programme
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Tell us whether you are exploring a programme partnership, evidence request,
            newsroom collaboration, or production commission.
          </p>
          <Button asChild size="lg">
            <Link href="/contact?intent=partner">
              Contact the team
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
