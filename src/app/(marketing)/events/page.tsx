"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import Wrapper from "@/components/global/wrapper";
import { Routes } from "@/constants/routes";
import {
  contentLoadErrorMessage,
  loadEventList,
  type HubEvent,
} from "@/lib/citizen-content";

import { formatInNairobi } from "@/lib/datetime";

function formatWhen(iso: string): string {
  return formatInNairobi(iso);
}

export default function EventsPage() {
  const [events, setEvents] = useState<HubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void loadEventList()
      .then(setEvents)
      .catch((err) => setError(contentLoadErrorMessage(err, "events")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Wrapper className="py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Events</h1>
        <p className="text-muted-foreground mb-10">
          Civic events and gatherings from the BNSKE content API.
        </p>
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="size-8 animate-spin" />
          </div>
        )}
        {error && <p className="text-destructive">{error}</p>}
        <div className="grid gap-6">
          {events.map((event) => (
            <Link
              key={event.id}
              href={Routes.Event(event.id)}
              className="block rounded-xl border border-border p-6 hover:border-primary/40 transition-colors"
            >
              <h2 className="text-xl font-semibold">{event.title}</h2>
              {event.starts_at ? (
                <p className="text-sm text-muted-foreground mt-1">{formatWhen(event.starts_at)}</p>
              ) : null}
              {event.location ? (
                <p className="text-sm text-muted-foreground">{event.location}</p>
              ) : null}
              <p className="mt-3 text-muted-foreground line-clamp-2">{event.snippet}</p>
            </Link>
          ))}
        </div>
        {!loading && !error && events.length === 0 && (
          <p className="text-muted-foreground">No upcoming events published yet.</p>
        )}
      </div>
    </Wrapper>
  );
}
