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

    return (
        <main className="w-full relative">
            <Navbar />
            {children}
            {!isContactPage && <Footer />}
        </main>
    );
};

export default MarketingLayout;
