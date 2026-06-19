import ContactPageLayout from "@/layouts/ContactPage";
import { Metadata } from "next";
import { canonicalUrl } from "@/utils/metadata";

export const metadata: Metadata = {
    title: "Contact | Budget Ndio Story",
    description: "Get in touch with the Budget Ndio Story team. Share your views on Kenya's Finance Bill, Appropriation Bill, or parliamentary budget process.",
    keywords: ["contact Budget Ndio Story", "Kenya budget questions", "Finance Bill inquiry", "public participation budget", "civic engagement Kenya"],
    alternates: { canonical: canonicalUrl("/contact") },
    openGraph: {
        title: "Contact | Budget Ndio Story",
        description: "Reach out to the Budget Ndio Story team about Kenya's budget, Finance Bill, and civic education initiatives.",
        url: "/contact",
    },
};

export default function ContactPage() {
    return <ContactPageLayout />;
}
