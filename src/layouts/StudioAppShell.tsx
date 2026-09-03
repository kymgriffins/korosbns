"use client";

import { useStudioTheme } from "@/contexts/studio-theme-context";

type Props = {
  children: React.ReactNode;
};

/** Studio routes use per-page nav — no global marketing-style header. */
export function StudioAppShell({ children }: Props) {
  const { theme } = useStudioTheme();

  return (
    <div
      data-studio-theme={theme}
      className="studio-app studio-theatre min-h-dvh w-full"
    >
      {children}
    </div>
  );
}
