import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Budget Ndio Story",
    description: "Privacy policy for Budget Ndio Story users and visitors.",
};

export default function PrivacyPage() {
    return (
        <section className="relative w-full min-h-screen bg-background overflow-hidden">
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full opacity-50" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 blur-[120px] rounded-full opacity-50" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold font-heading tracking-tight">
                        Privacy Policy
                    </h1>
                    <p className="text-muted-foreground mt-4 text-sm md:text-base">
                        Last updated: April 2026
                    </p>
                </div>

                <div className="prose prose-invert max-w-none space-y-8 text-foreground/80">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                        <p>
                            Budget Ndio Story (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects information you provide directly to us, such as when you subscribe to our newsletter or contact us via the contact form. This may include your name, email address, and message content.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-3">
                            <li>Send you budget updates and newsletters</li>
                            <li>Respond to your inquiries and messages</li>
                            <li>Improve our content and user experience</li>
                            <li>Analyze site traffic and usage patterns</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">3. Data Storage & Security</h2>
                        <p>
                            Your data is stored securely and we take reasonable measures to protect it from unauthorized access, alteration, or destruction. Newsletter subscriptions are stored locally in your browser&apos;s localStorage for demonstration purposes. In production, we would use secure server-side storage.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">4. Cookies & Tracking</h2>
                        <p>
                            We use essential cookies for site functionality. We may also use analytics tools (like Google Analytics or Plausible) to understand how visitors interact with our site. You can opt out of tracking through your browser settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">5. Third-Party Services</h2>
                        <p>
                            We use third-party services such as YouTube for video embeds and Google Drive for document hosting. These services have their own privacy policies and we encourage you to review them.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-3">
                            <li>Access the personal data we hold about you</li>
                            <li>Request correction of inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Opt out of future communications</li>
                        </ul>
                        <p className="mt-3">
                            To exercise any of these rights, contact us at <a href="mailto:info@budgetndiostory.com" className="text-primary hover:underline">info@budgetndiostory.com</a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
                        <p>
                            If you have questions about this Privacy Policy, please reach out to us at <a href="mailto:info@budgetndiostory.com" className="text-primary hover:underline">info@budgetndiostory.com</a>.
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
