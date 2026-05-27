import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Civic Events & Budget Forums | Budget Ndio Story",
  description:
    "Browse civic education events, public participation forums, and budget awareness sessions across Kenya. Stay informed about Finance Bill debates and county budget hearings.",
  keywords: [
    "Kenya civic events",
    "public participation budget",
    "Finance Bill forums Kenya",
    "county budget hearings",
    "Budget Ndio Story events",
    "parliamentary budget sessions",
  ],
  alternates: { canonical: "/events" },
  openGraph: {
    title: "Civic Events & Budget Forums | Budget Ndio Story",
    description:
      "Public events and forums on Kenya's budget process, Finance Bill discussions, and county allocation hearings.",
    url: "/events",
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
