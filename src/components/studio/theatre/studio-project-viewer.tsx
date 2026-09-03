"use client";

import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { FormatPodcastPage } from "@/components/studio/format-pages/format-podcast-page";
import { FormatDocumentaryPage } from "@/components/studio/format-pages/format-documentary-page";
import { FormatExplainerPage } from "@/components/studio/format-pages/format-explainer-page";
import { FormatAnimationPage } from "@/components/studio/format-pages/format-animation-page";
import { FormatDossierPage } from "@/components/studio/format-pages/format-dossier-page";
import { FormatSeriesPage } from "@/components/studio/format-pages/format-series-page";
import { FormatConveningPage } from "@/components/studio/format-pages/format-convening-page";
import { FormatListeningPage } from "@/components/studio/format-pages/format-listening-page";

type Props = {
  project: StudioProjectEvidence;
};

/**
 * Dispatches each project to its own category-designed page —
 * podcasts read like episodes, films like films, dossiers like dossiers.
 */
export function StudioProjectViewer({ project }: Props) {
  switch (project.contentType) {
    case "Podcast & Audio":
      return <FormatPodcastPage project={project} />;
    case "Documentaries":
      return <FormatDocumentaryPage project={project} />;
    case "Animations":
      return <FormatAnimationPage project={project} />;
    case "Research Spotlights":
      return <FormatDossierPage project={project} />;
    case "Social Media Series":
      return <FormatSeriesPage project={project} />;
    case "Town Hall Design & Facilitation":
      return <FormatConveningPage project={project} />;
    case "Community Listening Sessions":
      return <FormatListeningPage project={project} />;
    case "Explainer Videos":
    default:
      return <FormatExplainerPage project={project} />;
  }
}
