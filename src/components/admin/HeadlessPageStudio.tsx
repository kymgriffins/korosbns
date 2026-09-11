"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Globe,
  Layers,
  Sparkles,
  ExternalLink,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  RefreshCw,
  HelpCircle,
  FileText,
  Link2,
  BarChart2,
  Check,
  ChevronRight,
  ShieldCheck,
  Info,
  Play,
  Eye,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MASTER_CMS_EMAIL } from "@/lib/headless-cms";

type PageKey =
  | "landing"
  | "programmes"
  | "connect"
  | "mashinani"
  | "wanahabari-lab"
  | "studios"
  | "about"
  | "featured-blogs"
  | "custom-pages";

type TabKey = "sections" | "hero" | "core" | "deliverables" | "buttons" | "faqs";

interface PageMeta {
  key: PageKey;
  label: string;
  tag: string;
  route: string;
  sectionPageId: string;
  icon: string;
}

const PAGES: PageMeta[] = [
  {
    key: "landing",
    label: "Landing Page",
    tag: "Homepage Spine",
    route: "/",
    sectionPageId: "home",
    icon: "🌐",
  },
  {
    key: "programmes",
    label: "Programmes Hub",
    tag: "All Programmes",
    route: "/programmes",
    sectionPageId: "programmes",
    icon: "📊",
  },
  {
    key: "connect",
    label: "BNS Connect",
    tag: "National Money",
    route: "/programmes/connect",
    sectionPageId: "programmeConnect",
    icon: "🔍",
  },
  {
    key: "mashinani",
    label: "BNS Mashinani",
    tag: "County Scrutiny",
    route: "/programmes/mashinani",
    sectionPageId: "programmeMashinani",
    icon: "🌾",
  },
  {
    key: "wanahabari-lab",
    label: "Wanahabari Lab",
    tag: "Newsroom Bench",
    route: "/programmes/wanahabari-lab",
    sectionPageId: "programmeWanahabari",
    icon: "🎙️",
  },
  {
    key: "studios",
    label: "BNS Studios",
    tag: "Impact Production",
    route: "/bns-studio",
    sectionPageId: "studio",
    icon: "🎬",
  },
  {
    key: "about",
    label: "About Us",
    tag: "Organization & Team",
    route: "/about",
    sectionPageId: "about",
    icon: "🏢",
  },
  {
    key: "featured-blogs",
    label: "Featured Blogs & Evidence",
    tag: "Editorial Stories",
    route: "/#featured-projects",
    sectionPageId: "featured-blogs",
    icon: "📰",
  },
  {
    key: "custom-pages",
    label: "Custom Pages Builder",
    tag: "Create New Pages",
    route: "/pages",
    sectionPageId: "custom-pages",
    icon: "📄",
  },
];

