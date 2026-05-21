"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import Wrapper from "@/components/global/wrapper";
import { Routes } from "@/constants/routes";
import {
  contentLoadErrorMessage,
  loadEventDetail,
  type HubEvent,
} from "@/lib/citizen-content";

export default function EventDetailPage() {
  const params = useParams();
  const id = String(params.id || "");
  const [event, setEvent] = useState<HubEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    void loadEventDetail(id)
      .then(setEvent)
      .catch((err) => setError(contentLoadErrorMessage(err, "event")))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <Wrapper className="py-16">
      <article className="max-w-3xl mx-auto">
        <Link
          href={Routes.Events}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="size-4" />
          All events
        </Link>
        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="size-8 animate-spin" />
          </div>
        )}
        {error && <p className="text-destructive">{error}</p>}
        {event && (
          <>
            <h1 className="text-3xl lg:text-4xl font-bold">{event.title}</h1>
            {event.starts_at ? (
              <p className="text-muted-foreground mt-2">
                {new Date(event.starts_at).toLocaleString()}
              </p>
            ) : null}
            {event.location ? (
              <p className="text-muted-foreground">{event.location}</p>
            ) : null}
            {event.location_url ? (
              <a
                href={event.location_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline mt-2"
              >
                <ExternalLink className="size-4" />
                Event location & materials
              </a>
            ) : null}
            {event.galleries && event.galleries.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {event.galleries.map((gallery) => (
                  <li key={gallery.id || gallery.url}>
                    <a
                      href={gallery.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="size-4" />
                      {gallery.label || "Photo gallery"}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            {event.body_html ? (
              <div
                className="notion-content-wrapper mt-8"
                dangerouslySetInnerHTML={{ __html: event.body_html }}
              />
            ) : (
              <div className="prose dark:prose-invert max-w-none mt-8 whitespace-pre-wrap">
                {event.body || event.snippet}
              </div>
            )}
          </>
        )}
      </article>
    </Wrapper>
  );
}
