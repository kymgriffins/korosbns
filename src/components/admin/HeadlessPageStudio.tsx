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
  EyeOff,
  Palette,
  UploadCloud,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Columns,
  Film,
  Sliders,
  Smartphone,
  Search,
  SlidersHorizontal,
  VolumeX,
  Volume2,
  Database,
  ChevronDown,
  ChevronUp,
  Filter,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MASTER_CMS_EMAIL } from "@/lib/headless-cms";
import { LivePagePreview, type DeviceMode } from "./LivePagePreview";
import { CustomPageStudioEditor } from "./CustomPageStudioEditor";
import { WysiwygProseEditor } from "./WysiwygProseEditor";
import { MediaAssetPicker, type MediaSelection } from "./MediaAssetPicker";
import { ImageFieldControl } from "./ImageFieldControl";
import { ColorFieldControl } from "./ColorFieldControl";
import { MediaEmbed, detectMediaType } from "@/components/ui/media-embed";
import { NavigationStudioEditor } from "./NavigationStudioEditor";
import { DesignTokensStudioEditor } from "./DesignTokensStudioEditor";
import { CoursesStudioEditor } from "./CoursesStudioEditor";
import { ContactStudioEditor } from "./ContactStudioEditor";
import {
  CmsCollectionJsonEditor,
  isCollectionPageKey,
} from "./CmsCollectionJsonEditor";
import { BnsStudioSectionsEditor } from "./BnsStudioSectionsEditor";
import { AboutStudioEditor } from "./AboutStudioEditor";
import { CareersStudioEditor } from "./CareersStudioEditor";
import { ImpactStudioEditor } from "./ImpactStudioEditor";
import { StoriesStudioEditor } from "./StoriesStudioEditor";
import { FaqStudioEditor } from "./FaqStudioEditor";
import { AllProjectsStudioEditor } from "./AllProjectsStudioEditor";
import { listProgrammePresetOptions } from "@/lib/programme-theme";

type PageKey =
  | "landing"
  | "programmes"
  | "connect"
  | "mashinani"
  | "wanahabari-lab"
  | "studios"
  | "about"
  | "featured-blogs"
  | "custom-pages"
  | "navigation"
  | "tokens"
  | "courses"
  | "contact"
  | "faq"
  | "stories"
  | "impact"
  | "consortium"
  | "careers"
  | "legal"
  | "team-initiatives"
  | "landing-hero"
  | "landing-sections"
  | "programme-reels"
  | "studios-evidence"
  | "bns-studio";

type TabKey = "sections" | "hero" | "carousel" | "bets" | "core" | "deliverables" | "buttons" | "faqs" | "media" | "mobile" | "theme";

export type CmsPageCategory = "pages" | "programmes" | "projects" | "system";

export interface PageMeta {
  key: PageKey;
  label: string;
  tag: string;
  route: string;
  sectionPageId: string;
  icon: string;
  category: CmsPageCategory;
}

const PAGES: PageMeta[] = [
  // 1. CORE PAGES
  {
    key: "landing",
    label: "Landing Page",
    tag: "Homepage Spine & Layout",
    route: "/",
    sectionPageId: "home",
    icon: "🌐",
    category: "pages",
  },
  {
    key: "programmes",
    label: "Programmes Hub",
    tag: "All Programmes Overview",
    route: "/programmes",
    sectionPageId: "programmes",
    icon: "📊",
    category: "pages",
  },
  {
    key: "about",
    label: "About Us",
    tag: "Organization, Mandate & Team",
    route: "/about",
    sectionPageId: "about",
    icon: "🏢",
    category: "pages",
  },
  {
    key: "contact",
    label: "Contact Page",
    tag: "Direct Inquiries & Channels",
    route: "/contact",
    sectionPageId: "contact",
    icon: "📬",
    category: "pages",
  },
  {
    key: "faq",
    label: "FAQ & Help Center",
    tag: "Frequently Asked Questions",
    route: "/faq",
    sectionPageId: "faq",
    icon: "❓",
    category: "pages",
  },
  {
    key: "careers",
    label: "Careers & Open Roles",
    tag: "Job Listings & Culture",
    route: "/careers",
    sectionPageId: "careers",
    icon: "💼",
    category: "pages",
  },
  {
    key: "legal",
    label: "Legal & Security",
    tag: "Security, Privacy & Terms",
    route: "/security",
    sectionPageId: "legal",
    icon: "📜",
    category: "pages",
  },

  // 2. CIVIC PROGRAMMES
  {
    key: "connect",
    label: "BNS Connect",
    tag: "National Money Tracker",
    route: "/programmes/connect",
    sectionPageId: "programmeConnect",
    icon: "🔍",
    category: "programmes",
  },
  {
    key: "mashinani",
    label: "BNS Mashinani",
    tag: "County Devolved Scrutiny",
    route: "/programmes/mashinani",
    sectionPageId: "programmeMashinani",
    icon: "🌾",
    category: "programmes",
  },
  {
    key: "wanahabari-lab",
    label: "Wanahabari Lab",
    tag: "Newsroom Investigations Bench",
    route: "/programmes/wanahabari-lab",
    sectionPageId: "programmeWanahabari",
    icon: "🎙️",
    category: "programmes",
  },
  {
    key: "bns-studio",
    label: "BNS Studio",
    tag: "Production House & Impact Films",
    route: "/bns-studio",
    sectionPageId: "studio",
    icon: "🎬",
    category: "programmes",
  },

  // 3. PROJECTS & MEDIA
  {
    key: "studios-evidence",
    label: "All Projects Database",
    tag: "Canonical Master Portfolio (20+ Projects)",
    route: "/work",
    sectionPageId: "studios-evidence",
    icon: "🗄️",
    category: "projects",
  },
  {
    key: "featured-blogs",
    label: "Featured Projects (Spotlight)",
    tag: "Homepage Curated Spotlight Cards",
    route: "/#featured-projects",
    sectionPageId: "featured-blogs",
    icon: "⭐",
    category: "projects",
  },
  {
    key: "programme-reels",
    label: "Programme Social Reels",
    tag: "Vertical R2 Video Archive (8 Reels)",
    route: "/programmes",
    sectionPageId: "programme-reels",
    icon: "📱",
    category: "projects",
  },
  {
    key: "stories",
    label: "Budget Stories",
    tag: "Deep Dive Articles & Explainers",
    route: "/stories",
    sectionPageId: "stories",
    icon: "📖",
    category: "projects",
  },
  {
    key: "courses",
    label: "Learning Curriculum",
    tag: "Civic Training & Modules",
    route: "/learn",
    sectionPageId: "courses",
    icon: "🎓",
    category: "projects",
  },

  // 4. DESIGN & GLOBAL SYSTEM
  {
    key: "tokens",
    label: "Design Tokens & Brand Agency",
    tag: "Colors, typography, 4px radii, buttons",
    route: "/",
    sectionPageId: "tokens",
    icon: "🎨",
    category: "system",
  },
  {
    key: "navigation",
    label: "Navbar & Footer",
    tag: "Global Navigation & Chrome",
    route: "/",
    sectionPageId: "navigation",
    icon: "🧭",
    category: "system",
  },
  {
    key: "landing-hero",
    label: "Landing Hero Component",
    tag: "Homepage Headline & Subtitle",
    route: "/",
    sectionPageId: "landing-hero",
    icon: "🎯",
    category: "system",
  },
  {
    key: "landing-sections",
    label: "Landing Sections Matrix",
    tag: "Homepage Section Structure",
    route: "/",
    sectionPageId: "landing-sections",
    icon: "📐",
    category: "system",
  },
  {
    key: "custom-pages",
    label: "Custom Pages Builder",
    tag: "Create New Dynamic Pages",
    route: "/pages",
    sectionPageId: "custom-pages",
    icon: "📄",
    category: "system",
  },
  {
    key: "impact",
    label: "Impact Metrics",
    tag: "Public Scorecard & Metrics",
    route: "/impact",
    sectionPageId: "impact",
    icon: "📊",
    category: "system",
  },
  {
    key: "consortium",
    label: "Consortium Partners",
    tag: "Partner Profiles & Activities",
    route: "/consortium",
    sectionPageId: "consortium",
    icon: "🤝",
    category: "system",
  },
  {
    key: "team-initiatives",
    label: "Team Initiatives",
    tag: "Per-Member Initiative Links",
    route: "/team",
    sectionPageId: "team-initiatives",
    icon: "👥",
    category: "system",
  },
];

