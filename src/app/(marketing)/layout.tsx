"use client";

import Footer from "@/components/marketing/footer";
import Navbar from "@/components/marketing/navbar";
import { usePathname } from "next/navigation";

const MarketingLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {

    const pathname = usePathname();
    const isContactPage = pathname === "/contact";
    const isLearnPage = pathname === "/learn";
    const isLearnDocPage = pathname.startsWith("/learn/") && pathname !== "/learn";
    const isAccountPage = pathname.startsWith("/account");
    const showMarketingFooter =
        !isContactPage && !isLearnPage && !isLearnDocPage && !isAccountPage;

    return (
        <main className={`w-full relative ${isAccountPage ? "" : "pt-14 sm:pt-20"}`}>
            {!isAccountPage && <Navbar />}
            {children}
            {showMarketingFooter && <Footer />}
        </main>
    );
};

export default MarketingLayout;
