import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Media | Budget Ndio Story",
    description: "Press releases, media mentions, and coverage of Budget Ndio Story.",
};

export default function MediaPage() {
    return (
        <section className="relative w-full min-h-screen bg-background overflow-hidden">
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full opacity-50" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 blur-[120px] rounded-full opacity-50" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 lg:py-24 text-center">
                <h1 className="text-3xl md:text-5xl font-bold font-heading tracking-tight mb-6">
                    Media & Press
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    We&apos;re building something special. Press inquiries welcome.
                </p>
                <div className="rounded-2xl p-8 bg-foreground/5 border border-foreground/10 max-w-2xl mx-auto">
                    <p className="text-muted-foreground mb-6">
                        Budget Ndio Story is a youth-led organization transforming budget literacy in Kenya. Our work has been featured in:
                    </p>
                    <ul className="text-left space-y-3 text-foreground/80">
                        <li className="flex items-center gap-3">
                            <span className="text-primary">•</span>
                            <span>Daily Nation - &ldquo;Youth-led platform simplifies budget&rdquo; (2025)</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-primary">•</span>
                            <span>KTN News - Interview on civic engagement (2025)</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-primary">•</span>
                            <span>UNICEF Kenya - Partnership announcement (2024)</span>
                        </li>
                    </ul>
                    <div className="mt-8 pt-6 border-t border-foreground/10">
                        <p className="text-sm text-muted-foreground">
                            For media inquiries, contact us at{' '}
                            <a href="mailto:info@budgetndiostory.com" className="text-primary hover:underline">
                                info@budgetndiostory.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
