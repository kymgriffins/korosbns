"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { cn } from "@/utils";

export interface ServiceItem {
    heading: string;
    descp: string;
    image: string;
    ctaLabel?: string;
    ctaHref?: string;
}

export interface ServicesProps {
    data?: ServiceItem[];
}

export const servicesData: ServiceItem[] = [
    {
        heading: "Brand Strategy",
        descp: "We craft unique brand stories and visual identities that resonate with your audience and build long-lasting trust and recognition.",
        image: "/images/explainer-formulation.png",
        ctaLabel: "Learn More",
        ctaHref: "/contact",
    },
    {
        heading: "Web development",
        descp: "Build stunning, user-friendly websites that not only look great but also perform seamlessly across all devices.",
        image: "/images/project.png",
        ctaLabel: "See Capabilities",
        ctaHref: "/about",
    },
    {
        heading: "Content creation",
        descp: "We create engaging, high-quality content that resonates with your audience and helps you connect with them on a deeper level.",
        image: "/images/community-pulse.png",
        ctaLabel: "View Work",
        ctaHref: "/about",
    },
    {
        heading: "Motion graphics",
        descp: "We create engaging, high-quality motion graphics that capture the essence of your brand and help you connect with your audience on a deeper level.",
        image: "/images/dashboard.png",
        ctaLabel: "Book a Session",
        ctaHref: "/contact",
    }
];

function Services({ data = servicesData }: ServicesProps) {
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const handleMouseEnter = (index: number) => {
        setActiveIndex(index);
    };

    return (
        <section className="bg-background">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 lg:py-20 sm:py-16 py-8">
                <div className="flex flex-col sm:gap-16 gap-8">
                    <div className="flex md:flex-row flex-col justify-between md:items-end items-start gap-4">
                        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-left-10 duration-1000 delay-200 ease-in-out fill-mode-both">
                            <Badge variant="outline" className="py-1 px-3 h-auto text-sm font-normal border-0 outline outline-border">
                                Services
                            </Badge>
                            <h2 className="sm:text-5xl text-3xl text-foreground font-semibold">What we do</h2>
                            <p className="max-w-2xl text-muted-foreground sm:text-lg text-base">
                                A glimpse into our creativity—exploring innovative designs, successful collaborations, and transformative digital experiences.
                            </p>
                        </div>
                        <Link href="/contact">
                            <Button
                                className={"group p-1 bg-primary hover:bg-primary/80 text-white font-medium flex gap-2 lg:gap-3 justify-between items-center rounded-full w-fit ps-5 h-auto border-0 animate-in fade-in slide-in-from-right-10 duration-1000 delay-200 ease-in-out fill-mode-both"}
                            >
                                <span className="flex items-center gap-3 text-primary-foreground text-sm font-medium">
                                    Let's Collaborate
                                    <span className="p-2 bg-background rounded-full group-hover:rotate-45 transition-transform duration-300 ease-in-out">
                                        <Icon
                                            className="text-foreground"
                                            icon="lucide:arrow-up-right"
                                            width={16}
                                            height={16}
                                        />
                                    </span>
                                </span>
                            </Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-12 relative gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200 ease-in-out fill-mode-both">
                        <div className="hidden lg:flex w-full lg:col-span-5 items-start justify-center">
                            <div className={`transition-all duration-300 z-10 w-full max-w-lg`}>
                                {data?.[activeIndex]?.image && (
                                    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
                                        <Image
                                            src={data[activeIndex].image}
                                            alt={data[activeIndex].heading}
                                            width={640}
                                            height={420}
                                            className="h-[320px] w-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-16 lg:col-span-7 col-span-12">
                            <div>
                                {data?.map((value, index) => (
                                    <div
                                        key={index}
                                        onMouseEnter={() => handleMouseEnter(index)}
                                        className="group py-6 xl:py-8 border-t border-border cursor-pointer flex xl:flex-row flex-col xl:items-start items-start justify-between xl:gap-10 gap-4 relative">
                                        <div className="w-full space-y-3">
                                            <h3 className={cn("group-hover:text-primary py-1 text-2xl md:text-3xl font-semibold text-foreground w-full", activeIndex === index ? "text-primary" : "")}>
                                            {value.heading}
                                            </h3>
                                            <p className={cn("text-muted-foreground text-base transition-all duration-300", activeIndex === index ? "opacity-100" : "opacity-80")}>
                                                {value.descp}
                                            </p>
                                            <div className="lg:hidden overflow-hidden rounded-xl border border-border/60 bg-card">
                                                <Image
                                                    src={value.image}
                                                    alt={value.heading}
                                                    width={560}
                                                    height={320}
                                                    className="h-52 w-full object-cover"
                                                />
                                            </div>
                                        </div>
                                        <Link href={value.ctaHref ?? "/contact"} className="shrink-0">
                                            <Button
                                                variant={activeIndex === index ? "default" : "outline"}
                                                className="rounded-full"
                                            >
                                                {value.ctaLabel ?? "Learn More"}
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Services;
