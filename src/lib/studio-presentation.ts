import type { StudioProjectEvidence } from "@/data/studios-evidence";

export type StudioPanelId =
  | "overview"
  | "watch"
  | "listen"
  | "gallery"
  | "behind";

export type StudioGalleryImage = {
  url: string;
  caption?: string;
  position?: string;
};

export function projectHasVideo(project: StudioProjectEvidence): boolean {
  return (
    project.media.type === "video" ||
    project.media.type === "animation" ||
    Boolean(project.media.videoUrl)
  );
}

export function projectHasAudio(project: StudioProjectEvidence): boolean {
  return project.media.type === "audio" || Boolean(project.media.audioUrl);
}

export function projectGallery(
  project: StudioProjectEvidence,
): StudioGalleryImage[] {
  return project.media.gallery ?? [];
}

export function projectHasGallery(project: StudioProjectEvidence): boolean {
  return projectGallery(project).length > 0;
}

export function projectHasBehind(project: StudioProjectEvidence): boolean {
  return (
    project.outputs.some((o) => /b-roll|photo|still|archive|interview/i.test(o)) ||
    project.tags.some((t) => /forum|production|stakeholder/i.test(t))
  );
}

export function getStudioPanels(project: StudioProjectEvidence): StudioPanelId[] {
  const panels: StudioPanelId[] = ["overview"];
  if (projectHasVideo(project)) panels.push("watch");
  if (projectHasAudio(project)) panels.push("listen");
  if (projectHasGallery(project)) panels.push("gallery");
  if (projectHasBehind(project)) panels.push("behind");
  return panels;
}

export function defaultStudioPanel(project: StudioProjectEvidence): StudioPanelId {
  if (projectHasVideo(project)) return "watch";
  if (projectHasAudio(project)) return "listen";
  if (projectHasGallery(project)) return "gallery";
  return "overview";
}

export function panelLabel(panel: StudioPanelId): string {
  switch (panel) {
    case "overview":
      return "Overview";
    case "watch":
      return "Watch";
    case "listen":
      return "Listen";
    case "gallery":
      return "Gallery";
    case "behind":
      return "Behind the scenes";
    default:
      return panel;
  }
}
