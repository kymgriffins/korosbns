import Link from "next/link";
import { Routes } from "@/constants/routes";

export default function ArticleNotFound() {
  return (
    <section className="mx-auto flex min-h-[50vh] w-full max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">404</p>
      <h1 className="mt-2 text-2xl font-bold">Article not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This article may have been unpublished or the link is incorrect.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href={Routes.Articles}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Browse articles
        </Link>
        <Link
          href={Routes.Learn}
          className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:bg-muted/50"
        >
          Learn hub
        </Link>
      </div>
    </section>
  );
}
