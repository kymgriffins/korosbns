"use client";

import React from "react";
import { Header as Navbar } from "@/layouts/Header";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ease } from "@/motion/variants";
import BNSFooter from "@/components/shadcn-space/blocks/footer-02/footer";
import {
  shouldShowMarketingFooter,
  usesMarketingChrome,
} from "@/lib/marketing-layout";

const MarketingLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isLearnApp = pathname.startsWith("/learn");
  const showMarketingChrome = usesMarketingChrome(pathname);
  const showMarketingFooter = shouldShowMarketingFooter(pathname);

  return (
    <main
      className={`relative flex min-h-dvh w-full flex-col ${
        showMarketingChrome ? "pt-12 md:pt-16 lg:pt-20" : ""
      }`}
    >
      {!isLearnApp && <Navbar />}

      <div className="flex flex-1 flex-col">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.38, ease: ease.expo }}
            className={isLearnApp ? "contents" : "flex flex-1 flex-col"}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {showMarketingFooter ? (
        <div className="mt-auto shrink-0">
          <BNSFooter />
        </div>
      ) : null}
    </main>
  );
};

export default MarketingLayout;
