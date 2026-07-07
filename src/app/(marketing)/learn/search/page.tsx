"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { LmsPage } from "@/components/lms/lms-page";
import { LMS_COURSES } from "@/data/lms/catalog";
import { LmsRoutes } from "@/data/lms/routes";
import { Input } from "@/components/ui/input";

type SearchResult = {
  type: "course" | "module" | "lesson";
  title: string;
  subtitle: string;
  href: string;
};

export default function LearnSearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [] as SearchResult[];
    const q = query.toLowerCase();
    const items: SearchResult[] = [];

    for (const course of LMS_COURSES) {
      if (course.title.toLowerCase().includes(q) || course.description.toLowerCase().includes(q)) {
        items.push({
          type: "course",
          title: course.title,
          subtitle: course.category,
          href: LmsRoutes.course(course.slug),
        });
      }
      for (const mod of course.modules) {
        if (mod.title.toLowerCase().includes(q)) {
          items.push({
            type: "module",
            title: mod.title,
            subtitle: course.title,
            href: LmsRoutes.module(course.slug, mod.slug),
          });
        }
        for (const lesson of mod.lessons) {
          if (lesson.title.toLowerCase().includes(q) || lesson.summary.toLowerCase().includes(q)) {
            items.push({
              type: "lesson",
              title: lesson.title,
              subtitle: `${course.title} · ${mod.title}`,
              href: LmsRoutes.lesson(course.slug, mod.slug, lesson.slug),
            });
          }
        }
      }
    }
    return items;
  }, [query]);

  return (
    <LmsPage className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Search</h1>
        <p className="text-muted-foreground">Find courses, modules, lessons, and resources.</p>
      </header>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search learning content..."
          className="pl-9"
          autoFocus
        />
      </div>

      <ul className="space-y-2">
        {results.map((result) => (
          <li key={`${result.type}-${result.href}`}>
            <Link
              href={result.href}
              className="block rounded-xl border border-border/60 bg-card px-4 py-3 transition-colors hover:bg-muted/30"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{result.type}</p>
              <p className="font-medium">{result.title}</p>
              <p className="text-sm text-muted-foreground">{result.subtitle}</p>
            </Link>
          </li>
        ))}
      </ul>

      {query && results.length === 0 ? (
        <p className="text-sm text-muted-foreground">No results for &ldquo;{query}&rdquo;</p>
      ) : null}
    </LmsPage>
  );
}
