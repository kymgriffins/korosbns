"use client";

import { BookOpen, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTeachingOptional } from "./teaching-context";

type Props = {
  title?: string;
  description?: string;
};

export function TeachingToggle({
  title = "Teaching tips",
  description = "Page guides and button tips. Mute anytime — nothing is required.",
}: Props) {
  const teaching = useTeachingOptional();

  if (!teaching) return null;

  const { muted, setMuted, resetDismissals, ready } = teaching;

  if (!ready) {
    return (
      <Button size="icon" variant="ghost" className="size-8" aria-hidden disabled>
        <BookOpen className="size-4 opacity-40" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="size-8"
          aria-label={muted ? "Teaching muted — open options" : "Teaching tips on — open options"}
          title={muted ? "Teaching muted" : "Teaching tips"}
        >
          {muted ? <VolumeX className="size-4 text-muted-foreground" /> : <BookOpen className="size-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <p className="px-2 pb-2 text-xs text-muted-foreground">{description}</p>
        <DropdownMenuSeparator />
        {muted ? (
          <DropdownMenuItem onSelect={() => setMuted(false)}>Turn teaching tips on</DropdownMenuItem>
        ) : (
          <DropdownMenuItem onSelect={() => setMuted(true)}>Mute all teaching tips</DropdownMenuItem>
        )}
        <DropdownMenuItem
          onSelect={() => {
            resetDismissals();
            setMuted(false);
          }}
        >
          Restore dismissed page guides
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
