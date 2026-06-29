"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft, BookOpen, Globe, ExternalLink,
  Loader2, AlertCircle, Link2, MessageCircle,
} from "lucide-react";
import { Button } from "@/ui/button";
import { Routes } from "@/constants/routes";
import { learningData } from "@/data/learning";
import { usePageView } from "@/hooks/use-page-view";
import type { CivicModule, CivicModuleAuthor } from "@/types/learn";

export default function AuthorProfilePage() {
  usePageView();
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<{
    author: CivicModuleAuthor;
    modules: CivicModule[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    learningData.authors.fetchBySlug(slug)
      .then((res) => {
        if (res) setData(res as { author: CivicModuleAuthor; modules: CivicModule[] });
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <AlertCircle className="size-12 text-muted-foreground/30" />
        <h2 className="text-lg font-bold">Author not found</h2>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          The author you are looking for does not exist or has no published modules.
        </p>
        <Button asChild variant="outline" size="sm" className="rounded-lg">
          <Link href={Routes.Learn}>Back to Learn</Link>
        </Button>
      </div>
    );
  }

  const { author, modules } = data;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href={Routes.Learn}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="size-3.5" />
        Back to Learn
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/40 rounded-2xl p-6 sm:p-8 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
          <div className="relative size-24 sm:size-28 rounded-full overflow-hidden border-2 border-border/50 shrink-0 bg-muted/20">
            {author.image ? (
              <Image
                src={author.image}
                alt={author.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="size-full flex items-center justify-center text-3xl text-muted-foreground/30">
                <BookOpen className="size-10" />
              </div>
            )}
          </div>

          <div className="text-center sm:text-left flex-1 min-w-0">
            <h1 className="text-2xl font-black tracking-tight">{author.name}</h1>
            {author.role && (
              <p className="text-sm font-semibold text-muted-foreground mt-0.5">
                {author.role}
              </p>
            )}
            {author.bio && (
              <p className="text-xs text-muted-foreground/80 mt-3 leading-relaxed max-w-xl">
                {author.bio}
              </p>
            )}
            {author.socials && (
              <div className="flex items-center gap-2 mt-4 justify-center sm:justify-start">
                {author.socials.linkedin && (
                  <a
                    href={author.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-8 flex items-center justify-center rounded-lg bg-muted/40 hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                    aria-label="LinkedIn"
                  >
                    <Link2 className="size-4" />
                  </a>
                )}
                {author.socials.x && (
                  <a
                    href={author.socials.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-8 flex items-center justify-center rounded-lg bg-muted/40 hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                    aria-label="X (Twitter)"
                  >
                    <MessageCircle className="size-4" />
                  </a>
                )}
                {author.socials.website && (
                  <a
                    href={author.socials.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-8 flex items-center justify-center rounded-lg bg-muted/40 hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                    aria-label="Website"
                  >
                    <Globe className="size-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {author.intro_video_url && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-6">
          <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 pb-0">
              <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider mb-3">Introduction Video</p>
            </div>
            <div className="aspect-video bg-black">
              <iframe
                src={author.intro_video_url}
                title={`${author.name} introduction`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </motion.div>
      )}

      {modules.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8"
        >
          <h2 className="text-sm font-bold mb-3 flex items-center gap-2">
            <BookOpen className="size-4 text-primary" />
            Modules by {author.name}
            <span className="text-muted-foreground font-normal text-xs">
              ({modules.length})
            </span>
          </h2>
          <div className="grid gap-2.5">
            {modules.map((mod) => (
              <Link
                key={mod.id}
                href={`/learn/${mod.slug || mod.id}`}
                className="flex items-center gap-3 p-3.5 bg-card border border-border/40 rounded-xl hover:bg-accent/30 transition-colors group"
              >
                <span className="text-2xl shrink-0">{mod.badge || "📘"}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold group-hover:text-primary transition-colors truncate">
                    {mod.title}
                  </h3>
                  <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                    {mod.description || ""}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground shrink-0">
                  <span>{mod.steps.length} lessons</span>
                  <ExternalLink className="size-3" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
