import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | Budget Ndio Story",
    description: "Terms of service for using Budget Ndio Story website, budget literacy content, and civic engagement platform.",
    alternates: { canonical: "/terms" },
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
                        Terms of Service
                    </h1>
                    <p className="text-muted-foreground mt-4 text-sm md:text-base">
                        Last updated: April 2026
                    </p>
                </div>

                <div className="prose prose-invert max-w-none space-y-8 text-foreground/80">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using Budget Ndio Story (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
                        <p>
                            Permission is granted to temporarily access the materials on Budget Ndio Story for personal, non-commercial use. This is the grant of a license, not a transfer of title.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">3. Disclaimer</h2>
                        <p>
                            The materials on Budget Ndio Story are provided on an &apos;as is&apos; basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
                        </p>
                        <p className="mt-3">
                            While we strive for accuracy, budget figures and policy information are based on official government documents which may be updated. Always refer to official sources for the most current data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">4. Limitations</h2>
                        <p>
                            In no event shall Budget Ndio Story or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">5. Content Ownership</h2>
                        <p>
                            All content on this site—including text, graphics, logos, and software—is the property of Budget Ndio Story or its content suppliers and is protected by Kenyan and international copyright laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">6. External Links</h2>
                        <p>
                            Our site may contain links to external websites (e.g., government budget documents, social media platforms). We are not responsible for the content or practices of these third-party sites.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">7. Modifications</h2>
                        <p>
                            We may revise these terms at any time without notice. By using this website, you agree to be bound by the then-current version of these Terms of Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">8. Contact</h2>
                        <p>
                            If you have any questions about these Terms of Service, please contact us at <a href="mailto:info@budgetndiostory.com" className="text-primary hover:underline">info@budgetndiostory.com</a>.
                        </p>
                    </section>
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
