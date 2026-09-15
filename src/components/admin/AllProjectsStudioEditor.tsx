"use client";

import React, { useState, useMemo } from "react";
import {
  Database,
  Search,
  Plus,
  Trash2,
  ExternalLink,
  Edit3,
  Check,
  ChevronDown,
  ChevronUp,
  Film,
  Building2,
  Code2,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CmsCollectionJsonEditor } from "./CmsCollectionJsonEditor";

export interface ProjectMedia {
  type?: string;
  posterUrl?: string;
  posterPosition?: string;
  videoUrl?: string;
  videoUrlFr?: string;
  platform?: string;
  aspectRatio?: string;
}

export interface ImpactEvidence {
  primaryMetric?: string;
  context?: string;
  verificationOutcome?: string;
}

export interface EvidenceProject {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  contentType?: string;
  organizationId?: string;
  date?: string;
  year?: string;
  briefChallenge?: string;
  whatWeProduced?: string;
  description?: string;
  programmeSlug?: string;
  media?: ProjectMedia;
  outputs?: string[];
  impactEvidence?: ImpactEvidence;
  [key: string]: any;
}

export interface OrganizationMeta {
  id: string;
  slug: string;
  name: string;
  sector?: string;
  description?: string;
  location?: string;
  logoText?: string;
  [key: string]: any;
}

interface AllProjectsStudioEditorProps {
  data: Record<string, any>;
  onChange: (next: Record<string, any>) => void;
}

