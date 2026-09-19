import React from "react";
import { MagazineShell } from "@/components/magazine/magazine-shell";
import { getLiveMagazineGlobalData } from "@/lib/cms-live-data";

const MarketingLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const magazineGlobal = await getLiveMagazineGlobalData();

  return (
    <MagazineShell content={magazineGlobal}>
      <main className="relative flex min-h-dvh w-full flex-col">
        <div className="flex flex-1 flex-col">{children}</div>
      </main>
    </MagazineShell>
  );
};

export default MarketingLayout;
