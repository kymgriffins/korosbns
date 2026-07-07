"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { cn } from "@/utils";

export interface ServiceItem {
    heading: string;
    descp: string;
    image: string;
    icon?: string;
    ctaLabel?: string;
    ctaHref?: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
    highlights?: string[];
    statLabel?: string;
    statValue?: string;
}

export interface ServicesProps {
    data?: ServiceItem[];
}

export const servicesData: ServiceItem[] = [
    {
        heading: "Brand Strategy",
        descp: "We craft unique brand stories and visual identities that resonate with your audience and build long-lasting trust and recognition.",
        image: "/images/explainer-formulation.png",
        icon: "lucide:lightbulb",
        ctaLabel: "Learn More",
        ctaHref: "/contact",
        secondaryCtaLabel: "View Portfolio",
        secondaryCtaHref: "/about",
        highlights: ["Brand audit", "Positioning", "Messaging kit"],
        statLabel: "Projects",
        statValue: "40+",
    },
    {
        heading: "Web development",
        descp: "Build stunning, user-friendly websites that not only look great but also perform seamlessly across all devices.",
        image: "/images/project.png",
        icon: "lucide:code-2",
        ctaLabel: "See Capabilities",
        ctaHref: "/about",
        secondaryCtaLabel: "Talk to team",
        secondaryCtaHref: "/contact",
        highlights: ["Responsive builds", "Performance-first", "SEO setup"],
        statLabel: "Avg load gain",
        statValue: "2.3x",
    },
    {
        heading: "Content creation",
        descp: "We create engaging, high-quality content that resonates with your audience and helps you connect with them on a deeper level.",
        image: "/images/community-pulse.png",
        icon: "lucide:pen-line",
        ctaLabel: "View Work",
        ctaHref: "/about",
        secondaryCtaLabel: "Get strategy call",
        secondaryCtaHref: "/contact",
        highlights: ["Video scripts", "Editorial plans", "Social campaigns"],
        statLabel: "Monthly outputs",
        statValue: "120+",
    },
    {
        heading: "Motion graphics",
        descp: "We create engaging, high-quality motion graphics that capture the essence of your brand and help you connect with your audience on a deeper level.",
        image: "/images/dashboard.png",
        icon: "lucide:clapperboard",
        ctaLabel: "Book a Session",
        ctaHref: "/contact",
        secondaryCtaLabel: "See showreel",
        secondaryCtaHref: "/about",
        highlights: ["2D/3D motion", "Explainers", "Campaign assets"],
        statLabel: "Delivery SLA",
        statValue: "72h",
    }
];

