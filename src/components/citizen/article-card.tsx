import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Routes } from "@/constants/routes";
import type { HubArticle } from "@/lib/learn-content";

export function ArticleCard({ article, index }: { article: HubArticle; index: number }) {
  const imageSrc = article.heroImage;

  return (
    <Link href={Routes.Article(article.id)} className="group block">
      <div className="relative overflow-hidden rounded-[24px] border border-border bg-card shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
        <div className="relative m-2 h-44 overflow-hidden rounded-[22px] bg-muted">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt=""
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,8,12,0.72)_18%,rgba(8,8,12,0.16)_72%)]" />
          <div className="absolute right-3 top-3 rounded-full bg-background p-2 text-foreground shadow-md">
            <ArrowRight className="size-3.5" />
          </div>
        </div>
        <div className="px-4 pb-4 pt-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
            {article.category || "Article"} · {article.readTime}
          </p>
          <h2 className="mt-1 text-xl font-bold leading-tight tracking-tight sm:text-2xl">
            {article.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {article.snippet}
          </p>
        </div>
      </div>
    </Link>
  );
}
