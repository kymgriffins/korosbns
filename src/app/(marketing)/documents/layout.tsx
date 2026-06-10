import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documents | Budget Ndio Story",
  description:
    "Browse and download official budget documents, government reports, and public resources.",
  openGraph: {
    title: "Documents | Budget Ndio Story",
    description:
      "Browse and download official budget documents, government reports, and public resources.",
    url: "/documents",
  },
};

export default function DocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
