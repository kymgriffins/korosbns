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

    return (
        <main className="w-full relative pt-16 md:pt-18">
            <Navbar />
            {children}
            {!isContactPage && !isLearnPage && !isLearnDocPage && <Footer />}
        </main>
    );
};

export default MarketingLayout;
