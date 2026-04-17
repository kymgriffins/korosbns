import Contact from "@/components/marketing/contact";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact | Budget Ndio Story",
    description: "Get in touch with the Budget Ndio Story team. Send us a message or follow us on social media.",
};

const ContactPage = () => {
    return (
        <Contact />
    );
};

export default ContactPage;
