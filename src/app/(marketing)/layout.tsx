"use client";

import React from "react";
import { Header as Navbar } from "@/layouts/Header";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ease } from "@/motion/variants";
import BNSFooter from "@/components/shadcn-space/blocks/footer-02/footer";

const MarketingLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isLearnApp = pathname.startsWith("/learn");
  const isAppPage = isLearnApp ||
    pathname === "/contact" ||
    pathname.startsWith("/surveys") ||
    pathname.startsWith("/events") ||
    pathname.startsWith("/budgetnews") ||
    pathname.startsWith("/bns-project");
  const showMarketingFooter = !isAppPage;

  const showMarketingChrome = !isLearnApp;

  return (
    <main
      className={`w-full relative ${
        showMarketingChrome ? "pt-12 md:pt-16 lg:pt-20" : ""
      }`}
    >
      {!isLearnApp && <Navbar />}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.38, ease: ease.expo }}
          className={isLearnApp ? "contents" : undefined}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {showMarketingFooter && <BNSFooter />}
    </main>
  );
};

export default MarketingLayout;
