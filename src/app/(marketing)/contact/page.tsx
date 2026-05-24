import ContactPageLayout from "@/layouts/ContactPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact | Budget Ndio Story",
    description: "Get in touch with the Budget Ndio Story team. Send us a message or follow us on social media.",
};

export default function ContactPage() {
    return <ContactPageLayout />;
}
