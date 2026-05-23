"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Loader2, Trophy } from "lucide-react";
import Wrapper from "@/components/global/wrapper";
import { Button } from "@/ui/button";
import { Routes } from "@/constants/routes";
import { citizenApi, type TriviaSetApi } from "@/lib/api-client";

export default function TriviaPage() {
  const [sets, setSets] = useState<TriviaSetApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void citizenApi
      .getTriviaList()
      .then((data) => setSets(data.results || []))
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load trivia."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Wrapper className="py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Trophy className="size-10 mx-auto text-primary mb-4" />
          <h1 className="text-4xl font-bold mb-4">Budget Trivia</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Test your knowledge. Browse freely; sign in with membership to score attempts and join the leaderboard.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="size-8 animate-spin" />
          </div>
        )}
        {error && <p className="text-center text-destructive">{error}</p>}

        <div className="space-y-4">
          {sets.map((set, i) => (
            <motion.div
              key={set.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border p-6"
            >
              <div>
                <h2 className="text-lg font-semibold">{set.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {(set.questions || []).length} questions
                  {set.points != null ? ` · up to ${set.points} pts` : ""}
                </p>
              </div>
              <Button asChild>
                <Link href={Routes.TriviaSet(set.id)}>Play</Link>
              </Button>
            </motion.div>
          ))}
        </div>

        {!loading && !error && sets.length === 0 && (
          <p className="text-center text-muted-foreground">No published trivia sets yet.</p>
        )}
      </div>
    </Wrapper>
  );
}
