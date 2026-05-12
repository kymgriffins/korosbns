"use client";

import React from "react";
import { motion } from "motion/react";
import Container from "@/components/ui/container";
import { APPLE_EASE } from "@/constants/motion";

interface Props {
    text?: string;
    height?: string;
}

const CinematicSilence = ({ text, height = "min-h-[25vh]" }: Props) => {
    return (
        <section className={`relative w-full ${height} flex items-center justify-center bg-background`}>
            <Container size="ultra">
                {text && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, ease: APPLE_EASE }}
                        viewport={{ once: true }}
                        className="text-center text-[12px] md:text-[14px] font-black uppercase tracking-[0.5em] text-foreground/30 px-6"
                    >
                        {text}
                    </motion.p>
                )}
            </Container>
        </section>
    );
};

export default CinematicSilence;