function Services({ data = servicesData }: ServicesProps) {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const sectionRef = useRef<HTMLElement | null>(null);
    const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });
    const parallaxY = useSpring(
        useTransform(scrollYProgress, [0, 1], [28, -28]),
        { stiffness: 90, damping: 28 },
    );

    const handleMouseEnter = (index: number) => {
        setActiveIndex(index);
    };

    useEffect(() => {
        if (!data?.length) return;
        let ticking = false;

        const updateActiveFromScroll = () => {
            ticking = false;
            const viewportAnchor = window.innerHeight * 0.42;
            let nextIndex = 0;
            let closestUpcomingDistance = Number.POSITIVE_INFINITY;

            itemRefs.current.forEach((node, index) => {
                if (!node) return;
                const rect = node.getBoundingClientRect();
                const passedAnchor = rect.top <= viewportAnchor;

                // Promote the latest section that has crossed the anchor.
                if (passedAnchor) {
                    nextIndex = index;
                    return;
                }

                // Before first crossing, use nearest upcoming section.
                const upcomingDistance = rect.top - viewportAnchor;
                if (upcomingDistance < closestUpcomingDistance) {
                    closestUpcomingDistance = upcomingDistance;
                    nextIndex = index;
                }
            });

            setActiveIndex((prev) => (prev === nextIndex ? prev : nextIndex));
        };

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(updateActiveFromScroll);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        onScroll();

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [data]);

    return (
        <section ref={sectionRef} className="bg-background">
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
                            <motion.div
                                style={{ y: parallaxY }}
                                className="sticky top-24 transition-all duration-300 z-10 w-full max-w-lg"
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={`sticky-panel-${activeIndex}`}
                                        initial={{ opacity: 0, y: 18 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -18 }}
                                        transition={{ duration: 0.35, ease: "easeOut" }}
                                        className="overflow-hidden rounded-2xl border border-border/70 bg-card p-1"
                                    >
                                        {data?.[activeIndex]?.image && (
                                            <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl">
                                                <Image
                                                    src={data[activeIndex].image}
                                                    alt={data[activeIndex].heading}
                                                    width={640}
                                                    height={420}
                                                    className="absolute inset-0 h-full w-full object-cover object-top"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                                            </div>
                                        )}
                                        <div className="space-y-3 p-5">
                                            <motion.div
                                                initial={{ scale: 0.88, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ duration: 0.3, ease: "easeOut" }}
                                                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary"
                                            >
                                                <Icon icon={data?.[activeIndex]?.icon ?? "lucide:sparkles"} width={18} height={18} />
                                            </motion.div>
                                            <h3 className="text-xl font-semibold text-foreground">
                                                {data?.[activeIndex]?.heading}
                                            </h3>
                                            {data?.[activeIndex]?.statLabel && data?.[activeIndex]?.statValue ? (
                                                <div className="inline-flex items-center gap-2 rounded-xl border border-primary/25 bg-primary/10 px-3 py-2">
                                                    <span className="text-xs uppercase tracking-wide text-primary/80">
                                                        {data[activeIndex].statLabel}
                                                    </span>
                                                    <AnimatedStat value={data[activeIndex].statValue} />
                                                </div>
                                            ) : null}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>
                        </div>
                        <div className="w-full flex flex-col gap-16 lg:col-span-7 col-span-12">
                            <div>
                                {data?.map((value, index) => (
                                    <motion.div
                                        key={index}
                                        ref={(node) => {
                                            itemRefs.current[index] = node;
                                        }}
                                        onMouseEnter={() => handleMouseEnter(index)}
                                        animate={{
                                            opacity: activeIndex === index ? 1 : 0.45,
                                            y: activeIndex === index ? 0 : 20,
                                        }}
                                        transition={{ duration: 0.35, ease: "easeOut" }}
                                        className="group min-h-[72vh] lg:min-h-[92vh] py-8 xl:py-10 border-t border-border cursor-pointer flex xl:flex-row flex-col xl:items-center items-start justify-between xl:gap-10 gap-5 relative">
                                        <div className="w-full max-w-2xl space-y-4">
                                            <h3 className={cn("group-hover:text-primary py-1 text-2xl md:text-3xl font-semibold text-foreground w-full", activeIndex === index ? "text-primary" : "")}>
                                            {value.heading}
                                            </h3>
                                            <p className={cn("text-muted-foreground text-base transition-all duration-300", activeIndex === index ? "opacity-100" : "opacity-80")}>
                                                {value.descp}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {(value.highlights ?? []).map((item) => (
                                                    <span
                                                        key={item}
                                                        className={cn(
                                                            "rounded-full border px-3 py-1 text-xs font-medium",
                                                            activeIndex === index
                                                                ? "border-primary/30 bg-primary/10 text-primary"
                                                                : "border-border text-muted-foreground",
                                                        )}
                                                    >
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                            {(value.statLabel && value.statValue) ? (
                                                <div className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card px-3 py-2">
                                                    <span className="text-xs uppercase tracking-wide text-muted-foreground">{value.statLabel}</span>
                                                    <span className="text-sm font-semibold text-foreground">{value.statValue}</span>
                                                </div>
                                            ) : null}
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
                                        <div className="flex shrink-0 items-center gap-2 self-start xl:self-center">
                                            <Link href={value.ctaHref ?? "/contact"}>
                                                <Button
                                                    variant={activeIndex === index ? "default" : "outline"}
                                                    className="rounded-full"
                                                >
                                                    {value.ctaLabel ?? "Learn More"}
                                                </Button>
                                            </Link>
                                            {value.secondaryCtaHref ? (
                                                <Link href={value.secondaryCtaHref}>
                                                    <Button variant="ghost" className="rounded-full">
                                                        {value.secondaryCtaLabel ?? "Details"}
                                                    </Button>
                                                </Link>
                                            ) : null}
                                        </div>
                                    </motion.div>
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

function AnimatedStat({ value }: { value: string }) {
    const parsed = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
    const numeric = parsed ? Number(parsed[1]) : null;
    const suffix = parsed ? parsed[2] : "";
    const [display, setDisplay] = useState<string>(numeric === null ? value : "0");

    useEffect(() => {
        if (numeric === null) {
            setDisplay(value);
            return;
        }

        const durationMs = 550;
        const steps = 24;
        const stepMs = Math.max(16, Math.floor(durationMs / steps));
        let step = 0;
        const timer = window.setInterval(() => {
            step += 1;
            const progress = Math.min(step / steps, 1);
            const current = numeric * progress;
            const decimalPlaces = Number.isInteger(numeric) ? 0 : 1;
            setDisplay(current.toFixed(decimalPlaces));
            if (progress >= 1) {
                window.clearInterval(timer);
            }
        }, stepMs);

        return () => window.clearInterval(timer);
    }, [numeric, value]);

    return (
        <span className="text-sm font-semibold text-foreground">
            {numeric === null ? value : `${display}${suffix}`}
        </span>
    );
}
