"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import Wrapper from "@/components/global/wrapper";
import { Routes } from "@/constants/routes";
import {
  contentLoadErrorMessage,
  loadKnowledgeList,
  type HubKnowledge,
} from "@/lib/citizen-content";

export default function KnowledgePage() {
  const [items, setItems] = useState<HubKnowledge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void loadKnowledgeList()
      .then(setItems)
      .catch((err) => setError(contentLoadErrorMessage(err, "knowledge")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Wrapper className="py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Knowledge hub</h1>
        <p className="text-muted-foreground mb-10">
          Budget explainers and reference material from the BNSKE content API.
        </p>
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="size-8 animate-spin" />
          </div>
        )}
        {error && <p className="text-destructive">{error}</p>}
        <div className="grid gap-6">
          {items.map((item) => (
            <Link
              key={item.id}
              href={Routes.KnowledgeEntry(item.id)}
              className="block rounded-xl border border-border p-6 hover:border-primary/40 transition-colors"
            >
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="mt-3 text-muted-foreground line-clamp-2">{item.snippet}</p>
            </Link>
          ))}
        </div>
        {!loading && !error && items.length === 0 && (
          <p className="text-muted-foreground">No published knowledge entries yet.</p>
        )}
      </div>
    </Wrapper>
  );
}
