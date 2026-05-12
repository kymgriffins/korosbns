"use client";

import GustoFooter from "@/components/marketing/gusto-footer";
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
    const showFooter = !isContactPage && !isLearnPage && !isLearnDocPage;

    return (
        <main className="w-full relative">
            <Navbar />

            
            <div className="relative z-10 bg-background shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                {children}
            </div>

            {showFooter && (
                <>
                    <div className="hidden md:block sticky bottom-0 z-0 h-screen w-full pointer-events-none">
                        <div className="pointer-events-auto h-full w-full">
                            <GustoFooter />
                        </div>
                    </div>
                    <div className="md:hidden relative z-20 bg-background">
                        <GustoFooter />
                    </div>
                </>
            )}
        </main>
    );
};

export default MarketingLayout;