export function HeadlessPageStudio() {
  const [selectedPageKey, setSelectedPageKey] = useState<PageKey>("landing");
  const [activeTab, setActiveTab] = useState<TabKey>("sections");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeImagePicker, setActiveImagePicker] = useState<{
    isOpen: boolean;
    title: string;
    currentUrl?: string;
    onSelect: (url: string) => void;
  } | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Raw State Stores
  const [landingData, setLandingData] = useState<Record<string, any>>({});
  const [programmesData, setProgrammesData] = useState<Record<string, any>>({});
  const [sectionsData, setSectionsData] = useState<Record<string, any>>({});
  const [aboutData, setAboutData] = useState<Record<string, any>>({});
  const [customPagesData, setCustomPagesData] = useState<{ pages?: any[] }>({ pages: [] });
  const [featuredData, setFeaturedData] = useState<{ count?: number; provenance?: any; results?: any[] }>({ results: [] });
  const [navigationData, setNavigationData] = useState<Record<string, any>>({});
  const [designTokensData, setDesignTokensData] = useState<Record<string, any>>({});
  const [coursesData, setCoursesData] = useState<Record<string, any>>({ results: [] });
  const [contactData, setContactData] = useState<Record<string, any>>({});
  const [faqData, setFaqData] = useState<Record<string, any>>({});
  const [storiesData, setStoriesData] = useState<Record<string, any>>({});
  const [impactData, setImpactData] = useState<Record<string, any>>({});
  const [consortiumData, setConsortiumData] = useState<Record<string, any>>({});
  const [careersData, setCareersData] = useState<Record<string, any>>({});
  const [legalData, setLegalData] = useState<Record<string, any>>({});
  const [teamInitiativesData, setTeamInitiativesData] = useState<Record<string, any>>({});
  const [landingHeroData, setLandingHeroData] = useState<Record<string, any>>({});
  const [landingSectionsData, setLandingSectionsData] = useState<Record<string, any>>({});
  const [programmeReelsData, setProgrammeReelsData] = useState<Record<string, any>>({});
  const [studiosEvidenceData, setStudiosEvidenceData] = useState<Record<string, any>>({});
  const [bnsStudioData, setBnsStudioData] = useState<Record<string, any>>({});

  // Selections for sub-studios
  const [selectedCustomPageSlug, setSelectedCustomPageSlug] = useState<string>("");
  const [selectedFeaturedId, setSelectedFeaturedId] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [viewMode, setViewMode] = useState<"split" | "editor" | "preview">("editor");
  const [previewDevice, setPreviewDevice] = useState<DeviceMode>("desktop");
  const [previewRefreshKey, setPreviewRefreshKey] = useState(0);

  // Category & Search State for Pages Menu
  const [selectedCategory, setSelectedCategory] = useState<"all" | CmsPageCategory>("all");
  const [pageSearchQuery, setPageSearchQuery] = useState("");
  const [showSectionSwitchboard, setShowSectionSwitchboard] = useState(false);
  const [sectionSearchQuery, setSectionSearchQuery] = useState("");
  const [projectsViewMode, setProjectsViewMode] = useState<"cards" | "json">("cards");
  const [projectProgrammeFilter, setProjectProgrammeFilter] = useState<string>("all");
  const [projectSearchQuery, setProjectSearchQuery] = useState("");

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
      const fetchFresh = (endpoint: string) =>
        fetch(`${endpoint}?t=${Date.now()}`, { cache: "no-store" });

      const [resLanding, resProg, resSec, resAbout, resCustom, resFeatured, resNav, resTokens, resCourses, resContact, resFaq, resStories, resImpact, resConsortium, resCareers, resLegal, resTeamInitiatives, resLandingHero, resLandingSections, resProgrammeReels, resStudiosEvidence, resBnsStudio] = await Promise.all([
        fetchFresh("/api/cms/landing/"),
        fetchFresh("/api/cms/programmes/"),
        fetchFresh("/api/cms/partner-page-sections/"),
        fetchFresh("/api/cms/about/"),
        fetchFresh("/api/cms/custom-pages/"),
        fetchFresh("/api/cms/featured-projects/"),
        fetchFresh("/api/cms/navigation/"),
        fetchFresh("/api/cms/design-tokens/"),
        fetchFresh("/api/cms/civic-modules/"),
        fetchFresh("/api/cms/contact/"),
        fetchFresh("/api/cms/faq/"),
        fetchFresh("/api/cms/stories/"),
        fetchFresh("/api/cms/impact/"),
        fetchFresh("/api/cms/consortium/"),
        fetchFresh("/api/cms/careers/"),
        fetchFresh("/api/cms/legal/"),
        fetchFresh("/api/cms/team-initiatives/"),
        fetchFresh("/api/cms/landing-hero/"),
        fetchFresh("/api/cms/landing-sections/"),
        fetchFresh("/api/cms/programme-reels/"),
        fetchFresh("/api/cms/studios-evidence/"),
        fetchFresh("/api/cms/bns-studio/"),
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
        const data = json.data || {};
        // Ensure loading policy exists even when R2 predates this field
        if (!data.policy) data.policy = {};
        if (!data.policy.loadingDefaults) {
          data.policy.loadingDefaults = {
            globalSplash: false,
            globalSplashMinMs: 0,
            routeLoadingDefault: false,
            routeLoadingVariant: "none",
            notes:
              "Never show cosmetic loaders by default. Opt in per page only when intentional.",
          };
        }
        if (data.pages?.studio && !data.pages.studio.loading) {
          data.pages.studio.loading = {
            enabled: false,
            minMs: 0,
            variant: "studio-reel",
          };
        }
        setSectionsData(data);
      }
      if (resAbout.ok) {
        const json = await resAbout.json();
        setAboutData(json.data || {});
      }
      if (resCustom.ok) {
        const json = await resCustom.json();
        const pages = json.data?.pages || [];
        setCustomPagesData(json.data || { pages: [] });
        if (pages.length > 0) {
          setSelectedCustomPageSlug((prev) => prev || pages[0].slug);
        }
      }
      if (resFeatured.ok) {
        const json = await resFeatured.json();
        const results = json.data?.results || [];
        setFeaturedData(json.data || { results: [] });
        if (results.length > 0) {
          setSelectedFeaturedId((prev) => prev || results[0].id);
        }
      }
      if (resNav.ok) {
        const json = await resNav.json();
        setNavigationData(json.data || {});
      }
      if (resTokens.ok) {
        const json = await resTokens.json();
        setDesignTokensData(json.data || {});
      }
      if (resCourses.ok) {
        const json = await resCourses.json();
        setCoursesData(json.data || { results: [] });
      }
      if (resContact.ok) {
        const json = await resContact.json();
        setContactData(json.data || {});
      }
      if (resFaq.ok) {
        const json = await resFaq.json();
        setFaqData(json.data || {});
      }
      if (resStories.ok) {
        const json = await resStories.json();
        setStoriesData(json.data || {});
      }
      if (resImpact.ok) {
        const json = await resImpact.json();
        setImpactData(json.data || {});
      }
      if (resConsortium.ok) {
        const json = await resConsortium.json();
        setConsortiumData(json.data || {});
      }
      if (resCareers.ok) {
        const json = await resCareers.json();
        setCareersData(json.data || {});
      }
      if (resLegal.ok) {
        const json = await resLegal.json();
        setLegalData(json.data || {});
      }
      if (resTeamInitiatives.ok) {
        const json = await resTeamInitiatives.json();
        setTeamInitiativesData(json.data || {});
      }
      if (resLandingHero.ok) {
        const json = await resLandingHero.json();
        setLandingHeroData(json.data || {});
      }
      if (resLandingSections.ok) {
        const json = await resLandingSections.json();
        setLandingSectionsData(json.data || {});
      }
      if (resProgrammeReels.ok) {
        const json = await resProgrammeReels.json();
        setProgrammeReelsData(json.data || {});
      }
      if (resStudiosEvidence.ok) {
        const json = await resStudiosEvidence.json();
        setStudiosEvidenceData(json.data || {});
      }
      if (resBnsStudio.ok) {
        const json = await resBnsStudio.json();
        setBnsStudioData(json.data || {});
      }
      setLastSaved(new Date().toLocaleTimeString());
    } catch {
      toast.error("Failed to load CMS datasets from server");
    } finally {
      setIsLoading(false);
    }
  }, []);

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
  const handleMoveSection = (idx: number, direction: "up" | "down") => {
    const pageId = currentPage.sectionPageId;
    const currentSections = [...(pageSectionsConfig.sections || [])];
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= currentSections.length) return;

    const temp = currentSections[idx];
    currentSections[idx] = currentSections[targetIdx];
    currentSections[targetIdx] = temp;

    setSectionsData({
      ...sectionsData,
      pages: {
        ...(sectionsData.pages || {}),
        [pageId]: {
          ...(sectionsData.pages?.[pageId] || {}),
          sections: currentSections,
        },
      },
    });
    setPreviewRefreshKey((k) => k + 1);
    toast.success(`Moved section "${temp.label}" ${direction}!`);
  };

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
    setPreviewRefreshKey((k) => k + 1);
  };

  const toggleSectionForPage = (pageId: string, sectionId: string) => {
    const updatedSections = { ...sectionsData };
    const pageObj = updatedSections.pages?.[pageId];
    if (!pageObj || !pageObj.sections) return;

    pageObj.sections = pageObj.sections.map((sec: any) => {
      if (sec.id === sectionId) {
        return { ...sec, visible: sec.visible === false ? true : false };
      }
      return sec;
    });

    setSectionsData(updatedSections);
    setPreviewRefreshKey((k) => k + 1);
    toast.success(`Updated section visibility for ${pageId}!`);
  };

  const areAllPartnersMuted = useMemo(() => {
    const homeSec = sectionsData.pages?.home?.sections?.find((s: any) => s.id === "partners");
    const progSec = sectionsData.pages?.programmes?.sections?.find((s: any) => s.id === "partners");
    return homeSec?.visible === false && progSec?.visible === false;
  }, [sectionsData]);

  const areAllReelsMuted = useMemo(() => {
    const connectReel = sectionsData.pages?.programmeConnect?.sections?.find((s: any) => s.id === "reels");
    const mashinaniReel = sectionsData.pages?.programmeMashinani?.sections?.find((s: any) => s.id === "reels");
    const wanahabariReel = sectionsData.pages?.programmeWanahabari?.sections?.find((s: any) => s.id === "reels");
    const studioReel = sectionsData.pages?.studio?.sections?.find((s: any) => s.id === "hero-reel");
    return (
      connectReel?.visible === false &&
      mashinaniReel?.visible === false &&
      wanahabariReel?.visible === false &&
      studioReel?.visible === false
    );
  }, [sectionsData]);

  const toggleAllPartnerAssets = (visible: boolean) => {
    const updated = { ...sectionsData };
    if (!updated.pages) updated.pages = {};
    ["home", "programmes"].forEach((pageId) => {
      if (updated.pages[pageId]?.sections) {
        updated.pages[pageId].sections = updated.pages[pageId].sections.map((s: any) =>
          s.id === "partners" ? { ...s, visible } : s
        );
      }
    });
    setSectionsData(updated);
    setPreviewRefreshKey((k) => k + 1);
    toast.success(
      visible
        ? "Partner assets enabled on Homepage and Programmes Hub!"
        : "Partner assets muted across Homepage and Programmes Hub!"
    );
  };

  const toggleAllSocialReels = (visible: boolean) => {
    const updated = { ...sectionsData };
    if (!updated.pages) updated.pages = {};
    ["programmeConnect", "programmeMashinani", "programmeWanahabari"].forEach((pageId) => {
      if (updated.pages[pageId]?.sections) {
        updated.pages[pageId].sections = updated.pages[pageId].sections.map((s: any) =>
          s.id === "reels" ? { ...s, visible } : s
        );
      }
    });
    if (updated.pages.studio?.sections) {
      updated.pages.studio.sections = updated.pages.studio.sections.map((s: any) =>
        s.id === "hero-reel" ? { ...s, visible } : s
      );
    }
    setSectionsData(updated);
    setPreviewRefreshKey((k) => k + 1);
    toast.success(
      visible
        ? "Social video reels enabled across all civic programme pages!"
        : "Social video reels muted across all civic programme pages!"
    );
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: PAGES.length, pages: 0, programmes: 0, projects: 0, system: 0 };
    for (const page of PAGES) {
      if (counts[page.category] !== undefined) {
        counts[page.category]++;
      }
    }
    return counts;
  }, []);

  const filteredPages = useMemo(() => {
    return PAGES.filter((page) => {
      const matchesCategory =
        selectedCategory === "all" || page.category === selectedCategory;
      const q = pageSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        page.label.toLowerCase().includes(q) ||
        page.route.toLowerCase().includes(q) ||
        page.tag.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, pageSearchQuery]);

  const handleUpdateSectionProp = (sectionId: string, prop: string, value: any) => {
    const pageId = currentPage.sectionPageId;
    const currentSections = [...(pageSectionsConfig.sections || [])];
    const updated = currentSections.map((sec: any) =>
      sec.id === sectionId ? { ...sec, [prop]: value } : sec
    );
    setSectionsData({
      ...sectionsData,
      pages: {
        ...(sectionsData.pages || {}),
        [pageId]: {
          ...(sectionsData.pages?.[pageId] || {}),
          sections: updated,
        },
      },
    });
    setPreviewRefreshKey((k) => k + 1);
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

  const updateCardBlurb = (slug: string, value: string) => {
    const updated = { ...programmesData };
    if (!updated.cardBlurbs) updated.cardBlurbs = {};
    updated.cardBlurbs[slug] = value;
    setProgrammesData(updated);
  };

  // FAQ Handlers
  const handleAddFaq = () => {
    if (!currentProgramme) return;
    const faqs = [...(currentProgramme.faqs || [])];
    faqs.push({ q: "New Question", a: "Answer details go here." });
    updateCurrentProgrammeField("faqs", faqs);
  };

  const handleUpdateFaq = (index: number, field: "q" | "a", value: string) => {
    if (!currentProgramme) return;
    const faqs = [...(currentProgramme.faqs || [])];
    faqs[index] = { ...faqs[index], [field]: value };
    updateCurrentProgrammeField("faqs", faqs);
  };

  const handleDeleteFaq = (index: number) => {
    if (!currentProgramme) return;
    const faqs = (currentProgramme.faqs || []).filter((_: any, i: number) => i !== index);
    updateCurrentProgrammeField("faqs", faqs);
  };

  // Deliverables Handlers
  const handleUpdateDeliverable = (index: number, field: "title" | "description", value: string) => {
    if (!currentProgramme) return;
    const deliverables = [...(currentProgramme.deliverables || [])];
    deliverables[index] = { ...deliverables[index], [field]: value };
    updateCurrentProgrammeField("deliverables", deliverables);
  };

  // Process Handlers
  const handleUpdateProcess = (index: number, field: "title" | "body", value: string) => {
    if (!currentProgramme) return;
    const process = [...(currentProgramme.process || [])];
    process[index] = { ...process[index], [field]: value };
    updateCurrentProgrammeField("process", process);
  };

  // Stats Handlers
  const handleUpdateStat = (index: number, field: "value" | "label", value: string) => {
    if (!currentProgramme) return;
    const stats = [...(currentProgramme.stats || [])];
    stats[index] = { ...stats[index], [field]: value };
    updateCurrentProgrammeField("stats", stats);
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
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const slug = `civic-campaign-${randomSuffix}`;
    const newPage = {
      slug,
      title: "New Civic Initiative Page",
      seoDescription: "An evidence-based civic brief tracking public expenditures and devolution milestones.",
      eyebrow: "Civic Initiative · BNS Special",
      headline: "Empowering Citizen Scrutiny & Public Accountability",
      body: "An independent analysis exploring budgetary efficiency, county spending patterns, and civic monitoring baselines across Kenya.",
      content: "Public participation thrives when citizens have direct access to clear, uncompromised financial data.\n\nThis initiative bridges grassroots investigative reporting with fiscal data to ensure every shilling allocated to public interest projects is accounted for.",
      ctaLabel: "Download Policy Brief",
      ctaHref: "/contact?intent=partner",
      secondaryLabel: "Explore All Programmes",
      secondaryHref: "/programmes",
      stats: [
        { value: "47", label: "Counties Monitored" },
        { value: "100%", label: "Verified Data" },
        { value: "Quarterly", label: "Audit Reports" },
      ],
      published: false,
      createdAt: new Date().toISOString(),
    };
    const updatedPages = [...(customPagesData.pages || []), newPage];
    setCustomPagesData({ pages: updatedPages });
    setSelectedCustomPageSlug(slug);
    toast.success("Created new draft page! Edit below and save to drafts or publish live.");
  };

  
  const handleUpdateCustomPageWhole = (updatedPage: any) => {
    const pages = customPagesData.pages || [];
    const updated = pages.map((p: any) => {
      if (p.slug === updatedPage.slug || (selectedCustomPageSlug && p.slug === selectedCustomPageSlug)) {
        return updatedPage;
      }
      return p;
    });
    setCustomPagesData({ pages: updated });
    if (updatedPage.slug && updatedPage.slug !== selectedCustomPageSlug) {
      setSelectedCustomPageSlug(updatedPage.slug);
    }
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
  
  // Hero Carousel Stills Handlers
  const heroStills = (landingData.heroReelStills as any[]) || [];

  const handleMoveCarouselStill = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= heroStills.length) return;
    const updated = [...heroStills];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setLandingData({ ...landingData, heroReelStills: updated });
    toast.success(`Reordered slide to position #${targetIndex + 1}`);
  };

  const handleDeleteCarouselStill = (index: number) => {
    if (heroStills.length <= 1) {
      toast.error("At least one hero reel slide must remain.");
      return;
    }
    const updated = heroStills.filter((_, i) => i !== index);
    setLandingData({ ...landingData, heroReelStills: updated });
    toast.success("Removed slide from hero carousel.");
  };

  const handleUpdateCarouselStill = (index: number, field: string, value: any) => {
    const updated = heroStills.map((still, i) => (i === index ? { ...still, [field]: value } : still));
    setLandingData({ ...landingData, heroReelStills: updated });
  };

  const handleToggleCarouselStillVisibility = (index: number) => {
    const updated = heroStills.map((still, i) =>
      i === index ? { ...still, visible: still.visible === false ? true : false } : still
    );
    setLandingData({ ...landingData, heroReelStills: updated });
    toast.success(
      updated[index].visible === false
        ? "Slide hidden from landing carousel (retained safely in library)."
        : "Slide enabled in landing carousel!"
    );
  };

  const updateLandingProgrammeExplain = (index: number, field: string, value: any) => {
    const explains = (landingData.programmeExplains as any[]) || [];
    const updated = explains.map((exp: any, i: number) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    setLandingData({ ...landingData, programmeExplains: updated });
  };

  const handleAddCarouselStill = () => {
    const newSlide = {
      id: `slide-${Date.now()}`,
      src: "/images/media/129A4039.jpg",
      alt: "Budget Ndio Story civic engagement session",
      caption: "Civic Evidence · National",
      programme: "connect",
      storyTitle: "New Evidence Moment",
      storyLine: "Field capture documenting budget scrutiny and public participation.",
    };
    const updated = [...heroStills, newSlide];
    setLandingData({ ...landingData, heroReelStills: updated });
    toast.success("Added new slide to hero carousel. Reorder and edit below.");
  };

  // Reorder Featured Story
  const handleMoveFeaturedStory = (index: number, direction: "up" | "down") => {
    const results = featuredData.results || [];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= results.length) return;
    const updated = [...results];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFeaturedData({ ...featuredData, results: updated });
    toast.success(`Reordered story to position #${targetIndex + 1}`);
  };

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
      href: `/bns-project/${id}`,
      isProject: true,
      useYoutubeThumbnail: true,
      hostInstitution: "House of Fiscal Wisdom",
      funder: "Supported by Consortium Partners",
      wysiwygProse: `## Executive Overview\nForensic policy analysis and empirical revenue tracking produced by Budget Ndio Story.\n\n### 1. Statutory Framework & Fiscal Background\nEvaluating revenue allocations against the Public Finance Management (PFM) Act.\n\n- Primary expenditure ceilings and statutory compliance\n- Sub-national devolution shares and disbursement pacing\n\n### 2. Civic Impact & Monograph Evidence\nField testimonies and investigative datasets documenting public resource governance.`,
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

  const handleDeleteFeaturedStory = async (id: string) => {
    const results = featuredData.results || [];
    if (results.length <= 1) {
      toast.error("At least one featured story must remain.");
      return;
    }
    const updated = results.filter((s) => s.id !== id);
    const updatedFeatured = {
      ...featuredData,
      count: updated.length,
      results: updated,
    };
    setFeaturedData(updatedFeatured);
    if (selectedFeaturedId === id) {
      setSelectedFeaturedId(updated[0]?.id || "");
    }
    try {
      const res = await fetch("/api/cms/featured-projects/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: updatedFeatured, editorEmail: MASTER_CMS_EMAIL }),
      });
      if (res.ok) {
        toast.success("Deleted featured story and permanently saved to disk.");
      } else {
        toast.success("Deleted from view. Click 'Save All Changes' to persist.");
      }
    } catch {
      toast.success("Deleted from view. Click 'Save All Changes' to persist.");
    }
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
  const [isSyncingRss, setIsSyncingRss] = useState(false);
  const handleSyncYoutubeRss = async () => {
    setIsSyncingRss(true);
    try {
      const res = await fetch("/api/youtube/sync", { method: "POST" });
      const json = await res.json();
      if (json.success && Array.isArray(json.results)) {
        setFeaturedData({
          ...featuredData,
          count: json.results.length,
          results: json.results,
        });
        toast.success("Successfully synced YouTube products!", {
          description: `Curated ${json.results.length} flagship products without duplicate multi-part episodes.`,
        });
      } else {
        throw new Error(json.error || "Failed to sync RSS");
      }
    } catch (err: any) {
      toast.error(err.message || "YouTube sync failed");
    } finally {
      setIsSyncingRss(false);
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const collectionsToSave: { slug: string; data: Record<string, any> }[] = [
        { slug: "landing", data: landingData },
        { slug: "programmes", data: programmesData },
        { slug: "partner-page-sections", data: sectionsData },
        { slug: "about", data: aboutData },
        { slug: "custom-pages", data: customPagesData },
        { slug: "featured-projects", data: featuredData },
        { slug: "navigation", data: navigationData },
        { slug: "design-tokens", data: designTokensData },
        { slug: "civic-modules", data: coursesData },
        { slug: "contact", data: contactData },
        { slug: "faq", data: faqData },
        { slug: "stories", data: storiesData },
        { slug: "impact", data: impactData },
        { slug: "consortium", data: consortiumData },
        { slug: "careers", data: careersData },
        { slug: "legal", data: legalData },
        { slug: "team-initiatives", data: teamInitiativesData },
        { slug: "landing-hero", data: landingHeroData },
        { slug: "landing-sections", data: landingSectionsData },
        { slug: "programme-reels", data: programmeReelsData },
        { slug: "studios-evidence", data: studiosEvidenceData },
        { slug: "bns-studio", data: bnsStudioData },
      ];

      const saveResults = await Promise.all(
        collectionsToSave.map(async ({ slug, data }) => {
          try {
            const res = await fetch(`/api/cms/${slug}/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ data, editorEmail: MASTER_CMS_EMAIL }),
            });
            const json = await res.json().catch(() => ({}));
            return { slug, ok: res.ok, status: res.status, json };
          } catch (fetchErr: any) {
            return { slug, ok: false, status: 0, json: { error: fetchErr.message || "Network error" } };
          }
        })
      );

      const failed = saveResults.filter((r) => !r.ok);
      const succeeded = saveResults.filter((r) => r.ok);

      if (failed.length === 0) {
        setLastSaved(new Date().toLocaleTimeString());
        setPreviewRefreshKey((k) => k + 1);
        const hadR2Failure = succeeded.some((s) => s.json?.r2Persisted === false);
        toast.success(`Successfully saved and published live!`, {
          description: hadR2Failure
            ? `Saved ${succeeded.length} collections to repository disk. Note: Cloudflare R2 backup skipped (credentials unauthorized).`
            : `Updated all ${succeeded.length} CMS collections persistently to disk and edge storage.`,
        });
      } else {
        const errorDetails = failed.map((f) => {
          let detail = f.json.error || `HTTP ${f.status}`;
          if (Array.isArray(f.json.validationFailures) && f.json.validationFailures.length > 0) {
            const rules = f.json.validationFailures.map((v: any) => `${v.rule}: ${v.message}`).join("; ");
            detail += ` (${rules})`;
          } else if (Array.isArray(f.json.lockedPaths) && f.json.lockedPaths.length > 0) {
            detail += ` (Locked paths: ${f.json.lockedPaths.join(", ")})`;
          }
          return `${f.slug}: ${detail}`;
        });

        const fullErrorMsg = `Failed to save ${failed.length} of ${saveResults.length} collections:\n• ${errorDetails.join("\n• ")}`;
        toast.error(`Save failed for ${failed.length} collection(s)`, {
          description: errorDetails.slice(0, 2).join(" | "),
        });
        throw new Error(fullErrorMsg);
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

  const activePreviewRoute = useMemo(() => {
    if (selectedPageKey === "custom-pages") {
      return selectedCustomPage?.slug ? `/pages/${selectedCustomPage.slug}?preview=true` : "/pages";
    }
    if (selectedPageKey === "featured-blogs") {
      return "/#featured-projects";
    }
    if (selectedPageKey === "contact") {
      return "/contact";
    }
    return currentPage.route;
  }, [selectedPageKey, selectedCustomPage, currentPage]);

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
              <Badge variant="outline" className="text-[10px] px-2 py-0.5 font-medium text-emerald-600 bg-emerald-500/10 border-emerald-500/20">
                ● Production Live Mode
              </Badge>
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
            {/* View Layout Switcher (Split View vs Editor Only vs Live Preview) */}
            <div className="flex items-center rounded-xl bg-muted/70 p-0.5 border border-border/80 shadow-xs mr-1">
              <button
                type="button"
                onClick={() => setViewMode("split")}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "split"
                    ? "bg-background text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Side-by-side: Editor & Live Page Preview"
              >
                <Columns className="size-3.5" />
                <span className="hidden sm:inline">Split View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("editor")}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "editor"
                    ? "bg-background text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Focus on Content Editor Only"
              >
                <FileText className="size-3.5" />
                <span className="hidden sm:inline">Editor Only</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("preview")}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "preview"
                    ? "bg-background text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Full Live Interactive Preview"
              >
                <Eye className="size-3.5" />
                <span className="hidden sm:inline">Live Preview</span>
              </button>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setActiveImagePicker({
                  isOpen: true,
                  title: "Cloudflare R2 Media Bucket Explorer",
                  currentUrl: "",
                  onSelect: (url) => {
                    if (typeof navigator !== "undefined" && navigator.clipboard) {
                      navigator.clipboard.writeText(url);
                      toast.success("Copied R2 image URL to clipboard!", { description: url });
                    }
                  },
                })
              }
              className="gap-1.5 text-xs font-semibold bg-primary/5 hover:bg-primary/10 text-foreground"
            >
              <ImageIcon className="size-3.5 text-primary" />
              <span>Media Bucket</span>
            </Button>
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
              <span>Save &amp; Publish Changes</span>
            </Button>
          </div>
        </div>

        {/* Page Selector Tabs & Category Navigation */}
        <div className="mt-5 space-y-3 border-t border-border/50 pt-4">
          {/* Category Filter Pills, Search Bar, & Switchboard Button */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "all", label: "All Collections", count: categoryCounts.all, icon: "✦" },
                { id: "pages", label: "Core Pages", count: categoryCounts.pages, icon: "📄" },
                { id: "programmes", label: "Civic Programmes", count: categoryCounts.programmes, icon: "🏛️" },
                { id: "projects", label: "Projects & Media", count: categoryCounts.projects, icon: "📂" },
                { id: "system", label: "Design & Global", count: categoryCounts.system, icon: "⚙️" },
              ].map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-xs font-bold"
                        : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                        isActive
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-background text-muted-foreground"
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input & Switchboard Toggle */}
            <div className="flex items-center gap-2">
              <div className="relative min-w-[200px] flex-1 sm:w-64">
                <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={pageSearchQuery}
                  onChange={(e) => setPageSearchQuery(e.target.value)}
                  placeholder="Filter pages by name, route..."
                  className="h-8 pl-8 text-xs"
                />
                {pageSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setPageSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                )}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSectionSwitchboard((prev) => !prev)}
                className={`h-8 gap-1.5 text-xs font-semibold transition-all ${
                  showSectionSwitchboard
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-muted/40 hover:bg-muted text-foreground"
                }`}
                title="Open Global Section Visibility Switchboard"
              >
                <SlidersHorizontal className="size-3.5 text-primary" />
                <span>Section Switchboard</span>
                {(areAllPartnersMuted || areAllReelsMuted) && (
                  <span className="flex h-2 w-2 rounded-full bg-amber-500" title="Mute filters active" />
                )}
                {showSectionSwitchboard ? (
                  <ChevronUp className="size-3 text-muted-foreground" />
                ) : (
                  <ChevronDown className="size-3 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          {/* Expandable Section Switchboard Drawer */}
          {showSectionSwitchboard && (
            <div className="rounded-xl border border-primary/20 bg-primary/[0.03] p-4 space-y-4 shadow-xs">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                      <SlidersHorizontal className="size-3.5 text-primary" />
                      Global Section Visibility Switchboard
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono text-primary bg-primary/5">
                      Live Controls
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Instantly toggle visibility for any section across any page. Changes persist on &ldquo;Save &amp; Publish&rdquo;.
                  </p>
                </div>

                <div className="relative w-full sm:w-56">
                  <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={sectionSearchQuery}
                    onChange={(e) => setSectionSearchQuery(e.target.value)}
                    placeholder="Search sections (e.g. reels, partners)..."
                    className="h-7 pl-8 text-xs bg-background"
                  />
                </div>
              </div>

              {/* Quick Mute Action Cards */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Partner Assets Quick Mute Card */}
                <div className="rounded-lg border border-border bg-card p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="size-3.5 text-primary" />
                      <span className="text-xs font-semibold text-foreground">Partner Assets &amp; Marquee</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        areAllPartnersMuted
                          ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                          : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      }`}
                    >
                      {areAllPartnersMuted ? "Muted Everywhere" : "Active on Site"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Controls partner logos marquee on Homepage (<code className="font-mono text-[10px]">home.partners</code>) and Programmes Hub (<code className="font-mono text-[10px]">programmes.partners</code>).
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      type="button"
                      size="sm"
                      variant={areAllPartnersMuted ? "default" : "outline"}
                      onClick={() => toggleAllPartnerAssets(areAllPartnersMuted)}
                      className="h-7 text-xs font-semibold gap-1.5"
                    >
                      {areAllPartnersMuted ? (
                        <>
                          <Volume2 className="size-3" />
                          <span>Enable Partner Assets</span>
                        </>
                      ) : (
                        <>
                          <VolumeX className="size-3 text-rose-500" />
                          <span>Mute Partner Assets Everywhere</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Social Video Reels Quick Mute Card */}
                <div className="rounded-lg border border-border bg-card p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Film className="size-3.5 text-primary" />
                      <span className="text-xs font-semibold text-foreground">Social Video Reels</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        areAllReelsMuted
                          ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                          : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      }`}
                    >
                      {areAllReelsMuted ? "Muted Everywhere" : "Active on Site"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Controls TikTok-style vertical reels across BNS Connect, Mashinani, Wanahabari Lab, and Studio Screening Reel.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      type="button"
                      size="sm"
                      variant={areAllReelsMuted ? "default" : "outline"}
                      onClick={() => toggleAllSocialReels(areAllReelsMuted)}
                      className="h-7 text-xs font-semibold gap-1.5"
                    >
                      {areAllReelsMuted ? (
                        <>
                          <Volume2 className="size-3" />
                          <span>Enable All Social Reels</span>
                        </>
                      ) : (
                        <>
                          <VolumeX className="size-3 text-rose-500" />
                          <span>Mute All Social Reels</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Individual Section Toggles by Page */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Individual Section Toggles by Page
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 max-h-56 overflow-y-auto pr-1">
                  {Object.entries(sectionsData.pages || {}).flatMap(([pageId, pData]: [string, any]) => {
                    const sections = pData?.sections || [];
                    return sections
                      .filter((s: any) => {
                        const q = sectionSearchQuery.toLowerCase().trim();
                        if (!q) return true;
                        return (
                          s.id?.toLowerCase().includes(q) ||
                          s.label?.toLowerCase().includes(q) ||
                          pageId.toLowerCase().includes(q)
                        );
                      })
                      .map((sec: any) => {
                        const isVisible = sec.visible !== false;
                        return (
                          <div
                            key={`${pageId}-${sec.id}`}
                            className="flex items-center justify-between rounded-md border border-border/70 bg-card px-2.5 py-1.5 text-xs shadow-2xs"
                          >
                            <div className="min-w-0 pr-2">
                              <div className="flex items-center gap-1 font-semibold truncate text-[11px] text-foreground">
                                <span className="truncate">{sec.label || sec.id}</span>
                              </div>
                              <div className="font-mono text-[9px] text-muted-foreground truncate">
                                {pageId} · <span className="text-primary">{sec.id}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleSectionForPage(pageId, sec.id)}
                              className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-semibold transition-all ${
                                isVisible
                                  ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                                  : "bg-muted text-muted-foreground hover:bg-muted/80 line-through"
                              }`}
                            >
                              {isVisible ? "Visible" : "Muted"}
                            </button>
                          </div>
                        );
                      });
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Categorized Page Grid */}
          <div className="flex flex-wrap gap-2 pt-1">
            {filteredPages.map((page) => {
              const isSelected = selectedPageKey === page.key;
              return (
                <button
                  key={page.key}
                  type="button"
                  onClick={() => setSelectedPageKey(page.key)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
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

            {filteredPages.length === 0 && (
              <div className="flex w-full items-center justify-between rounded-lg border border-dashed border-border p-4 text-xs text-muted-foreground">
                <span>No CMS collections match &ldquo;{pageSearchQuery}&rdquo;</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPageSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="h-7 text-xs"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Editor & Live Preview Workspace */}
      {viewMode === "preview" ? (
        <div className="w-full">
          <LivePagePreview
            url={activePreviewRoute}
            pageTitle={currentPage.label}
            refreshKey={previewRefreshKey}
            onRefresh={() => setPreviewRefreshKey((k) => k + 1)}
            device={previewDevice}
            onDeviceChange={setPreviewDevice}
            fullHeight
          />
        </div>
      ) : (
        <div className={viewMode === "split" ? "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" : "w-full"}>
          <div className={viewMode === "split" ? "lg:col-span-7 xl:col-span-7 space-y-6" : "w-full space-y-6"}>
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
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={handleSyncYoutubeRss}
                    disabled={isSyncingRss}
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs font-semibold bg-primary/5 hover:bg-primary/10 border-primary/30 text-foreground"
                    title="Automate & Curate flagship products from YouTube RSS (never duplicates parts)"
                  >
                    <RefreshCw className={`size-3.5 text-primary ${isSyncingRss ? "animate-spin" : ""}`} />
                    <span>Sync YouTube RSS</span>
                  </Button>
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
              </div>

              <div className="space-y-2">
                {(featuredData.results || []).map((story: any, idx: number) => {
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
                          <div className="flex items-center gap-1.5">
                            <span className="rounded bg-primary/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-primary uppercase">
                              {story.programmeLabel || story.programmeSlug}
                            </span>
                            <span className="font-mono text-[9px] text-muted-foreground">
                              #{idx + 1}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-[9px] px-1.5 py-0 h-4 font-mono font-semibold ${
                                story.visible === false
                                  ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                                  : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              }`}
                            >
                              {story.visible === false ? "Hidden" : "Visible"}
                            </Badge>
                          </div>
                          <h3 className="line-clamp-2 text-xs font-bold text-foreground">
                            {story.title}
                          </h3>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span>{story.authorName}</span>
                            {story.videoId && <span>• ID: {story.videoId}</span>}
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateFeaturedStory(
                                  story.id,
                                  "visible",
                                  story.visible === false ? true : false,
                                );
                              }}
                              className={`h-5 w-5 p-0 ${
                                story.visible === false
                                  ? "text-rose-500 hover:text-rose-600"
                                  : "text-emerald-600 hover:text-emerald-700"
                              }`}
                              title={story.visible === false ? "Show story on site" : "Hide story from site"}
                            >
                              {story.visible === false ? (
                                <EyeOff className="size-3" />
                              ) : (
                                <Eye className="size-3" />
                              )}
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={idx === 0}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveFeaturedStory(idx, "up");
                              }}
                              className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30"
                              title="Move Up in sequence"
                            >
                              <ArrowUp className="size-3" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={idx === (featuredData.results || []).length - 1}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveFeaturedStory(idx, "down");
                              }}
                              className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30"
                              title="Move Down in sequence"
                            >
                              <ArrowDown className="size-3" />
                            </Button>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFeaturedStory(story.id);
                            }}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-rose-500"
                            title="Delete story"
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
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
                      Stories publish directly to the live homepage, hub, and video carousels.
                    </p>
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">
                    id: {selectedFeaturedStory.id}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {/* Story Visibility Card */}
                  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-3">
                    <div className="space-y-0.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        {selectedFeaturedStory.visible === false ? (
                          <EyeOff className="size-3.5 text-rose-500" />
                        ) : (
                          <Eye className="size-3.5 text-emerald-600" />
                        )}
                        <span>Story Visibility on Live Site</span>
                      </label>
                      <p className="text-[11px] text-muted-foreground">
                        {selectedFeaturedStory.visible === false
                          ? "Currently hidden from the homepage and featured sections."
                          : "Currently visible on the live homepage and featured sections."}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant={selectedFeaturedStory.visible === false ? "outline" : "default"}
                      className="h-7 text-xs font-semibold gap-1.5"
                      onClick={() =>
                        handleUpdateFeaturedStory(
                          selectedFeaturedStory.id,
                          "visible",
                          selectedFeaturedStory.visible === false ? true : false,
                        )
                      }
                    >
                      {selectedFeaturedStory.visible === false ? (
                        <>
                          <EyeOff className="size-3.5 text-rose-500" />
                          <span>Hidden</span>
                        </>
                      ) : (
                        <>
                          <Eye className="size-3.5" />
                          <span>Visible</span>
                        </>
                      )}
                    </Button>
                  </div>

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
                    <label className="text-xs font-semibold text-foreground">Subtitle (optional)</label>
                    <Input
                      value={selectedFeaturedStory.subtitle ?? ""}
                      onChange={(e) =>
                        handleUpdateFeaturedStory(selectedFeaturedStory.id, "subtitle", e.target.value)
                      }
                      className="mt-1 h-8 text-xs"
                      placeholder="Short supporting line under the title"
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

                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      CTA button label (e.g. Open project)
                    </label>
                    <Input
                      value={selectedFeaturedStory.ctaLabel ?? ""}
                      onChange={(e) =>
                        handleUpdateFeaturedStory(selectedFeaturedStory.id, "ctaLabel", e.target.value)
                      }
                      className="mt-1 h-8 text-xs font-semibold"
                      placeholder="Leave blank to use landing default (Open project)"
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

                  {/* Media Type & Non-YouTube Sources */}
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Media Source
                      </h3>
                      <span className="rounded bg-muted px-2 py-0.5 font-mono text-[9px] text-muted-foreground">
                        {selectedFeaturedStory.mediaType || "youtube"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-[11px] font-semibold text-foreground">Media Type</label>
                        <select
                          value={selectedFeaturedStory.mediaType ?? "youtube"}
                          onChange={(e) => handleUpdateFeaturedStory(selectedFeaturedStory.id, "mediaType", e.target.value)}
                          className="mt-1 h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                        >
                          <option value="youtube">YouTube</option>
                          <option value="vimeo">Vimeo</option>
                          <option value="reel">Reel (MP4 vertical)</option>
                          <option value="audio">Audio (Spotify etc.)</option>
                          <option value="image">Image only</option>
                          <option value="animation">Animation</option>
                          <option value="none">No media</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-foreground">Media Caption (below hero)</label>
                        <Input
                          value={selectedFeaturedStory.mediaCaption ?? ""}
                          onChange={(e) => handleUpdateFeaturedStory(selectedFeaturedStory.id, "mediaCaption", e.target.value)}
                          className="mt-1 h-8 text-xs"
                          placeholder="Optional caption shown below the hero media"
                        />
                      </div>
                    </div>

                    {(selectedFeaturedStory.mediaType === "reel" || !selectedFeaturedStory.mediaType || selectedFeaturedStory.mediaType === "youtube") && (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="text-[11px] font-semibold text-foreground">Reel MP4 URL (for reel type)</label>
                          <Input
                            value={selectedFeaturedStory.reelUrl ?? ""}
                            onChange={(e) => handleUpdateFeaturedStory(selectedFeaturedStory.id, "reelUrl", e.target.value)}
                            className="mt-1 h-8 text-xs font-mono"
                            placeholder="https://pub-...r2.dev/video.mp4"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-foreground">Audio Embed URL (for audio type)</label>
                          <Input
                            value={selectedFeaturedStory.audioUrl ?? ""}
                            onChange={(e) => handleUpdateFeaturedStory(selectedFeaturedStory.id, "audioUrl", e.target.value)}
                            className="mt-1 h-8 text-xs font-mono"
                            placeholder="https://open.spotify.com/..."
                          />
                        </div>
                      </div>
                    )}

                    <label className="flex items-center gap-2 text-[11px] font-semibold text-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFeaturedStory.hideCaptions ?? false}
                        onChange={(e) => handleUpdateFeaturedStory(selectedFeaturedStory.id, "hideCaptions", e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-input"
                      />
                      Hide caption / helper texts on this project page
                    </label>
                  </div>

                  {/* Gallery */}
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Project Gallery ({(selectedFeaturedStory.gallery || []).length} images)
                      </h3>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="gap-1 text-xs"
                        onClick={() => {
                          const current = selectedFeaturedStory.gallery || [];
                          handleUpdateFeaturedStory(selectedFeaturedStory.id, "gallery", [
                            ...current,
                            { url: "", caption: "", alt: "" },
                          ]);
                        }}
                      >
                        <Plus className="size-3" />
                        Add Image
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Collection of pictures shown before the commissions/outputs section. Leave URL empty to remove.
                    </p>
                    {(selectedFeaturedStory.gallery || []).length > 0 && (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {(selectedFeaturedStory.gallery || []).map((img: any, idx: number) => (
                          <div key={idx} className="rounded-lg border border-border/40 bg-background p-2 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[9px] text-muted-foreground">#{idx + 1}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 p-0 text-muted-foreground hover:text-rose-500"
                                onClick={() => {
                                  const updated = (selectedFeaturedStory.gallery || []).filter((_: any, i: number) => i !== idx);
                                  handleUpdateFeaturedStory(selectedFeaturedStory.id, "gallery", updated);
                                }}
                              >
                                <Trash2 className="size-3" />
                              </Button>
                            </div>
                            <Input
                              value={img.url ?? ""}
                              onChange={(e) => {
                                const updated = [...(selectedFeaturedStory.gallery || [])];
                                updated[idx] = { ...updated[idx], url: e.target.value };
                                handleUpdateFeaturedStory(selectedFeaturedStory.id, "gallery", updated);
                              }}
                              className="h-7 text-[10px] font-mono"
                              placeholder="Image URL (R2 or external)"
                            />
                            <Input
                              value={img.caption ?? ""}
                              onChange={(e) => {
                                const updated = [...(selectedFeaturedStory.gallery || [])];
                                updated[idx] = { ...updated[idx], caption: e.target.value };
                                handleUpdateFeaturedStory(selectedFeaturedStory.id, "gallery", updated);
                              }}
                              className="h-7 text-[10px]"
                              placeholder="Caption (optional)"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <ImageFieldControl
                        label="Thumbnail Image (Cloudflare R2)"
                        value={selectedFeaturedStory.thumbnail ?? ""}
                        onChange={(url) => handleUpdateFeaturedStory(selectedFeaturedStory.id, "thumbnail", url)}
                        onOpenBucket={() => {
                          setActiveImagePicker({
                            isOpen: true,
                            title: `Thumbnail for "${selectedFeaturedStory.title || "Story"}"`,
                            currentUrl: selectedFeaturedStory.thumbnail,
                            onSelect: (url) => handleUpdateFeaturedStory(selectedFeaturedStory.id, "thumbnail", url),
                          });
                        }}
                        description="Select an existing image from Cloudflare R2 or upload directly."
                      />
                      <ImageFieldControl
                        label="Mobile thumbnail (hide wide 1280px thumbs on phones)"
                        value={selectedFeaturedStory.thumbnailMobile ?? ""}
                        onChange={(url) =>
                          handleUpdateFeaturedStory(selectedFeaturedStory.id, "thumbnailMobile", url)
                        }
                        onOpenBucket={() => {
                          setActiveImagePicker({
                            isOpen: true,
                            title: "Mobile story thumbnail",
                            currentUrl: selectedFeaturedStory.thumbnailMobile,
                            onSelect: (url) =>
                              handleUpdateFeaturedStory(selectedFeaturedStory.id, "thumbnailMobile", url),
                          });
                        }}
                        description="Portrait or square crop for mobile cards."
                      />
                      <label className="mt-2 flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!selectedFeaturedStory.hideDesktopThumbOnMobile}
                          onChange={(e) =>
                            handleUpdateFeaturedStory(
                              selectedFeaturedStory.id,
                              "hideDesktopThumbOnMobile",
                              e.target.checked,
                            )
                          }
                          className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
                        />
                        <span>Hide desktop thumbnail on mobile when mobile thumb is set</span>
                      </label>
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

                  
                  {/* Project Promotion & Target Link */}
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                          <Sparkles className="size-3.5 text-primary" />
                          <span>Promote Story as Project Dossier</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Generates a live dedicated project page at <code className="font-mono text-primary">/bns-project/{selectedFeaturedStory.id}</code> with full WYSIWYG evidence and media.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFeaturedStory.isProject ?? true}
                          onChange={(e) => {
                            const isProj = e.target.checked;
                            handleUpdateFeaturedStory(selectedFeaturedStory.id, "isProject", isProj);
                            if (isProj) {
                              handleUpdateFeaturedStory(
                                selectedFeaturedStory.id,
                                "href",
                                `/bns-project/${selectedFeaturedStory.slug || selectedFeaturedStory.id}`
                              );
                            }
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2 border-t border-primary/10">
                      <div>
                        <label className="text-[11px] font-semibold text-foreground">Host Institution</label>
                        <Input
                          value={selectedFeaturedStory.hostInstitution ?? "House of Fiscal Wisdom"}
                          onChange={(e) => handleUpdateFeaturedStory(selectedFeaturedStory.id, "hostInstitution", e.target.value)}
                          className="mt-1 h-7 text-xs"
                          placeholder="e.g. House of Fiscal Wisdom"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-foreground">Funder / Partners</label>
                        <Input
                          value={selectedFeaturedStory.funder ?? "Supported by Consortium Partners"}
                          onChange={(e) => handleUpdateFeaturedStory(selectedFeaturedStory.id, "funder", e.target.value)}
                          className="mt-1 h-7 text-xs"
                          placeholder="e.g. Supported by Luminate"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-muted-foreground">Target Route:</span>
                      <a
                        href={selectedFeaturedStory.href || `/bns-project/${selectedFeaturedStory.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-primary hover:underline text-[11px]"
                      >
                        <span>{selectedFeaturedStory.href || `/bns-project/${selectedFeaturedStory.id}`}</span>
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                  </div>

                  {/* Media Settings: YouTube Thumbnail Toggle */}
                  <div className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/20 px-4 py-3">
                    <div className="space-y-0.5">
                      <label className="text-xs font-semibold text-foreground">
                        Use YouTube Thumbnail with Multi-Layer Fallback
                      </label>
                      <p className="text-[11px] text-muted-foreground">
                        Automatically loads maxres/hqdefault thumbnail with fallback to custom R2 poster so visuals are never blank.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFeaturedStory.useYoutubeThumbnail ?? true}
                        onChange={(e) => handleUpdateFeaturedStory(selectedFeaturedStory.id, "useYoutubeThumbnail", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  {/* Full WYSIWYG Prose Editor */}
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-bold text-foreground">
                          Full Project / Blog Dossier (WYSIWYG Editorial Copy)
                        </label>
                        <p className="text-[11px] text-muted-foreground">
                          Rich formatting, headings, blockquotes, lists, links, and Cloudflare R2 media embeds rendered on the live project page.
                        </p>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {(selectedFeaturedStory.wysiwygProse || "").length} characters
                      </Badge>
                    </div>
                    <WysiwygProseEditor
                      value={selectedFeaturedStory.wysiwygProse ?? ""}
                      onChange={(val) => handleUpdateFeaturedStory(selectedFeaturedStory.id, "wysiwygProse", val)}
                      placeholder="Write comprehensive investigation findings, methodology, fiscal data tables, or embed Cloudflare R2 / YouTube media..."
                    />
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
                            {page.published !== false ? (
                              <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                                LIVE
                              </span>
                            ) : (
                              <span className="rounded bg-amber-500/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-amber-600 dark:text-amber-400">
                                DRAFT
                              </span>
                            )}
                            <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[140px]">
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
              <CustomPageStudioEditor
                page={selectedCustomPage}
                onChange={handleUpdateCustomPageWhole}
              />
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

      {/* SPECIAL DESK 4: NAVIGATION & FOOTER */}
      {selectedPageKey === "navigation" && (
        <NavigationStudioEditor
          data={navigationData}
          onChange={setNavigationData}
          onOpenMediaPicker={(onSelect) => {
            setActiveImagePicker({
              isOpen: true,
              title: "Select Brand Logo from R2 Bucket",
              currentUrl: navigationData.logo?.src,
              onSelect: (url) => {
                onSelect(url);
                setActiveImagePicker(null);
              },
            });
          }}
          onUploadToR2={handleFileUploadToR2}
        />
      )}

      {/* SPECIAL DESK 5: DESIGN TOKENS & BADGES */}
      {selectedPageKey === "tokens" && (
        <DesignTokensStudioEditor
          data={designTokensData}
          onChange={setDesignTokensData}
        />
      )}

      {/* SPECIAL DESK 6: LEARNING COURSES (BNSKE PROJECTS) */}
      {selectedPageKey === "courses" && (
        <CoursesStudioEditor
          data={coursesData}
          onChange={setCoursesData}
          onOpenMediaPicker={(onSelect) => {
            setActiveImagePicker({
              isOpen: true,
              title: "Select Course Cover Image from R2 Bucket",
              currentUrl: "",
              onSelect: (url) => {
                onSelect(url);
                setActiveImagePicker(null);
              },
            });
          }}
          onUploadToR2={handleFileUploadToR2}
        />
      )}

      {/* SPECIAL DESK 7: CONTACT PAGE */}
      {selectedPageKey === "contact" && (
        <ContactStudioEditor
          data={contactData}
          onChange={setContactData}
        />
      )}

      {/* SPECIAL DESK 8: BNS STUDIO LANDING (type-aware media editor) */}
      {selectedPageKey === "bns-studio" && (
        <BnsStudioSectionsEditor
          data={bnsStudioData}
          onChange={setBnsStudioData}
          onOpenMediaPicker={(onSelect, title, currentUrl) => {
            setActiveImagePicker({
              isOpen: true,
              title: title || "Select media from R2 Bucket",
              currentUrl: currentUrl || "",
              onSelect: (url) => {
                onSelect(url);
                setActiveImagePicker(null);
              },
            });
          }}
          visibilityRows={
            (sectionsData?.pages?.studio?.sections as Array<{
              id: string;
              label?: string;
              visible?: boolean;
            }>) || []
          }
          onToggleVisibility={(sectionId) => {
            const pageId = "studio";
            const page = sectionsData?.pages?.[pageId] || {};
            const list = Array.isArray(page.sections) ? [...page.sections] : [];
            const idx = list.findIndex(
              (sec: { id: string }) => sec.id === sectionId,
            );
            if (idx >= 0) {
              const current = list[idx] as { id: string; visible?: boolean };
              list[idx] = { ...current, visible: !current.visible };
            } else {
              list.push({
                id: sectionId,
                label: sectionId,
                visible: true,
              });
            }
            setSectionsData({
              ...sectionsData,
              pages: {
                ...(sectionsData.pages || {}),
                [pageId]: {
                  ...page,
                  sections: list,
                },
              },
            });
          }}
        />
      )}

      {/* VISUAL EDITORS FOR SPECIFIC PAGES */}
      {selectedPageKey === "about" && (
        <AboutStudioEditor
          data={aboutData}
          onChange={setAboutData}
        />
      )}

      {selectedPageKey === "careers" && (
        <CareersStudioEditor
          data={careersData}
          onChange={setCareersData}
        />
      )}

      {selectedPageKey === "impact" && (
        <ImpactStudioEditor
          data={impactData}
          onChange={setImpactData}
        />
      )}

      {selectedPageKey === "stories" && (
        <StoriesStudioEditor
          data={storiesData}
          onChange={setStoriesData}
        />
      )}

      {selectedPageKey === "faq" && (
        <FaqStudioEditor
          data={faqData}
          onChange={setFaqData}
        />
      )}

      {/* ALL PROJECTS MASTER DATABASE (studios-evidence.json) */}
      {selectedPageKey === "studios-evidence" && (
        <AllProjectsStudioEditor
          data={studiosEvidenceData}
          onChange={setStudiosEvidenceData}
        />
      )}

      {/* GENERIC COLLECTION EDITORS (consortium, legal, team-initiatives, etc.) */}
      {isCollectionPageKey(selectedPageKey) && selectedPageKey !== "bns-studio" && selectedPageKey !== "careers" && selectedPageKey !== "impact" && selectedPageKey !== "stories" && selectedPageKey !== "faq" && selectedPageKey !== "studios-evidence" && (
        <CmsCollectionJsonEditor
          title={currentPage.label}
          description={`Edit live CMS collection \`${selectedPageKey}\`. Changes save to R2 and appear on marketing routes after revalidation.`}
          data={
            ({
              consortium: consortiumData,
              legal: legalData,
              "team-initiatives": teamInitiativesData,
              "landing-hero": landingHeroData,
              "landing-sections": landingSectionsData,
              "programme-reels": programmeReelsData,
            }[selectedPageKey] as Record<string, unknown>) || {}
          }
          onChange={(next) => {
            const setters: Record<string, (v: Record<string, unknown>) => void> = {
              consortium: setConsortiumData,
              legal: setLegalData,
              "team-initiatives": setTeamInitiativesData,
              "landing-hero": setLandingHeroData,
              "landing-sections": setLandingSectionsData,
              "programme-reels": setProgrammeReelsData,
            };
            setters[selectedPageKey]?.(next);
          }}
        />
      )}

      {/* STANDARD MULTI-TAB WORKSPACE (LANDING, PROGRAMMES, & PROGRAMME DETAIL PAGES) */}
      {selectedPageKey !== "featured-blogs" && selectedPageKey !== "custom-pages" && selectedPageKey !== "about" && selectedPageKey !== "navigation" && selectedPageKey !== "tokens" && selectedPageKey !== "courses" && selectedPageKey !== "contact" && selectedPageKey !== "bns-studio" && selectedPageKey !== "careers" && selectedPageKey !== "impact" && selectedPageKey !== "stories" && selectedPageKey !== "faq" && !isCollectionPageKey(selectedPageKey) && (
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

              {selectedPageKey === "landing" && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveTab("bets")}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      activeTab === "bets"
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Layers className="size-3.5" />
                    <span>Three Big Bets (Programmes)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("carousel")}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      activeTab === "carousel"
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <ImageIcon className="size-3.5" />
                    <span>Hero Reel Images</span>
                    <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                      {heroStills.filter((s: any) => s.visible !== false).length}/{heroStills.length}
                    </span>
                  </button>
                </>
              )}

              {selectedPageKey !== "landing" && selectedPageKey !== "programmes" && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveTab("media")}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      activeTab === "media"
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Film className="size-3.5" />
                    <span>Hero Media &amp; Videos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("mobile")}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      activeTab === "mobile"
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Smartphone className="size-3.5" />
                    <span>Mobile Design</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("theme")}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      activeTab === "theme"
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Palette className="size-3.5" />
                    <span>Colour Theme</span>
                  </button>

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
                </>
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

              {/* Loading / splash policy */}
              <div className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Loading &amp; splash
                  </h3>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Default is off — no fake BNS Studios reel, no global splash, no &ldquo;Loading content…&rdquo;.
                    Opt in only when you want branded chrome.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!sectionsData?.policy?.loadingDefaults?.globalSplash}
                      onChange={(e) => {
                        setSectionsData({
                          ...sectionsData,
                          policy: {
                            ...(sectionsData.policy || {}),
                            loadingDefaults: {
                              ...(sectionsData.policy?.loadingDefaults || {}),
                              globalSplash: e.target.checked,
                              globalSplashMinMs:
                                sectionsData.policy?.loadingDefaults?.globalSplashMinMs ?? 0,
                              routeLoadingDefault:
                                sectionsData.policy?.loadingDefaults?.routeLoadingDefault ?? false,
                              routeLoadingVariant:
                                sectionsData.policy?.loadingDefaults?.routeLoadingVariant ?? "none",
                            },
                          },
                        });
                      }}
                      className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
                    />
                    <span>Sitewide logo splash (first paint)</span>
                  </label>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      Splash min duration (ms)
                    </label>
                    <Input
                      type="number"
                      min={0}
                      step={100}
                      value={sectionsData?.policy?.loadingDefaults?.globalSplashMinMs ?? 0}
                      onChange={(e) => {
                        setSectionsData({
                          ...sectionsData,
                          policy: {
                            ...(sectionsData.policy || {}),
                            loadingDefaults: {
                              ...(sectionsData.policy?.loadingDefaults || {}),
                              globalSplash:
                                sectionsData.policy?.loadingDefaults?.globalSplash ?? false,
                              globalSplashMinMs: Number(e.target.value) || 0,
                              routeLoadingDefault:
                                sectionsData.policy?.loadingDefaults?.routeLoadingDefault ?? false,
                              routeLoadingVariant:
                                sectionsData.policy?.loadingDefaults?.routeLoadingVariant ?? "none",
                            },
                          },
                        });
                      }}
                      className="mt-0.5 h-8 text-xs font-mono"
                      disabled={!sectionsData?.policy?.loadingDefaults?.globalSplash}
                    />
                  </div>
                </div>

                <div className="border-t border-border/40 pt-3 space-y-3">
                  <p className="text-[11px] font-semibold text-foreground">
                    This page: {currentPage.label}
                  </p>
                  <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!pageSectionsConfig.loading?.enabled}
                      onChange={(e) => {
                        const pageId = currentPage.sectionPageId;
                        setSectionsData({
                          ...sectionsData,
                          pages: {
                            ...(sectionsData.pages || {}),
                            [pageId]: {
                              ...(sectionsData.pages?.[pageId] || {}),
                              loading: {
                                enabled: e.target.checked,
                                minMs: pageSectionsConfig.loading?.minMs ?? 0,
                                variant:
                                  pageSectionsConfig.loading?.variant ||
                                  (pageId === "studio" ? "studio-reel" : "none"),
                              },
                            },
                          },
                        });
                      }}
                      className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
                    />
                    <span>Show a loading page on this route</span>
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground">
                        Loading style
                      </label>
                      <select
                        value={pageSectionsConfig.loading?.variant ?? "none"}
                        onChange={(e) => {
                          const pageId = currentPage.sectionPageId;
                          setSectionsData({
                            ...sectionsData,
                            pages: {
                              ...(sectionsData.pages || {}),
                              [pageId]: {
                                ...(sectionsData.pages?.[pageId] || {}),
                                loading: {
                                  enabled: pageSectionsConfig.loading?.enabled ?? false,
                                  minMs: pageSectionsConfig.loading?.minMs ?? 0,
                                  variant: e.target.value,
                                },
                              },
                            },
                          });
                        }}
                        disabled={!pageSectionsConfig.loading?.enabled}
                        className="mt-0.5 flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                      >
                        <option value="none">None</option>
                        <option value="spinner">Spinner</option>
                        <option value="text">Text (&ldquo;Loading content…&rdquo;)</option>
                        <option value="studio-reel">BNS Studios reel shooter</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground">
                        Timer / min duration (ms)
                      </label>
                      <Input
                        type="number"
                        min={0}
                        step={100}
                        value={pageSectionsConfig.loading?.minMs ?? 0}
                        onChange={(e) => {
                          const pageId = currentPage.sectionPageId;
                          setSectionsData({
                            ...sectionsData,
                            pages: {
                              ...(sectionsData.pages || {}),
                              [pageId]: {
                                ...(sectionsData.pages?.[pageId] || {}),
                                loading: {
                                  enabled: pageSectionsConfig.loading?.enabled ?? false,
                                  variant: pageSectionsConfig.loading?.variant ?? "none",
                                  minMs: Number(e.target.value) || 0,
                                },
                              },
                            },
                          });
                        }}
                        disabled={!pageSectionsConfig.loading?.enabled}
                        className="mt-0.5 h-8 text-xs font-mono"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Tip: keep Learn, programmes, and Connect at enabled=false. Only turn on Studio reel if you want that cinematic intro back.
                  </p>
                </div>
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
                {(pageSectionsConfig.sections || []).map((sec: any, idx: number) => (
                  <div
                    key={sec.id}
                    className="p-3.5 transition-colors hover:bg-muted/40 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 font-mono text-[10px] font-bold text-primary">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-xs text-foreground">{sec.label}</span>
                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                          id: {sec.id}
                        </code>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Reorder Buttons */}
                        <div className="flex items-center rounded-lg border border-border/60 bg-background p-0.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={idx === 0}
                            onClick={() => handleMoveSection(idx, "up")}
                            className="h-6 px-1.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30"
                            title="Move section higher on page"
                          >
                            <ArrowUp className="size-3 mr-1" />
                            <span className="text-[10px] font-semibold">Up</span>
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={idx === (pageSectionsConfig.sections || []).length - 1}
                            onClick={() => handleMoveSection(idx, "down")}
                            className="h-6 px-1.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30"
                            title="Move section lower on page"
                          >
                            <ArrowDown className="size-3 mr-1" />
                            <span className="text-[10px] font-semibold">Down</span>
                          </Button>
                        </div>

                        {/* Visibility Toggle Switch */}
                        <button
                          type="button"
                          onClick={() => handleToggleSection(sec.id)}
                          className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            sec.visible ? "bg-emerald-600" : "bg-neutral-300 dark:bg-neutral-700"
                          }`}
                          title={sec.visible ? "Section is visible" : "Section is hidden"}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              sec.visible ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Section customization: Label Override & Background Theme */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-1 border-t border-border/30 text-xs">
                      <div className="sm:col-span-8 flex items-center gap-2">
                        <label className="text-[10px] font-semibold text-muted-foreground shrink-0">Section Label:</label>
                        <Input
                          value={sec.label ?? ""}
                          onChange={(e) => handleUpdateSectionProp(sec.id, "label", e.target.value)}
                          className="h-7 text-xs bg-background"
                          placeholder="Section Title / Heading"
                        />
                      </div>
                      <div className="sm:col-span-4 flex items-center gap-2">
                        <label className="text-[10px] font-semibold text-muted-foreground shrink-0">Theme:</label>
                        <select
                          value={sec.theme ?? "default"}
                          onChange={(e) => handleUpdateSectionProp(sec.id, "theme", e.target.value)}
                          className="h-7 w-full rounded-md border border-input bg-background px-2 text-xs text-foreground"
                        >
                          <option value="default">Default</option>
                          <option value="muted">Muted Tint</option>
                          <option value="card">Card Block</option>
                          <option value="contrast">High Contrast</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: HERO & HEADLINES */}
                    {/* HERO REEL & CAROUSEL STILLS MANAGER */}
          {activeTab === "carousel" && selectedPageKey === "landing" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                      <ImageIcon className="size-4 text-primary" />
                      <span>Landing Hero Reel &amp; Image Carousel ({heroStills.length} Slides)</span>
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[11px] font-mono border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                        {heroStills.filter((s: any) => s.visible !== false).length} Active on Homepage
                      </Badge>
                      {heroStills.filter((s: any) => s.visible === false).length > 0 && (
                        <Badge variant="outline" className="text-[11px] font-mono text-muted-foreground bg-muted/50">
                          {heroStills.filter((s: any) => s.visible === false).length} Hidden (Stored in Library)
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddCarouselStill}
                    size="sm"
                    className="gap-1.5 bg-primary text-primary-foreground text-xs font-bold"
                  >
                    <Plus className="size-3.5" />
                    <span>Add New Slide</span>
                  </Button>
                </div>

                <div className="space-y-4">
                  {heroStills.map((slide: any, idx: number) => (
                    <div
                      key={slide.id || idx}
                      className={`rounded-xl border p-4 space-y-4 transition-all shadow-xs ${
                        slide.visible !== false
                          ? "border-border/80 bg-muted/20 hover:border-primary/50"
                          : "border-border/50 bg-muted/10 opacity-75"
                      }`}
                    >
                      {/* Slide Top Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-primary/15 px-2 py-0.5 font-mono text-[11px] font-bold text-primary">
                            Slide #{idx + 1} of {heroStills.length}
                          </span>
                          <span className="font-heading text-xs font-bold text-foreground truncate max-w-xs">
                            {slide.storyTitle || "Untitled Slide"}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          {/* Visibility Toggle Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleCarouselStillVisibility(idx)}
                            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                              slide.visible !== false
                                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                                : "bg-muted text-muted-foreground border border-border"
                            }`}
                            title={
                              slide.visible !== false
                                ? "Click to hide from homepage reel (retains photo in R2 and library)"
                                : "Click to show on homepage reel"
                            }
                          >
                            {slide.visible !== false ? (
                              <>
                                <Eye className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span>Visible on Landing</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="size-3.5 text-muted-foreground" />
                                <span>Hidden from Landing</span>
                              </>
                            )}
                          </button>

                          {/* Reorder Buttons */}
                          <div className="flex items-center rounded-lg border border-border/60 bg-background p-0.5">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={idx === 0}
                              onClick={() => handleMoveCarouselStill(idx, "up")}
                              className="h-6 px-1.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30"
                              title="Move Slide Up (Earlier in sequence)"
                            >
                              <ArrowUp className="size-3 mr-1" />
                              <span className="text-[10px] font-semibold">Up</span>
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={idx === heroStills.length - 1}
                              onClick={() => handleMoveCarouselStill(idx, "down")}
                              className="h-6 px-1.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30"
                              title="Move Slide Down (Later in sequence)"
                            >
                              <ArrowDown className="size-3 mr-1" />
                              <span className="text-[10px] font-semibold">Down</span>
                            </Button>
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCarouselStill(idx)}
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-rose-500"
                            title="Delete this slide"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* Slide Content Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                        {/* Thumbnail & Image Bucket Control */}
                        <div className="md:col-span-5 space-y-2">
                          <ImageFieldControl
                            label={`Slide #${idx + 1} Image`}
                            value={slide.src ?? ""}
                            onChange={(url) => handleUpdateCarouselStill(idx, "src", url)}
                            onOpenBucket={() => {
                              setActiveImagePicker({
                                isOpen: true,
                                title: `Hero Reel Slide #${idx + 1}: "${slide.storyTitle || "Slide"}"`,
                                currentUrl: slide.src,
                                onSelect: (url) => handleUpdateCarouselStill(idx, "src", url),
                              });
                            }}
                            description="Select from R2 bucket, upload new, or remove."
                          />
                        </div>

                        {/* Editable Text Fields */}
                        <div className="md:col-span-7 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] font-semibold text-foreground">
                                Story Title (Moment Headline)
                              </label>
                              <Input
                                value={slide.storyTitle ?? ""}
                                onChange={(e) => handleUpdateCarouselStill(idx, "storyTitle", e.target.value)}
                                className="mt-1 h-8 text-xs font-semibold"
                                placeholder="e.g. Hall full of questions"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-semibold text-foreground">
                                Programme Tag
                              </label>
                              <select
                                value={slide.programme ?? "connect"}
                                onChange={(e) => handleUpdateCarouselStill(idx, "programme", e.target.value)}
                                className="mt-1 flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs text-foreground"
                              >
                                <option value="connect">Connect</option>
                                <option value="mashinani">Mashinani</option>
                                <option value="wanahabari-lab">Wanahabari Lab</option>
                                <option value="studios">BNS Studio</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-foreground">
                              Story Line (Observational Caption)
                            </label>
                            <Input
                              value={slide.storyLine ?? ""}
                              onChange={(e) => handleUpdateCarouselStill(idx, "storyLine", e.target.value)}
                              className="mt-1 h-8 text-xs"
                              placeholder="e.g. Desks filled, camera rolling — a May town hall listens from the back row."
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] font-semibold text-foreground">
                                Bottom Tag / Caption
                              </label>
                              <Input
                                value={slide.caption ?? ""}
                                onChange={(e) => handleUpdateCarouselStill(idx, "caption", e.target.value)}
                                className="mt-1 h-8 text-xs"
                                placeholder="e.g. Town hall · Mashinani"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-semibold text-foreground">
                                Image Alt Text
                              </label>
                              <Input
                                value={slide.alt ?? ""}
                                onChange={(e) => handleUpdateCarouselStill(idx, "alt", e.target.value)}
                                className="mt-1 h-8 text-xs"
                                placeholder="e.g. Photo from Eldoret town hall"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-center">
                  <Button
                    type="button"
                    onClick={handleAddCarouselStill}
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs font-semibold"
                  >
                    <Plus className="size-3.5" />
                    <span>Add Another Slide to Reel</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: THREE BIG BETS (PROGRAMMES) */}
          {activeTab === "bets" && selectedPageKey === "landing" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
                <div className="border-b border-border/50 pb-4">
                  <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Layers className="size-4 text-primary" />
                    <span>Three Big Bets (Programme Explains)</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Edit the three pillar programme narratives shown on the landing page (Connect, Mashinani, Wanahabari Lab).
                  </p>
                </div>

                <div className="space-y-5">
                  {((landingData.programmeExplains as any[]) || []).map((bet: any, idx: number) => (
                    <div
                      key={bet.slug || idx}
                      className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-border/40 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-primary/15 px-2 py-0.5 font-mono text-xs font-bold text-primary">
                            Bet {bet.number || `0${idx + 1}`}
                          </span>
                          <span className="font-heading text-xs font-bold text-foreground">
                            {bet.name || bet.slug}
                          </span>
                        </div>
                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                          slug: {bet.slug}
                        </code>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-foreground">Eyebrow</label>
                          <Input
                            value={bet.eyebrow ?? ""}
                            onChange={(e) => updateLandingProgrammeExplain(idx, "eyebrow", e.target.value)}
                            className="mt-1 h-8 text-xs font-medium"
                            placeholder="e.g. Connect"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-foreground">Programme Full Name</label>
                          <Input
                            value={bet.name ?? ""}
                            onChange={(e) => updateLandingProgrammeExplain(idx, "name", e.target.value)}
                            className="mt-1 h-8 text-xs font-medium"
                            placeholder="e.g. BNS Connect"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-foreground">
                          Headline / Title (Core Mandate Phrase)
                        </label>
                        <Input
                          value={bet.title ?? ""}
                          onChange={(e) => updateLandingProgrammeExplain(idx, "title", e.target.value)}
                          className="mt-1 h-8 text-xs font-semibold"
                          placeholder="e.g. National budget intelligence"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-foreground">
                          Lede (Plain Stakes Narrative)
                        </label>
                        <textarea
                          value={bet.lede ?? ""}
                          onChange={(e) => updateLandingProgrammeExplain(idx, "lede", e.target.value)}
                          rows={2}
                          className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs text-foreground focus-visible:outline-none"
                          placeholder="What the programme actually does..."
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-foreground">
                          Success Statement (Named Proof &amp; Citable Baseline)
                        </label>
                        <textarea
                          value={bet.success ?? ""}
                          onChange={(e) => updateLandingProgrammeExplain(idx, "success", e.target.value)}
                          rows={2}
                          className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs text-foreground focus-visible:outline-none"
                          placeholder="What success looks like..."
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-foreground">Lifecycle Whisper</label>
                          <Input
                            value={bet.cycle ?? ""}
                            onChange={(e) => updateLandingProgrammeExplain(idx, "cycle", e.target.value)}
                            className="mt-1 h-8 text-xs"
                            placeholder="e.g. Formulation → Budget Day → scrutiny"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-foreground">
                            Read more CTA label
                          </label>
                          <Input
                            value={bet.ctaLabel ?? ""}
                            onChange={(e) => updateLandingProgrammeExplain(idx, "ctaLabel", e.target.value)}
                            className="mt-1 h-8 text-xs font-semibold"
                            placeholder="e.g. Read more"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-foreground">Target URL</label>
                          <Input
                            value={bet.href ?? ""}
                            onChange={(e) => updateLandingProgrammeExplain(idx, "href", e.target.value)}
                            className="mt-1 h-8 text-xs font-mono"
                            placeholder="e.g. /programmes/connect"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground">
                          <input
                            type="checkbox"
                            checked={Boolean(bet.hideCta)}
                            onChange={(e) => updateLandingProgrammeExplain(idx, "hideCta", e.target.checked)}
                            className="rounded border-input text-primary focus:ring-primary h-3.5 w-3.5"
                          />
                          <span>Hide Call to Action button for this bet</span>
                        </label>
                      </div>

                      {/* Evidence Images for this Bet */}
                      <div className="space-y-3 pt-2 border-t border-border/50">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                            Evidence &amp; Field Stills (Displayed on Landing)
                          </label>
                          <span className="text-[10px] text-muted-foreground">2 Photos per Bet</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[0, 1].map((imgIdx) => {
                            const currentImgs = bet.images || [];
                            const currentImg = currentImgs[imgIdx] || { src: "", alt: "", caption: "" };
                            return (
                              <div key={imgIdx} className="space-y-2 rounded-xl border border-border/70 bg-card p-3 shadow-xs">
                                <ImageFieldControl
                                  label={`Photo #${imgIdx + 1}`}
                                  value={currentImg.src ?? ""}
                                  onChange={(newSrc) => {
                                    const nextImgs = [...(bet.images || [{}, {}])];
                                    nextImgs[imgIdx] = { ...nextImgs[imgIdx], src: newSrc };
                                    updateLandingProgrammeExplain(idx, "images", nextImgs);
                                  }}
                                  onOpenBucket={() => {
                                    setActiveImagePicker({
                                      isOpen: true,
                                      title: `Select Photo #${imgIdx + 1} for ${bet.name || bet.eyebrow}`,
                                      currentUrl: currentImg.src,
                                      onSelect: (url) => {
                                        const nextImgs = [...(bet.images || [{}, {}])];
                                        nextImgs[imgIdx] = { ...nextImgs[imgIdx], src: url };
                                        updateLandingProgrammeExplain(idx, "images", nextImgs);
                                        setActiveImagePicker(null);
                                      },
                                    });
                                  }}
                                  description="Displayed in the 4:3 evidence frame on the landing page."
                                />
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                  <div>
                                    <span className="text-[10px] font-semibold text-muted-foreground">Caption</span>
                                    <Input
                                      value={currentImg.caption ?? ""}
                                      onChange={(e) => {
                                        const nextImgs = [...(bet.images || [{}, {}])];
                                        nextImgs[imgIdx] = { ...nextImgs[imgIdx], caption: e.target.value };
                                        updateLandingProgrammeExplain(idx, "images", nextImgs);
                                      }}
                                      className="h-7 text-xs"
                                      placeholder="Photo caption"
                                    />
                                  </div>
                                  <div>
                                    <span className="text-[10px] font-semibold text-muted-foreground">Alt Text</span>
                                    <Input
                                      value={currentImg.alt ?? ""}
                                      onChange={(e) => {
                                        const nextImgs = [...(bet.images || [{}, {}])];
                                        nextImgs[imgIdx] = { ...nextImgs[imgIdx], alt: e.target.value };
                                        updateLandingProgrammeExplain(idx, "images", nextImgs);
                                      }}
                                      className="h-7 text-xs"
                                      placeholder="Alt text"
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

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

                  {/* Hero CTA Button Styling */}
                  <div className="rounded-xl border border-border/70 p-4 space-y-3 bg-muted/10">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                          Hero CTA Buttons
                        </h4>
                        <p className="text-[11px] text-muted-foreground">
                          Style the primary and secondary buttons in the hero.
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-semibold text-muted-foreground">Primary Style</span>
                        <select
                          value={landingData.heroCta?.primaryVariant ?? "white"}
                          onChange={(e) => updateLandingField(["heroCta", "primaryVariant"], e.target.value)}
                          className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                        >
                          <option value="white">White (default)</option>
                          <option value="outline">Outline</option>
                          <option value="primary">Brand Primary</option>
                          <option value="secondary">Brand Secondary</option>
                        </select>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={landingData.heroCta?.primaryColor ?? "#ffffff"}
                            onChange={(e) => updateLandingField(["heroCta", "primaryColor"], e.target.value)}
                            className="h-7 w-7 cursor-pointer rounded border border-input"
                          />
                          <Input
                            value={landingData.heroCta?.primaryColor ?? ""}
                            placeholder="auto"
                            onChange={(e) => updateLandingField(["heroCta", "primaryColor"], e.target.value || undefined)}
                            className="h-7 flex-1 text-[11px] font-mono"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-semibold text-muted-foreground">Secondary Style</span>
                        <select
                          value={landingData.heroCta?.secondaryVariant ?? "outline"}
                          onChange={(e) => updateLandingField(["heroCta", "secondaryVariant"], e.target.value)}
                          className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                        >
                          <option value="white">White</option>
                          <option value="outline">Outline (default)</option>
                          <option value="primary">Brand Primary</option>
                          <option value="secondary">Brand Secondary</option>
                        </select>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={landingData.heroCta?.secondaryColor ?? "#ffffff"}
                            onChange={(e) => updateLandingField(["heroCta", "secondaryColor"], e.target.value)}
                            className="h-7 w-7 cursor-pointer rounded border border-input"
                          />
                          <Input
                            value={landingData.heroCta?.secondaryColor ?? ""}
                            placeholder="auto"
                            onChange={(e) => updateLandingField(["heroCta", "secondaryColor"], e.target.value || undefined)}
                            className="h-7 flex-1 text-[11px] font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hero Text Colours */}
                  <div className="rounded-xl border border-border/70 p-4 space-y-3 bg-muted/10">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                          Hero Text Colours
                        </h4>
                        <p className="text-[11px] text-muted-foreground">
                          Text colours for the hero overlay (dark background).
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-semibold text-muted-foreground">Title</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={landingData.heroColors?.title ?? "#ffffff"}
                            onChange={(e) => updateLandingField(["heroColors", "title"], e.target.value)}
                            className="h-7 w-7 cursor-pointer rounded border border-input"
                          />
                          <Input
                            value={landingData.heroColors?.title ?? ""}
                            placeholder="#fff"
                            onChange={(e) => updateLandingField(["heroColors", "title"], e.target.value || undefined)}
                            className="h-7 flex-1 text-[11px] font-mono"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-semibold text-muted-foreground">Lede</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={landingData.heroColors?.lede ?? "#d1d5db"}
                            onChange={(e) => updateLandingField(["heroColors", "lede"], e.target.value)}
                            className="h-7 w-7 cursor-pointer rounded border border-input"
                          />
                          <Input
                            value={landingData.heroColors?.lede ?? ""}
                            placeholder="rgba(255,255,255,0.82)"
                            onChange={(e) => updateLandingField(["heroColors", "lede"], e.target.value || undefined)}
                            className="h-7 flex-1 text-[11px] font-mono"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-semibold text-muted-foreground">Eyebrow</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={landingData.heroColors?.eyebrow ?? "#9ca3af"}
                            onChange={(e) => updateLandingField(["heroColors", "eyebrow"], e.target.value)}
                            className="h-7 w-7 cursor-pointer rounded border border-input"
                          />
                          <Input
                            value={landingData.heroColors?.eyebrow ?? ""}
                            placeholder="rgba(255,255,255,0.62)"
                            onChange={(e) => updateLandingField(["heroColors", "eyebrow"], e.target.value || undefined)}
                            className="h-7 flex-1 text-[11px] font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Google Font Family */}
                  <div className="rounded-xl border border-border/70 p-4 space-y-3 bg-muted/10">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                          Typography
                        </h4>
                        <p className="text-[11px] text-muted-foreground">
                          Select a Google Font for hero text. Applied via CSS variable.
                        </p>
                      </div>
                    </div>
                    <select
                      value={landingData.fontFamily ?? ""}
                      onChange={(e) => updateLandingField(["fontFamily"], e.target.value || undefined)}
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
                    >
                      <option value="">Default (Neue Montreal)</option>
                      <option value="Inter, sans-serif">Inter</option>
                      <option value="Roboto, sans-serif">Roboto</option>
                      <option value="Open Sans, sans-serif">Open Sans</option>
                      <option value="Lato, sans-serif">Lato</option>
                      <option value="Poppins, sans-serif">Poppins</option>
                      <option value="Nunito, sans-serif">Nunito</option>
                      <option value="Work Sans, sans-serif">Work Sans</option>
                      <option value="DM Sans, sans-serif">DM Sans</option>
                      <option value="Plus Jakarta Sans, sans-serif">Plus Jakarta Sans</option>
                      <option value="Space Grotesk, sans-serif">Space Grotesk</option>
                      <option value="Outfit, sans-serif">Outfit</option>
                      <option value="Manrope, sans-serif">Manrope</option>
                      <option value="Sora, sans-serif">Sora</option>
                    </select>
                    {landingData.fontFamily && (
                      <p className="text-[10px] text-muted-foreground font-mono">
                        {landingData.fontFamily}
                      </p>
                    )}
                  </div>

                  {/* Hero Bottom-Left Programme Lines */}
                  <div className="rounded-xl border border-border/70 p-4 space-y-3 bg-muted/10">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                          Hero Bottom-Left Programme Anchors
                        </h4>
                        <p className="text-[11px] text-muted-foreground">
                          Customise the active programme labels displayed at the bottom of the hero reel.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {((landingData.heroProgrammeLines as any[]) || [
                        { slug: "connect", label: "Connect", href: "/programmes/connect" },
                        { slug: "mashinani", label: "Mashinani", href: "/programmes/mashinani" },
                        { slug: "wanahabari-lab", label: "Wanahabari Lab", href: "/programmes/wanahabari-lab" },
                      ]).map((line: any, lIdx: number) => (
                        <div key={line.slug || lIdx} className="space-y-1.5 rounded-lg border border-border/60 bg-card p-2.5">
                          <div>
                            <span className="text-[10px] font-semibold text-muted-foreground">Label</span>
                            <Input
                              value={line.label ?? ""}
                              onChange={(e) => {
                                const currentLines = [...((landingData.heroProgrammeLines as any[]) || [
                                  { slug: "connect", label: "Connect", href: "/programmes/connect" },
                                  { slug: "mashinani", label: "Mashinani", href: "/programmes/mashinani" },
                                  { slug: "wanahabari-lab", label: "Wanahabari Lab", href: "/programmes/wanahabari-lab" },
                                ])];
                                currentLines[lIdx] = { ...currentLines[lIdx], label: e.target.value };
                                updateLandingField(["heroProgrammeLines"], currentLines);
                              }}
                              className="h-7 text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold text-muted-foreground">URL</span>
                            <Input
                              value={line.href ?? ""}
                              onChange={(e) => {
                                const currentLines = [...((landingData.heroProgrammeLines as any[]) || [
                                  { slug: "connect", label: "Connect", href: "/programmes/connect" },
                                  { slug: "mashinani", label: "Mashinani", href: "/programmes/mashinani" },
                                  { slug: "wanahabari-lab", label: "Wanahabari Lab", href: "/programmes/wanahabari-lab" },
                                ])];
                                currentLines[lIdx] = { ...currentLines[lIdx], href: e.target.value };
                                updateLandingField(["heroProgrammeLines"], currentLines);
                              }}
                              className="h-7 text-[11px] font-mono"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
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
                      <label className="text-xs font-semibold text-foreground">Intro Lede / Description</label>
                      <textarea
                        value={landingData.featuredIntro?.lede ?? ""}
                        onChange={(e) => updateLandingField(["featuredIntro", "lede"], e.target.value)}
                        rows={2}
                        className="mt-1 w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground">
                        Default project CTA label
                      </label>
                      <Input
                        value={landingData.featuredIntro?.openProjectLabel ?? "Open project"}
                        onChange={(e) =>
                          updateLandingField(["featuredIntro", "openProjectLabel"], e.target.value)
                        }
                        className="mt-1 h-9 text-xs font-semibold"
                        placeholder="e.g. Open project"
                      />
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        Used under each featured story unless a story sets its own CTA label.
                      </p>
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

                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 text-[11px] font-semibold text-foreground">
                            <input
                              type="checkbox"
                              checked={bet.hideCycle ?? false}
                              onChange={(e) => {
                                const explains = [...(landingData.programmeExplains || [])];
                                explains[i] = { ...explains[i], hideCycle: e.target.checked };
                                updateLandingField(["programmeExplains"], explains);
                              }}
                              className="h-3.5 w-3.5 rounded border-input"
                            />
                            Hide lifecycle text
                          </label>
                          <label className="flex items-center gap-2 text-[11px] font-semibold text-foreground">
                            <input
                              type="checkbox"
                              checked={bet.hideCta ?? false}
                              onChange={(e) => {
                                const explains = [...(landingData.programmeExplains || [])];
                                explains[i] = { ...explains[i], hideCta: e.target.checked };
                                updateLandingField(["programmeExplains"], explains);
                              }}
                              className="h-3.5 w-3.5 rounded border-input"
                            />
                            Hide CTA link
                          </label>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label className="text-[11px] font-semibold text-foreground">Button Style</label>
                            <select
                              value={bet.ctaVariant ?? "outline"}
                              onChange={(e) => {
                                const explains = [...(landingData.programmeExplains || [])];
                                explains[i] = { ...explains[i], ctaVariant: e.target.value };
                                updateLandingField(["programmeExplains"], explains);
                              }}
                              className="mt-1 h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                            >
                              <option value="outline">Outline</option>
                              <option value="primary">Primary (filled)</option>
                              <option value="secondary">Secondary</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-foreground">Button Colour</label>
                            <div className="mt-1 flex items-center gap-2">
                              <input
                                type="color"
                                value={bet.ctaColor ?? "#000000"}
                                onChange={(e) => {
                                  const explains = [...(landingData.programmeExplains || [])];
                                  explains[i] = { ...explains[i], ctaColor: e.target.value };
                                  updateLandingField(["programmeExplains"], explains);
                                }}
                                className="h-8 w-8 cursor-pointer rounded border border-input"
                              />
                              <Input
                                value={bet.ctaColor ?? ""}
                                placeholder="auto"
                                onChange={(e) => {
                                  const explains = [...(landingData.programmeExplains || [])];
                                  explains[i] = { ...explains[i], ctaColor: e.target.value || undefined };
                                  updateLandingField(["programmeExplains"], explains);
                                }}
                                className="h-8 flex-1 text-xs font-mono"
                              />
                            </div>
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


          {/* TAB: FEATURED MEDIA & VIDEOS */}
          {activeTab === "media" && (
            <div className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="border-b border-border/50 pb-3">
                <h2 className="text-base font-bold text-foreground">Featured Media, Videos &amp; Gallery</h2>
                <p className="text-xs text-muted-foreground">
                  Connect Cloudflare R2 videos, YouTube, TikTok-style reels, or a still image. Social reels for this programme also appear in the project grid (play in-app).
                </p>
              </div>

              {currentProgramme ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Film className="size-3.5 text-primary" />
                        <span>Programme Hero Media</span>
                      </h4>
                      <div className="flex items-center gap-2">
                        {currentProgramme.featuredMedia?.url && (
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => updateCurrentProgrammeField("featuredMedia", undefined)}
                            className="h-7 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 gap-1"
                          >
                            <Trash2 className="size-3" />
                            <span>Remove</span>
                          </Button>
                        )}
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setActiveImagePicker({
                              isOpen: true,
                              title: `Featured Media for ${currentProgramme.title || "Programme"}`,
                              currentUrl: currentProgramme.featuredMedia?.url,
                              onSelect: (url) => {
                                const detected = detectMediaType(url);
                                const type =
                                  detected === "vimeo"
                                    ? "video"
                                    : detected === "image" ||
                                        detected === "youtube" ||
                                        detected === "tiktok" ||
                                        detected === "video"
                                      ? detected
                                      : "image";
                                updateCurrentProgrammeField("featuredMedia", {
                                  ...(currentProgramme.featuredMedia || {}),
                                  url,
                                  type,
                                });
                              },
                            });
                          }}
                          className="h-7 text-xs gap-1.5 font-semibold"
                        >
                          <Sliders className="size-3.5" />
                          <span>Select / Upload Media</span>
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground">Hero media type</label>
                      <select
                        value={currentProgramme.featuredMedia?.type ?? "auto"}
                        onChange={(e) => {
                          updateCurrentProgrammeField("featuredMedia", {
                            ...(currentProgramme.featuredMedia || { url: "" }),
                            type: e.target.value,
                          });
                        }}
                        className="mt-1 flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                      >
                        <option value="image">Still image</option>
                        <option value="tiktok">TikTok-style reel (vertical)</option>
                        <option value="youtube">YouTube embed</option>
                        <option value="video">Landscape video (MP4)</option>
                        <option value="auto">Auto-detect</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground">
                        Media URL (R2 / YouTube / TikTok video page)
                      </label>
                      <Input
                        value={currentProgramme.featuredMedia?.url ?? ""}
                        onChange={(e) => {
                          const url = e.target.value;
                          const detected = url ? detectMediaType(url) : "image";
                          const inferred =
                            detected === "vimeo"
                              ? "video"
                              : detected;
                          const keepManual =
                            currentProgramme.featuredMedia?.type &&
                            currentProgramme.featuredMedia.type !== "auto";
                          updateCurrentProgrammeField("featuredMedia", {
                            ...(currentProgramme.featuredMedia || {}),
                            url,
                            type: keepManual
                              ? currentProgramme.featuredMedia?.type
                              : inferred,
                          });
                        }}
                        className="mt-1 h-8 font-mono text-xs"
                        placeholder="https://...jpg / .mp4 / youtube.com/watch?v=..."
                      />
                    </div>

                    {currentProgramme.featuredMedia?.url ? (
                      <div className="space-y-3">
                        <div className="max-w-md overflow-hidden rounded-lg border border-border bg-black">
                          <MediaEmbed
                            src={currentProgramme.featuredMedia.url}
                            type={currentProgramme.featuredMedia.type}
                            title={currentProgramme.featuredMedia.title}
                            poster={currentProgramme.featuredMedia.poster}
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                          <div>
                            <label className="text-[11px] font-semibold text-muted-foreground">Media Title</label>
                            <Input
                              value={currentProgramme.featuredMedia.title ?? ""}
                              onChange={(e) => {
                                const fm = { ...(currentProgramme.featuredMedia || {}), title: e.target.value };
                                updateCurrentProgrammeField("featuredMedia", fm);
                              }}
                              className="mt-0.5 h-7 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-muted-foreground">Caption / Credit</label>
                            <Input
                              value={currentProgramme.featuredMedia.caption ?? ""}
                              onChange={(e) => {
                                const fm = { ...(currentProgramme.featuredMedia || {}), caption: e.target.value };
                                updateCurrentProgrammeField("featuredMedia", fm);
                              }}
                              className="mt-0.5 h-7 text-xs"
                            />
                          </div>
                        </div>
                        <ImageFieldControl
                          label="Poster / cover still"
                          value={currentProgramme.featuredMedia.poster ?? ""}
                          onChange={(url) => {
                            updateCurrentProgrammeField("featuredMedia", {
                              ...(currentProgramme.featuredMedia || {}),
                              poster: url,
                            });
                          }}
                          onOpenBucket={() => {
                            setActiveImagePicker({
                              isOpen: true,
                              title: "Hero poster image",
                              currentUrl: currentProgramme.featuredMedia?.poster,
                              onSelect: (url) => {
                                updateCurrentProgrammeField("featuredMedia", {
                                  ...(currentProgramme.featuredMedia || {}),
                                  poster: url,
                                });
                              },
                            });
                          }}
                        />
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-border py-5 text-center text-xs text-muted-foreground">
                        No hero media yet. Pick an R2 file, paste a YouTube URL, or use a TikTok-style reel MP4.
                      </div>
                    )}
                  </div>

                  {/* Programme social reels (from programme-reels collection) */}
                  <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Film className="size-3.5 text-primary" />
                        <span>Social reels in project grid</span>
                      </h4>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const secPageKey =
                            currentProgramme.slug === "connect"
                              ? "programmeConnect"
                              : currentProgramme.slug === "mashinani"
                                ? "programmeMashinani"
                                : currentProgramme.slug === "wanahabari-lab"
                                  ? "programmeWanahabari"
                                  : null;
                          if (!secPageKey) return null;
                          const isReelsVis =
                            sectionsData.pages?.[secPageKey]?.sections?.find((s: any) => s.id === "reels")?.visible !== false;
                          return (
                            <Button
                              type="button"
                              size="sm"
                              variant={isReelsVis ? "default" : "outline"}
                              className="h-6 text-[10px] font-semibold gap-1"
                              onClick={() => toggleSectionForPage(secPageKey, "reels")}
                              title={isReelsVis ? "Click to mute social reels on this programme page" : "Click to enable social reels on this programme page"}
                            >
                              {isReelsVis ? (
                                <>
                                  <Eye className="size-3" />
                                  <span>Reels Active</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="size-3 text-rose-500" />
                                  <span>Reels Muted</span>
                                </>
                              )}
                            </Button>
                          );
                        })()}
                        <span className="font-mono text-[10px] text-muted-foreground">
                          desk: Programme Reels
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Reels tagged <code className="font-mono">{currentProgramme.slug}</code> appear inside this programme&apos;s project grid and play in-app. Edit the archive under the{" "}
                      <strong>Programme Reels</strong> CMS desk, then Save.
                    </p>
                    <div className="space-y-2">
                      {(((programmeReelsData?.reels as any[]) || []).filter(
                        (r) => r.programmeSlug === currentProgramme.slug,
                      ).length === 0) ? (
                        <p className="rounded-lg border border-dashed border-border py-4 text-center text-[11px] text-muted-foreground">
                          No reels tagged for this programme yet.
                        </p>
                      ) : (
                        ((programmeReelsData?.reels as any[]) || [])
                          .filter((r) => r.programmeSlug === currentProgramme.slug)
                          .map((reel) => (
                            <div
                              key={reel.id}
                              className="flex items-center gap-3 rounded-lg border border-border/60 bg-card p-2"
                            >
                              <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                                {reel.posterUrl ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={reel.posterUrl}
                                    alt=""
                                    className="size-full object-cover"
                                  />
                                ) : null}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-semibold text-foreground">
                                  {reel.title}
                                </p>
                                <p className="truncate font-mono text-[10px] text-muted-foreground">
                                  {reel.id} · {reel.duration || "reel"}
                                </p>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="h-7 text-[10px]"
                                onClick={() => {
                                  updateCurrentProgrammeField("featuredMedia", {
                                    type: "tiktok",
                                    url: reel.videoUrl,
                                    poster: reel.posterUrl,
                                    title: reel.title,
                                    caption: reel.caption,
                                  });
                                }}
                              >
                                Use as hero
                              </Button>
                            </div>
                          ))
                      )}
                    </div>
                  </div>

                  {/* Programme Hero Poster / Fallback Visual */}
                  <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <ImageIcon className="size-3.5 text-primary" />
                      <span>Programme Hero Poster Image</span>
                    </h4>
                    <ImageFieldControl
                      label="Hero Poster Image"
                      value={currentProgramme.visual?.hero ?? ""}
                      onChange={(url) => {
                        updateCurrentProgrammeField("visual", {
                          ...(currentProgramme.visual || {}),
                          hero: url,
                        });
                      }}
                      onOpenBucket={() => {
                        setActiveImagePicker({
                          isOpen: true,
                          title: `Hero Poster for ${currentProgramme.title || "Programme"}`,
                          currentUrl: currentProgramme.visual?.hero,
                          onSelect: (url) => {
                            updateCurrentProgrammeField("visual", {
                              ...(currentProgramme.visual || {}),
                              hero: url,
                            });
                          },
                        });
                      }}
                      description="Displayed as the primary visual on programme cards and hero header."
                    />
                    <div>
                      <label className="text-xs font-semibold text-foreground">Hero alt text</label>
                      <Input
                        value={currentProgramme.visual?.heroAlt ?? ""}
                        onChange={(e) => {
                          updateCurrentProgrammeField("visual", {
                            ...(currentProgramme.visual || {}),
                            heroAlt: e.target.value,
                          });
                        }}
                        className="mt-1 h-8 text-xs"
                        placeholder="Describe the hero image"
                      />
                    </div>
                  </div>

                  {/* Programme media gallery array */}
                  <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <ImageIcon className="size-3.5 text-primary" />
                        <span>Media gallery array</span>
                      </h4>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1.5"
                        onClick={() => {
                          const gallery = [
                            ...((currentProgramme.visual?.gallery as Array<{ src?: string; alt?: string }>) || []),
                            { src: "", alt: "" },
                          ];
                          updateCurrentProgrammeField("visual", {
                            ...(currentProgramme.visual || {}),
                            gallery,
                          });
                        }}
                      >
                        <Plus className="size-3.5" />
                        Add media
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Edits <code className="font-mono">visual.gallery[]</code> - the multi-image media strip used on programme and studio surfaces.
                    </p>
                    {(((currentProgramme.visual?.gallery as Array<{ src?: string; alt?: string }>) || []).length === 0) ? (
                      <div className="rounded-lg border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                        No gallery items yet. Add media to capture the array in CMS.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {((currentProgramme.visual?.gallery as Array<{ src?: string; alt?: string }>) || []).map(
                          (item, index) => (
                            <div
                              key={`gallery-${index}`}
                              className="rounded-lg border border-border/70 bg-card p-3 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-foreground">
                                  Media {index + 1}
                                </span>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                                  onClick={() => {
                                    const gallery = [
                                      ...((currentProgramme.visual?.gallery as Array<{
                                        src?: string;
                                        alt?: string;
                                      }>) || []),
                                    ];
                                    gallery.splice(index, 1);
                                    updateCurrentProgrammeField("visual", {
                                      ...(currentProgramme.visual || {}),
                                      gallery,
                                    });
                                  }}
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </div>
                              <ImageFieldControl
                                label="Image / video URL"
                                value={item.src ?? ""}
                                onChange={(url) => {
                                  const gallery = [
                                    ...((currentProgramme.visual?.gallery as Array<{
                                      src?: string;
                                      alt?: string;
                                    }>) || []),
                                  ];
                                  gallery[index] = { ...gallery[index], src: url };
                                  updateCurrentProgrammeField("visual", {
                                    ...(currentProgramme.visual || {}),
                                    gallery,
                                  });
                                }}
                                onOpenBucket={() => {
                                  setActiveImagePicker({
                                    isOpen: true,
                                    title: `Gallery media ${index + 1}`,
                                    currentUrl: item.src,
                                    onSelect: (url) => {
                                      const gallery = [
                                        ...((currentProgramme.visual?.gallery as Array<{
                                          src?: string;
                                          alt?: string;
                                        }>) || []),
                                      ];
                                      gallery[index] = { ...gallery[index], src: url };
                                      updateCurrentProgrammeField("visual", {
                                        ...(currentProgramme.visual || {}),
                                        gallery,
                                      });
                                    },
                                  });
                                }}
                              />
                              <div>
                                <label className="text-xs font-semibold text-foreground">Alt text</label>
                                <Input
                                  value={item.alt ?? ""}
                                  onChange={(e) => {
                                    const gallery = [
                                      ...((currentProgramme.visual?.gallery as Array<{
                                        src?: string;
                                        alt?: string;
                                      }>) || []),
                                    ];
                                    gallery[index] = { ...gallery[index], alt: e.target.value };
                                    updateCurrentProgrammeField("visual", {
                                      ...(currentProgramme.visual || {}),
                                      gallery,
                                    });
                                  }}
                                  className="mt-1 h-8 text-xs"
                                />
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  Select a programme to manage its hero videos, gallery array, and stream assets.
                </div>
              )}
            </div>
          )}

          {/* TAB: MOBILE DESIGN */}
          {activeTab === "mobile" && (
            <div className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="border-b border-border/50 pb-3">
                <h2 className="text-base font-bold text-foreground">Mobile Design</h2>
                <p className="text-xs text-muted-foreground">
                  Wide desktop heroes (e.g. 1280px landscape) often crop badly on phones. Set a mobile-only image or reel here — desktop media stays for tablet+.
                </p>
              </div>

              {currentProgramme ? (
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        currentProgramme.featuredMedia?.hideDesktopOnMobile ??
                        Boolean(currentProgramme.featuredMedia?.mobileUrl || currentProgramme.visual?.heroMobile)
                      }
                      onChange={(e) => {
                        updateCurrentProgrammeField("featuredMedia", {
                          ...(currentProgramme.featuredMedia || { url: currentProgramme.featuredMedia?.url || "" }),
                          hideDesktopOnMobile: e.target.checked,
                        });
                      }}
                      className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
                    />
                    <span>Hide wide desktop hero on mobile (show mobile asset instead)</span>
                  </label>

                  <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Mobile hero media
                    </h4>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground">Mobile media type</label>
                      <select
                        value={currentProgramme.featuredMedia?.mobileType ?? "image"}
                        onChange={(e) => {
                          updateCurrentProgrammeField("featuredMedia", {
                            ...(currentProgramme.featuredMedia || { url: "" }),
                            mobileType: e.target.value,
                          });
                        }}
                        className="mt-1 flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                      >
                        <option value="image">Still image (recommended)</option>
                        <option value="tiktok">TikTok-style reel</option>
                        <option value="youtube">YouTube</option>
                        <option value="video">MP4 video</option>
                        <option value="auto">Auto-detect</option>
                      </select>
                    </div>
                    <ImageFieldControl
                      label="Mobile media URL (portrait / square works best)"
                      value={currentProgramme.featuredMedia?.mobileUrl ?? ""}
                      onChange={(url) => {
                        const detected = url ? detectMediaType(url) : "image";
                        updateCurrentProgrammeField("featuredMedia", {
                          ...(currentProgramme.featuredMedia || { url: "" }),
                          mobileUrl: url,
                          mobileType:
                            currentProgramme.featuredMedia?.mobileType &&
                            currentProgramme.featuredMedia.mobileType !== "auto"
                              ? currentProgramme.featuredMedia.mobileType
                              : detected === "vimeo"
                                ? "video"
                                : detected,
                          hideDesktopOnMobile: true,
                        });
                      }}
                      onOpenBucket={() => {
                        setActiveImagePicker({
                          isOpen: true,
                          title: "Mobile hero media",
                          currentUrl: currentProgramme.featuredMedia?.mobileUrl,
                          onSelect: (url) => {
                            const detected = detectMediaType(url);
                            updateCurrentProgrammeField("featuredMedia", {
                              ...(currentProgramme.featuredMedia || { url: "" }),
                              mobileUrl: url,
                              mobileType: detected === "vimeo" ? "video" : detected,
                              hideDesktopOnMobile: true,
                            });
                          },
                        });
                      }}
                    />
                    <ImageFieldControl
                      label="Mobile poster / cover still"
                      value={currentProgramme.featuredMedia?.mobilePoster ?? ""}
                      onChange={(url) => {
                        updateCurrentProgrammeField("featuredMedia", {
                          ...(currentProgramme.featuredMedia || { url: "" }),
                          mobilePoster: url,
                        });
                      }}
                      onOpenBucket={() => {
                        setActiveImagePicker({
                          isOpen: true,
                          title: "Mobile poster",
                          currentUrl: currentProgramme.featuredMedia?.mobilePoster,
                          onSelect: (url) => {
                            updateCurrentProgrammeField("featuredMedia", {
                              ...(currentProgramme.featuredMedia || { url: "" }),
                              mobilePoster: url,
                            });
                          },
                        });
                      }}
                    />
                    {currentProgramme.featuredMedia?.mobileUrl ? (
                      <div className="mx-auto max-w-[220px] overflow-hidden rounded-xl border border-border bg-black">
                        <MediaEmbed
                          src={currentProgramme.featuredMedia.mobileUrl}
                          type={currentProgramme.featuredMedia.mobileType || "image"}
                          poster={currentProgramme.featuredMedia.mobilePoster}
                          aspectRatio={
                            currentProgramme.featuredMedia.mobileType === "tiktok"
                              ? "portrait"
                              : currentProgramme.featuredMedia.mobileType === "image" ||
                                  !currentProgramme.featuredMedia.mobileType
                                ? "auto"
                                : "video"
                          }
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Fallback mobile still (when no featured media)
                    </h4>
                    <ImageFieldControl
                      label="visual.heroMobile"
                      value={currentProgramme.visual?.heroMobile ?? ""}
                      onChange={(url) => {
                        updateCurrentProgrammeField("visual", {
                          ...(currentProgramme.visual || {}),
                          heroMobile: url,
                        });
                      }}
                      onOpenBucket={() => {
                        setActiveImagePicker({
                          isOpen: true,
                          title: "Mobile hero still",
                          currentUrl: currentProgramme.visual?.heroMobile,
                          onSelect: (url) => {
                            updateCurrentProgrammeField("visual", {
                              ...(currentProgramme.visual || {}),
                              heroMobile: url,
                            });
                          },
                        });
                      }}
                    />
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    Tip: Button mobile/desktop visibility lives under the Buttons tab. Use Preview → phone width to check this page.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Select a programme desk to edit mobile media.</p>
              )}
            </div>
          )}

          {/* TAB: COLOUR THEME */}
          {activeTab === "theme" && (
            <div className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="border-b border-border/50 pb-3">
                <h2 className="text-base font-bold text-foreground">Programme Colour Theme</h2>
                <p className="text-xs text-muted-foreground">
                  Pick a preset (Connect blue, Mashinani red, …) or custom colours. Buttons and primary accents update on this page only — not the whole site.
                </p>
              </div>

              {currentProgramme ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {listProgrammePresetOptions(designTokensData).map((preset) => {
                      const selected =
                        (currentProgramme.theme?.preset || "global") === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            updateCurrentProgrammeField("theme", {
                              ...(currentProgramme.theme || {}),
                              preset: preset.id,
                            });
                          }}
                          className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                            selected
                              ? "border-primary bg-primary/10 ring-1 ring-primary"
                              : "border-border/60 bg-muted/20 hover:bg-muted/50"
                          }`}
                        >
                          <input
                            type="color"
                            value={/^#[0-9A-Fa-f]{6}$/.test(preset.swatch) ? preset.swatch : "#0055FF"}
                            readOnly
                            tabIndex={-1}
                            aria-hidden
                            className="mt-0.5 size-8 shrink-0 cursor-pointer rounded-full border border-border bg-transparent p-0"
                          />
                          <span className="min-w-0">
                            <span className="block text-xs font-bold text-foreground">
                              {preset.label}
                            </span>
                            {preset.description ? (
                              <span className="mt-0.5 block text-[11px] text-muted-foreground">
                                {preset.description}
                              </span>
                            ) : null}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {(currentProgramme.theme?.preset === "custom" ||
                    currentProgramme.theme?.primary ||
                    currentProgramme.theme?.buttonBg) && (
                    <div className="grid grid-cols-1 gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 sm:grid-cols-2">
                      <ColorFieldControl
                        label="Primary"
                        value={currentProgramme.theme?.primary ?? "#0055FF"}
                        onChange={(v) =>
                          updateCurrentProgrammeField("theme", {
                            ...(currentProgramme.theme || {}),
                            preset: currentProgramme.theme?.preset || "custom",
                            primary: v,
                          })
                        }
                      />
                      <ColorFieldControl
                        label="Primary text"
                        value={currentProgramme.theme?.primaryForeground ?? "#FFFFFF"}
                        onChange={(v) =>
                          updateCurrentProgrammeField("theme", {
                            ...(currentProgramme.theme || {}),
                            primaryForeground: v,
                          })
                        }
                      />
                      <ColorFieldControl
                        label="Accent"
                        value={currentProgramme.theme?.accent ?? currentProgramme.theme?.primary ?? "#0055FF"}
                        onChange={(v) =>
                          updateCurrentProgrammeField("theme", {
                            ...(currentProgramme.theme || {}),
                            accent: v,
                          })
                        }
                      />
                      <ColorFieldControl
                        label="Button fill"
                        value={currentProgramme.theme?.buttonBg ?? currentProgramme.theme?.primary ?? "#0055FF"}
                        onChange={(v) =>
                          updateCurrentProgrammeField("theme", {
                            ...(currentProgramme.theme || {}),
                            buttonBg: v,
                          })
                        }
                      />
                      <ColorFieldControl
                        label="Button text"
                        value={currentProgramme.theme?.buttonFg ?? "#FFFFFF"}
                        onChange={(v) =>
                          updateCurrentProgrammeField("theme", {
                            ...(currentProgramme.theme || {}),
                            buttonFg: v,
                          })
                        }
                      />
                      <ColorFieldControl
                        label="Button hover"
                        value={currentProgramme.theme?.buttonHoverBg ?? "#0044CC"}
                        onChange={(v) =>
                          updateCurrentProgrammeField("theme", {
                            ...(currentProgramme.theme || {}),
                            buttonHoverBg: v,
                          })
                        }
                      />
                    </div>
                  )}

                  <p className="text-[11px] text-muted-foreground">
                    Edit preset definitions (swatches used across desks) under the global{" "}
                    <strong>Design Tokens</strong> CMS desk. Save this programme after picking a theme.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Select a programme desk to assign a theme.</p>
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
                  {/* Partners Marquee Eyebrow */}
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <span>Partners Marquee Section Eyebrow</span>
                    </h3>
                    <div>
                      <label className="text-xs font-semibold text-foreground">Marquee Header / Eyebrow Text</label>
                      <Input
                        value={landingData.partnersEyebrow ?? "BNS Partners"}
                        onChange={(e) => updateLandingField(["partnersEyebrow"], e.target.value)}
                        className="mt-1 h-8 text-xs font-medium"
                        placeholder="e.g. BNS Partners"
                      />
                    </div>
                  </div>

                  {/* Partner Closing CTA Band */}
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-4">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Partner Closing CTA Band
                      </h3>
                      <span className="text-[10px] text-muted-foreground">Appears at page footer</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-foreground">CTA Band Eyebrow</label>
                        <Input
                          value={landingData.partnerCta?.eyebrow ?? ""}
                          onChange={(e) => updateLandingField(["partnerCta", "eyebrow"], e.target.value)}
                          className="mt-1 h-8 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground">CTA Band Background Theme</label>
                        <select
                          value={landingData.partnerCta?.theme ?? "muted"}
                          onChange={(e) => updateLandingField(["partnerCta", "theme"], e.target.value)}
                          className="mt-1 flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs text-foreground"
                        >
                          <option value="muted">Muted Surface (Default)</option>
                          <option value="default">Standard / Clean</option>
                          <option value="card">Card Shadow Box</option>
                          <option value="contrast">High Contrast (Dark)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground">CTA Band Title</label>
                      <Input
                        value={landingData.partnerCta?.title ?? ""}
                        onChange={(e) => updateLandingField(["partnerCta", "title"], e.target.value)}
                        className="mt-1 h-8 text-xs font-semibold"
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

                    <div>
                      <label className="text-xs font-semibold text-foreground">Buttons Row Alignment</label>
                      <select
                        value={landingData.partnerCta?.buttonAlign ?? "right"}
                        onChange={(e) => updateLandingField(["partnerCta", "buttonAlign"], e.target.value)}
                        className="mt-1 flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs text-foreground"
                      >
                        <option value="right">Align Right (Recommended)</option>
                        <option value="center">Align Center</option>
                        <option value="left">Align Left</option>
                        <option value="stretch">Stretch Full Width</option>
                      </select>
                    </div>

                    {/* Primary Button Settings */}
                    <div className="rounded-lg border border-border/70 bg-background p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-foreground">Primary CTA Button</span>
                        <label className="flex items-center gap-1.5 cursor-pointer text-xs text-muted-foreground">
                          <input
                            type="checkbox"
                            checked={Boolean(landingData.partnerCta?.hidePrimaryButton)}
                            onChange={(e) => updateLandingField(["partnerCta", "hidePrimaryButton"], e.target.checked)}
                            className="rounded border-input text-primary focus:ring-primary h-3.5 w-3.5"
                          />
                          <span>Hide Primary Button</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="sm:col-span-1">
                          <label className="text-[11px] font-semibold text-muted-foreground">Label</label>
                          <Input
                            value={landingData.partnerCta?.ctaLabel ?? ""}
                            onChange={(e) => updateLandingField(["partnerCta", "ctaLabel"], e.target.value)}
                            className="mt-1 h-8 text-xs"
                          />
                        </div>
                        <div className="sm:col-span-1">
                          <label className="text-[11px] font-semibold text-muted-foreground">Target URL</label>
                          <Input
                            value={landingData.partnerCta?.ctaHref ?? ""}
                            onChange={(e) => updateLandingField(["partnerCta", "ctaHref"], e.target.value)}
                            className="mt-1 h-8 text-xs font-mono"
                          />
                        </div>
                        <div className="sm:col-span-1">
                          <label className="text-[11px] font-semibold text-muted-foreground">Style Variant</label>
                          <select
                            value={landingData.partnerCta?.ctaVariant ?? "primary"}
                            onChange={(e) => updateLandingField(["partnerCta", "ctaVariant"], e.target.value)}
                            className="mt-1 flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs text-foreground"
                          >
                            <option value="primary">Primary (Solid)</option>
                            <option value="outline">Outline</option>
                            <option value="secondary">Secondary (Soft)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Secondary Button Settings */}
                    <div className="rounded-lg border border-border/70 bg-background p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-foreground">Secondary CTA Button</span>
                        <label className="flex items-center gap-1.5 cursor-pointer text-xs text-muted-foreground">
                          <input
                            type="checkbox"
                            checked={Boolean(landingData.partnerCta?.hideSecondaryButton)}
                            onChange={(e) => updateLandingField(["partnerCta", "hideSecondaryButton"], e.target.checked)}
                            className="rounded border-input text-primary focus:ring-primary h-3.5 w-3.5"
                          />
                          <span>Hide Secondary Button</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="sm:col-span-1">
                          <label className="text-[11px] font-semibold text-muted-foreground">Label</label>
                          <Input
                            value={landingData.partnerCta?.secondaryLabel ?? ""}
                            onChange={(e) => updateLandingField(["partnerCta", "secondaryLabel"], e.target.value)}
                            className="mt-1 h-8 text-xs"
                          />
                        </div>
                        <div className="sm:col-span-1">
                          <label className="text-[11px] font-semibold text-muted-foreground">Target URL</label>
                          <Input
                            value={landingData.partnerCta?.secondaryHref ?? ""}
                            onChange={(e) => updateLandingField(["partnerCta", "secondaryHref"], e.target.value)}
                            className="mt-1 h-8 text-xs font-mono"
                          />
                        </div>
                        <div className="sm:col-span-1">
                          <label className="text-[11px] font-semibold text-muted-foreground">Style Variant</label>
                          <select
                            value={landingData.partnerCta?.secondaryVariant ?? "outline"}
                            onChange={(e) => updateLandingField(["partnerCta", "secondaryVariant"], e.target.value)}
                            className="mt-1 flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs text-foreground"
                          >
                            <option value="outline">Outline (Default)</option>
                            <option value="secondary">Secondary (Soft)</option>
                            <option value="primary">Primary (Solid)</option>
                          </select>
                        </div>
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
                      Project grid CTA labels
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Enforced on programme project cards - no hardcoded Open project / Watch reel.
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground">Open project label</label>
                        <Input
                          value={programmesData.landing?.featuredIntro?.openProjectLabel ?? "Open project"}
                          onChange={(e) =>
                            updateProgrammesLandingField(
                              ["featuredIntro", "openProjectLabel"],
                              e.target.value,
                            )
                          }
                          className="mt-1 h-8 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground">Watch reel label</label>
                        <Input
                          value={programmesData.landing?.featuredIntro?.watchReelLabel ?? "Watch reel"}
                          onChange={(e) =>
                            updateProgrammesLandingField(
                              ["featuredIntro", "watchReelLabel"],
                              e.target.value,
                            )
                          }
                          className="mt-1 h-8 text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Featured evidence layout (Stories behind the evidence)
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Pick layout + how many tiles per row. Leave project IDs blank to show all Featured Blogs; or paste comma-separated IDs from the Featured Blogs desk.
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground">Layout</label>
                        <select
                          value={programmesData.landing?.featuredIntro?.layout ?? "grid"}
                          onChange={(e) =>
                            updateProgrammesLandingField(["featuredIntro", "layout"], e.target.value)
                          }
                          className="mt-1 flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                        >
                          <option value="grid">Tile grid</option>
                          <option value="list">Editorial list</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground">Columns (grid)</label>
                        <select
                          value={String(programmesData.landing?.featuredIntro?.columns ?? 3)}
                          onChange={(e) =>
                            updateProgrammesLandingField(
                              ["featuredIntro", "columns"],
                              Number(e.target.value),
                            )
                          }
                          className="mt-1 flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                        >
                          <option value="2">2 per row</option>
                          <option value="3">3 per row</option>
                          <option value="4">4 per row</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground">
                        Featured project IDs (optional)
                      </label>
                      <p className="text-[10px] text-muted-foreground mb-2">
                        Pick from the canonical project database. Uncheck all to show all projects.
                      </p>
                      <div className="max-h-48 overflow-y-auto rounded-md border border-input bg-background p-2 space-y-1">
                        {(() => {
                          // Canonical project list from studios-evidence
                          const allProjects = [
                            { id: "cabri-digital-pfm-reforms", title: "Digital PFM Reform Stories" },
                            { id: "illicit-financial-flows-benin-cabo-verde", title: "Illicit Financial Flows" },
                            { id: "project-terra", title: "Project TERRA" },
                            { id: "afrodad-debt-conference", title: "AFRODAD Debt Conference" },
                            { id: "red-flags-book-launch", title: "Red Flags Book Launch" },
                            { id: "uon-cohort-001", title: "UON Cohort 001" },
                            { id: "budget-day-2026", title: "Budget Day 2026" },
                          ];
                          const selected = new Set(programmesData.landing?.featuredIntro?.projectIds || []);
                          return allProjects.map((proj) => (
                            <label key={proj.id} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-muted/50 rounded px-1 py-0.5">
                              <input
                                type="checkbox"
                                checked={selected.size === 0 || selected.has(proj.id)}
                                onChange={(e) => {
                                  const current = [...(programmesData.landing?.featuredIntro?.projectIds || [])];
                                  let updated: string[];
                                  if (e.target.checked) {
                                    updated = [...current, proj.id];
                                  } else {
                                    updated = current.filter((id) => id !== proj.id);
                                  }
                                  updateProgrammesLandingField(["featuredIntro", "projectIds"], updated);
                                }}
                                className="h-3 w-3 rounded border-input"
                              />
                              <span className="font-mono text-[10px] text-muted-foreground">{proj.id}</span>
                              <span className="text-foreground">{proj.title}</span>
                            </label>
                          ));
                        })()}
                      </div>
                      <Input
                        value={(programmesData.landing?.featuredIntro?.projectIds || []).join(", ")}
                        onChange={(e) => {
                          const ids = e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean);
                          updateProgrammesLandingField(["featuredIntro", "projectIds"], ids);
                        }}
                        className="mt-1 h-8 font-mono text-xs"
                        placeholder="All projects (leave empty)"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground">Section eyebrow</label>
                        <Input
                          value={programmesData.landing?.featuredIntro?.eyebrow ?? ""}
                          onChange={(e) =>
                            updateProgrammesLandingField(["featuredIntro", "eyebrow"], e.target.value)
                          }
                          className="mt-1 h-8 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground">Section headline</label>
                        <Input
                          value={programmesData.landing?.featuredIntro?.headline ?? ""}
                          onChange={(e) =>
                            updateProgrammesLandingField(["featuredIntro", "headline"], e.target.value)
                          }
                          className="mt-1 h-8 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Hub hero image &amp; text
                    </h3>
                    <ImageFieldControl
                      label="Hero image (leave blank to use first programme still)"
                      value={programmesData.landing?.heroMedia?.src ?? ""}
                      onChange={(url) =>
                        updateProgrammesLandingField(["heroMedia", "src"], url)
                      }
                      onOpenBucket={() => {
                        setActiveImagePicker({
                          isOpen: true,
                          title: "Programmes hub hero",
                          currentUrl: programmesData.landing?.heroMedia?.src,
                          onSelect: (url) =>
                            updateProgrammesLandingField(["heroMedia", "src"], url),
                        });
                      }}
                    />
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground">Aspect ratio</label>
                        <select
                          value={programmesData.landing?.heroMedia?.aspect ?? "16/10"}
                          onChange={(e) =>
                            updateProgrammesLandingField(["heroMedia", "aspect"], e.target.value)
                          }
                          className="mt-1 flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                        >
                          <option value="16/10">16:10 landscape</option>
                          <option value="16/9">16:9 video</option>
                          <option value="4/3">4:3</option>
                          <option value="1/1">1:1 square</option>
                          <option value="auto">Auto height</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground">Image fit</label>
                        <select
                          value={programmesData.landing?.heroMedia?.objectFit ?? "cover"}
                          onChange={(e) =>
                            updateProgrammesLandingField(["heroMedia", "objectFit"], e.target.value)
                          }
                          className="mt-1 flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                        >
                          <option value="cover">Cover (crop)</option>
                          <option value="contain">Contain (letterbox)</option>
                          <option value="fill">Fill / stretch</option>
                        </select>
                      </div>
                      <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer sm:col-span-2">
                        <input
                          type="checkbox"
                          checked={!!programmesData.landing?.heroText?.headlineItalic}
                          onChange={(e) =>
                            updateProgrammesLandingField(
                              ["heroText", "headlineItalic"],
                              e.target.checked,
                            )
                          }
                          className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
                        />
                        <span>Italic headline</span>
                      </label>
                      <div>
                        <label className="text-xs font-semibold text-foreground">Headline colour</label>
                        <select
                          value={programmesData.landing?.heroText?.headlineColor || ""}
                          onChange={(e) =>
                            updateProgrammesLandingField(
                              ["heroText", "headlineColor"],
                              e.target.value,
                            )
                          }
                          className="mt-1 flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                        >
                          <option value="">Default foreground</option>
                          <option value="primary">Brand primary</option>
                          <option value="muted">Muted</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground">Body colour</label>
                        <select
                          value={programmesData.landing?.heroText?.bodyColor || ""}
                          onChange={(e) =>
                            updateProgrammesLandingField(["heroText", "bodyColor"], e.target.value)
                          }
                          className="mt-1 flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                        >
                          <option value="">Default</option>
                          <option value="muted">Muted</option>
                          <option value="primary">Brand primary</option>
                        </select>
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
                      <div className="flex items-center justify-between">
                        <div className="text-[11px] font-bold text-foreground">Primary Action Button</div>
                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!currentProgramme.cta?.hidden}
                            onChange={(e) => {
                              const cta = { ...(currentProgramme.cta || {}), hidden: e.target.checked };
                              updateCurrentProgrammeField("cta", cta);
                            }}
                            className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                          />
                          <span className={currentProgramme.cta?.hidden ? "text-amber-500 font-semibold" : ""}>
                            {currentProgramme.cta?.hidden ? "Hidden on page" : "Visible"}
                          </span>
                        </label>
                      </div>
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
                      <div className="flex flex-wrap gap-4 pt-1">
                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                          <input
                            type="checkbox"
                            checked={currentProgramme.cta?.showOnMobile !== false}
                            onChange={(e) => {
                              updateCurrentProgrammeField("cta", {
                                ...(currentProgramme.cta || {}),
                                showOnMobile: e.target.checked,
                              });
                            }}
                            className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
                          />
                          <span>Show on mobile</span>
                        </label>
                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                          <input
                            type="checkbox"
                            checked={currentProgramme.cta?.showOnDesktop !== false}
                            onChange={(e) => {
                              updateCurrentProgrammeField("cta", {
                                ...(currentProgramme.cta || {}),
                                showOnDesktop: e.target.checked,
                              });
                            }}
                            className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
                          />
                          <span>Show on desktop</span>
                        </label>
                      </div>
                    </div>

                    {/* Secondary Button */}
                    <div className="space-y-2 border-b border-border/40 pb-3 pt-1">
                      <div className="flex items-center justify-between">
                        <div className="text-[11px] font-bold text-foreground">Secondary Action Button (Co-Funding)</div>
                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!currentProgramme.secondaryCta?.hidden}
                            onChange={(e) => {
                              const secondary = {
                                ...(currentProgramme.secondaryCta || {}),
                                hidden: e.target.checked,
                              };
                              updateCurrentProgrammeField("secondaryCta", secondary);
                            }}
                            className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                          />
                          <span className={currentProgramme.secondaryCta?.hidden ? "text-amber-500 font-semibold" : ""}>
                            {currentProgramme.secondaryCta?.hidden ? "Hidden on page" : "Visible"}
                          </span>
                        </label>
                      </div>
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
                      <div className="flex flex-wrap gap-4 pt-1">
                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                          <input
                            type="checkbox"
                            checked={currentProgramme.secondaryCta?.showOnMobile !== false}
                            onChange={(e) => {
                              updateCurrentProgrammeField("secondaryCta", {
                                ...(currentProgramme.secondaryCta || {}),
                                showOnMobile: e.target.checked,
                              });
                            }}
                            className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
                          />
                          <span>Show on mobile</span>
                        </label>
                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                          <input
                            type="checkbox"
                            checked={currentProgramme.secondaryCta?.showOnDesktop !== false}
                            onChange={(e) => {
                              updateCurrentProgrammeField("secondaryCta", {
                                ...(currentProgramme.secondaryCta || {}),
                                showOnDesktop: e.target.checked,
                              });
                            }}
                            className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
                          />
                          <span>Show on desktop</span>
                        </label>
                      </div>
                    </div>

                    {/* All programmes Button */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <div className="text-[11px] font-bold text-foreground">All programmes Button</div>
                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!currentProgramme.allProgrammesCta?.hidden}
                            onChange={(e) => {
                              updateCurrentProgrammeField("allProgrammesCta", {
                                label: currentProgramme.allProgrammesCta?.label ?? "All programmes",
                                href: currentProgramme.allProgrammesCta?.href ?? "/programmes",
                                ...(currentProgramme.allProgrammesCta || {}),
                                hidden: e.target.checked,
                              });
                            }}
                            className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                          />
                          <span className={currentProgramme.allProgrammesCta?.hidden ? "text-amber-500 font-semibold" : ""}>
                            {currentProgramme.allProgrammesCta?.hidden ? "Hidden on page" : "Visible"}
                          </span>
                        </label>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="text-[11px] font-semibold text-muted-foreground">Label</label>
                          <Input
                            value={currentProgramme.allProgrammesCta?.label ?? "All programmes"}
                            onChange={(e) => {
                              updateCurrentProgrammeField("allProgrammesCta", {
                                href: currentProgramme.allProgrammesCta?.href ?? "/programmes",
                                ...(currentProgramme.allProgrammesCta || {}),
                                label: e.target.value,
                              });
                            }}
                            className="mt-0.5 h-8 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-muted-foreground">URL Target</label>
                          <Input
                            value={currentProgramme.allProgrammesCta?.href ?? "/programmes"}
                            onChange={(e) => {
                              updateCurrentProgrammeField("allProgrammesCta", {
                                label: currentProgramme.allProgrammesCta?.label ?? "All programmes",
                                ...(currentProgramme.allProgrammesCta || {}),
                                href: e.target.value,
                              });
                            }}
                            className="mt-0.5 h-8 text-xs font-mono"
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 pt-1">
                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                          <input
                            type="checkbox"
                            checked={currentProgramme.allProgrammesCta?.showOnMobile !== false}
                            onChange={(e) => {
                              updateCurrentProgrammeField("allProgrammesCta", {
                                label: currentProgramme.allProgrammesCta?.label ?? "All programmes",
                                href: currentProgramme.allProgrammesCta?.href ?? "/programmes",
                                ...(currentProgramme.allProgrammesCta || {}),
                                showOnMobile: e.target.checked,
                              });
                            }}
                            className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
                          />
                          <span>Show on mobile</span>
                        </label>
                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                          <input
                            type="checkbox"
                            checked={currentProgramme.allProgrammesCta?.showOnDesktop !== false}
                            onChange={(e) => {
                              updateCurrentProgrammeField("allProgrammesCta", {
                                label: currentProgramme.allProgrammesCta?.label ?? "All programmes",
                                href: currentProgramme.allProgrammesCta?.href ?? "/programmes",
                                ...(currentProgramme.allProgrammesCta || {}),
                                showOnDesktop: e.target.checked,
                              });
                            }}
                            className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
                          />
                          <span>Show on desktop</span>
                        </label>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Tip: on mobile, keep only the primary CTA. Hide secondary + All programmes to free vertical space.
                      </p>
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
          {viewMode === "split" && (
            <div className="lg:col-span-5 xl:col-span-5 sticky top-4">
              <LivePagePreview
                url={activePreviewRoute}
                pageTitle={currentPage.label}
                refreshKey={previewRefreshKey}
                onRefresh={() => setPreviewRefreshKey((k) => k + 1)}
                device={previewDevice}
                onDeviceChange={setPreviewDevice}
              />
            </div>
          )}
        </div>
      )}

      {/* Cloudflare R2 Media Asset Picker Modal */}
      {activeImagePicker?.isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-4xl max-h-[88vh] shadow-2xl rounded-2xl overflow-hidden border border-border bg-card">
            <MediaAssetPicker
              title={activeImagePicker.title}
              currentUrl={activeImagePicker.currentUrl}
              currentType="image"
              onClose={() => setActiveImagePicker(null)}
              onSelect={(media) => {
                activeImagePicker.onSelect(media.url);
                setActiveImagePicker(null);
                toast.success("Image selected from Cloudflare R2 bucket!");
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
