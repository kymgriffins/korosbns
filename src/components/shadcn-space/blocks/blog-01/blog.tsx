"use client";

import { useRef } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useInView } from "motion/react";
import { learningData } from "@/data/learning";
import { Routes } from "@/constants/routes";
import type { CivicModule } from "@/types/learn";
import { BNS_COMMUNITY_IMAGES } from "@/constants/bns-media-images";

const MODULE_FALLBACK_IMAGES = [
  "/images/explainer-formulation.png",
  BNS_COMMUNITY_IMAGES.cohortA,
  BNS_COMMUNITY_IMAGES.forumE,
  "/images/community-pulse.png",
];

function getPublishedAt(module: CivicModule): string | null {
  const meta = module.metadata;
  if (!meta) return null;
  for (const key of ["published_at", "created_at", "updated_at"]) {
    const value = meta[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return null;
}

function getModuleImage(module: CivicModule, index: number): string {
  if (module.image_url?.trim()) return module.image_url.trim();
  if (module.author?.image?.trim()) return module.author.image.trim();
  return MODULE_FALLBACK_IMAGES[index % MODULE_FALLBACK_IMAGES.length];
}

function sortModules(modules: CivicModule[]): CivicModule[] {
  return [...modules]
    .filter((module) => module.status !== "draft" && module.status !== "archived")
    .sort((a, b) => {
      const dateA = getPublishedAt(a);
      const dateB = getPublishedAt(b);
      if (dateA && dateB) {
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      }
      if (dateA) return -1;
      if (dateB) return 1;
      return (b.order ?? 0) - (a.order ?? 0);
    });
}

function formatPublishedDate(module: CivicModule): string {
  const published = getPublishedAt(module);
  if (published) {
    return new Date(published).toLocaleDateString("en-KE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }
  if (module.fiscal_year_label) {
    return module.fiscal_year_label;
  }
  return "Learning module";
}

const Blog = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const { data: modules = [], isLoading } = useQuery({
    queryKey: ["landing", "learn-modules"],
    queryFn: () => learningData.modules.fetch(),
    staleTime: 1000 * 60 * 10,
  });

  const featuredModules = sortModules(modules).slice(0, 3);

  return (
    <section ref={sectionRef} className="py-10 md:py-20">
      <div className="max-w-7xl xl:px-16 lg:px-8 px-4 mx-auto">
        <div className="flex flex-col gap-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 1, delay: 0.1, ease: "easeInOut" }}
              className="flex flex-col gap-4 justify-center items-start grow"
            >
              <Badge
                variant="outline"
                className="text-sm font-normal py-1 px-3 h-7"
              >
                Resources
              </Badge>
              <h2 className="text-foreground text-3xl sm:text-5xl font-semibold">
                Learning modules
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
              transition={{ duration: 1, delay: 0.1, ease: "easeInOut" }}
              className="flex flex-col gap-3 max-w-xl"
            >
              <p className="text-base font-normal text-muted-foreground">
                Step-by-step civic finance lessons from the BNS learning hub —
                explore budgets, participation, and accountability at your pace.
              </p>
              <Link
                href={Routes.LearnModules}
                className="text-sm font-semibold text-primary hover:underline w-fit"
              >
                View all modules →
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className={`flex flex-col gap-5 ${index === 0 ? "sm:col-span-2" : ""}`}
                  >
                    <div
                      className={`w-full bg-muted animate-pulse rounded-lg ${
                        index === 0 ? "aspect-video sm:h-96" : "aspect-video"
                      }`}
                    />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                      <div className="h-7 w-full bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                ))
              : featuredModules.length > 0
                ? featuredModules.map((module, index) => {
                    const formattedDate = formatPublishedDate(module);
                    const coverImage = getModuleImage(module, index);
                    return (
                      <motion.div
                        key={module.id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={
                          isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
                        }
                        transition={{
                          duration: 1,
                          delay: index === 0 ? 0.2 : index === 1 ? 0.4 : 0.6,
                          ease: "easeInOut",
                        }}
                        className={index === 0 ? "sm:col-span-2" : ""}
                      >
                        <Link
                          href={`/learn/modules/${module.slug}`}
                          className="group flex flex-col gap-5"
                        >
                          <Card className="p-0 ring-0 border-0 rounded-none shadow-none">
                            <CardContent className="p-0 group flex flex-col gap-5">
                              <div
                                className={`w-full overflow-hidden rounded-lg ${
                                  index === 0
                                    ? "aspect-video sm:aspect-auto sm:h-96"
                                    : "aspect-video"
                                }`}
                              >
                                <img
                                  src={coverImage}
                                  alt={module.title}
                                  className="w-full h-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-110"
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <p className="text-base font-normal text-muted-foreground">
                                  {formattedDate}
                                </p>
                                <p className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                                  {module.title}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    );
                  })
                : (
                    <div className="sm:col-span-2 lg:col-span-4 rounded-xl border border-dashed border-border p-10 text-center">
                      <p className="text-muted-foreground mb-4">
                        Learning modules are loading soon. Visit the hub to start learning.
                      </p>
                      <Link
                        href={Routes.Learn}
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        Go to Learning Hub →
                      </Link>
                    </div>
                  )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
