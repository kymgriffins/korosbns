import Link from "next/link";
import { Routes } from "@/constants/routes";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title = "Nothing here yet",
  description = "Check back soon for new civic explainers.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--bh-border)] px-8 py-16 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <Button asChild variant="outline" className="mt-6 rounded-full">
        <Link href={Routes.Learn}>Back to Budget Hub</Link>
      </Button>
    </div>
  );
}
