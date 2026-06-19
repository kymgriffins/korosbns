import "@/styles/globals.css";
import type { Viewport } from "next";
import LearnProviders from "./learn-providers";
import { cn } from "@/utils";
import { base, heading, handwriting } from "@/constants";

export const viewport: Viewport = {
  themeColor: "#020817",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://bnske.budgetndiostory.org" />
      </head>
      <body
        className={cn(
          "min-h-dvh bg-background text-foreground font-base antialiased overflow-x-hidden",
          base.variable,
          heading.variable,
          handwriting.variable,
        )}
      >
        <LearnProviders>{children}</LearnProviders>
      </body>
    </html>
  );
}
