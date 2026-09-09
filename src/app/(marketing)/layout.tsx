"use client";

import React from "react";
import { Header as Navbar } from "@/layouts/Header";
import { usePathname } from "next/navigation";
import BNSFooter from "@/components/shadcn-space/blocks/footer-02/footer";
import MinimalFooter from "@/components/global/minimal-footer";
import {
  getFooterVariant,
  usesMarketingChrome,
} from "@/lib/marketing-layout";

const MarketingLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isChromeDisabled = pathname.startsWith("/learn") || pathname.startsWith("/stories");
  const showMarketingChrome = usesMarketingChrome(pathname);
  const footerVariant = getFooterVariant(pathname);

  return (
    <main
      className={`relative flex min-h-dvh w-full flex-col ${
        showMarketingChrome ? "pt-12 md:pt-16 lg:pt-20" : ""
      }`}
    >
      {!isChromeDisabled && <Navbar />}

      <div className="flex flex-1 flex-col">{children}</div>

      {!isChromeDisabled && footerVariant !== "none" ? (
        <div className="mt-auto shrink-0">
          {footerVariant === "marketing" ? <BNSFooter /> : <MinimalFooter />}
        </div>
      ) : null}
    </main>
  );
};

export default MarketingLayout;
