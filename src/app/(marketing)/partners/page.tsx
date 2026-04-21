import { Metadata } from "next";
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Partners | Budget Ndio Story",
    description: "Our partners and supporters who help make budget transparency possible for Kenyan youth.",
};

const partners = [
    { name: "UNICEF Kenya", logo: "/icons/integrations/figma.svg", link: "https://unicef.org/kenya" },
    { name: "KPMG East Africa", logo: "/icons/integrations/dribbble.svg", link: "#" },
    { name: "Transparency International", logo: "/icons/integrations/slack.svg", link: "#" },
    { name: "United Nations Development Programme", logo: "/icons/integrations/github.svg", link: "#" },
    { name: "Open Governance Partnership", logo: "/icons/integrations/linear.svg", link: "#" },
    { name: "Kenya School of Government", logo: "/icons/integrations/notion.svg", link: "#" },
];

export default function PartnersPage() {
    return (
        <section className="relative w-full min-h-screen bg-background overflow-hidden">
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full opacity-50" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 blur-[120px] rounded-full opacity-50" />
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-5xl font-bold font-heading tracking-tight mb-4">
                        Our Partners
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        We collaborate with organizations that share our vision of transparent, accessible public finance information for all Kenyans.
                    </p>
                </div>

                {/* Partners Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
                    {partners.map((partner, idx) => (
                        <a
                            key={partner.name}
                            href={partner.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group rounded-2xl p-6 bg-foreground/5 border border-foreground/10 hover:border-primary/30 transition-all flex items-center justify-center h-32"
                        >
                            <div className="relative w-full h-8 flex items-center justify-center">
                                <Image
                                    src={partner.logo}
                                    alt={partner.name}
                                    fill
                                    className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                                />
                            </div>
                        </a>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center">
                    <div className="rounded-2xl p-8 lg:p-12 bg-foreground/5 border border-foreground/10 max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold mb-4">Partner with us</h2>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            Are you an organization working on civic education, transparency, or youth engagement? We&apos;d love to explore partnerships that amplify our collective impact.
                        </p>
                        <Link href="/contact">
                            <button className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors">
                                Get in Touch
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
