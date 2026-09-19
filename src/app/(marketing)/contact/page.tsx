import type { Metadata } from "next";
import { ContactForm } from "@/components/clean-slate/contact-form";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getContactContent, getContactIntent } from "@/data/marketing";

export const metadata: Metadata = {
  title: "Contact | Budget Ndio Story",
  description:
    "Contact Budget Ndio Story about investigations, programme partnerships, media, or evidence production.",
  alternates: { canonical: "https://budgetndiostory.org/contact" },
};

type ContactPageProps = {
  searchParams: Promise<{
    intent?: string;
    programme?: string;
    member?: string;
  }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const query = await searchParams;
  const content = getContactContent();
  const intent = getContactIntent(query.intent);
  const initialSubject = (() => {
    if (query.intent === "commission") return "commission";
    if (query.intent === "budget-tracker" || query.intent === "wanahabari-lab") {
      return "application";
    }
    if (query.intent === "partner" || query.intent === "collaboration" || query.programme) {
      return "partnership";
    }
    return "general";
  })();
  const programmeLine = query.programme
    ? `Programme: ${query.programme}\n\n`
    : "";
  const memberLine = query.member ? `Team member: ${query.member}\n\n` : "";
  const initialMessage = `${programmeLine}${memberLine}${intent?.messagePrefill || ""}`;

  return (
    <>
      <section className="border-b bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-5 px-4 sm:px-6 lg:px-8">
          <Badge variant="secondary">{content.hero.eyebrow}</Badge>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {intent?.title || content.hero.title}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            {intent?.blurb || content.hero.description}
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)] lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Send a message</CardTitle>
              <CardDescription>
                Fields marked as required must be completed before submission.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm
                initialSubject={initialSubject}
                initialMessage={initialMessage}
              />
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Direct contact</CardTitle>
                <CardDescription>{content.directContact.prompt}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm">
                <a
                  className="w-fit font-medium underline-offset-4 hover:underline"
                  href={`mailto:${content.directContact.email}`}
                >
                  {content.directContact.email}
                </a>
                <a
                  className="w-fit text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  href={`tel:${content.directContact.phone.replace(/\s+/gu, "")}`}
                >
                  {content.directContact.phone}
                </a>
                <a
                  className="w-fit text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  href={content.directContact.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social channels</CardTitle>
                <CardDescription>Follow Budget Ndio Story on your preferred platform.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                {content.socials.map((social) => (
                  <a
                    key={social.url}
                    className="text-sm font-medium underline-offset-4 hover:underline"
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {social.name}
                  </a>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
