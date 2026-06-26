"use client";

import Icons from '@/components/global/icons';
import Wrapper from '@/components/global/wrapper';
import { useIsMobile } from "@/hooks";
import { cn } from '@/utils';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import Container from "@/components/global/container";
import { Button } from "@/ui/button";
import { Particles } from "@/ui/particles";

const partnerMap = {
    SenMedia: {
        label: "SME",
        name: "Sen Media & Events",
        href: "https://senmedia-events.co.ke/",
        logoSrc: "/images/senmedia.png",
    },
    ContinentalPot: {
        label: "TCP",
        name: "The Continental Pot",
        href: "https://continentalpot.africa/",
        logoSrc: "/images/The-Continental-Pot-Vertical-removebg-preview.png",
    },
    ColourTwist: {
        label: "CTM",
        name: "Colour Twist Media",
        href: "https://colortwistmedia.com/",
        logoSrc: "/images/colortwist.png",
    },
};

const IntegrationCard = ({
    className,
    logoSrc,
    logoClassName,
    label,
    name,
    href
}: {
    className?: string;
    logoSrc?: string;
    logoClassName?: string;
    label?: string;
    name?: string;
    href?: string;
}) => {
    const CardContent = (
        <div
            className={cn(
                "relative group flex h-20 w-20 items-center justify-center rounded-2xl border border-foreground/10 bg-card p-1.5 transition-all duration-300",
                href && "hover:border-primary/50",
                className
            )}
            title={name}
        >
            {logoSrc && (
                <div className="relative h-full w-full">
                    <Image
                        src={logoSrc}
                        alt={name ?? "Partner logo"}
                        fill
                        className={cn(
                            "object-contain opacity-95 group-hover:opacity-100 transition-all duration-300",
                            logoClassName
                        )}
                    />
                </div>
            )}
            {!logoSrc && label && (
                <div className="m-auto flex size-10 items-center justify-center rounded-xl bg-primary/10 text-[11px] font-semibold tracking-wide text-primary">
                    {label}
                </div>
            )}
        </div>
    );

    if (href) {
        return (
            <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
            >
                {CardContent}
            </Link>
        );
    }

    return CardContent;
};

const Integrations = () => {

    const isMobile = useIsMobile();

    return (
        <section id="integrations" className="w-full py-16 lg:py-24 relative z-0">
            <div className="hidden lg:block absolute -z-10 top-0 -right-1/4 inset-1/12 bg-primary/5 rounded-full blur-[8rem]" />
            <div className="hidden lg:block absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-52 lg:size-80 bg-primary/10 rounded-full blur-[8rem]" />

            <Particles
                quantity={100}
                ease={10}
                color={isMobile ? "#404040" : "#525252"}
                vx={0}
                vy={0}
                className="absolute hidden lg:block top-0 lg:top-1/3 left-1/2 -translate-x-1/2 lg:-translate-y-1/2 -z-10 size-full lg:size-1/2"
            />

            <Wrapper>
                <div className="aspect-square group relative mx-auto flex max-w-80 items-center justify-between sm:max-w-xs lg:max-w-md uppercase">
                    <div
                        role="presentation"
                        className="bg-linear-to-b border-foreground/5 absolute inset-0 z-10 aspect-square animate-spin hidden lg:block items-center justify-center rounded-full border-t from-primary/15 to-transparent to-25% opacity-0 duration-[3.5s] group-hover:opacity-100"
                    />

                    <div
                        role="presentation"
                        className="bg-linear-to-b border-foreground/5 absolute inset-16 z-10 aspect-square scale-90 animate-spin items-center justify-center rounded-full border-t from-primary/15 to-transparent to-25% opacity-0 duration-[3.5s] group-hover:opacity-100 [animation-direction:reverse]"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-linear-to-b from-foreground/10 absolute inset-0 flex aspect-square items-center justify-center rounded-full border-t border-foreground/5 to-transparent to-25% z-30"
                    >
                        <IntegrationCard
                            className="absolute left-[14%] top-1/2 -translate-y-1/2"
                            logoSrc={partnerMap.SenMedia.logoSrc}
                            logoClassName="scale-[1.15]"
                            label={partnerMap.SenMedia.label}
                            name={partnerMap.SenMedia.name}
                            href={partnerMap.SenMedia.href}
                        />
                        <IntegrationCard
                            className="absolute left-1/2 top-[10%] -translate-x-1/2"
                            logoSrc={partnerMap.ContinentalPot.logoSrc}
                            logoClassName="scale-[1.55] object-top"
                            label={partnerMap.ContinentalPot.label}
                            name={partnerMap.ContinentalPot.name}
                            href={partnerMap.ContinentalPot.href}
                        />
                        <IntegrationCard
                            className="absolute right-[14%] top-1/2 -translate-y-1/2"
                            logoSrc={partnerMap.ColourTwist.logoSrc}
                            logoClassName="scale-[1.2]"
                            label={partnerMap.ColourTwist.label}
                            name={partnerMap.ColourTwist.name}
                            href={partnerMap.ColourTwist.href}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="absolute bottom-[10%] left-1/2 z-30 -translate-x-1/2"
                    >
                        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-foreground/10 bg-card">
                            <Image
                                src="/logo.svg"
                                alt="Budget Ndio Story"
                                width={56}
                                height={24}
                                className="h-5 w-auto opacity-95"
                            />
                        </div>
                    </motion.div>

                    <Container animation="blurIn" delay={0.5} className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 flex justify-center w-fit scale-90 lg:scale-100">
                        <div className="relative flex h-24 w-22 rounded-2xl border border-foreground/10 bg-card px-2 py-1.5">
                            <div className="m-auto flex flex-col items-center justify-center">
                                <Image
                                    src="/kenya-logo.png"
                                    alt="Kenya logo"
                                    width={40}
                                    height={40}
                                    className="size-8 object-contain"
                                />
                                <span className="mt-1 text-[8px] font-semibold tracking-[0.14em] text-foreground/70">
                                    KENYA
                                </span>
                            </div>
                        </div>
                    </Container>
                </div>

                <div className="relative z-20 mx-auto -mt-4 max-w-lg space-y-6 text-center">
                    <motion.h2
                        className="title mt-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                    >
                        Consortium-led storytelling
                    </motion.h2>

                    <motion.p
                        className="desc mt-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                    >
                        Led by The Continental Pot, Colour Twist Media, and Sen Media & Events to make budget information clear, useful, and actionable for young Kenyans.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                    >
                        <Link
                            href="https://continentalpot.africa/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="white">
                                Explore Consortium
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </Wrapper>
        </section>
    );
};

export default Integrations;
