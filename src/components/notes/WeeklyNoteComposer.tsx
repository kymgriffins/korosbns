"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Loader2, Save, Send } from "lucide-react";
import type { WeeklyNoteCreateApi, WeeklyNoteApi } from "@/types/notes";
import { citizenApi } from "@/lib/api-client";
import { toast } from "sonner";

type FormData = WeeklyNoteCreateApi;

type Props = {
  existingNote?: WeeklyNoteApi;
  onSaved: (note: WeeklyNoteApi) => void;
};

export function WeeklyNoteComposer({ existingNote, onSaved }: Props) {
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    defaultValues: {
      week_label: existingNote?.week_label || "",
      title: existingNote?.title || "",
      content: existingNote?.content || "",
    },
  });

  const content = watch("content");

  const autoSave = useCallback(async () => {
    if (!isDirty) return;
    setSaving(true);
    try {
      const formValues = { week_label: watch("week_label"), title: watch("title"), content: watch("content") };
      if (existingNote) {
        const updated = await citizenApi.updateWeeklyNote(existingNote.id, formValues);
        onSaved(updated);
      } else {
        const created = await citizenApi.createWeeklyNote(formValues);
        onSaved(created);
      }
      setLastSaved(new Date());
    } catch {
      toast.error("Auto-save failed");
    } finally {
      setSaving(false);
    }
  }, [isDirty, existingNote, onSaved, watch]);

  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(autoSave, 30000);
    return () => clearTimeout(timer);
  }, [content, isDirty, autoSave]);

  const onSubmit = async (data: FormData) => {
    setPublishing(true);
    try {
      let note: WeeklyNoteApi;
      if (existingNote) {
        note = await citizenApi.updateWeeklyNote(existingNote.id, data);
      } else {
        note = await citizenApi.createWeeklyNote(data);
      }
      onSaved(note);
      toast.success("Note saved");
    } catch {
      toast.error("Failed to save note");
    } finally {
      setPublishing(false);
    }
  };

  const handlePublish = async () => {
    if (!existingNote) return;
    setPublishing(true);
    try {
      const note = await citizenApi.publishWeeklyNote(existingNote.id);
      onSaved(note);
      toast.success("Note published");
    } catch {
      toast.error("Failed to publish");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="week_label">
          <Calendar className="size-4 inline mr-1" />
          Week Label
        </Label>
        <Input
          id="week_label"
          placeholder="e.g. Week 12 - March 17-23"
          {...register("week_label", { required: "Week label is required" })}
        />
        {errors.week_label && (
          <p className="text-xs text-destructive">{errors.week_label.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Weekly note title"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          rows={12}
          placeholder="Write your weekly note here..."
          {...register("content", { required: "Content is required" })}
        />
        {errors.content && (
          <p className="text-xs text-destructive">{errors.content.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {saving && (
            <>
              <Loader2 className="size-3 animate-spin" />
              Saving...
            </>
          )}
          {lastSaved && !saving && (
            <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={publishing}>
            <Save className="size-4 mr-1" />
            Save
          </Button>
          {existingNote && existingNote.status === "draft" && (
            <Button
              type="button"
              variant="secondary"
              onClick={handlePublish}
              disabled={publishing}
            >
              <Send className="size-4 mr-1" />
              Publish
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
