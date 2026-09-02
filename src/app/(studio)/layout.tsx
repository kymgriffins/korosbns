import { StudioThemeProvider } from "@/contexts/studio-theme-context";
import { StudioAppShell } from "@/layouts/StudioAppShell";

export default function StudioRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudioThemeProvider>
      <StudioAppShell>{children}</StudioAppShell>
    </StudioThemeProvider>
  );
}
