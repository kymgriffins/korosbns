"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { StarRating } from "./star-rating";

interface RatingSectionProps {
  contentId: string;
  contentType: string;
  readonly?: boolean;
}

export function RatingSection({ contentId, contentType, readonly }: RatingSectionProps) {
  const { data } = useQuery({
    queryKey: ["rating", contentType, contentId],
    queryFn: () =>
      apiFetch<{
        average_rating: number | null;
        total_ratings: number;
      }>(`/engagement/feedback/summary/?content_type=${contentType}&content_id=${contentId}`),
    staleTime: 1000 * 60,
  });

  return (
    <StarRating
      contentId={contentId}
      contentType={contentType}
      averageRating={data?.average_rating ?? null}
      totalRatings={data?.total_ratings ?? 0}
      readonly={readonly}
    />
  );
}