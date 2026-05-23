import { Skeleton } from "@/ui/skeleton";

export default function ArticleLoading() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <Skeleton className="mb-6 h-4 w-48" />
      <Skeleton className="mb-8 h-48 w-full rounded-[24px]" />
      <Skeleton className="mb-3 h-6 w-32" />
      <Skeleton className="mb-4 h-10 w-full max-w-lg" />
      <Skeleton className="mb-2 h-5 w-full" />
      <Skeleton className="mb-8 h-5 w-2/3" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </section>
  );
}
