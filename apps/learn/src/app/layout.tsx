import type { Metadata } from "next";
import LearnProviders from "./learn-providers";

export const metadata: Metadata = {
  title: "Budget Ndio Story - Learning Hub",
  description: "Learn about Kenya's budget and public finance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LearnProviders>{children}</LearnProviders>
      </body>
    </html>
  );
}
