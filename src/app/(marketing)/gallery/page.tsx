import { Metadata } from "next";
import Gallery from "@/components/marketing/gallery";
import Wrapper from "@/components/global/wrapper";

export const metadata: Metadata = {
    title: "Gallery | Budget Ndio Story",
    description: "Real-world impact: Visualizing the journey of Budget Ndio Story through authentic moments of civic engagement and transparency across Kenya.",
};

export default function GalleryPage() {
    return (
        <main className="relative w-full min-h-screen pt-20">
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full opacity-50" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/5 blur-[120px] rounded-full opacity-50" />
            </div>

            <Gallery />

            <section className="pb-24">
                <Wrapper>
                    <div className="rounded-[2.5rem] p-8 lg:p-16 bg-foreground/5 border border-foreground/10 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">Have photos from a BNS event?</h2>
                        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                            We love seeing how our community engages with budget stories. If you have high-quality photos from a Town Hall or Campus Hub, share them with us.
                        </p>
                        <a 
                            href="mailto:info@budgetndiostory.org" 
                            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all hover:scale-105"
                        >
                            Submit your photos
                        </a>
                    </div>
                </Wrapper>
            </section>
        </main>
    );
}
