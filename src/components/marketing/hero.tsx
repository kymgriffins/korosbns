"use client";

import React from 'react';
import Wrapper from '../global/wrapper';
import { Button } from '../ui/button';
import { ArrowRightIcon } from 'lucide-react';
import { Routes } from '@/constants';
import { team } from '@/constants/team';
import { getMemberUsername } from '@/lib/team';
import Link from 'next/link';
import { motion, useMotionValue } from 'motion/react';
import { cn } from '@/utils';
import Balancer from 'react-wrap-balancer';
import Container from "../global/container";

const badges = [
    { text: "Budget Stories", top: "15%", left: "5%" },
    { text: "County Spending", top: "25%", right: "8%" },
    { text: "Data Visuals", top: "60%", left: "10%" },
    { text: "Action Steps", top: "70%", right: "18%" },
];

const FloatingBadge = ({ text, top, left, right, index }: { text: string; top: string; left?: string; right?: string; index: number }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
                opacity: 1,
                scale: 1,
                y: [0, -10, 0],
            }}
            transition={{
                opacity: { delay: index * 0.2, duration: 0.5 },
                scale: { delay: index * 0.2, duration: 0.5 },
                y: {
                    duration: 3 + index,
                    repeat: Infinity,
                    ease: "easeInOut",
                }
            }}
            style={{
                x,
                y,
                top,
                left,
                right,
            }}
            className="absolute hidden lg:block z-30"
        >
            <div className="px-3 py-1 rounded-lg border border-border-subtle g-glass">
                <span className="text-base font-handwriting text-text-2 whitespace-nowrap select-none">
                    {text}
                </span>
            </div>
        </motion.div>
    );
};

const Hero = () => {

    const badge = "Fiscal Literacy & Democratic Participation";
    const description = "A Youth-Led Initiative bridging the gap between Kenya's youth energy and national fiscal policy.";
    const featuredMembers = team.slice(0, 4);

    return (
        <section className="relative w-full flex items-center justify-center pt-8 lg:pt-8 pb-4 overflow-visible">
            <Wrapper className="relative z-10">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={cn(
                            "flex items-center justify-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full",
                            "bg-surface-0 border border-border-default shadow-sm"
                        )}
                    >
                        <span className={cn(
                            "px-2 py-0.5 text-xs font-semibold rounded-full",
                            "bg-text-1 text-surface-0"
                        )}>
                            Mission
                        </span>
                        <Container words={true} className="w-min flex text-sm text-text-2">
                            {badge.split(" ").map((word, index) => (
                                <span className="w-min" key={index}>
                                    {word}&nbsp;
                                </span>
                            ))}
                        </Container>
                    </motion.div>

                    <h1 className="g-display mt-10 pb-2">
                        <Balancer>
                            {"Bridging the gap between".split(" ").map((word, index) => (
                                <motion.span
                                    initial={{ filter: "blur(10px)", opacity: 0, y: 10 }}
                                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    className="inline-block"
                                    key={index}
                                >
                                    {word}&nbsp;
                                </motion.span>
                            ))}
                            <br />
                            {"youth energy & fiscal policy".split(" ").map((word, index) => (
                                <motion.span
                                    initial={{ filter: "blur(10px)", opacity: 0, y: 10 }}
                                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: (4 + index) * 0.05 }}
                                    className={cn(
                                        "inline-block",
                                        (word === "youth" || word === "energy") && "text-primary"
                                    )}
                                    key={index}
                                >
                                    {word}&nbsp;
                                </motion.span>
                            ))}
                        </Balancer>
                    </h1>

                    <p className="g-text mt-10 text-center">
                        <Balancer>
                            {description.split(" ").map((word, index) => (
                                <motion.span
                                    initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.3 + index * 0.02 }}
                                    className="inline-block"
                                    key={index}
                                >
                                    {word}&nbsp;
                                </motion.span>
                            ))}
                        </Balancer>
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className={cn("flex items-center gap-4 flex-wrap justify-center mt-8")}
                    >
                        <Link href="/learn">
                            <Button size="lg">
                                Explore stories
                            </Button>
                        </Link>
                        <Link href="/research">
                            <Button size="lg" variant="outline">
                                Dive into data
                            </Button>
                        </Link>
                    </motion.div>
                  
                </div>

                <motion.div
                    initial={{ opacity: 0, filter: "blur(20px)", y: 30 }}
                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className={cn("mt-16 lg:mt-26 relative")}
                >
                    <div className="relative mx-auto max-w-6xl rounded-xl md:rounded-[24px] border border-border-subtle bg-surface-0 p-2">

                        <div className="rounded-lg md:rounded-[20px] border border-border-subtle bg-surface-0 overflow-hidden">
                            <div className="relative aspect-[16/10] w-full bg-black">
                                <iframe
                                    src="https://www.youtube.com/embed/Ed9lP0-komE?rel=0&modestbranding=1"
                                    title="Budget Ndio Story overview"
                                    className="absolute inset-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 z-20 w-full h-3/4 bg-linear-to-t from-surface-0 to-surface-0/0 from-10% pointer-events-none" />

                    {badges.map((badge, index) => (
                        <FloatingBadge
                            key={index}
                            text={badge.text}
                            top={badge.top}
                            left={badge.left}
                            right={badge.right}
                            index={index}
                        />
                    ))}
                </motion.div>
            </Wrapper>
        </section>
    );
};

export default Hero;

