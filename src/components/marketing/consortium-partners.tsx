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
        <section id="partners" className="w-full py-40 md:py-64 relative overflow-hidden bg-background">
            <div className="mb-24 px-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <span className="g-eyebrow text-primary mb-6 block tracking-[0.4em]">Institutional Trust</span>
                    <h2 className="text-4xl md:text-7xl font-black tracking-tightest leading-[0.95] mb-8 max-w-4xl mx-auto overflow-hidden">
                        {["Trusted by organizations", "shaping participation"].map((line, i) => (
                            <motion.span
                                key={i}
                                initial={{ y: "100%" }}
                                whileInView={{ y: 0 }}
                                viewport={{ once: true }}
                                transition={{ 
                                    duration: 1.2, 
                                    delay: i * 0.15, 
                                    ease: APPLE_EASE 
                                }}
                                className="block"
                            >
                                {line}
                            </motion.span>
                        ))}
                    </h2>
                </motion.div>
            </div>

            <div className="space-y-4">
                {/* Single Row Marquee */}
                <div className="relative py-8 border-y border-foreground/5">
                    <Marquee pauseOnHover className="[--duration:50s] [--gap:10rem]">
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
    <div className="flex items-center justify-center w-64 h-24 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700 ease-out group">
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

