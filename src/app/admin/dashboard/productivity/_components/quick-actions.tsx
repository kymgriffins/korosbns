import Link from "next/link";

import { CheckSquare, FileText, Focus, Orbit, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRouteBase, getFullUrl } from "@/lib/route-base";

const quickActions = [
  { label: "New Note", icon: FileText, href: "/dashboard/notes/new" },
  { label: "New Task", icon: CheckSquare, href: "/dashboard/task/new" },
  { label: "New Project", icon: Orbit, href: "#" },
  { label: "New Goal", icon: Focus, href: "#" },
  { label: "Upload", icon: Upload, href: "#" },
] as const;

export function QuickActions() {
  const routeBase = useRouteBase();
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xl tracking-tight">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {quickActions.map((action) => (
          <Button key={action.label} variant="outline" className="justify-start" asChild>
            <Link href={getFullUrl(routeBase, action.href)}>{action.icon && <action.icon data-icon="inline-start" />}{action.label}</Link>
          </Button>
        ))}
      </div>
    </section>
  );
}
