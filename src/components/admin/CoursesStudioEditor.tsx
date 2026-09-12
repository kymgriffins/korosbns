"use client";

import React, { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, GraduationCap, Video, BookOpen, ExternalLink, Image as ImageIcon, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ImageFieldControl } from "./ImageFieldControl";
import { WysiwygProseEditor } from "./WysiwygProseEditor";

interface CoursesStudioEditorProps {
  data: Record<string, any>;
  onChange: (updatedData: Record<string, any>) => void;
  onOpenMediaPicker: (onSelect: (url: string) => void) => void;
  onUploadToR2: (file: File, onSuccess: (url: string) => void) => void;
}

export function CoursesStudioEditor({
  data,
  onChange,
  onOpenMediaPicker,
  onUploadToR2,
}: CoursesStudioEditorProps) {
  const courses = (data?.results as any[]) || [];
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || "");
  const [activeTab, setActiveTab] = useState<"overview" | "videos" | "article" | "expectations">("overview");

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0] || null;

  const updateCourseField = (id: string, field: string, value: any) => {
    const updated = courses.map((c) => (c.id === id ? { ...c, [field]: value } : c));
    onChange({
      ...data,
      count: updated.length,
      results: updated,
    });
  };

  const handleAddCourse = () => {
    const id = "course-" + Date.now().toString(36);
    const newCourse = {
      id,
      slug: id,
      title: "New Civic Learning Course",
      badge: "📚",
      badgeName: "Civic Course",
      documentName: "Public Finance Management",
      status: "Published",
      credits: "Budget Ndio Story Editorial & Research Team",
      description: "An evidence-based learning course breaking down fiscal policy, public expenditure, and citizen accountability mechanisms.",
      image_url: "https://i.ytimg.com/vi/A_EXLueEMlk/hqdefault.jpg",
      order: courses.length + 1,
      expectations: [
        "Inspect public expenditure allocations against statutory benchmarks.",
        "Track budget implementation and devolution disbursements in your county.",
        "Submit formal memoranda during public participation windows.",
      ],
      steps: [
        {
          id: id + "-ch1",
          title: "Introduction & Statutory Principles",
          order: 1,
          youtube_url: "https://www.youtube.com/watch?v=A_EXLueEMlk",
          youtube_urls: ["https://www.youtube.com/watch?v=A_EXLueEMlk"],
          article_slug: id + "-companion",
          article_summary: "Written overview of the core statutory mechanisms and citizen audit techniques.",
          text: "### Course Overview\n\nUnderstand the financial mechanics, statutory frameworks, and citizen oversight powers codified in the Constitution and PFM Act.",
        },
      ],
      trivia: [],
    };

    const updated = [...courses, newCourse];
    onChange({
      ...data,
      count: updated.length,
      results: updated,
    });
    setSelectedCourseId(id);
  };

  const handleDeleteCourse = (id: string) => {
    if (courses.length <= 1) return;
    const updated = courses.filter((c) => c.id !== id);
    onChange({
      ...data,
      count: updated.length,
      results: updated,
    });
    if (selectedCourseId === id) {
      setSelectedCourseId(updated[0]?.id || "");
    }
  };

  const handleMoveCourse = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= courses.length) return;
    const updated = [...courses];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    onChange({
      ...data,
      results: updated,
    });
  };

  // Video Playlist Helpers
  const playlistUrls = (selectedCourse?.steps?.[0]?.youtube_urls as string[]) || [];

  const handleAddVideoToPlaylist = () => {
    if (!selectedCourse) return;
    const nextUrls = [...playlistUrls, "https://www.youtube.com/watch?v="];
    const steps = [...(selectedCourse.steps || [])];
    if (steps.length === 0) {
      steps.push({ id: selectedCourse.id + "-ch1", title: selectedCourse.title, youtube_urls: nextUrls });
    } else {
      steps[0] = { ...steps[0], youtube_urls: nextUrls, youtube_url: steps[0].youtube_url || nextUrls[0] };
    }
    updateCourseField(selectedCourse.id, "steps", steps);
  };

  const handleUpdateVideoUrl = (index: number, value: string) => {
    if (!selectedCourse) return;
    const nextUrls = [...playlistUrls];
    nextUrls[index] = value;
    const steps = [...(selectedCourse.steps || [])];
    steps[0] = { ...steps[0], youtube_urls: nextUrls, youtube_url: nextUrls[0] || steps[0].youtube_url };
    updateCourseField(selectedCourse.id, "steps", steps);
  };

  const handleDeleteVideoUrl = (index: number) => {
    if (!selectedCourse) return;
    const nextUrls = playlistUrls.filter((_, i) => i !== index);
    const steps = [...(selectedCourse.steps || [])];
    steps[0] = { ...steps[0], youtube_urls: nextUrls, youtube_url: nextUrls[0] || "" };
    updateCourseField(selectedCourse.id, "steps", steps);
  };

  // Expectations Helpers
  const expectations = (selectedCourse?.expectations as string[]) || [];

  const handleAddExpectation = () => {
    if (!selectedCourse) return;
    const nextExp = [...expectations, "New learning outcome or statutory take-away."];
    updateCourseField(selectedCourse.id, "expectations", nextExp);
  };

  const handleUpdateExpectation = (index: number, value: string) => {
    if (!selectedCourse) return;
    const nextExp = [...expectations];
    nextExp[index] = value;
    updateCourseField(selectedCourse.id, "expectations", nextExp);
  };

  const handleDeleteExpectation = (index: number) => {
    if (!selectedCourse) return;
    const nextExp = expectations.filter((_, i) => i !== index);
    updateCourseField(selectedCourse.id, "expectations", nextExp);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Column: Course Selector */}
      <div className="space-y-4 lg:col-span-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <div>
              <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <GraduationCap className="size-4 text-primary" />
                <span>BNSKE Courses &amp; Projects</span>
              </h2>
              <p className="text-[11px] text-muted-foreground">Manage multi-part curriculum &amp; media.</p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddCourse}
              className="gap-1 text-xs"
            >
              <Plus className="size-3" />
              <span>Add</span>
            </Button>
          </div>

          <div className="space-y-2">
            {courses.map((course: any, idx: number) => {
              const isSelected = selectedCourse?.id === course.id;
              const videoCount = course.steps?.[0]?.youtube_urls?.length || 1;
              return (
                <div
                  key={course.id || idx}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`cursor-pointer rounded-xl border p-3 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary"
                      : "border-border/60 bg-muted/20 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{course.badge || "📚"}</span>
                        <span className="rounded bg-primary/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-primary">
                          #{idx + 1}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {videoCount} {videoCount === 1 ? "Video" : "Part Series"}
                        </span>
                      </div>
                      <h3 className="line-clamp-2 text-xs font-bold text-foreground">
                        {course.title}
                      </h3>
                      <p className="text-[10px] text-muted-foreground truncate">
                        /learn/modules/{course.slug}
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={idx === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveCourse(idx, "up");
                          }}
                          className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <ArrowUp className="size-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={idx === courses.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveCourse(idx, "down");
                          }}
                          className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <ArrowDown className="size-3" />
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={courses.length <= 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCourse(course.id);
                        }}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-rose-500"
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

      {/* Right Column: Active Course Editor */}
      <div className="space-y-6 lg:col-span-8">
        {selectedCourse ? (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{selectedCourse.badge || "📚"}</span>
                  <h2 className="text-base font-bold text-foreground">{selectedCourse.title}</h2>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  Slug: {selectedCourse.slug}
                </p>
              </div>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
              >
                <a
                  href={`/learn/modules/${selectedCourse.slug}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>View Live Course</span>
                  <ExternalLink className="size-3.5 text-muted-foreground" />
                </a>
              </Button>
            </div>

            {/* Sub Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-border/60 pb-3">
              <Button
                type="button"
                size="sm"
                variant={activeTab === "overview" ? "default" : "outline"}
                onClick={() => setActiveTab("overview")}
                className="text-xs"
              >
                Course Details &amp; Cover
              </Button>
              <Button
                type="button"
                size="sm"
                variant={activeTab === "videos" ? "default" : "outline"}
                onClick={() => setActiveTab("videos")}
                className="text-xs"
              >
                Video Playlist ({playlistUrls.length})
              </Button>
              <Button
                type="button"
                size="sm"
                variant={activeTab === "expectations" ? "default" : "outline"}
                onClick={() => setActiveTab("expectations")}
                className="text-xs"
              >
                Takeaways ({expectations.length})
              </Button>
              <Button
                type="button"
                size="sm"
                variant={activeTab === "article" ? "default" : "outline"}
                onClick={() => setActiveTab("article")}
                className="text-xs"
              >
                Written Companion Article
              </Button>
            </div>

            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground">Course Title</label>
                    <Input
                      value={selectedCourse.title ?? ""}
                      onChange={(e) => updateCourseField(selectedCourse.id, "title", e.target.value)}
                      className="mt-1 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">URL Slug</label>
                    <Input
                      value={selectedCourse.slug ?? ""}
                      onChange={(e) => updateCourseField(selectedCourse.id, "slug", e.target.value)}
                      className="mt-1 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground">Emoji Badge</label>
                    <Input
                      value={selectedCourse.badge ?? "📚"}
                      onChange={(e) => updateCourseField(selectedCourse.id, "badge", e.target.value)}
                      className="mt-1 text-xs text-center text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">Category Name</label>
                    <Input
                      value={selectedCourse.badgeName ?? ""}
                      onChange={(e) => updateCourseField(selectedCourse.id, "badgeName", e.target.value)}
                      className="mt-1 text-xs"
                      placeholder="e.g. Infrastructure, Devolution"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">Statutory Reference</label>
                    <Input
                      value={selectedCourse.documentName ?? ""}
                      onChange={(e) => updateCourseField(selectedCourse.id, "documentName", e.target.value)}
                      className="mt-1 text-xs"
                      placeholder="e.g. PFM Act Section 24"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">Course Description / Mandate</label>
                  <textarea
                    rows={3}
                    value={selectedCourse.description ?? ""}
                    onChange={(e) => updateCourseField(selectedCourse.id, "description", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Provide plain stakes and why this course matters to youth and civic auditors..."
                  />
                </div>

                <ImageFieldControl
                  label="Course Cover Art / Video Poster"
                  value={selectedCourse.image_url ?? ""}
                  onChange={(val) => updateCourseField(selectedCourse.id, "image_url", val)}
                  onOpenBucket={() =>
                    onOpenMediaPicker((url) => updateCourseField(selectedCourse.id, "image_url", url))
                  }
                  description="Displays on the Learn Hub, curriculum cards, and video player headers."
                />
              </div>
            )}

            {/* VIDEO PLAYLIST TAB */}
            {activeTab === "videos" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Multi-Part YouTube Playlist
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Sequential video watch order. Part 1 is automatically showcased as the product flagship.
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddVideoToPlaylist}
                    className="gap-1 text-xs"
                  >
                    <Plus className="size-3" />
                    <span>Add Episode / Part</span>
                  </Button>
                </div>

                <div className="space-y-3">
                  {playlistUrls.map((url: string, idx: number) => {
                    const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
                    const videoId = videoIdMatch ? videoIdMatch[1] : "";
                    return (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-xl border border-border/60 bg-muted/20 p-3"
                      >
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-primary/20 px-2 py-0.5 font-mono text-xs font-bold text-primary">
                            Part {idx + 1}
                          </span>
                          {idx === 0 && (
                            <Badge variant="outline" className="text-[9px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                              Flagship Showcase
                            </Badge>
                          )}
                        </div>

                        {videoId && (
                          <div className="relative size-12 shrink-0 rounded overflow-hidden bg-black/40">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                              alt=""
                              className="size-full object-cover"
                            />
                          </div>
                        )}

                        <div className="flex-1 w-full">
                          <Input
                            value={url}
                            onChange={(e) => handleUpdateVideoUrl(idx, e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="text-xs font-mono h-8"
                          />
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteVideoUrl(idx)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-500 self-end sm:self-center"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* EXPECTATIONS TAB */}
            {activeTab === "expectations" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Learning Outcomes &amp; Takeaways
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Bullet points shown to learners before starting the course.
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddExpectation}
                    className="gap-1 text-xs"
                  >
                    <Plus className="size-3" />
                    <span>Add Outcome</span>
                  </Button>
                </div>

                <div className="space-y-2.5">
                  {expectations.map((exp: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground w-6 text-center">
                        #{idx + 1}
                      </span>
                      <Input
                        value={exp}
                        onChange={(e) => handleUpdateExpectation(idx, e.target.value)}
                        className="text-xs h-8 flex-1"
                        placeholder="Learner will understand..."
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteExpectation(idx)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-500"
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* COMPANION ARTICLE TAB */}
            {activeTab === "article" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground">Article Summary</label>
                  <Input
                    value={selectedCourse.steps?.[0]?.article_summary ?? ""}
                    onChange={(e) => {
                      const steps = [...(selectedCourse.steps || [])];
                      if (steps.length === 0) {
                        steps.push({ id: selectedCourse.id + "-ch1", title: selectedCourse.title });
                      }
                      steps[0] = { ...steps[0], article_summary: e.target.value };
                      updateCourseField(selectedCourse.id, "steps", steps);
                    }}
                    className="mt-1 text-xs"
                    placeholder="Brief 1-line thesis of this written companion..."
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Comprehensive Written Analysis (Markdown / Prose)
                  </label>
                  <div className="mt-1">
                    <WysiwygProseEditor
                      value={selectedCourse.steps?.[0]?.text ?? ""}
                      onChange={(content) => {
                        const steps = [...(selectedCourse.steps || [])];
                        if (steps.length === 0) {
                          steps.push({ id: selectedCourse.id + "-ch1", title: selectedCourse.title });
                        }
                        steps[0] = { ...steps[0], text: content };
                        updateCourseField(selectedCourse.id, "steps", steps);
                      }}
                      placeholder="Write the full companion article with headings, statutory citations, and analysis..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center text-muted-foreground border border-dashed rounded-2xl">
            Select a course from the left or click &ldquo;Add&rdquo;.
          </div>
        )}
      </div>
    </div>
  );
}
