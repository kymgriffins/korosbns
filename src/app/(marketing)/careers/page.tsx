import { Metadata } from "next";
import Wrapper from "@/components/global/wrapper";
import SectionBadge from "@/ui/section-badge";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Careers | Budget Ndio Story",
    description:
        "Join Budget Ndio Story through our open call for young creatives in Kenya.",
};

const openRoles = [
    "Podcast hosts",
    "Storytellers",
    "Animators",
    "Videographers",
    "Photographers",
    "Script writers",
    "Social media managers",
    "Facilitators",
];

export default function CareersPage() {
    return (
        <section className="w-full py-16 lg:py-24">
            <Wrapper>
                <div className="mx-auto max-w-4xl">
                    <SectionBadge title="Careers" />
                    <h1 className="mt-6 text-3xl font-bold tracking-tight md:text-5xl">
                        Open call: young creatives wanted (18-34)
                    </h1>
                    <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                        Budget Ndio Story is growing a creative network of young people who can
                        turn public budget information into powerful civic storytelling. If you are
                        between 18 and 34, we would love to hear from you.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        {openRoles.map((role) => (
                            <span
                                key={role}
                                className="rounded-full border border-foreground/15 bg-background px-4 py-2 text-sm font-medium"
                            >
                                {role}
                            </span>
                        ))}
                    </div>

                    <div className="mt-10 rounded-2xl border border-foreground/10 bg-foreground/5 p-6 md:p-8">
                        <h2 className="text-xl font-semibold">How to apply</h2>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            Send your name, age, role of interest, and links to previous work.
                            Shortlisted candidates will be contacted for the next steps.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href="/contact?subject=Open%20Call%20Application"
                                className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                            >
                                Apply now
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center rounded-xl border border-foreground/15 px-5 py-3 text-sm font-semibold transition-colors hover:border-primary/40 hover:text-primary"
                            >
                                Contact team
                            </Link>
                        </div>
                    </div>
                </div>
            </Wrapper>
        </section>
    );
}
