"use client";

import type { ProgrammeBlock } from "@/content";
import { ConnectScrollytelling } from "@/components/programmes/scrollytelling/connect-scrollytelling";
import { MashinaniScrollytelling } from "@/components/programmes/scrollytelling/mashinani-scrollytelling";
import { WanahabariScrollytelling } from "@/components/programmes/scrollytelling/wanahabari-scrollytelling";
import { StudiosScrollytelling } from "@/components/programmes/scrollytelling/studios-scrollytelling";

export function ProgrammeDetail({ programme }: { programme: ProgrammeBlock }) {
  if (programme.slug === "connect") {
    return (
      <div className="prog-page bg-background text-foreground selection:bg-primary/20">
        <ConnectScrollytelling />
      </div>
    );
  }

  if (programme.slug === "mashinani") {
    return (
      <div className="prog-page bg-background text-foreground selection:bg-amber-500/20">
        <MashinaniScrollytelling />
      </div>
    );
  }

  if (programme.slug === "wanahabari-lab") {
    return (
      <div className="prog-page bg-background text-foreground selection:bg-red-500/20">
        <WanahabariScrollytelling />
      </div>
    );
  }

  if (programme.slug === "studios") {
    return (
      <div className="prog-page bg-background text-foreground selection:bg-primary/20">
        <StudiosScrollytelling />
      </div>
    );
  }

  // Fallback
  return (
    <div className="prog-page bg-background text-foreground selection:bg-primary/20">
      <ConnectScrollytelling />
    </div>
  );
}
