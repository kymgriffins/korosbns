import Link from "next/link";
import { Metadata } from "next";
import { canonicalUrl } from "@/utils/metadata";
import { legalContent } from "@/content";

export const metadata: Metadata = {
    title: "Terms of Service | Budget Ndio Story",
    description: "Terms of service and user agreement for the Budget Ndio Story platform and civic engagement resources.",
    alternates: { canonical: canonicalUrl("/terms") },
};

export default function TermsPage() {
    return (
        <section className="relative w-full min-h-screen bg-background overflow-hidden">
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full opacity-50" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 blur-[120px] rounded-full opacity-50" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold font-heading tracking-tight">
                        {legalContent.terms.title}
                    </h1>
                    <p className="text-muted-foreground mt-4 text-sm md:text-base">
                        Last updated: {legalContent.terms.lastUpdated}
                    </p>
                </div>

                <div className="prose prose-invert max-w-none space-y-8 text-foreground/80">
                    {(legalContent.terms.sections as Array<{ heading: string; content: string }>).map((section) => (
                        <section key={section.heading}>
                            <h2 className="text-2xl font-bold mb-4">{section.heading}</h2>
                            <p>{section.content}</p>
                        </section>
                    ))}
                </div>

                <div className="mt-16 pt-8 border-t border-foreground/10 text-center">
                    <Link href="/" className="text-primary hover:underline text-sm">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </section>
    );
}