export function HeadlessPageStudio() {
  const [selectedPageKey, setSelectedPageKey] = useState<PageKey>("landing");
  const [activeTab, setActiveTab] = useState<TabKey>("sections");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Raw State Stores
  const [landingData, setLandingData] = useState<Record<string, any>>({});
  const [programmesData, setProgrammesData] = useState<Record<string, any>>({});
  const [sectionsData, setSectionsData] = useState<Record<string, any>>({});
  const [aboutData, setAboutData] = useState<Record<string, any>>({});
  const [customPagesData, setCustomPagesData] = useState<{ pages?: any[] }>({ pages: [] });
  const [featuredData, setFeaturedData] = useState<{ count?: number; provenance?: any; results?: any[] }>({ results: [] });

  // Selections for sub-studios
  const [selectedCustomPageSlug, setSelectedCustomPageSlug] = useState<string>("");
  const [selectedFeaturedId, setSelectedFeaturedId] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUploadToR2 = async (file: File, onSuccess: (url: string) => void) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "thumbnails");

      const res = await fetch("/api/cms/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image to Cloudflare R2");
      }

      const json = await res.json();
      onSuccess(json.url);
      toast.success("Uploaded file directly to Cloudflare R2 bucket!", {
        description: json.url,
      });
    } catch (err: any) {
      toast.error(err.message || "Upload error");
    } finally {
      setIsUploading(false);
    }
  };

  // Fetch all authoritative data stores
  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [resLanding, resProg, resSec, resAbout, resCustom, resFeatured] = await Promise.all([
        fetch("/api/cms/landing"),
        fetch("/api/cms/programmes"),
        fetch("/api/cms/partner-page-sections"),
        fetch("/api/cms/about"),
        fetch("/api/cms/custom-pages"),
        fetch("/api/cms/featured-projects"),
      ]);

      if (resLanding.ok) {
        const json = await resLanding.json();
        setLandingData(json.data || {});
      }
      if (resProg.ok) {
        const json = await resProg.json();
        setProgrammesData(json.data || {});
      }
      if (resSec.ok) {
        const json = await resSec.json();
        setSectionsData(json.data || {});
      }
      if (resAbout.ok) {
        const json = await resAbout.json();
        setAboutData(json.data || {});
      }
      if (resCustom.ok) {
        const json = await resCustom.json();
        const pages = json.data?.pages || [];
        setCustomPagesData(json.data || { pages: [] });
        if (pages.length > 0 && !selectedCustomPageSlug) {
          setSelectedCustomPageSlug(pages[0].slug);
        }
      }
      if (resFeatured.ok) {
        const json = await resFeatured.json();
        const results = json.data?.results || [];
        setFeaturedData(json.data || { results: [] });
        if (results.length > 0 && !selectedFeaturedId) {
          setSelectedFeaturedId(results[0].id);
        }
      }
      setLastSaved(new Date().toLocaleTimeString());
    } catch {
      toast.error("Failed to load CMS datasets from server");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCustomPageSlug, selectedFeaturedId]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const currentPage = useMemo(
    () => PAGES.find((p) => p.key === selectedPageKey) || PAGES[0],
    [selectedPageKey],
  );

  // Section config for the selected page
  const pageSectionsConfig = useMemo(() => {
    const pages = sectionsData?.pages || {};
    return pages[currentPage.sectionPageId] || { sections: [] };
  }, [sectionsData, currentPage]);

  const visibleSectionCount = useMemo(() => {
    return (pageSectionsConfig.sections || []).filter((s: any) => s.visible).length;
  }, [pageSectionsConfig]);

  const maxAllowed = sectionsData?.policy?.maxBlocksPartnerPages ?? 5;
  const isOverBudget = visibleSectionCount > maxAllowed && !pageSectionsConfig.blogLike;

  // Selected Programme Item (for connect, mashinani, wanahabari-lab, studios)
  const currentProgrammeIndex = useMemo(() => {
    if (!programmesData.items || !Array.isArray(programmesData.items)) return -1;
    return programmesData.items.findIndex(
      (item: any) => item.slug === selectedPageKey || item.id === selectedPageKey,
    );
  }, [programmesData, selectedPageKey]);

  const currentProgramme = useMemo(() => {
    if (currentProgrammeIndex >= 0 && programmesData.items) {
      return programmesData.items[currentProgrammeIndex];
    }
    return null;
  }, [programmesData, currentProgrammeIndex]);

  // Section Toggle Handler
  const handleToggleSection = (sectionId: string) => {
    const updatedSections = { ...sectionsData };
    const pageObj = updatedSections.pages?.[currentPage.sectionPageId];
    if (!pageObj || !pageObj.sections) return;

    pageObj.sections = pageObj.sections.map((sec: any) => {
      if (sec.id === sectionId) {
        return { ...sec, visible: !sec.visible };
      }
      return sec;
    });

    setSectionsData(updatedSections);
  };

  // Generic Nested Field Updater
  const updateLandingField = (path: string[], value: any) => {
    const updated = { ...landingData };
    let curr: any = updated;
    for (let i = 0; i < path.length - 1; i++) {
      if (!curr[path[i]]) curr[path[i]] = {};
      curr = curr[path[i]];
    }
    curr[path[path.length - 1]] = value;
    setLandingData(updated);
  };

  const updateProgrammesLandingField = (path: string[], value: any) => {
    const updated = { ...programmesData };
    if (!updated.landing) updated.landing = {};
    let curr: any = updated.landing;
    for (let i = 0; i < path.length - 1; i++) {
      if (!curr[path[i]]) curr[path[i]] = {};
      curr = curr[path[i]];
    }
    curr[path[path.length - 1]] = value;
    setProgrammesData(updated);
  };

  const updateProgrammesClosingField = (path: string[], value: any) => {
    const updated = { ...programmesData };
    if (!updated.closing) updated.closing = {};
    let curr: any = updated.closing;
    for (let i = 0; i < path.length - 1; i++) {
      if (!curr[path[i]]) curr[path[i]] = {};
      curr = curr[path[i]];
    }
    curr[path[path.length - 1]] = value;
    setProgrammesData(updated);
  };

  const updateCurrentProgrammeField = (field: string, value: any) => {
    if (currentProgrammeIndex < 0) return;
    const updated = { ...programmesData };
    const items = [...(updated.items || [])];
    items[currentProgrammeIndex] = {
      ...items[currentProgrammeIndex],
      [field]: value,
    };
    updated.items = items;
    setProgrammesData(updated);
  };

  const updateAboutField = (path: string[], value: any) => {
    const updated = { ...aboutData };
    let curr: any = updated;
    for (let i = 0; i < path.length - 1; i++) {
      if (!curr[path[i]]) curr[path[i]] = {};
      curr = curr[path[i]];
    }
    curr[path[path.length - 1]] = value;
    setAboutData(updated);
  };

  // Custom Pages Handlers
  const handleAddCustomPage = () => {
    const slug = `brief-${Date.now().toString(36)}`;
    const newPage = {
      slug,
      title: "New Public Finance Brief",
      seoDescription: "Independent fiscal intelligence and public expenditure tracking brief.",
      eyebrow: "Special Brief · BNS Connect",
      headline: "Tracking Public Expenditure & Policy Execution",
      body: "Comprehensive analysis breaking down statutory budget allocations, county transfers, and policy implementation milestones.",
      content: "Public budget debates require verified empirical baselines. This brief provides partners, civil society, and newsrooms with structured data tracking public allocations against actual statutory disbursements.\n\nAll figures are sourced directly from verified Controller of Budget reports and National Treasury releases.",
      ctaLabel: "Discuss Co-Funding",
      ctaHref: "/contact?intent=partner",
      secondaryLabel: "Explore All Programmes",
      secondaryHref: "/programmes",
      stats: [
        { value: "100%", label: "Verified Statutory Data" },
        { value: "47", label: "Counties Monitored" },
        { value: "Quarterly", label: "Reporting Frequency" },
      ],
      published: true,
      createdAt: new Date().toISOString(),
    };
    const updatedPages = [...(customPagesData.pages || []), newPage];
    setCustomPagesData({ pages: updatedPages });
    setSelectedCustomPageSlug(slug);
    toast.success("Created new custom page draft!");
  };

  const handleDeleteCustomPage = (slug: string) => {
    const pages = customPagesData.pages || [];
    if (pages.length <= 1) {
      toast.error("Cannot delete the only remaining page.");
      return;
    }
    const filtered = pages.filter((p) => p.slug !== slug);
    setCustomPagesData({ pages: filtered });
    if (selectedCustomPageSlug === slug) {
      setSelectedCustomPageSlug(filtered[0]?.slug || "");
    }
    toast.success(`Deleted custom page /pages/${slug}`);
  };

  const handleUpdateCustomPageField = (slug: string, field: string, value: any) => {
    const pages = customPagesData.pages || [];
    const updated = pages.map((p) => {
      if (p.slug === slug) {
        return { ...p, [field]: value };
      }
      return p;
    });
    setCustomPagesData({ pages: updated });
  };

  const handleUpdateCustomPageStat = (slug: string, index: number, field: "value" | "label", value: string) => {
    const pages = customPagesData.pages || [];
    const updated = pages.map((p) => {
      if (p.slug === slug) {
        const stats = [...(p.stats || [])];
        stats[index] = { ...stats[index], [field]: value };
        return { ...p, stats };
      }
      return p;
    });
    setCustomPagesData({ pages: updated });
  };

  // Featured Evidence & Blogs Handlers
  const handleAddFeaturedStory = () => {
    const id = `story-${Date.now().toString(36)}`;
    const newStory = {
      id,
      slug: id,
      videoId: "kWpY4K1uI20",
      url: "https://www.youtube.com/watch?v=kWpY4K1uI20",
      title: "New Public Finance Impact Investigation",
      prose: "Walks partners and newsrooms through forensic tracking of public revenue systems and statutory expenditure.",
      thumbnail: "/images/events/red-flags-book-launch/dr-lyla-latif.jpeg",
      authorName: "Budget Ndio Story Team",
      programmeSlug: "wanahabari-lab",
      programmeLabel: "Wanahabari",
      href: `/bns-studio/${id}`,
      publishedAt: new Date().toISOString(),
      channelHandle: "@BudgetNdioStory",
    };
    const updated = [newStory, ...(featuredData.results || [])];
    setFeaturedData({
      ...featuredData,
      count: updated.length,
      results: updated,
    });
    setSelectedFeaturedId(id);
    toast.success("Added new featured impact story!");
  };

  const handleDeleteFeaturedStory = (id: string) => {
    const results = featuredData.results || [];
    if (results.length <= 1) {
      toast.error("At least one featured story must remain.");
      return;
    }
    const updated = results.filter((s) => s.id !== id);
    setFeaturedData({
      ...featuredData,
      count: updated.length,
      results: updated,
    });
    if (selectedFeaturedId === id) {
      setSelectedFeaturedId(updated[0]?.id || "");
    }
    toast.success("Deleted featured impact story");
  };

  const handleUpdateFeaturedStory = (id: string, field: string, value: any) => {
    const results = featuredData.results || [];
    const updated = results.map((s) => {
      if (s.id === id) {
        const item = { ...s, [field]: value };
        if (field === "url") {
          const match = value.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
          if (match && match[1]) {
            item.videoId = match[1];
          }
        }
        if (field === "programmeSlug") {
          const labelMap: Record<string, string> = {
            "wanahabari-lab": "Wanahabari",
            studios: "BNS Studio",
            connect: "BNS Connect",
            mashinani: "BNS Mashinani",
          };
          if (labelMap[value]) {
            item.programmeLabel = labelMap[value];
          }
        }
        return item;
      }
      return s;
    });
    setFeaturedData({ ...featuredData, results: updated });
  };

  // Save All Changes to Disk via Persistent APIs
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const payloadPromises = [
        fetch("/api/cms/landing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: landingData, editorEmail: MASTER_CMS_EMAIL }),
        }),
        fetch("/api/cms/programmes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: programmesData, editorEmail: MASTER_CMS_EMAIL }),
        }),
        fetch("/api/cms/partner-page-sections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: sectionsData, editorEmail: MASTER_CMS_EMAIL }),
        }),
        fetch("/api/cms/about", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: aboutData, editorEmail: MASTER_CMS_EMAIL }),
        }),
        fetch("/api/cms/custom-pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: customPagesData, editorEmail: MASTER_CMS_EMAIL }),
        }),
        fetch("/api/cms/featured-projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: featuredData, editorEmail: MASTER_CMS_EMAIL }),
        }),
      ];

      const responses = await Promise.all(payloadPromises);
      const allOk = responses.every((r) => r.ok);

      if (allOk) {
        setLastSaved(new Date().toLocaleTimeString());
        toast.success(`Successfully saved and persisted changes to disk!`, {
          description: `Updated landing, programmes, sections, custom pages, featured blogs, and about schemas.`,
        });
      } else {
        throw new Error("One or more collections failed to persist");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save CMS updates");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedCustomPage = useMemo(() => {
    const pages = customPagesData.pages || [];
    return pages.find((p) => p.slug === selectedCustomPageSlug) || pages[0] || null;
  }, [customPagesData, selectedCustomPageSlug]);

  const selectedFeaturedStory = useMemo(() => {
    const results = featuredData.results || [];
    return results.find((s) => s.id === selectedFeaturedId) || results[0] || null;
  }, [featuredData, selectedFeaturedId]);

  if (isLoading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3 rounded-2xl border border-border/70 bg-card p-12 text-center text-muted-foreground">
        <RefreshCw className="size-6 animate-spin text-primary" />
        <p className="text-sm font-medium">Loading Headless CMS content schemas from disk...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Studio Header & Navigation Bar */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-primary/20 bg-primary/10 font-mono text-xs font-semibold text-primary"
              >
                Headless Visual Studio
              </Badge>
              <span className="text-xs text-muted-foreground">
                Persistent: <code className="font-semibold text-foreground">src/content/*.json</code>
              </span>
              {lastSaved && (
                <span className="text-xs text-muted-foreground">
                  Saved at <strong className="text-foreground">{lastSaved}</strong>
                </span>
              )}
            </div>
            <h1 className="mt-1 font-heading text-xl font-bold tracking-tight text-foreground md:text-2xl">
              Page Content &amp; Buttons Studio
            </h1>
            <p className="text-xs text-muted-foreground">
              Directly edit copy, call-to-action buttons, metrics, and sections without touching code.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-semibold"
            >
              <a href={currentPage.route} target="_blank" rel="noreferrer">
                <span>View Live Page</span>
                <ExternalLink className="size-3.5 text-muted-foreground" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loadAllData}
              disabled={isSaving}
              className="gap-1.5 text-xs font-semibold"
            >
              <RotateCcw className="size-3.5" />
              <span>Revert</span>
            </Button>
            <Button
              onClick={handleSaveAll}
              disabled={isSaving}
              size="sm"
              className="gap-1.5 bg-emerald-600 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
            >
              {isSaving ? (
                <RefreshCw className="size-3.5 animate-spin" />
              ) : (
                <Save className="size-3.5" />
              )}
              <span>Save &amp; Publish to Disk</span>
            </Button>
          </div>
        </div>

        {/* Page Selector Tabs */}
        <div className="mt-5 flex flex-wrap gap-2 border-t border-border/50 pt-4">
          {PAGES.map((page) => {
            const isSelected = selectedPageKey === page.key;
            return (
              <button
                key={page.key}
                type="button"
                onClick={() => setSelectedPageKey(page.key)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 font-bold text-foreground shadow-xs"
                    : "border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span className="text-base">{page.icon}</span>
                <div className="text-left">
                  <div className="leading-tight">{page.label}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">{page.route}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SPECIAL DESK 1: FEATURED EVIDENCE & BLOGS */}
      {selectedPageKey === "featured-blogs" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Story Roster & Add Button */}
          <div className="space-y-4 lg:col-span-4">
            <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Featured Stories ({featuredData.results?.length || 0})
                  </h2>
                  <p className="text-[11px] text-muted-foreground">
                    Featured impact projects on homepage &amp; hub.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={handleAddFeaturedStory}
                  size="sm"
                  variant="outline"
                  className="gap-1 text-xs"
                >
                  <Plus className="size-3.5" />
                  <span>Add Story</span>
                </Button>
              </div>

              <div className="space-y-2">
                {(featuredData.results || []).map((story: any) => {
                  const isSelected = (selectedFeaturedStory?.id === story.id);
                  return (
                    <div
                      key={story.id}
                      onClick={() => setSelectedFeaturedId(story.id)}
                      className={`cursor-pointer rounded-xl border p-3 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-xs"
                          : "border-border/60 bg-muted/20 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <span className="rounded bg-primary/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-primary uppercase">
                            {story.programmeLabel || story.programmeSlug}
                          </span>
                          <h3 className="line-clamp-2 text-xs font-bold text-foreground">
                            {story.title}
                          </h3>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span>{story.authorName}</span>
                            {story.videoId && <span>• Video ID: {story.videoId}</span>}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFeaturedStory(story.id);
                          }}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-rose-500"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Active Story Editor & Live Preview */}
          <div className="space-y-6 lg:col-span-8">
            {selectedFeaturedStory ? (
              <div className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-foreground">
                      Edit Featured Story / Blog
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Edits persist directly to <code className="font-mono">src/data/fallbacks/featured-projects.json</code>.
                    </p>
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">
                    id: {selectedFeaturedStory.id}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground">Story Title</label>
                    <Input
                      value={selectedFeaturedStory.title ?? ""}
                      onChange={(e) => handleUpdateFeaturedStory(selectedFeaturedStory.id, "title", e.target.value)}
                      className="mt-1 text-sm font-semibold"
                      placeholder="e.g. Learn about illicit financial flows in Benin and Cabo Verde"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      Editorial Description / Prose (Summary for Investors &amp; Public)
                    </label>
                    <textarea
                      value={selectedFeaturedStory.prose ?? ""}
                      onChange={(e) => handleUpdateFeaturedStory(selectedFeaturedStory.id, "prose", e.target.value)}
                      rows={4}
                      className="mt-1 w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground focus-visible:outline-none"
                      placeholder="Concise overview explaining who leads this, what was investigated, and the civic impact..."
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-foreground">Author / Storyteller Name</label>
                      <Input
                        value={selectedFeaturedStory.authorName ?? ""}
                        onChange={(e) => handleUpdateFeaturedStory(selectedFeaturedStory.id, "authorName", e.target.value)}
                        className="mt-1 h-8 text-xs"
                        placeholder="e.g. Dr. Lyla Latif"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground">Programme Category</label>
                      <select
                        value={selectedFeaturedStory.programmeSlug ?? "wanahabari-lab"}
                        onChange={(e) => handleUpdateFeaturedStory(selectedFeaturedStory.id, "programmeSlug", e.target.value)}
                        className="mt-1 flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs text-foreground"
                      >
                        <option value="wanahabari-lab">Wanahabari Lab</option>
                        <option value="studios">BNS Studio</option>
                        <option value="connect">BNS Connect</option>
                        <option value="mashinani">BNS Mashinani</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-foreground">YouTube Video URL</label>
                      <Input
                        value={selectedFeaturedStory.url ?? ""}
                        onChange={(e) => handleUpdateFeaturedStory(selectedFeaturedStory.id, "url", e.target.value)}
                        className="mt-1 h-8 text-xs font-mono"
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground">YouTube Video ID</label>
                      <Input
                        value={selectedFeaturedStory.videoId ?? ""}
                        onChange={(e) => handleUpdateFeaturedStory(selectedFeaturedStory.id, "videoId", e.target.value)}
                        className="mt-1 h-8 text-xs font-mono"
                        placeholder="e.g. G5ddu4I6mNs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-foreground">Thumbnail Image URL / Asset Path</label>
                        <label className="flex items-center gap-1 cursor-pointer text-[10px] font-bold text-primary hover:underline">
                          <UploadCloud className="size-3" />
                          <span>{isUploading ? "Uploading..." : "Upload to R2"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={isUploading}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUploadToR2(file, (url) => {
                                  handleUpdateFeaturedStory(selectedFeaturedStory.id, "thumbnail", url);
                                });
                              }
                            }}
                          />
                        </label>
                      </div>
                      <Input
                        value={selectedFeaturedStory.thumbnail ?? ""}
                        onChange={(e) => handleUpdateFeaturedStory(selectedFeaturedStory.id, "thumbnail", e.target.value)}
                        className="mt-1 h-8 text-xs font-mono"
                        placeholder="/images/events/... or Cloudflare R2 URL"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground">Internal Link / Target URL</label>
                      <Input
                        value={selectedFeaturedStory.href ?? ""}
                        onChange={(e) => handleUpdateFeaturedStory(selectedFeaturedStory.id, "href", e.target.value)}
                        className="mt-1 h-8 text-xs font-mono"
                        placeholder="/bns-studio/..."
                      />
                    </div>
                  </div>

                  {/* Visual Card Preview */}
                  <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <Eye className="size-4 text-primary" />
                      <span>Live Website Card Preview</span>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm max-w-md">
                      <div className="relative aspect-video bg-neutral-900">
                        {selectedFeaturedStory.thumbnail ? (
                          <img
                            src={selectedFeaturedStory.thumbnail}
                            alt={selectedFeaturedStory.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                            No thumbnail image
                          </div>
                        )}
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="bg-black/70 text-white text-[10px]">
                            {selectedFeaturedStory.programmeLabel || selectedFeaturedStory.programmeSlug}
                          </Badge>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg">
                            <Play className="size-4 fill-current ml-0.5" />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="text-[11px] font-medium text-muted-foreground">
                          By {selectedFeaturedStory.authorName}
                        </div>
                        <h4 className="font-heading text-sm font-bold text-foreground line-clamp-2">
                          {selectedFeaturedStory.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                          {selectedFeaturedStory.prose}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-muted-foreground border border-dashed rounded-2xl">
                Select a featured story from the left or click &ldquo;Add Story&rdquo;.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SPECIAL DESK 2: CUSTOM PAGES BUILDER */}
      {selectedPageKey === "custom-pages" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: List of Custom Pages */}
          <div className="space-y-4 lg:col-span-4">
            <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Custom Pages ({customPagesData.pages?.length || 0})
                  </h2>
                  <p className="text-[11px] text-muted-foreground">
                    Dynamic routes rendered at <code className="font-mono">/pages/[slug]</code>.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={handleAddCustomPage}
                  size="sm"
                  variant="outline"
                  className="gap-1 text-xs"
                >
                  <Plus className="size-3.5" />
                  <span>Create Page</span>
                </Button>
              </div>

              <div className="space-y-2">
                {(customPagesData.pages || []).map((page: any) => {
                  const isSelected = (selectedCustomPage?.slug === page.slug);
                  return (
                    <div
                      key={page.slug}
                      onClick={() => setSelectedCustomPageSlug(page.slug)}
                      className={`cursor-pointer rounded-xl border p-3 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-xs"
                          : "border-border/60 bg-muted/20 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                page.published !== false ? "bg-emerald-500" : "bg-amber-500"
                              }`}
                            />
                            <span className="font-mono text-[10px] text-muted-foreground">
                              /pages/{page.slug}
                            </span>
                          </div>
                          <h3 className="line-clamp-1 text-xs font-bold text-foreground">
                            {page.title}
                          </h3>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCustomPage(page.slug);
                          }}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-rose-500"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Active Custom Page Form */}
          <div className="space-y-6 lg:col-span-8">
            {selectedCustomPage ? (
              <div className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-foreground">
                      Edit Page: {selectedCustomPage.title}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Live URL: <code className="font-mono font-bold text-primary">/pages/{selectedCustomPage.slug}</code>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs font-semibold"
                    >
                      <a
                        href={`/pages/${selectedCustomPage.slug}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span>Preview Page</span>
                        <ExternalLink className="size-3.5" />
                      </a>
                    </Button>
                    <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCustomPage.published !== false}
                        onChange={(e) =>
                          handleUpdateCustomPageField(selectedCustomPage.slug, "published", e.target.checked)
                        }
                        className="rounded border-input text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Published (Live)</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-foreground">Page Title</label>
                      <Input
                        value={selectedCustomPage.title ?? ""}
                        onChange={(e) =>
                          handleUpdateCustomPageField(selectedCustomPage.slug, "title", e.target.value)
                        }
                        className="mt-1 h-8 text-xs font-semibold"
                        placeholder="e.g. Kenya Sovereign Debt Brief"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground">URL Slug</label>
                      <Input
                        value={selectedCustomPage.slug ?? ""}
                        onChange={(e) =>
                          handleUpdateCustomPageField(selectedCustomPage.slug, "slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))
                        }
                        className="mt-1 h-8 text-xs font-mono"
                        placeholder="e.g. kenya-sovereign-debt-brief"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-foreground">Eyebrow Pill Tag</label>
                      <Input
                        value={selectedCustomPage.eyebrow ?? ""}
                        onChange={(e) =>
                          handleUpdateCustomPageField(selectedCustomPage.slug, "eyebrow", e.target.value)
                        }
                        className="mt-1 h-8 text-xs"
                        placeholder="e.g. Special Brief · BNS Connect"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground">SEO Description (Meta Tag)</label>
                      <Input
                        value={selectedCustomPage.seoDescription ?? ""}
                        onChange={(e) =>
                          handleUpdateCustomPageField(selectedCustomPage.slug, "seoDescription", e.target.value)
                        }
                        className="mt-1 h-8 text-xs"
                        placeholder="Concise description for Google search and WhatsApp previews"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">Hero Headline</label>
                    <Input
                      value={selectedCustomPage.headline ?? ""}
                      onChange={(e) =>
                        handleUpdateCustomPageField(selectedCustomPage.slug, "headline", e.target.value)
                      }
                      className="mt-1 text-sm font-bold"
                      placeholder="e.g. Tracking Kenya's Sovereign Debt & Statutory Obligations"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">Hero Lead Paragraph (Lede)</label>
                    <textarea
                      value={selectedCustomPage.body ?? ""}
                      onChange={(e) =>
                        handleUpdateCustomPageField(selectedCustomPage.slug, "body", e.target.value)
                      }
                      rows={3}
                      className="mt-1 w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground focus-visible:outline-none leading-relaxed"
                      placeholder="Core summary statement introducing the brief or campaign..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      Full Editorial Longform Content (Markdown / Prose)
                    </label>
                    <textarea
                      value={selectedCustomPage.content ?? ""}
                      onChange={(e) =>
                        handleUpdateCustomPageField(selectedCustomPage.slug, "content", e.target.value)
                      }
                      rows={6}
                      className="mt-1 w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground font-sans focus-visible:outline-none leading-relaxed"
                      placeholder="Write the full narrative or body text here. You can separate paragraphs with empty lines."
                    />
                  </div>

                  {/* Primary & Secondary Action Buttons */}
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Call-to-Action Buttons
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-[11px] font-semibold text-foreground">Primary Button Label</label>
                        <Input
                          value={selectedCustomPage.ctaLabel ?? ""}
                          onChange={(e) =>
                            handleUpdateCustomPageField(selectedCustomPage.slug, "ctaLabel", e.target.value)
                          }
                          className="mt-1 h-8 text-xs"
                          placeholder="Discuss Co-Funding"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-foreground">Primary Button Target URL</label>
                        <Input
                          value={selectedCustomPage.ctaHref ?? ""}
                          onChange={(e) =>
                            handleUpdateCustomPageField(selectedCustomPage.slug, "ctaHref", e.target.value)
                          }
                          className="mt-1 h-8 text-xs font-mono"
                          placeholder="/contact?intent=partner"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-[11px] font-semibold text-foreground">Secondary Button Label</label>
                        <Input
                          value={selectedCustomPage.secondaryLabel ?? ""}
                          onChange={(e) =>
                            handleUpdateCustomPageField(selectedCustomPage.slug, "secondaryLabel", e.target.value)
                          }
                          className="mt-1 h-8 text-xs"
                          placeholder="View All Programmes"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-foreground">Secondary Button Target URL</label>
                        <Input
                          value={selectedCustomPage.secondaryHref ?? ""}
                          onChange={(e) =>
                            handleUpdateCustomPageField(selectedCustomPage.slug, "secondaryHref", e.target.value)
                          }
                          className="mt-1 h-8 text-xs font-mono"
                          placeholder="/programmes"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics / Scale Stats */}
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Key Metrics Band (Up to 3 Metrics)
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {[0, 1, 2].map((idx) => {
                        const stat = (selectedCustomPage.stats && selectedCustomPage.stats[idx]) || { value: "", label: "" };
                        return (
                          <div key={idx} className="space-y-1.5 rounded-lg border border-border/40 bg-background/50 p-2.5">
                            <label className="text-[10px] font-semibold text-muted-foreground uppercase">Metric {idx + 1}</label>
                            <Input
                              value={stat.value ?? ""}
                              onChange={(e) =>
                                handleUpdateCustomPageStat(selectedCustomPage.slug, idx, "value", e.target.value)
                              }
                              className="h-7 text-xs font-bold font-mono"
                              placeholder="e.g. 11.2T"
                            />
                            <Input
                              value={stat.label ?? ""}
                              onChange={(e) =>
                                handleUpdateCustomPageStat(selectedCustomPage.slug, idx, "label", e.target.value)
                              }
                              className="h-7 text-[11px]"
                              placeholder="e.g. Public Debt"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-muted-foreground border border-dashed rounded-2xl">
                Select a page from the left or click &ldquo;Create Page&rdquo;.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SPECIAL DESK 3: ABOUT US EDITING */}
      {selectedPageKey === "about" && (
        <div className="space-y-6">
          {/* About Hero Section */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="border-b border-border/50 pb-3">
              <h2 className="text-base font-bold text-foreground">About Us — Hero &amp; Positioning</h2>
              <p className="text-xs text-muted-foreground">
                Consortium story and main youth-led transparency mandate. Saved to <code className="font-mono">src/content/about.json</code>.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-foreground">Eyebrow Tag</label>
                <Input
                  value={aboutData.hero?.eyebrow ?? ""}
                  onChange={(e) => updateAboutField(["hero", "eyebrow"], e.target.value)}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">Hero Title</label>
                <Input
                  value={aboutData.hero?.title ?? ""}
                  onChange={(e) => updateAboutField(["hero", "title"], e.target.value)}
                  className="mt-1 h-8 text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Lead Body Paragraph</label>
              <textarea
                value={aboutData.hero?.body ?? ""}
                onChange={(e) => updateAboutField(["hero", "body"], e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground focus-visible:outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* About Mission Section */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="border-b border-border/50 pb-3">
              <h2 className="text-base font-bold text-foreground">Our Mission</h2>
              <p className="text-xs text-muted-foreground">
                Core mission statement presented across public and partner channels.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Mission Section Title</label>
              <Input
                value={aboutData.mission?.title ?? ""}
                onChange={(e) => updateAboutField(["mission", "title"], e.target.value)}
                className="mt-1 h-8 text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Mission Narrative Statement</label>
              <textarea
                value={aboutData.mission?.body ?? ""}
                onChange={(e) => updateAboutField(["mission", "body"], e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground focus-visible:outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Open Creative Call Band */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="border-b border-border/50 pb-3">
              <h2 className="text-base font-bold text-foreground">Open Creative Call &amp; Talent Network</h2>
              <p className="text-xs text-muted-foreground">
                Recruitment strip for young animators, storytellers, researchers, and podcast hosts.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Section Title</label>
              <Input
                value={aboutData.openCall?.title ?? ""}
                onChange={(e) => updateAboutField(["openCall", "title"], e.target.value)}
                className="mt-1 h-8 text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Section Body Copy</label>
              <textarea
                value={aboutData.openCall?.body ?? ""}
                onChange={(e) => updateAboutField(["openCall", "body"], e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground focus-visible:outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-foreground">Primary Action Button Label</label>
                <Input
                  value={aboutData.openCall?.primaryCta?.label ?? ""}
                  onChange={(e) => updateAboutField(["openCall", "primaryCta", "label"], e.target.value)}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">Primary Button URL</label>
                <Input
                  value={aboutData.openCall?.primaryCta?.href ?? ""}
                  onChange={(e) => updateAboutField(["openCall", "primaryCta", "href"], e.target.value)}
                  className="mt-1 h-8 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STANDARD MULTI-TAB WORKSPACE (LANDING, PROGRAMMES, & PROGRAMME DETAIL PAGES) */}
      {selectedPageKey !== "featured-blogs" && selectedPageKey !== "custom-pages" && selectedPageKey !== "about" && (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Nav: Section Tabs for Selected Page */}
        <div className="space-y-3 lg:col-span-3">
          <div className="rounded-xl border border-border bg-card p-3 shadow-xs">
            <div className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Page Editor Desks
            </div>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveTab("sections")}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  activeTab === "sections"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layers className="size-3.5" />
                  <span>Sections &amp; Policy</span>
                </div>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    isOverBudget
                      ? "bg-rose-500 text-white"
                      : activeTab === "sections"
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {visibleSectionCount}/{maxAllowed}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("hero")}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  activeTab === "hero"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Sparkles className="size-3.5" />
                <span>Hero &amp; Headlines</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("core")}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  activeTab === "core"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <FileText className="size-3.5" />
                <span>Story &amp; Value Thesis</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("deliverables")}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  activeTab === "deliverables"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <BarChart2 className="size-3.5" />
                <span>Scale, Deliverables &amp; Steps</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("buttons")}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  activeTab === "buttons"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Link2 className="size-3.5" />
                <span>Buttons &amp; Links</span>
              </button>

              {selectedPageKey !== "landing" && selectedPageKey !== "programmes" && (
                <button
                  type="button"
                  onClick={() => setActiveTab("faqs")}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === "faqs"
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <HelpCircle className="size-3.5" />
                  <span>Frequently Asked Questions</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Context Card */}
          <div className="rounded-xl border border-border/70 bg-card p-4 text-xs space-y-2.5">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-emerald-500" />
              <span>Editorial Policy Guardrail</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Partner pages enforce the Jan Kennis rule: at most {maxAllowed} visible sections to maintain high attention and zero fluff.
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[11px]">
              <span className="text-muted-foreground">Active on page:</span>
              <span className={`font-mono font-bold ${isOverBudget ? "text-rose-500" : "text-emerald-500"}`}>
                {visibleSectionCount} of {maxAllowed} allowed
              </span>
            </div>
          </div>
        </div>

        {/* Right Area: Structured Form Panels */}
        <div className="space-y-6 lg:col-span-9">
          {/* TAB 1: SECTIONS & VISIBILITY */}
          {activeTab === "sections" && (
            <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">Section Visibility &amp; Ordering</h2>
                  <p className="text-xs text-muted-foreground">
                    Toggle which blocks appear on {currentPage.label}. Saved to <code className="font-mono">partner-page-sections.json</code>.
                  </p>
                </div>
                <Badge
                  variant={isOverBudget ? "destructive" : "secondary"}
                  className="font-mono text-xs"
                >
                  {visibleSectionCount}/{maxAllowed} visible
                </Badge>
              </div>

              {isOverBudget && (
                <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold">Policy Violation:</strong> This partner-facing page has {visibleSectionCount} active blocks, exceeding the limit of {maxAllowed}. Please toggle off non-essential sections to maintain Rockefeller editorial clarity.
                  </div>
                </div>
              )}

              <div className="divide-y divide-border/40 rounded-xl border border-border/60 bg-muted/20">
                {(pageSectionsConfig.sections || []).map((sec: any) => (
                  <div
                    key={sec.id}
                    className="flex items-center justify-between p-3.5 transition-colors hover:bg-muted/40"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-xs text-foreground">{sec.label}</span>
                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                          id: {sec.id}
                        </code>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleSection(sec.id)}
                      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        sec.visible ? "bg-emerald-600" : "bg-neutral-300 dark:bg-neutral-700"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          sec.visible ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: HERO & HEADLINES */}
          {activeTab === "hero" && (
            <div className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="border-b border-border/50 pb-3">
                <h2 className="text-base font-bold text-foreground">Hero Section Copy</h2>
                <p className="text-xs text-muted-foreground">
                  The primary above-the-fold narrative for {currentPage.label}.
                </p>
              </div>

              {selectedPageKey === "landing" ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground">Hero Eyebrow</label>
                    <Input
                      value={landingData.heroNarrative?.eyebrow ?? ""}
                      onChange={(e) => updateLandingField(["heroNarrative", "eyebrow"], e.target.value)}
                      placeholder="e.g. After Budget Day"
                      className="mt-1 h-9 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">Main Title (Headline)</label>
                    <Input
                      value={landingData.heroNarrative?.title ?? ""}
                      onChange={(e) => updateLandingField(["heroNarrative", "title"], e.target.value)}
                      placeholder="e.g. The books land. Then the silence."
                      className="mt-1 h-9 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">Lede Paragraph</label>
                    <textarea
                      value={landingData.heroNarrative?.lede ?? ""}
                      onChange={(e) => updateLandingField(["heroNarrative", "lede"], e.target.value)}
                      rows={4}
                      className="mt-1 w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Hero narrative describing the core premise..."
                    />
                  </div>
                </div>
              ) : selectedPageKey === "programmes" ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground">SEO Title</label>
                    <Input
                      value={programmesData.landing?.seoTitle ?? ""}
                      onChange={(e) => updateProgrammesLandingField(["seoTitle"], e.target.value)}
                      className="mt-1 h-9 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">Hero Headline</label>
                    <Input
                      value={programmesData.landing?.headline ?? ""}
                      onChange={(e) => updateProgrammesLandingField(["headline"], e.target.value)}
                      className="mt-1 h-9 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">Hero Body Copy</label>
                    <textarea
                      value={programmesData.landing?.body ?? ""}
                      onChange={(e) => updateProgrammesLandingField(["body"], e.target.value)}
                      rows={3}
                      className="mt-1 w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">Hero Subhead / Whisper</label>
                    <Input
                      value={programmesData.landing?.subhead ?? ""}
                      onChange={(e) => updateProgrammesLandingField(["subhead"], e.target.value)}
                      className="mt-1 h-9 text-xs"
                    />
                  </div>
                </div>
              ) : currentProgramme ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-foreground">Programme Eyebrow</label>
                      <Input
                        value={currentProgramme.eyebrow ?? ""}
                        onChange={(e) => updateCurrentProgrammeField("eyebrow", e.target.value)}
                        className="mt-1 h-9 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground">Programme Display Name</label>
                      <Input
                        value={currentProgramme.name ?? ""}
                        onChange={(e) => updateCurrentProgrammeField("name", e.target.value)}
                        className="mt-1 h-9 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">Hero Headline</label>
                    <Input
                      value={currentProgramme.headline ?? ""}
                      onChange={(e) => updateCurrentProgrammeField("headline", e.target.value)}
                      className="mt-1 h-9 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">Hero Description Body</label>
                    <textarea
                      value={currentProgramme.body ?? ""}
                      onChange={(e) => updateCurrentProgrammeField("body", e.target.value)}
                      rows={4}
                      className="mt-1 w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 3: STORY & VALUE THESIS */}
          {activeTab === "core" && (
            <div className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="border-b border-border/50 pb-3">
                <h2 className="text-base font-bold text-foreground">Story &amp; Value Thesis</h2>
                <p className="text-xs text-muted-foreground">
                  The intellectual foundation, investor thesis, and mandate fit.
                </p>
              </div>

              {selectedPageKey === "landing" ? (
                <div className="space-y-5">
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Who We Are &amp; Operating Thesis
                    </h3>

                    <div>
                      <label className="text-xs font-semibold text-foreground">Thesis Eyebrow</label>
                      <Input
                        value={landingData.thesis?.eyebrow ?? ""}
                        onChange={(e) => updateLandingField(["thesis", "eyebrow"], e.target.value)}
                        className="mt-1 h-9 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground">Thesis Title</label>
                      <Input
                        value={landingData.thesis?.title ?? ""}
                        onChange={(e) => updateLandingField(["thesis", "title"], e.target.value)}
                        className="mt-1 h-9 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground">Thesis Body</label>
                      <textarea
                        value={landingData.thesis?.body ?? ""}
                        onChange={(e) => updateLandingField(["thesis", "body"], e.target.value)}
                        rows={3}
                        className="mt-1 w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground">Method Whisper</label>
                      <Input
                        value={landingData.thesis?.method ?? ""}
                        onChange={(e) => updateLandingField(["thesis", "method"], e.target.value)}
                        className="mt-1 h-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Featured Projects Intro
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground">Intro Eyebrow</label>
                        <Input
                          value={landingData.featuredIntro?.eyebrow ?? ""}
                          onChange={(e) => updateLandingField(["featuredIntro", "eyebrow"], e.target.value)}
                          className="mt-1 h-9 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground">Intro Headline</label>
                        <Input
                          value={landingData.featuredIntro?.headline ?? ""}
                          onChange={(e) => updateLandingField(["featuredIntro", "headline"], e.target.value)}
                          className="mt-1 h-9 text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground">Intro Lede</label>
                      <textarea
                        value={landingData.featuredIntro?.lede ?? ""}
                        onChange={(e) => updateLandingField(["featuredIntro", "lede"], e.target.value)}
                        rows={2}
                        className="mt-1 w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                  </div>
                </div>
              ) : selectedPageKey === "programmes" ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Investor Matrix Card Blurbs
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Concise 1-sentence statements displayed on the three programme cards.
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-foreground">Connect Blurb</label>
                        <Input
                          value={programmesData.cardBlurbs?.connect ?? ""}
                          onChange={(e) => updateCardBlurb("connect", e.target.value)}
                          className="mt-1 h-9 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground">Mashinani Blurb</label>
                        <Input
                          value={programmesData.cardBlurbs?.mashinani ?? ""}
                          onChange={(e) => updateCardBlurb("mashinani", e.target.value)}
                          className="mt-1 h-9 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground">Wanahabari Lab Blurb</label>
                        <Input
                          value={programmesData.cardBlurbs?.["wanahabari-lab"] ?? ""}
                          onChange={(e) => updateCardBlurb("wanahabari-lab", e.target.value)}
                          className="mt-1 h-9 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground">Studios Blurb</label>
                        <Input
                          value={programmesData.cardBlurbs?.studios ?? ""}
                          onChange={(e) => updateCardBlurb("studios", e.target.value)}
                          className="mt-1 h-9 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : currentProgramme ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground">Mandate Fit</label>
                    <Input
                      value={currentProgramme.mandateFit ?? ""}
                      onChange={(e) => updateCurrentProgrammeField("mandateFit", e.target.value)}
                      placeholder="e.g. Sub-National Governance · Devolution Delivery"
                      className="mt-1 h-9 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      The Conundrum (Why We Intervene)
                    </label>
                    <textarea
                      value={currentProgramme.investorThesis ?? ""}
                      onChange={(e) => updateCurrentProgrammeField("investorThesis", e.target.value)}
                      rows={3}
                      className="mt-1 w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="The root problem in Kenya's public finance system..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      The Intervention (How We Execute)
                    </label>
                    <textarea
                      value={currentProgramme.whatWeDo ?? ""}
                      onChange={(e) => updateCurrentProgrammeField("whatWeDo", e.target.value)}
                      rows={3}
                      className="mt-1 w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="How this programme systematically addresses the issue..."
                    />
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 4: SCALE, DELIVERABLES & PROCESS */}
          {activeTab === "deliverables" && (
            <div className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="border-b border-border/50 pb-3">
                <h2 className="text-base font-bold text-foreground">Scale Stats, Process &amp; Deliverables</h2>
                <p className="text-xs text-muted-foreground">
                  The proof-points, operational steps, and partner deliverables.
                </p>
              </div>

              {selectedPageKey === "landing" ? (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Three Numbered Big Bets
                  </h3>
                  <div className="space-y-4">
                    {(landingData.programmeExplains || []).map((bet: any, i: number) => (
                      <div key={bet.slug} className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-foreground">{bet.number} · {bet.name}</span>
                          <code className="text-[10px] font-mono text-muted-foreground">{bet.slug}</code>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label className="text-[11px] font-semibold text-foreground">Eyebrow</label>
                            <Input
                              value={bet.eyebrow ?? ""}
                              onChange={(e) => {
                                const explains = [...(landingData.programmeExplains || [])];
                                explains[i] = { ...explains[i], eyebrow: e.target.value };
                                updateLandingField(["programmeExplains"], explains);
                              }}
                              className="mt-1 h-8 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-foreground">Title (Phrase)</label>
                            <Input
                              value={bet.title ?? ""}
                              onChange={(e) => {
                                const explains = [...(landingData.programmeExplains || [])];
                                explains[i] = { ...explains[i], title: e.target.value };
                                updateLandingField(["programmeExplains"], explains);
                              }}
                              className="mt-1 h-8 text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-foreground">Lede</label>
                          <textarea
                            value={bet.lede ?? ""}
                            onChange={(e) => {
                              const explains = [...(landingData.programmeExplains || [])];
                              explains[i] = { ...explains[i], lede: e.target.value };
                              updateLandingField(["programmeExplains"], explains);
                            }}
                            rows={2}
                            className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs text-foreground focus-visible:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-foreground">What Success Looks Like</label>
                          <textarea
                            value={bet.success ?? ""}
                            onChange={(e) => {
                              const explains = [...(landingData.programmeExplains || [])];
                              explains[i] = { ...explains[i], success: e.target.value };
                              updateLandingField(["programmeExplains"], explains);
                            }}
                            rows={2}
                            className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs text-foreground focus-visible:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label className="text-[11px] font-semibold text-foreground">Cycle Whisper</label>
                            <Input
                              value={bet.cycle ?? ""}
                              onChange={(e) => {
                                const explains = [...(landingData.programmeExplains || [])];
                                explains[i] = { ...explains[i], cycle: e.target.value };
                                updateLandingField(["programmeExplains"], explains);
                              }}
                              className="mt-1 h-8 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-foreground">Button Label</label>
                            <Input
                              value={bet.ctaLabel ?? ""}
                              onChange={(e) => {
                                const explains = [...(landingData.programmeExplains || [])];
                                explains[i] = { ...explains[i], ctaLabel: e.target.value };
                                updateLandingField(["programmeExplains"], explains);
                              }}
                              className="mt-1 h-8 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : currentProgramme ? (
                <div className="space-y-6">
                  {/* 3 Key Stats */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Three Key Scale Metrics
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {(currentProgramme.stats || []).map((stat: any, idx: number) => (
                        <div key={idx} className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-2">
                          <label className="text-[11px] font-semibold text-foreground">Stat {idx + 1} Value</label>
                          <Input
                            value={stat.value ?? ""}
                            onChange={(e) => handleUpdateStat(idx, "value", e.target.value)}
                            className="h-8 text-xs font-mono font-bold"
                            placeholder="e.g. 4.8T or 04"
                          />
                          <label className="text-[11px] font-semibold text-foreground">Label</label>
                          <Input
                            value={stat.label ?? ""}
                            onChange={(e) => handleUpdateStat(idx, "label", e.target.value)}
                            className="h-8 text-xs"
                            placeholder="Label description"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4 Process Steps */}
                  <div className="space-y-3 pt-2 border-t border-border/40">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Four-Step Operational Delivery Sequence
                    </h3>
                    <div className="space-y-3">
                      {(currentProgramme.process || []).map((step: any, idx: number) => (
                        <div key={idx} className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-primary">0{idx + 1}.</span>
                            <Input
                              value={step.title ?? ""}
                              onChange={(e) => handleUpdateProcess(idx, "title", e.target.value)}
                              className="h-8 text-xs font-semibold"
                              placeholder="Step title"
                            />
                          </div>
                          <textarea
                            value={step.body ?? ""}
                            onChange={(e) => handleUpdateProcess(idx, "body", e.target.value)}
                            rows={2}
                            className="w-full rounded-md border border-input bg-background p-2 text-xs text-foreground focus-visible:outline-none"
                            placeholder="Step description"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3 Concrete Deliverables */}
                  <div className="space-y-3 pt-2 border-t border-border/40">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Three Concrete Partner Deliverables
                    </h3>
                    <div className="space-y-3">
                      {(currentProgramme.deliverables || []).map((deliv: any, idx: number) => (
                        <div key={idx} className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-emerald-500">#{idx + 1}</span>
                            <Input
                              value={deliv.title ?? ""}
                              onChange={(e) => handleUpdateDeliverable(idx, "title", e.target.value)}
                              className="h-8 text-xs font-semibold"
                              placeholder="Deliverable title"
                            />
                          </div>
                          <textarea
                            value={deliv.description ?? ""}
                            onChange={(e) => handleUpdateDeliverable(idx, "description", e.target.value)}
                            rows={2}
                            className="w-full rounded-md border border-input bg-background p-2 text-xs text-foreground focus-visible:outline-none"
                            placeholder="Deliverable description"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  Deliverables for this page are managed on the individual programme pages.
                </div>
              )}
            </div>
          )}

          {/* TAB 5: BUTTONS & LINKS */}
          {activeTab === "buttons" && (
            <div className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="border-b border-border/50 pb-3">
                <h2 className="text-base font-bold text-foreground">Buttons, Links &amp; CTAs</h2>
                <p className="text-xs text-muted-foreground">
                  Configure every button label, target route, and partner link for {currentPage.label}.
                </p>
              </div>

              {selectedPageKey === "landing" ? (
                <div className="space-y-5">
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Partner Closing CTA Band
                    </h3>

                    <div>
                      <label className="text-xs font-semibold text-foreground">CTA Band Eyebrow</label>
                      <Input
                        value={landingData.partnerCta?.eyebrow ?? ""}
                        onChange={(e) => updateLandingField(["partnerCta", "eyebrow"], e.target.value)}
                        className="mt-1 h-9 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground">CTA Band Title</label>
                      <Input
                        value={landingData.partnerCta?.title ?? ""}
                        onChange={(e) => updateLandingField(["partnerCta", "title"], e.target.value)}
                        className="mt-1 h-9 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground">CTA Band Description</label>
                      <textarea
                        value={landingData.partnerCta?.description ?? ""}
                        onChange={(e) => updateLandingField(["partnerCta", "description"], e.target.value)}
                        rows={2}
                        className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs text-foreground focus-visible:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground">Primary Button Label</label>
                        <Input
                          value={landingData.partnerCta?.ctaLabel ?? ""}
                          onChange={(e) => updateLandingField(["partnerCta", "ctaLabel"], e.target.value)}
                          className="mt-1 h-8 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground">Primary Button Target URL</label>
                        <Input
                          value={landingData.partnerCta?.ctaHref ?? ""}
                          onChange={(e) => updateLandingField(["partnerCta", "ctaHref"], e.target.value)}
                          className="mt-1 h-8 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground">Secondary Button Label</label>
                        <Input
                          value={landingData.partnerCta?.secondaryLabel ?? ""}
                          onChange={(e) => updateLandingField(["partnerCta", "secondaryLabel"], e.target.value)}
                          className="mt-1 h-8 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground">Secondary Button Target URL</label>
                        <Input
                          value={landingData.partnerCta?.secondaryHref ?? ""}
                          onChange={(e) => updateLandingField(["partnerCta", "secondaryHref"], e.target.value)}
                          className="mt-1 h-8 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedPageKey === "programmes" ? (
                <div className="space-y-5">
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Hero Action Buttons
                    </h3>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground">Primary Button Label</label>
                        <Input
                          value={programmesData.landing?.exploreCta?.label ?? ""}
                          onChange={(e) => updateProgrammesLandingField(["exploreCta", "label"], e.target.value)}
                          className="mt-1 h-8 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground">Primary Button Link</label>
                        <Input
                          value={programmesData.landing?.exploreCta?.href ?? ""}
                          onChange={(e) => updateProgrammesLandingField(["exploreCta", "href"], e.target.value)}
                          className="mt-1 h-8 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground">Secondary Button Label</label>
                        <Input
                          value={programmesData.landing?.partnerCta?.label ?? ""}
                          onChange={(e) => updateProgrammesLandingField(["partnerCta", "label"], e.target.value)}
                          className="mt-1 h-8 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground">Secondary Button Link</label>
                        <Input
                          value={programmesData.landing?.partnerCta?.href ?? ""}
                          onChange={(e) => updateProgrammesLandingField(["partnerCta", "href"], e.target.value)}
                          className="mt-1 h-8 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Closing Partnership Band
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground">Button Label</label>
                        <Input
                          value={programmesData.closing?.cta?.label ?? ""}
                          onChange={(e) => updateProgrammesClosingField(["cta", "label"], e.target.value)}
                          className="mt-1 h-8 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground">Button Target URL</label>
                        <Input
                          value={programmesData.closing?.cta?.href ?? ""}
                          onChange={(e) => updateProgrammesClosingField(["cta", "href"], e.target.value)}
                          className="mt-1 h-8 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : currentProgramme ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Programme Primary &amp; Secondary Buttons
                    </h3>

                    {/* Primary Button */}
                    <div className="space-y-2 border-b border-border/40 pb-3">
                      <div className="text-[11px] font-bold text-foreground">Primary Action Button</div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="text-[11px] font-semibold text-muted-foreground">Label</label>
                          <Input
                            value={currentProgramme.cta?.label ?? ""}
                            onChange={(e) => {
                              const cta = { ...(currentProgramme.cta || {}), label: e.target.value };
                              updateCurrentProgrammeField("cta", cta);
                            }}
                            className="mt-0.5 h-8 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-muted-foreground">URL Target</label>
                          <Input
                            value={currentProgramme.cta?.href ?? ""}
                            onChange={(e) => {
                              const cta = { ...(currentProgramme.cta || {}), href: e.target.value };
                              updateCurrentProgrammeField("cta", cta);
                            }}
                            className="mt-0.5 h-8 text-xs font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-muted-foreground">Note / Subtext</label>
                        <Input
                          value={currentProgramme.cta?.note ?? ""}
                          onChange={(e) => {
                            const cta = { ...(currentProgramme.cta || {}), note: e.target.value };
                            updateCurrentProgrammeField("cta", cta);
                          }}
                          className="mt-0.5 h-8 text-xs"
                        />
                      </div>
                    </div>

                    {/* Secondary Button */}
                    <div className="space-y-2 pt-1">
                      <div className="text-[11px] font-bold text-foreground">Secondary Action Button (Co-Funding)</div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="text-[11px] font-semibold text-muted-foreground">Label</label>
                          <Input
                            value={currentProgramme.secondaryCta?.label ?? "Discuss Co-Funding"}
                            onChange={(e) => {
                              const secondary = {
                                ...(currentProgramme.secondaryCta || {}),
                                label: e.target.value,
                              };
                              updateCurrentProgrammeField("secondaryCta", secondary);
                            }}
                            className="mt-0.5 h-8 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-muted-foreground">URL Target</label>
                          <Input
                            value={
                              currentProgramme.secondaryCta?.href ??
                              `/contact?intent=partner&programme=${currentProgramme.slug}`
                            }
                            onChange={(e) => {
                              const secondary = {
                                ...(currentProgramme.secondaryCta || {}),
                                href: e.target.value,
                              };
                              updateCurrentProgrammeField("secondaryCta", secondary);
                            }}
                            className="mt-0.5 h-8 text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 6: FAQS */}
          {activeTab === "faqs" && currentProgramme && (
            <div className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div>
                  <h2 className="text-base font-bold text-foreground">Frequently Asked Questions</h2>
                  <p className="text-xs text-muted-foreground">
                    Edit partner FAQs for {currentProgramme.name}.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={handleAddFaq}
                  size="sm"
                  variant="outline"
                  className="gap-1 text-xs"
                >
                  <Plus className="size-3.5" />
                  <span>Add Question</span>
                </Button>
              </div>

              <div className="space-y-3">
                {(currentProgramme.faqs || []).map((faq: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border/60 bg-muted/20 p-3.5 space-y-2 relative"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-1">
                        <label className="text-[11px] font-semibold text-foreground">
                          Question {idx + 1}
                        </label>
                        <Input
                          value={faq.q ?? ""}
                          onChange={(e) => handleUpdateFaq(idx, "q", e.target.value)}
                          className="h-8 text-xs font-medium"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFaq(idx)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-500"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-foreground">Answer</label>
                      <textarea
                        value={faq.a ?? ""}
                        onChange={(e) => handleUpdateFaq(idx, "a", e.target.value)}
                        rows={2}
                        className="w-full rounded-md border border-input bg-background p-2 text-xs text-foreground focus-visible:outline-none"
                      />
                    </div>
                  </div>
                ))}

                {(currentProgramme.faqs || []).length === 0 && (
                  <div className="p-6 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
                    No FAQs defined for this programme. Click &ldquo;Add Question&rdquo; to create one.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
