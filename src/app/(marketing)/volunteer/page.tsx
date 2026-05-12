import { Metadata } from "next";
import { MarketingSurfacePage } from "@/components/marketing/marketing-surface-page";
import { Routes } from "@/constants";

export const metadata: Metadata = {
  title: "Volunteer | Budget Ndio Story",
  description:
    "Volunteer with Budget Ndio Story—verification desks, events, and storytelling sprints across Kenya.",
};

export default function VolunteerPage() {
  return (
    <MarketingSurfacePage
      eyebrow="Hands on"
      title="Volunteer your craft."
      description="Verification hubs, town halls, and campus chapters always need researchers, designers, facilitators, and field documentarians. Share how many hours you can offer and the skills you bring—we’ll match you to a sprint."
      primary={{ label: "Offer your time", href: `${Routes.Contact}#contact-form` }}
      secondary={{ label: "Open roles", href: Routes.Careers }}
    />
  );
}
