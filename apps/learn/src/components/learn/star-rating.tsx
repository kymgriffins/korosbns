"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/utils";
import { apiFetch } from "@/lib/api-client";
import { toast } from "sonner";

interface StarRatingProps {
  contentId: string;
  contentType: string;
  initialRating?: number;
  averageRating?: number | null;
  totalRatings?: number;
  readonly?: boolean;
}

export function StarRating({ contentId, contentType, initialRating = 0, averageRating, totalRatings, readonly }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(initialRating);
  const [submitting, setSubmitting] = useState(false);

  const handleClick = async (rating: number) => {
    if (readonly || submitting) return;
    setSubmitting(true);
    try {
      await apiFetch("/engagement/feedback/", {
        method: "POST",
        body: JSON.stringify({
          content_type: contentType,
          content_id: contentId,
          rating,
          comment: "",
        }),
      });
      setSelected(rating);
      toast.success("Rating submitted!");
    } catch {
      toast.error("Failed to submit rating.");
    } finally {
      setSubmitting(false);
    }
  };

  const displayValue = averageRating ?? selected;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= (hovered || displayValue);
          return (
            <button
              key={star}
              type="button"
              disabled={readonly || submitting}
              onMouseEnter={() => !readonly && setHovered(star)}
              onMouseLeave={() => !readonly && setHovered(0)}
              onClick={() => handleClick(star)}
              className={cn(
                "p-0.5 transition-colors",
                readonly ? "cursor-default" : "cursor-pointer hover:scale-110",
              )}
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            >
              <Star
                className={cn(
                  "size-3.5 transition-all",
                  filled ? "fill-amber-400 text-amber-400" : "fill-none text-muted-foreground/30",
                )}
              />
            </button>
          );
        })}
      </div>
      {averageRating !== undefined && averageRating !== null && (
        <span className="text-[10px] font-semibold text-muted-foreground">
          {averageRating.toFixed(1)} ({totalRatings ?? 0})
        </span>
      )}
    </div>
  );
}