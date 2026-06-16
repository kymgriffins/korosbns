"use client";

import React, { useRef, useState } from "react";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { BitmojiAvatar, FemaleBitmoji, MaleBitmoji, type Gender } from "./bitmoji-avatar";
import { cn } from "@/utils";
import { citizenApi } from "@/lib/api-client";
import { Button } from "@/ui/button";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface ProfileAvatarEditorProps {
  avatarUrl?: string | null;
  gender?: Gender | null;
  size?: "md" | "lg" | "xl";
  className?: string;
  disabled?: boolean;
  onAvatarUrlChange?: (url: string | null) => void;
  onGenderChange?: (gender: Gender) => void;
  onSaved?: (avatarUrl: string | null) => void;
}

export function ProfileAvatarEditor({
  avatarUrl,
  gender,
  size = "xl",
  className,
  disabled = false,
  onAvatarUrlChange,
  onGenderChange,
  onSaved,
}: ProfileAvatarEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);

  const displayUrl = previewUrl ?? avatarUrl ?? null;
  const sizeClass = size === "lg" ? "size-16 md:size-20" : size === "md" ? "size-14" : "size-16 md:size-20";

  const handleFile = async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Use a JPEG, PNG, WebP, or GIF image");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error("Image must be under 2 MB");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setUploading(true);
    try {
      const updated = await citizenApi.patchMeAvatar(file);
      const resolved = updated.avatar_url ?? updated.avatar ?? objectUrl;
      onAvatarUrlChange?.(resolved);
      onSaved?.(resolved ?? null);
      toast.success("Profile photo updated");
      setEditing(false);
    } catch (err) {
      setPreviewUrl(null);
      toast.error(err instanceof Error ? err.message : "Could not upload photo");
    } finally {
      setUploading(false);
    }
  };

  const clearAvatar = async () => {
    setUploading(true);
    try {
      await citizenApi.patchMe({ avatar_url: null });
      setPreviewUrl(null);
      onAvatarUrlChange?.(null);
      onSaved?.(null);
      toast.success("Photo removed");
      setEditing(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not remove photo");
    } finally {
      setUploading(false);
    }
  };

  const selectGender = (next: Gender) => {
    onGenderChange?.(next);
    setEditing(false);
  };

  return (
    <div className={cn("relative shrink-0", className)}>
      <button
        type="button"
        disabled={disabled || uploading}
        onClick={() => setEditing((v) => !v)}
        className={cn(
          "group relative overflow-hidden rounded-full border-2 border-white/30 shadow-md transition-transform hover:scale-[1.02]",
          sizeClass,
          disabled && "pointer-events-none opacity-60",
        )}
        aria-label="Change profile photo"
      >
        {displayUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displayUrl} alt="" className="size-full object-cover" />
        ) : (
          <BitmojiAvatar gender={gender} size={size} className="size-full rounded-full" />
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          {uploading ? <Loader2 className="size-5 animate-spin text-white" /> : <Camera className="size-5 text-white" />}
        </span>
      </button>

      {editing && !disabled && (
        <div className="absolute left-0 top-full z-20 mt-2 w-56 rounded-xl border border-border/60 bg-card p-3 shadow-lg ring-1 ring-border/40">
          <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Profile photo</p>
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => selectGender("female")}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-lg border p-2 transition-colors",
                gender === "female" ? "border-pink-400 bg-pink-500/10" : "border-border/50 hover:bg-muted/30",
              )}
            >
              <FemaleBitmoji selected={gender === "female"} className="size-10" />
              <span className="text-[9px] font-bold text-muted-foreground">Bitmoji</span>
            </button>
            <button
              type="button"
              onClick={() => selectGender("male")}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-lg border p-2 transition-colors",
                gender === "male" ? "border-blue-400 bg-blue-500/10" : "border-border/50 hover:bg-muted/30",
              )}
            >
              <MaleBitmoji selected={gender === "male"} className="size-10" />
              <span className="text-[9px] font-bold text-muted-foreground">Bitmoji</span>
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = "";
            }}
          />
          <div className="flex flex-col gap-1.5">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="h-8 w-full text-xs font-bold"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              Upload photo
            </Button>
            {displayUrl && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-8 w-full text-xs font-bold text-destructive hover:text-destructive"
                disabled={uploading}
                onClick={() => void clearAvatar()}
              >
                <Trash2 className="mr-1 size-3.5" />
                Remove photo
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
