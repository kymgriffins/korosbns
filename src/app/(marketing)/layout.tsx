import React from "react";
import { LenisProvider } from "@/components/clean-slate/lenis-provider";
import { CleanSlateNav } from "@/components/clean-slate/nav";
import { CleanSlateFooter } from "@/components/clean-slate/footer";

const MarketingLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <LenisProvider>
      <div className="cs-page">
        <CleanSlateNav />
        <main style={{ paddingTop: "64px" }}>{children}</main>
        <CleanSlateFooter />
      </div>
    </LenisProvider>
  );
};

export default MarketingLayout;
