"use client";

import { EmailObfuscator } from "@/components/global/email-obfuscator";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { motion } from "motion/react";
import Link from "next/link";
import { landingSectionsContent } from "@/content";

export default function LandingFooter() {
  return (
    <footer className="bg-card text-card-foreground pt-24 md:pt-36 pb-12 md:pb-20 overflow-hidden border-t border-border rounded-none">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 mb-24 md:mb-32"
        >
          <motion.div variants={fadeInUp}>
            <h2 className="gusto-heading mb-12">
              {landingSectionsContent.footer.heading}
            </h2>
            <div className="flex flex-col gap-4">
              <EmailObfuscator
                email={landingSectionsContent.footer.email}
                className="text-2xl md:text-4xl font-black hover:text-primary transition-colors tracking-tight"
              />
              <p className="text-muted-foreground tracking-[0.2em] uppercase text-xs">
                {landingSectionsContent.footer.emailPrompt}
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-2 gap-8 md:gap-12"
          >
            {landingSectionsContent.footer.navSections.map((section) => (
              <div key={section.title} className="space-y-6">
                <h4 className="text-muted-foreground text-xs font-semibold">
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith('http') ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base md:text-lg hover:text-primary transition-colors inline-block"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-base md:text-lg hover:text-primary transition-colors inline-block"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="flex items-center gap-4">
            <span className="text-xl font-black tracking-tighter text-card-foreground">
              BNS.
            </span>
            <span className="text-muted-foreground/50 text-xs">
              {landingSectionsContent.footer.copyright}
            </span>
          </div>
          <div className="flex flex-wrap gap-6 text-muted-foreground text-xs font-semibold">
            {landingSectionsContent.footer.bottomLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-card-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