export function AllProjectsStudioEditor({
  data,
  onChange,
}: AllProjectsStudioEditorProps) {
  const [viewMode, setViewMode] = useState<"visual" | "json">("visual");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrgFilter, setSelectedOrgFilter] = useState("all");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("all");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const rawProjects: EvidenceProject[] = Array.isArray(data.projects)
    ? data.projects
    : [];
  const rawOrganizations: OrganizationMeta[] = Array.isArray(data.organizations)
    ? data.organizations
    : [];

  // Lookup map for organization names
  const orgNameMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const org of rawOrganizations) {
      map.set(org.id, org.name);
      if (org.slug) map.set(org.slug, org.name);
    }
    return map;
  }, [rawOrganizations]);

  // Unique content types
  const contentTypes = useMemo(() => {
    const types = new Set<string>();
    for (const p of rawProjects) {
      if (p.contentType) types.add(p.contentType);
    }
    return Array.from(types);
  }, [rawProjects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return rawProjects.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
        (p.slug && p.slug.toLowerCase().includes(q)) ||
        (p.briefChallenge && p.briefChallenge.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.organizationId && p.organizationId.toLowerCase().includes(q)) ||
        (orgNameMap.get(p.organizationId || "") || "").toLowerCase().includes(q);

      const matchesOrg =
        selectedOrgFilter === "all" ||
        p.organizationId === selectedOrgFilter;

      const matchesType =
        selectedTypeFilter === "all" ||
        p.contentType === selectedTypeFilter;

      return matchesQuery && matchesOrg && matchesType;
    });
  }, [rawProjects, searchQuery, selectedOrgFilter, selectedTypeFilter, orgNameMap]);

  // Update a single project by id
  const handleUpdateProject = (id: string, updates: Partial<EvidenceProject>) => {
    const updated = rawProjects.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );
    onChange({ ...data, projects: updated });
  };

  // Update nested media prop
  const handleUpdateProjectMedia = (
    id: string,
    field: keyof ProjectMedia,
    value: string
  ) => {
    const updated = rawProjects.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          media: {
            ...(p.media || {}),
            [field]: value,
          },
        };
      }
      return p;
    });
    onChange({ ...data, projects: updated });
  };

  // Add a brand new project
  const handleAddProject = () => {
    const newId = `project-${Date.now()}`;
    const newProject: EvidenceProject = {
      id: newId,
      slug: newId,
      title: "New Civic Project",
      subtitle: "Civic Investigation & Evidence",
      contentType: "Documentaries",
      organizationId: rawOrganizations[0]?.id || "bns",
      date: new Date().toISOString().slice(0, 10),
      year: String(new Date().getFullYear()),
      briefChallenge: "Describe the civic issue or public finance challenge addressed.",
      whatWeProduced: "Explain the media, evidence dossier, or citizen report produced.",
      description: "Detailed overview of the project and citizen impact.",
      media: {
        type: "video",
        posterUrl: "",
        videoUrl: "",
      },
      outputs: ["Civic Evidence Dossier"],
    };

    onChange({ ...data, projects: [newProject, ...rawProjects] });
    setEditingProjectId(newId);
  };

  // Delete a project
  const handleDeleteProject = (id: string) => {
    if (!confirm("Are you sure you want to delete this project from the database?")) {
      return;
    }
    const updated = rawProjects.filter((p) => p.id !== id);
    onChange({ ...data, projects: updated });
    if (editingProjectId === id) setEditingProjectId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Database Overview */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-primary/20 bg-primary/10 font-mono text-xs font-semibold text-primary"
              >
                Canonical Database
              </Badge>
              <Badge variant="outline" className="text-[10px] font-medium text-emerald-600 bg-emerald-500/10 border-emerald-500/20">
                {rawProjects.length} Master Projects
              </Badge>
              <Badge variant="outline" className="text-[10px] font-medium text-blue-600 bg-blue-500/10 border-blue-500/20">
                {rawOrganizations.length} Partners
              </Badge>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              All Projects Master Database
            </h1>
            <p className="text-xs text-muted-foreground">
              Authoritative project store for all civic investigations, films, and trackers.
              Feeds <code className="font-mono text-primary">/work</code>, programme evidence grids, and dossier detail routes.
            </p>
          </div>

          {/* Mode Switcher & Add Button */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-border bg-muted/50 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("visual")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-all ${
                  viewMode === "visual"
                    ? "bg-background font-bold text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Layers className="size-3.5" />
                <span>Visual Studio</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("json")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-all ${
                  viewMode === "json"
                    ? "bg-background font-bold text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Code2 className="size-3.5" />
                <span>Raw JSON</span>
              </button>
            </div>

            <Button
              type="button"
              size="sm"
              onClick={handleAddProject}
              className="gap-1.5 bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="size-3.5" />
              <span>Add Project</span>
            </Button>
          </div>
        </div>

        {/* Search & Filter Bar (Only in Visual Mode) */}
        {viewMode === "visual" && (
          <div className="mt-6 flex flex-col gap-3 border-t border-border/50 pt-4 sm:flex-row sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects by title, challenge, partner, or tags..."
                className="h-8 pl-8 text-xs"
              />
            </div>

            {/* Filter by Organization */}
            <select
              value={selectedOrgFilter}
              onChange={(e) => setSelectedOrgFilter(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none"
            >
              <option value="all">All Partners ({rawOrganizations.length})</option>
              {rawOrganizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>

            {/* Filter by Content Type */}
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none"
            >
              <option value="all">All Formats ({contentTypes.length})</option>
              {contentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {(searchQuery || selectedOrgFilter !== "all" || selectedTypeFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedOrgFilter("all");
                  setSelectedTypeFilter("all");
                }}
                className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                Reset
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Raw JSON View */}
      {viewMode === "json" ? (
        <CmsCollectionJsonEditor
          title="Canonical Project Store (studios-evidence.json)"
          description="Direct schema modification for organizations and projects."
          data={data}
          onChange={onChange}
        />
      ) : (
        /* Visual Cards & Inline Editor View */
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Showing {filteredProjects.length} of {rawProjects.length} Projects
            </span>
            <span className="text-xs text-muted-foreground">
              Click &ldquo;Edit&rdquo; on any project to modify its title, challenge, poster, or outputs.
            </span>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-8 text-center">
              <Database className="size-8 text-muted-foreground/50" />
              <p className="mt-2 text-sm font-semibold text-foreground">No projects found</p>
              <p className="text-xs text-muted-foreground">
                Try adjusting your search query or reset the partner and format filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredProjects.map((project) => {
                const isEditing = editingProjectId === project.id;
                const orgName = orgNameMap.get(project.organizationId || "") || project.organizationId;
                const poster = project.media?.posterUrl || "/images/media/129A4039.jpg";

                return (
                  <div
                    key={project.id}
                    className={`rounded-xl border bg-card transition-all ${
                      isEditing
                        ? "border-primary shadow-sm"
                        : "border-border hover:border-border/80"
                    }`}
                  >
                    {/* Project Header Row */}
                    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-4">
                        {/* Thumbnail preview */}
                        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-border/70 bg-muted">
                          {poster ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={poster}
                              alt={project.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                              <Film className="size-5" />
                            </div>
                          )}
                        </div>

                        {/* Title & Metadata */}
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-semibold text-sm text-foreground">
                              {project.title}
                            </span>
                            {project.year && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono">
                                {project.year}
                              </Badge>
                            )}
                            {project.contentType && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-primary/5 text-primary border-primary/20 font-medium">
                                {project.contentType}
                              </Badge>
                            )}
                            {orgName && (
                              <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                                <Building2 className="size-3 text-muted-foreground" />
                                {orgName}
                              </span>
                            )}
                          </div>

                          {project.subtitle && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {project.subtitle}
                            </p>
                          )}

                          {project.briefChallenge && (
                            <p className="text-xs text-muted-foreground/80 line-clamp-2">
                              {project.briefChallenge}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex items-center gap-1.5 self-end sm:self-start">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          asChild
                          className="h-7 gap-1 px-2 text-xs"
                        >
                          <a
                            href={`/work`}
                            target="_blank"
                            rel="noreferrer"
                            title="View on public portfolio"
                          >
                            <span>Live /work</span>
                            <ExternalLink className="size-3 text-muted-foreground" />
                          </a>
                        </Button>

                        <Button
                          type="button"
                          variant={isEditing ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            setEditingProjectId(isEditing ? null : project.id)
                          }
                          className="h-7 gap-1 px-2.5 text-xs font-semibold"
                        >
                          <Edit3 className="size-3" />
                          <span>{isEditing ? "Close Editor" : "Edit"}</span>
                          {isEditing ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-rose-600"
                          title="Delete Project"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Inline Editing Drawer */}
                    {isEditing && (
                      <div className="border-t border-border bg-muted/20 p-5 space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          <div>
                            <label className="text-[11px] font-semibold text-foreground">
                              Project Title
                            </label>
                            <Input
                              value={project.title ?? ""}
                              onChange={(e) =>
                                handleUpdateProject(project.id, { title: e.target.value })
                              }
                              className="mt-1 h-8 text-xs font-bold"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-foreground">
                              URL Slug
                            </label>
                            <Input
                              value={project.slug ?? ""}
                              onChange={(e) =>
                                handleUpdateProject(project.id, { slug: e.target.value })
                              }
                              className="mt-1 h-8 text-xs font-mono"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-foreground">
                              Format / Content Type
                            </label>
                            <Input
                              value={project.contentType ?? ""}
                              onChange={(e) =>
                                handleUpdateProject(project.id, { contentType: e.target.value })
                              }
                              placeholder="Documentaries, Toolkits, Field Reports..."
                              className="mt-1 h-8 text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-foreground">
                              Partner Organization
                            </label>
                            <select
                              value={project.organizationId ?? ""}
                              onChange={(e) =>
                                handleUpdateProject(project.id, { organizationId: e.target.value })
                              }
                              className="mt-1 flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs text-foreground"
                            >
                              {rawOrganizations.map((org) => (
                                <option key={org.id} value={org.id}>
                                  {org.name} ({org.id})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-foreground">
                              Production Year
                            </label>
                            <Input
                              value={project.year ?? ""}
                              onChange={(e) =>
                                handleUpdateProject(project.id, { year: e.target.value })
                              }
                              className="mt-1 h-8 text-xs font-mono"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-foreground">
                              Release Date (YYYY-MM-DD)
                            </label>
                            <Input
                              value={project.date ?? ""}
                              onChange={(e) =>
                                handleUpdateProject(project.id, { date: e.target.value })
                              }
                              className="mt-1 h-8 text-xs font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-foreground">
                            Subtitle / Mandate Tagline
                          </label>
                          <Input
                            value={project.subtitle ?? ""}
                            onChange={(e) =>
                              handleUpdateProject(project.id, { subtitle: e.target.value })
                            }
                            className="mt-1 h-8 text-xs"
                          />
                        </div>

                        {/* Media Links */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="text-[11px] font-semibold text-foreground">
                              Poster Image URL
                            </label>
                            <Input
                              value={project.media?.posterUrl ?? ""}
                              onChange={(e) =>
                                handleUpdateProjectMedia(project.id, "posterUrl", e.target.value)
                              }
                              placeholder="https://... or /images/..."
                              className="mt-1 h-8 text-xs font-mono"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-foreground">
                              Video Embed URL (YouTube or R2 MP4)
                            </label>
                            <Input
                              value={project.media?.videoUrl ?? ""}
                              onChange={(e) =>
                                handleUpdateProjectMedia(project.id, "videoUrl", e.target.value)
                              }
                              placeholder="https://www.youtube.com/watch?v=..."
                              className="mt-1 h-8 text-xs font-mono"
                            />
                          </div>
                        </div>

                        {/* Text Fields */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="text-[11px] font-semibold text-foreground">
                              Brief Challenge / Civic Context
                            </label>
                            <textarea
                              value={project.briefChallenge ?? ""}
                              onChange={(e) =>
                                handleUpdateProject(project.id, { briefChallenge: e.target.value })
                              }
                              rows={3}
                              className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs text-foreground focus-visible:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-foreground">
                              What We Produced / Outputs
                            </label>
                            <textarea
                              value={project.whatWeProduced ?? ""}
                              onChange={(e) =>
                                handleUpdateProject(project.id, { whatWeProduced: e.target.value })
                              }
                              rows={3}
                              className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs text-foreground focus-visible:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-foreground">
                            Full Narrative Description
                          </label>
                          <textarea
                            value={project.description ?? ""}
                            onChange={(e) =>
                              handleUpdateProject(project.id, { description: e.target.value })
                            }
                            rows={3}
                            className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs text-foreground focus-visible:outline-none"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => setEditingProjectId(null)}
                            className="gap-1 bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700"
                          >
                            <Check className="size-3" />
                            <span>Done Editing Card</span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
