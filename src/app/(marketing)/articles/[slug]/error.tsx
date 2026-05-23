"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/ui/button";
import { Routes } from "@/constants/routes";

export default function ArticleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[50vh] w-full max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Could not load this article</h1>
      <p className="mt-2 text-sm text-muted-foreground" role="alert">
        Something went wrong while fetching the article. Please try again.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button type="button" onClick={() => reset()}>
          Try again
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href={Routes.Articles}>Browse articles</Link>
        </Button>
      </div>
    </section>
  );
}
