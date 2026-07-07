"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { LmsPage, LmsSection } from "@/components/lms/lms-page";
import { CourseCard } from "@/components/lms/course-card";
import { LMS_COURSES } from "@/data/lms/catalog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils";

const CATEGORIES = ["All", ...Array.from(new Set(LMS_COURSES.map((c) => c.category)))];
const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"] as const;

export default function CataloguePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState<(typeof DIFFICULTIES)[number]>("All");

  const filtered = useMemo(() => {
    return LMS_COURSES.filter((course) => {
      const matchesQuery =
        !query ||
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "All" || course.category === category;
      const matchesDifficulty = difficulty === "All" || course.difficulty === difficulty;
      return matchesQuery && matchesCategory && matchesDifficulty;
    });
  }, [query, category, difficulty]);

  return (
    <LmsPage className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Course catalogue</h1>
        <p className="text-muted-foreground">Discover civic education built for progressive, mobile-first learning.</p>
      </header>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses..."
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              category === item
                ? "border-primary bg-primary/10 text-primary"
                : "border-border/60 text-muted-foreground hover:text-foreground",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {DIFFICULTIES.map((item) => (
          <Badge
            key={item}
            variant={difficulty === item ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setDifficulty(item)}
          >
            {item}
          </Badge>
        ))}
      </div>

      <LmsSection title={`${filtered.length} courses`}>
        <div className="grid gap-5 md:grid-cols-2">
          {filtered.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No courses match your filters.{" "}
            <Link href="/learn/catalogue" className="text-primary underline" onClick={() => setQuery("")}>
              Clear search
            </Link>
          </p>
        ) : null}
      </LmsSection>
    </LmsPage>
  );
}
