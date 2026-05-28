"use client";

interface DrawerHeaderProps {
  title: string;
  badge: string;
  currentStep: number;
  activeSubTab: "learn" | "documents";
  onSubTabChange: (tab: "learn" | "documents") => void;
  isCached: boolean;
  onClose: () => void;
}

export function DrawerHeader({
  title,
  badge,
  currentStep,
  activeSubTab,
  onSubTabChange,
  isCached,
  onClose,
}: DrawerHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 md:px-6 h-12 border-b border-border shrink-0 bg-background/80 backdrop-blur-xs z-20">
      <div className="flex items-center gap-2 min-w-0">
        <span className="hidden md:inline text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
          {title}
        </span>
        <span className="md:hidden text-xs font-black truncate flex items-center gap-1.5">
          <span className="text-base">{badge}</span>
          <span className="truncate">{title}</span>
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="flex rounded-lg border border-border bg-card p-0.5">
          <button
            onClick={() => onSubTabChange("learn")}
            className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
              activeSubTab === "learn"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Guided Journey
          </button>
          <button
            onClick={() => onSubTabChange("documents")}
            className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
              activeSubTab === "documents"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Documents
          </button>
        </div>

        {isCached && (
          <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-600 font-bold px-2 py-0.5 rounded-full hidden md:inline">
            📶 Cached
          </span>
        )}

        <button
          onClick={onClose}
          className="size-7 flex items-center justify-center rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
