"use client";

import React from "react";
import { Footer } from "@/layouts/Footer";
import { Header as Navbar } from "@/layouts/Header";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ease } from "@/motion/variants";

const MarketingLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isContactPage = pathname === "/contact";
  const isLearnApp = pathname.startsWith("/learn");
  const isAccountPage = pathname.startsWith("/account");
  const showMarketingFooter = !isContactPage && !isLearnApp && !isAccountPage;

  const showMarketingChrome = !isAccountPage && !isLearnApp;

  return (
    <main
      className={`w-full relative ${
        showMarketingChrome ? "pt-12 md:pt-16 lg:pt-20 pb-mobile-nav lg:pb-0" : ""
      }`}
    >
      {!isAccountPage && !isLearnApp && <Navbar />}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.38, ease: ease.expo }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {showMarketingFooter && <Footer />}
    </main>
  );
};

export default MarketingLayout;
