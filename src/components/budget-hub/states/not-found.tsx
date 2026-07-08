import Link from "next/link";
import { Routes } from "@/constants/routes";
import { Button } from "@/components/ui/button";

export function HubNotFound({
  message = "We couldn't find that story.",
}: {
  message?: string;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="mt-2 text-2xl font-semibold">Story not found</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{message}</p>
      <Button asChild className="mt-8 rounded-full bg-foreground text-background">
        <Link href={Routes.Learn}>Return to Budget Hub</Link>
      </Button>
    </div>
  );
}
