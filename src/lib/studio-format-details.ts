import type {
  StudioFormatAgendaItem,
  StudioFormatChapter,
  StudioFormatCredit,
  StudioFormatFinding,
  StudioFormatVoice,
  StudioProjectEvidence,
} from "@/data/studios-evidence";
import { projectGallery } from "@/lib/studio-presentation";

export type GalleryImage = {
  url: string;
  caption?: string;
  position?: string;
};

/** Poster + gallery + field-image fill — every format page stays image-rich. */
export function galleryImagesFor(
  project: StudioProjectEvidence,
  fieldImages: { src: string; alt: string }[],
  fillCount = 6,
): { gallery: GalleryImage[]; extra: { src: string; alt: string }[] } {
  const gallery: GalleryImage[] = [
    {
      url: project.media.posterUrl,
      caption: project.media.caption ?? project.title,
      position: project.media.posterPosition,
    },
    ...projectGallery(project),
  ];
  const extra = fieldImages.slice(0, Math.max(0, fillCount - gallery.length));
  return { gallery, extra };
}

/** Chapters (explainers, podcasts) — seeded or derived from outputs. */
export function chaptersFor(project: StudioProjectEvidence): StudioFormatChapter[] {
  if (project.formatDetails?.chapters?.length) return project.formatDetails.chapters;
  return project.outputs.map((output) => ({ title: output }));
}

/** Key findings (dossiers, listening) — seeded or derived from outputs. */
export function findingsFor(project: StudioProjectEvidence): StudioFormatFinding[] {
  if (project.formatDetails?.findings?.length) return project.formatDetails.findings;
  return project.outputs.slice(0, 4).map((output) => ({ title: output }));
}

/** Agenda (convenings) — seeded or derived from outputs. */
export function agendaFor(project: StudioProjectEvidence): StudioFormatAgendaItem[] {
  if (project.formatDetails?.agenda?.length) return project.formatDetails.agenda;
  return project.outputs.map((output) => ({ title: output }));
}

/** Voices — always real text: partner description + production field note. */
export function voicesFor(project: StudioProjectEvidence): StudioFormatVoice[] {
  if (project.formatDetails?.voices?.length) return project.formatDetails.voices;
  const voices: StudioFormatVoice[] = [
    {
      quote: project.organization.description,
      name: project.organization.name,
      role: project.organization.sector,
    },
  ];
  const firstSentence = project.description.split(/(?<=\.)\s+/)[0]?.trim();
  if (firstSentence) {
    voices.push({
      quote: firstSentence,
      name: "Production notes",
      role: "BNS Studios field log",
    });
  }
  return voices;
}

/** Credits roll — partner, place, year, delivery, format. */
export function creditsFor(project: StudioProjectEvidence): StudioFormatCredit[] {
  if (project.formatDetails?.credits?.length) return project.formatDetails.credits;
  return [
    { role: "Partner", name: project.organization.name },
    { role: "Location", name: project.organization.location },
    { role: "Year", name: project.year },
    { role: "Delivery", name: project.deliveryMode.replace("-", " ") },
    { role: "Format", name: project.contentType },
  ];
}
