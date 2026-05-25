"use client";

import { motion } from 'motion/react';
import Wrapper from '@/components/global/wrapper';
import SectionBadge from '@/ui/section-badge';
import Link from 'next/link';
import { ease } from '@/motion/variants';
import TeamSection from './team-section';
import { TeamMember } from '@/lib/team';

const About = ({ teamData }: { teamData?: TeamMember[] }) => {
    const openCallRoles = [
        "Podcast hosts",
        "Storytellers",
        "Animators",
        "Videographers",
        "Photographers",
        "Script writers",
        "Social media managers",
        "Facilitators",
    ];

    return (
        <section className="relative w-full min-h-screen bg-background overflow-hidden">
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 blur-[120px] rounded-full"
                />
            </div>

            <Wrapper className="relative z-10 py-12 lg:py-20">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
                    <SectionBadge title="About Us" />
                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1, ease: ease.expo }}
                        className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight mt-6"
                    >
                        Youth-led transparency for Kenya&apos;s budget
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2, ease: ease.expo }}
                        className="text-base md:text-lg text-muted-foreground mt-6 leading-relaxed"
                    >
                        Budget Ndio Story (BNS) is a youth-led organization transforming how Kenyans understand national and county budgets. We turn complex fiscal documents into simple stories, visuals, and actionable steps.
                    </motion.p>
                </div>

                {/* Mission Section */}
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: ease.expo }}
                    className="max-w-4xl mx-auto mb-20 lg:mb-32"
                >
                    <div className="rounded-2xl lg:rounded-3xl p-8 lg:p-12 bg-card border border-border shadow-sm">
                        <h2 className="text-2xl lg:text-3xl font-bold mb-6">Our Mission</h2>
                        <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                            We believe every young Kenyan has the right to understand how public money is spent. By breaking down the Budget Policy Statement and other fiscal documents into digestible content, we empower a new generation to hold leaders accountable and participate meaningfully in governance.
                        </p>
                    </div>
                </motion.div>
            </Wrapper>

            {/* Team Section - Full width */}
            <TeamSection teamData={teamData} />

            <Wrapper className="relative z-10">
                <motion.div
                    id="join-us"
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: ease.expo }}
                    className="max-w-5xl mx-auto mb-16 lg:mb-24"
                >
                    <div className="rounded-2xl lg:rounded-3xl p-8 lg:p-12 bg-card border border-border shadow-sm">
                        <div className="max-w-3xl">
                            <SectionBadge title="Join Us" />
                            <h2 className="text-2xl lg:text-3xl font-bold mt-5">Open call: young creatives wanted (18-34)</h2>
                            <p className="text-muted-foreground mt-4 leading-relaxed">
                                Budget Ndio Story is opening space for young creators who care about civic storytelling and public accountability.
                                If you are between 18 and 34 and ready to shape how Kenya talks about budgets, apply to join our creative network.
                            </p>
                        </div>

                        <div className="mt-7 flex flex-wrap gap-3">
                            {openCallRoles.map((role) => (
                                <span
                                    key={role}
                                    className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium"
                                >
                                    {role}
                                </span>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 shadow-sm"
                            >
                                Contact us to apply
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-semibold transition-colors hover:border-primary/40 hover:text-primary"
                            >
                                Go to contact page
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Impact Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: ease.expo }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="rounded-2xl lg:rounded-3xl p-8 lg:p-12 bg-card border border-border shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                            <div>
                                <h2 className="text-2xl lg:text-3xl font-bold mb-4">Our Impact</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Since our inception, we&apos;ve reached thousands of young Kenyans with clear, actionable budget information. Our content spans social media, interactive learning modules, and detailed research analyses.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.1 }}
                                    className="text-center p-6 rounded-xl bg-card border border-border"
                                >
                                    <div className="text-4xl lg:text-5xl font-bold text-primary">20k+</div>
                                    <div className="text-sm text-muted-foreground mt-2">Youth reached</div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                    className="text-center p-6 rounded-xl bg-card border border-border"
                                >
                                    <div className="text-4xl lg:text-5xl font-bold text-primary">1.2M+</div>
                                    <div className="text-sm text-muted-foreground mt-2">Content views</div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.3 }}
                                    className="text-center p-6 rounded-xl bg-card border border-border"
                                >
                                    <div className="text-4xl lg:text-5xl font-bold text-primary">47</div>
                                    <div className="text-sm text-muted-foreground mt-2">Counties covered</div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.4 }}
                                    className="text-center p-6 rounded-xl bg-card border border-border"
                                >
                                    <div className="text-4xl lg:text-5xl font-bold text-primary">5+</div>
                                    <div className="text-sm text-muted-foreground mt-2">Years of work</div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </Wrapper>
        </section>
    );
};

export default About;
