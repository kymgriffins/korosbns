import Link from "next/link";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ORG_CONTACT_EMAIL } from "@/constants/org";

type Cta = { label: string; href: string; variant?: "default" | "outline" };

export function MarketingSurfacePage({
  eyebrow,
  title,
  description,
  primary,
  secondary,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  primary: Cta;
  secondary?: Cta;
}) {
  return (
    <div className="min-h-[85vh] w-full bg-background pt-28 pb-24 px-4 md:px-6">
      <Container size="ultra" className="mx-auto max-w-2xl space-y-8">
        {eyebrow ? (
          <span className="g-mono block text-[11px] font-black uppercase tracking-[0.35em] text-primary">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          {title}
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">{description}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button size="lg" className="rounded-full px-8" asChild>
            <Link href={primary.href}>{primary.label}</Link>
          </Button>
          {secondary ? (
            <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
              <Link href={secondary.href}>{secondary.label}</Link>
            </Button>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground">
          Prefer email?{" "}
          <a
            className="text-primary underline-offset-4 hover:underline"
            href={`mailto:${ORG_CONTACT_EMAIL}`}
          >
            Reach us directly
          </a>
          {" — we reply within a few business days."}
        </p>
      </Container>
    </div>
  );
}
