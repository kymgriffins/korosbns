"use client";

import { Footer } from "@/layouts/Footer";
import { Header as Navbar } from "@/layouts/Header";
import { usePathname } from "next/navigation";

const MarketingLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {

    const pathname = usePathname();
    const isContactPage = pathname === "/contact";
    const isLearnApp = pathname.startsWith("/learn");
    const isAccountPage = pathname.startsWith("/account");
    const showMarketingFooter =
        !isContactPage && !isLearnApp && !isAccountPage;

    return (
        <main className={`w-full relative ${(isAccountPage || isLearnApp) ? "" : "pt-14 sm:pt-20"}`}>
            {!isAccountPage && !isLearnApp && <Navbar />}
            {children}
            {showMarketingFooter && <Footer />}
        </main>
    );
};

export default MarketingLayout;
