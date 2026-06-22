import type { ReactNode } from "react";

import { ProtectedGuard } from "./protected-guard";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <ProtectedGuard>{children}</ProtectedGuard>;
}
