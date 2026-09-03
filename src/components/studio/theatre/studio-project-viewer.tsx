"use client";

import { useEffect, useState } from "react";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { resolveCmsProject } from "@/data/studio-cms";
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
  // Merge CMS draft overlays on the client (localStorage previews).
  const [live, setLive] = useState(project);
  useEffect(() => {
    setLive(resolveCmsProject(project.slug) ?? project);
  }, [project]);
  const contentType = live.contentType;

  switch (contentType) {
    case "Podcast & Audio":
      return <FormatPodcastPage project={live} />;
    case "Documentaries":
      return <FormatDocumentaryPage project={live} />;
    case "Animations":
      return <FormatAnimationPage project={live} />;
    case "Research Spotlights":
      return <FormatDossierPage project={live} />;
    case "Social Media Series":
      return <FormatSeriesPage project={live} />;
    case "Town Hall Design & Facilitation":
      return <FormatConveningPage project={live} />;
    case "Community Listening Sessions":
      return <FormatListeningPage project={live} />;
    case "Explainer Videos":
    default:
      return <FormatExplainerPage project={live} />;
  }
}
