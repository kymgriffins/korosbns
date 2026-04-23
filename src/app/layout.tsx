import FlareCursor from "@/components/global/flare-cursor";
import LoadingScreen from "@/components/global/loading-screen";
import Providers from "@/components/global/providers";
import { base, handwriting, heading } from "@/constants";
import "@/styles/globals.css";
import { cn, generateMetadata } from "@/utils";
import { Analytics } from "@vercel/analytics/next";

export const metadata = generateMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-dvh bg-background text-foreground font-base antialiased overflow-x-hidden dark",
          base.variable,
          heading.variable,
          handwriting.variable,
        )}
      >
        <Providers>
          <LoadingScreen />
          <FlareCursor />
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
