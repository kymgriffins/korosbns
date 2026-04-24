"use client";

import Icons from '@/components/global/icons';
import Wrapper from '@/components/global/wrapper';
import { Routes } from "@/constants";
import { useIsMobile } from "@/hooks";
import { cn } from '@/utils';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Container from "@/components/global/container";
import { Button } from "@/components/ui/button";
import { Particles } from "@/components/ui/particles";

const partnerMap = {
    SenMedia: {
        label: "SME",
        name: "Sen Media & Events",
        href: "https://senmedia-events.co.ke/",
    },
    ContinentalPot: {
        label: "TCP",
        name: "The Continental Pot",
        href: "https://continentalpot.africa/",
    },
    ColourTwist: {
        label: "CTM",
        name: "Colour Twist Media",
        href: "https://colortwistmedia.com/",
    },
};

const IntegrationCard = ({
    className,
    isCenter = false,
    iconSrc,
    label,
    href
}: {
    className?: string;
    isCenter?: boolean;
    iconSrc?: string;
    label?: string;
    href?: string;
}) => {
    const CardContent = (
        <div
            className={cn(
                "relative group flex size-12 rounded-full border border-foreground/10 bg-background backdrop-blur-md transition-all duration-300",
                href && "hover:border-primary/50 hover:shadow-[0_0_15px_rgba(0,85,255,0.2)]",
                className
            )}
        >
            {iconSrc && (
                <div className="m-auto size-fit">
                    <Image
                        src={iconSrc}
                        alt=""
                        width={isCenter ? 32 : 20}
                        height={isCenter ? 32 : 20}
                        className="size-5 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                    />
                </div>
            )}
            {!iconSrc && label && (
                <div className="m-auto flex size-8 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold tracking-wide text-primary">
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
                        className="bg-linear-to-b border-foreground/5 absolute inset-16 z-10 aspect-square scale-90 animate-spin items-center justify-center rounded-full border-t from-primary/15 to-transparent to-25% opacity-0 duration-[3.5s] group-hover:opacity-100"
                        style={{ animationDirection: 'reverse' }}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-linear-to-b from-foreground/10 absolute inset-0 flex aspect-square items-center justify-center rounded-full border-t border-foreground/5 to-transparent to-25% z-30"
                    >
                        <IntegrationCard
                            className="absolute left-0 top-1/4 -translate-x-1/6 -translate-y-1/4"
                            label={partnerMap.SenMedia.label}
                            href={partnerMap.SenMedia.href}
                        />
                        <IntegrationCard
                            className="absolute top-0 -translate-y-1/2"
                            label={partnerMap.ContinentalPot.label}
                            href={partnerMap.ContinentalPot.href}
                        />
                        <IntegrationCard
                            className="absolute right-0 top-1/4 translate-x-1/6 -translate-y-1/4"
                            label={partnerMap.ColourTwist.label}
                            href={partnerMap.ColourTwist.href}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="bg-linear-to-b from-foreground/10 absolute inset-16 flex aspect-square scale-90 items-center justify-center rounded-full border-t border-foreground/5 to-transparent to-25% z-30"
                    >
                        <IntegrationCard
                            className="absolute left-0 top-1/4 -translate-x-1/4 -translate-y-1/4"
                            label={partnerMap.SenMedia.label}
                            href={partnerMap.SenMedia.href}
                        />
                        <IntegrationCard
                            className="absolute right-0 top-1/4 translate-x-1/4 -translate-y-1/4"
                            label={partnerMap.ColourTwist.label}
                            href={partnerMap.ColourTwist.href}
                        />
                    </motion.div>

                    <Container animation="blurIn" delay={0.5} className="absolute inset-x-0 bottom-0 lg:bottom-1/10 mx-auto my-2 flex justify-center gap-2 w-fit scale-90 lg:scale-100">
                        <div className="relative flex size-16 rounded-full border border-foreground/10 bg-background/50 backdrop-blur-md">
                            <div className="m-auto">
                                <Image
                                    src="/logo.svg"
                                    alt="Budget Ndio Story"
                                    width={100}
                                    height={50}
                                    className="w-auto h-6"
                                />
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
