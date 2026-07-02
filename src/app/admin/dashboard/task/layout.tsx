import type { ReactNode } from "react";

export default function TaskLayout({ children }: { children: ReactNode }) {
  return <div className="w-full max-w-none min-w-0">{children}</div>;
}
