"use client";

import React from "react";
import { Header as Navbar } from "@/layouts/Header";
import { usePathname } from "next/navigation";
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
      <Navbar />

      <div className="flex flex-1 flex-col">{children}</div>

      {showMarketingFooter ? (
        <div className="mt-auto shrink-0">
          <BNSFooter />
        </div>
      ) : null}
    </main>
  );
};

export default MarketingLayout;
