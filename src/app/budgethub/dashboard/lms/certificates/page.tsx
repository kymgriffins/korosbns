"use client";

import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { Award, ChevronRight, Download, ExternalLink, Loader2, RefreshCw, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { LearnProfileResponse } from "@/types/learn";
import { learningData } from "@/data/learning";
import { usePageView } from "@/hooks/use-page-view";

export default function CertificatesPage() {
  usePageView();
  const [profile, setProfile] = useState<LearnProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const res = await learningData.profile.fetch(); setProfile(res as LearnProfileResponse); } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const certificates = profile?.gamification?.certificates ?? [];
  const totalPoints = profile?.gamification?.points ?? 0;
  const filtered = searchQuery ? certificates.filter((c) => c.module_title.toLowerCase().includes(searchQuery.toLowerCase())) : certificates;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Certificates</h1>
          <p className="text-sm text-muted-foreground">View and download your earned certificates</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}><CardContent className="p-6">
              <Skeleton className="mb-3 h-24 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="mt-2 h-3 w-1/2" />
            </CardContent></Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="shadow-xs">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Certificates Earned</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10"><Award className="size-4 text-amber-500" /></div>
                  <span className="text-3xl font-bold tabular-nums">{certificates.length}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{certificates.length === 0 ? "No certificates yet" : `${certificates.length === 1 ? "1 certificate" : `${certificates.length} certificates`} earned`}</p>
              </CardContent>
            </Card>
            <Card className="shadow-xs">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Points</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10"><Award className="size-4 text-purple-500" /></div>
                  <span className="text-3xl font-bold tabular-nums">{totalPoints.toLocaleString()}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">points accumulated</p>
              </CardContent>
            </Card>
            <Card className="shadow-xs">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Latest Certificate</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10"><Award className="size-4 text-emerald-500" /></div>
                  <span className="text-sm font-medium truncate">{certificates.length > 0 ? certificates[0].module_title : "—"}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{certificates.length > 0 ? `Issued ${format(new Date(certificates[0].issued_at), "MMM d, yyyy")}` : "Complete a module to earn"}</p>
              </CardContent>
            </Card>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Search certificates..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border bg-background pl-9 pr-8 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring" />
            {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="size-3.5" /></button>}
          </div>

          {filtered.length === 0 ? (
            <Card><CardContent className="flex flex-col items-center gap-2 py-16">
              <Award className="size-12 text-muted-foreground/30" />
              <p className="text-lg font-medium">No certificates yet</p>
              <p className="text-sm text-muted-foreground">{searchQuery ? "No certificates match your search." : "Complete modules and pass quizzes to earn certificates."}</p>
              {!searchQuery && <Button variant="outline" size="sm" asChild className="mt-2"><a href="/budgethub/dashboard/lms/courses">Browse courses</a></Button>}
            </CardContent></Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((cert) => (
                <Card key={cert.id} className="group overflow-hidden transition-all hover:shadow-md">
                  <div className="flex aspect-[1.6/1] items-center justify-center bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/30 to-amber-500/10"><Award className="size-7 text-amber-600" /></div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Certificate of Completion</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="font-semibold leading-tight line-clamp-2">{cert.module_title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Issued {format(new Date(cert.issued_at), "MMMM d, yyyy")}</p>
                    <div className="mt-4 flex items-center gap-2">
                      {cert.certificate_url ? (
                        <>
                          <Button variant="default" size="sm" className="flex-1 gap-1.5" asChild>
                            <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer"><Download className="size-3.5" />Download</a>
                          </Button>
                          <Button variant="outline" size="sm" className="size-8 p-0" asChild>
                            <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="size-3.5" /></a>
                          </Button>
                        </>
                      ) : (
                        <span className="w-full rounded-md bg-secondary px-3 py-1.5 text-center text-xs text-secondary-foreground">Certificate link unavailable</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
