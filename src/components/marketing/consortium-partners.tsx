"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";
import { APPLE_EASE } from "@/constants/motion";

const partners = [
    { name: "Sen Media", image: "/partners/senmedia.png" },
    { name: "The Continental Pot", image: "/partners/The-Continental-Pot-Vertical-removebg-preview.png" },
    { name: "Colour Twist", image: "/partners/colortwist.png" },
    { name: "Sen Media 2", image: "/partners/senmedia.png" },
    { name: "The Continental Pot 2", image: "/partners/The-Continental-Pot-Vertical-removebg-preview.png" },
    { name: "Colour Twist 2", image: "/partners/colortwist.png" },
];

const ConsortiumPartners = () => {
    return (
        <section id="partners" className="w-full pt-12 md:pt-24 pb-24 md:pb-32 relative overflow-hidden bg-[#F8F8F6] dark:bg-[#0A0A0A]">
            <div className="mb-16 px-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <span className="g-eyebrow text-primary/60 mb-6 block">Institutional Trust</span>
                    <h2 className="g-headline mb-8 max-w-2xl mx-auto">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 1,
                                ease: APPLE_EASE
                            }}
                            className="block"
                        >
                            Organizations shaping participation
                        </motion.span>
                    </h2>
                </motion.div>
            </div>

            <div className="space-y-4">
                {/* Single Row Marquee */}
                <div className="relative py-12 border-y border-foreground/5 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
                    <Marquee pauseOnHover className="[--duration:40s] [--gap:4rem] md:[--gap:10rem]" repeat={6}>
                        {partners.map((partner, i) => (
                            <PartnerLogo key={`${partner.name}-${i}`} partner={partner} />
                        ))}
                    </Marquee>
                </div>
            </div>

            {/* Gradient Fades */}
            <div className="absolute inset-y-0 left-0 w-32 md:w-96 bg-linear-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 md:w-96 bg-linear-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />
        </section>
    );
};

const PartnerLogo = ({ partner }: { partner: any }) => (
    <div className="flex items-center justify-center w-48 md:w-64 h-24 grayscale-[0.5] md:grayscale opacity-70 md:opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700 ease-out group px-4">
        <Image
            src={partner.image}
            alt={partner.name}
            width={200}
            height={100}
            className="object-contain max-h-16 w-auto group-hover:scale-110 transition-transform duration-700"
        />
    </div>
);

export default ConsortiumPartners;

