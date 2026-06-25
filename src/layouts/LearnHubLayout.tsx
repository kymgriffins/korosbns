import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { LearnHubShell } from "./LearnHubShell";

export default async function LearnHubLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <LearnHubShell defaultOpen={defaultOpen}>
      {children}
    </LearnHubShell>
  );
}
