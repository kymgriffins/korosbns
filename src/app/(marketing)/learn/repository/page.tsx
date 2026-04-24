import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Folder, FolderOpen } from "lucide-react";
import { fetchDocumentsFromAPI } from "@/constants/documents";

export const metadata: Metadata = {
  title: "Document Repository | Budget Ndio Story",
  description:
    "Browse all budget document folders in one dedicated repository view.",
};

export default async function RepositoryPage() {
  const { documents, error } = await fetchDocumentsFromAPI();
  const hasLiveDocs = documents.length > 0;
  type RepositoryCard = { id: string; title: string; fullName: string; fileCount: number };
  const loadingCards = [
    { id: "loading-bps", title: "BPS", fullName: "Budget Policy Statement", fileCount: 0 },
    { id: "loading-cfsp", title: "CFSP", fullName: "County Fiscal Strategy Papers", fileCount: 0 },
    { id: "loading-pbb", title: "PBB", fullName: "Programme-Based Budgeting", fileCount: 0 },
  ];
  const liveCards: RepositoryCard[] = documents.map((doc) => ({
    id: doc.id,
    title: doc.title,
    fullName: doc.fullName,
    fileCount: doc.files.length,
  }));
  const cardsToRender: RepositoryCard[] = hasLiveDocs ? liveCards : loadingCards;

  return (
    <section className="relative min-h-screen w-full bg-background pt-16 sm:pt-20">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 -top-20 size-72 rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute -bottom-20 -right-20 size-72 rounded-full bg-teal-500/10 blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <Link
          href="/learn"
          className="mb-6 inline-flex items-center gap-2 text-sm text-foreground/60 transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Back to Learn
        </Link>

        <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-7">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-[size:18px_18px]" />
          <div className="absolute -right-16 -top-16 size-72 rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute -left-16 -bottom-16 size-72 rounded-full bg-orange-500/20 blur-[100px]" />

          <div className="relative z-10 max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
              <FolderOpen className="size-3.5" />
              Repository
            </div>
            <h1 className="text-3xl font-bold sm:text-5xl">Budget Document Repository</h1>
            <p className="mt-3 max-w-2xl text-sm text-foreground/70 sm:text-base">
              Structured, searchable, and visual. Explore budget folders in one place,
              with a cleaner experience built for policy deep dives and document workflows.
            </p>
          </div>
        </div>

        {!hasLiveDocs && (
          <div className="mb-5 rounded-2xl border border-amber-300/30 bg-amber-500/10 p-4 text-sm text-foreground/80">
            <p className="font-medium text-amber-200">Repository sync in progress...</p>
            <p className="mt-1 text-foreground/70">
              Live files are temporarily unavailable. Showing 3 featured folders in loading mode.
            </p>
            {error ? <p className="mt-1 text-xs text-foreground/50">{error}</p> : null}
          </div>
        )}

        {!hasLiveDocs && (
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5 overflow-hidden">
            <div className="relative">
              <div className="absolute -top-8 -left-8 size-24 rounded-full bg-primary/20 blur-2xl" />
              <div className="absolute -bottom-8 -right-8 size-24 rounded-full bg-orange-400/20 blur-2xl" />
              <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-primary/90 font-semibold">Smart Loading</p>
                  <h2 className="text-xl font-bold mt-1">Preparing your document ecosystem</h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 text-xs text-white/80">
                  <span className="size-2 rounded-full bg-primary animate-pulse" />
                  Streaming folder previews...
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary via-cyan-300 to-orange-300 animate-pulse"
                      style={{ width: `${55 + i * 15}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cardsToRender.map((doc, idx) => {
            const isLoadingCard = !hasLiveDocs;
            const href = isLoadingCard ? "#" : `/learn/${doc.id}`;

            return (
              <Link
                key={doc.id}
                href={href}
                aria-disabled={isLoadingCard}
                className={`group rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:border-primary/30 ${
                  isLoadingCard ? "pointer-events-none" : ""
                }`}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="relative flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Folder className="size-5 text-primary" />
                    {isLoadingCard ? (
                      <span className="absolute -right-1 -top-1 size-2 rounded-full bg-amber-300 animate-ping" />
                    ) : null}
                  </div>
                  <span className="text-xs text-foreground/50">
                    {isLoadingCard ? "Loading..." : `${doc.fileCount} files`}
                  </span>
                </div>
                <h2 className="text-lg font-semibold group-hover:text-primary">{doc.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-foreground/65">{doc.fullName}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  {isLoadingCard ? (
                    <>
                      Syncing folder
                      <span className="inline-flex gap-1 pl-1">
                        <span className="size-1.5 rounded-full bg-primary/80 animate-bounce" style={{ animationDelay: `${idx * 0.1}s` }} />
                        <span className="size-1.5 rounded-full bg-primary/80 animate-bounce" style={{ animationDelay: `${idx * 0.1 + 0.12}s` }} />
                        <span className="size-1.5 rounded-full bg-primary/80 animate-bounce" style={{ animationDelay: `${idx * 0.1 + 0.24}s` }} />
                      </span>
                    </>
                  ) : (
                    <>
                      Open folder <ArrowRight className="size-4" />
                    </>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

