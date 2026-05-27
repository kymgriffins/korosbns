"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/index";
import { ArrowUpRight } from "lucide-react";

interface Button01Props {
  label?: string;
  className?: string;
  compact?: boolean;
}

export default function Button01({ label = "Get Started", className, compact }: Button01Props) {
  return (
    <Button className={cn(
      "relative text-sm font-medium rounded-full p-1 group transition-all duration-500 overflow-hidden cursor-pointer",
      compact
        ? "h-9 ps-4 pe-11 hover:ps-11 hover:pe-4"
        : "h-10 ps-4 pe-12 hover:ps-12 hover:pe-4",
      "w-fit",
      className
    )}>
      <span className="relative z-10 transition-all duration-500">{label}</span>
      <div className={cn(
        "absolute bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:rotate-45",
        compact
          ? "right-0.5 w-7 h-7 group-hover:right-[calc(100%-30px)]"
          : "right-0.5 w-8 h-8 group-hover:right-[calc(100%-34px)]"
      )}>
        <ArrowUpRight size={compact ? 13 : 14} />
      </div>
    </Button>
  );
}
