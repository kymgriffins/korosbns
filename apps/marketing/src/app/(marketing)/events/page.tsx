"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Search, Calendar, MapPin, Sparkles, Building2 } from "lucide-react";
import Wrapper from "@/components/global/wrapper";
import { Routes } from "@/constants/routes";
import { Badge } from "@/ui/badge";
import { Input } from "@/ui/input";
import { motion } from "motion/react";
import { useEvents } from "@/hooks/use-events";

import { formatInNairobi } from "@/lib/datetime";

function getEventStatus(startsAt: string): "Upcoming" | "Past" | "Unknown" {
  if (!startsAt) return "Unknown";
  try {
    const eventDate = new Date(startsAt);
    const now = new Date();
    return eventDate > now ? "Upcoming" : "Past";
  } catch {
    return "Unknown";
  }
}

function parseDateParts(iso: string) {
  if (!iso) return { day: "", month: "", year: "" };
  try {
    const d = new Date(iso);
    const day = d.getDate().toString();
    const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const year = d.getFullYear().toString();
    return { day, month, year };
  } catch {
    return { day: "", month: "", year: "" };
  }
}

export default function EventsPage() {
  const { data: events = [], isLoading, error } = useEvents();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "upcoming" | "past">("all");

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.snippet && event.snippet.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (event.sponsors && event.sponsors.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())));

    const status = getEventStatus(event.starts_at);
    if (activeFilter === "upcoming") {
      return matchesSearch && status === "Upcoming";
    }
    if (activeFilter === "past") {
      return matchesSearch && status === "Past";
    }
    return matchesSearch;
  });

  return (
    <Wrapper className="py-20 relative min-h-screen overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-10 left-10 size-96 bg-primary/10 rounded-full blur-[10rem] opacity-70" />
        <div className="absolute top-40 right-10 size-96 bg-blue-500/10 rounded-full blur-[10rem] opacity-50" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-4">
              <Sparkles className="size-3" />
              <span>Budget Ndio Story Hub</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-linear-to-b from-foreground to-foreground/80 bg-clip-text text-transparent">
              Civic Events
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Participate, express yourself, and join community conversations about governance and public finance.
            </p>
          </motion.div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10 pb-6 border-b border-border/60">
          {/* Tabs */}
          <div className="flex p-1 rounded-xl bg-cardbox border border-border/80 w-full md:w-auto">
            {(["all", "upcoming", "past"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-all w-full md:w-auto ${
                  activeFilter === filter
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {filter} Events
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-cardbox/50 border-border/80 rounded-xl"
            />
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="size-10 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">Loading events...</p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-center">
            {error?.message ?? "An error occurred"}
          </div>
        )}

        {/* Events Grid */}
        {!isLoading && !error && (
          <div className="grid gap-6">
            {filteredEvents.map((event, idx) => {
              const status = getEventStatus(event.starts_at);
              const { day, month, year } = parseDateParts(event.starts_at);
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <Link
                    href={Routes.Event(event.id)}
                    className="group relative block overflow-hidden rounded-2xl border border-border/80 bg-cardbox/40 transition-all hover:border-primary/50 hover:bg-cardbox/60 hover:shadow-lg hover:shadow-primary/5"
                  >
                    {event.image_url ? (
                      <div>
                        {/* Cover Image */}
                        <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-muted border-b border-border/40">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                          />
                          {/* Floated Date Badge */}
                          {day && month && (
                            <div className="absolute top-4 left-4 flex flex-col items-center justify-center size-14 rounded-xl bg-background/90 backdrop-blur-md text-primary font-black shadow-md border border-border/50">
                              <span className="text-xl leading-none">{day}</span>
                              <span className="text-[9px] tracking-wider mt-0.5">{month}</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge
                              variant={status === "Upcoming" ? "default" : "secondary"}
                              className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5"
                            >
                              {status}
                            </Badge>
                            {event.sponsors && event.sponsors.length > 0 && (
                              <Badge variant="outline" className="text-[10px] font-semibold border-primary/20 text-primary flex items-center gap-1">
                                <Building2 className="size-3" />
                                <span>Sponsored</span>
                              </Badge>
                            )}
                          </div>

                          <h2 className="text-xl md:text-2xl font-bold group-hover:text-primary transition-colors line-clamp-1">
                            {event.title}
                          </h2>

                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                            {event.starts_at && (
                              <span className="flex items-center gap-1.5">
                                <Calendar className="size-4 shrink-0" />
                                {formatInNairobi(event.starts_at)}
                              </span>
                            )}
                            {event.location && (
                              <span className="flex items-center gap-1.5 line-clamp-1">
                                <MapPin className="size-4 shrink-0" />
                                {event.location}
                              </span>
                            )}
                          </div>

                          <p className="mt-4 text-muted-foreground line-clamp-2 leading-relaxed">
                            {event.snippet}
                          </p>

                          {event.sponsors && event.sponsors.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-border/40 flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Partners:</span>
                              <div className="flex flex-wrap gap-2">
                                {event.sponsors.map((s, sIdx) => (
                                  <span key={sIdx} className="text-xs font-semibold px-2 py-0.5 rounded bg-muted/60 border border-border/80">
                                    {s.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 flex flex-col sm:flex-row gap-6 items-start">
                        {/* Date Badge component */}
                        {day && month ? (
                          <div className="flex sm:flex-col items-center justify-center size-16 sm:size-20 shrink-0 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold">
                            <span className="text-2xl sm:text-3xl leading-none">{day}</span>
                            <span className="text-xs tracking-wider mt-0.5 sm:mt-1">{month}</span>
                            <span className="hidden sm:inline text-[10px] opacity-70 font-normal">{year}</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center size-16 sm:size-20 shrink-0 rounded-xl bg-muted border border-border text-muted-foreground">
                            <Calendar className="size-8" />
                          </div>
                        )}

                        {/* Content details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge
                              variant={status === "Upcoming" ? "default" : "secondary"}
                              className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5"
                            >
                              {status}
                            </Badge>
                            {event.sponsors && event.sponsors.length > 0 && (
                              <Badge variant="outline" className="text-[10px] font-semibold border-primary/20 text-primary flex items-center gap-1">
                                <Building2 className="size-3" />
                                <span>Sponsored</span>
                              </Badge>
                            )}
                          </div>

                          <h2 className="text-xl md:text-2xl font-bold group-hover:text-primary transition-colors line-clamp-1">
                            {event.title}
                          </h2>

                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                            {event.starts_at && (
                              <span className="flex items-center gap-1.5">
                                <Calendar className="size-4 shrink-0" />
                                {formatInNairobi(event.starts_at)}
                              </span>
                            )}
                            {event.location && (
                              <span className="flex items-center gap-1.5 line-clamp-1">
                                <MapPin className="size-4 shrink-0" />
                                {event.location}
                              </span>
                            )}
                          </div>

                          <p className="mt-4 text-muted-foreground line-clamp-2 leading-relaxed">
                            {event.snippet}
                          </p>

                          {/* Sponsors list indicator */}
                          {event.sponsors && event.sponsors.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-border/40 flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Partners:</span>
                              <div className="flex flex-wrap gap-2">
                                {event.sponsors.map((s, sIdx) => (
                                  <span key={sIdx} className="text-xs font-semibold px-2 py-0.5 rounded bg-muted/60 border border-border/80">
                                    {s.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {!isLoading && !error && filteredEvents.length === 0 && (
          <div className="text-center py-20 bg-cardbox/20 rounded-2xl border border-dashed border-border/80">
            <Calendar className="size-12 mx-auto text-muted-foreground/60 mb-4" />
            <h3 className="text-lg font-semibold mb-1">No events found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto text-sm">
              We couldn't find any events matching your search or filters. Try adjusting your query or tags.
            </p>
          </div>
        )}
      </div>
    </Wrapper>
  );
}
