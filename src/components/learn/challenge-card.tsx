"use client";

import { useEffect, useState } from "react";
import { fetchChallenges, submitChallenge } from "@/lib/gamification";
import type { ChallengeData } from "@/lib/gamification";
import { Button } from "@/ui/button";
import { toast } from "sonner";
import { Target, CheckCircle2, Clock, Trophy } from "lucide-react";
import { cn } from "@/utils";

function timeRemaining(endsAt: string): string {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `${days}d ${hours}h remaining`;
  return `${hours}h remaining`;
}

export function ChallengeCard({ challenge, onComplete }: { challenge: ChallengeData; onComplete?: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(challenge.is_completed ?? false);

  const handleSubmit = async () => {
    if (done || submitting) return;
    setSubmitting(true);
    const result = await submitChallenge(challenge.id);
    setSubmitting(false);
    if (result) {
      setDone(true);
      toast.success(`Challenge complete! +${result.points_awarded} points`);
      onComplete?.();
    } else {
      toast.error("Could not submit challenge. Already completed?");
    }
  };

  return (
    <div className={cn(
      "p-4 rounded-xl border space-y-3",
      done ? "border-emerald-500/20 bg-emerald-500/5" : "border-border bg-card"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="size-4 text-primary" />
          <h4 className="text-xs font-black uppercase">{challenge.title}</h4>
        </div>
        {done ? (
          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="size-3" /> Done
          </span>
        ) : (
          <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
            <Clock className="size-3" /> {timeRemaining(challenge.ends_at)}
          </span>
        )}
      </div>

      {challenge.description && (
        <p className="text-xs text-muted-foreground">{challenge.description}</p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs font-bold flex items-center gap-1">
          <Trophy className="size-3.5 text-amber-500" />
          +{challenge.points_reward} points
        </span>
        {!done && (
          <Button onClick={handleSubmit} disabled={submitting} size="sm" className="rounded-lg text-xs h-8 font-bold">
            {submitting ? "Submitting..." : "Complete"}
          </Button>
        )}
      </div>
    </div>
  );
}

export function ChallengeList() {
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    void fetchChallenges().then((data) => {
      setChallenges(data);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin size-5 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (challenges.length === 0) {
    return (
      <div className="p-4 rounded-xl border border-dashed border-border text-center space-y-2">
        <Target className="size-6 text-muted-foreground mx-auto" />
        <p className="text-xs text-muted-foreground">No active challenges right now. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Target className="size-5 text-primary" />
        <h2 className="text-lg font-black uppercase tracking-tight">Challenges</h2>
      </div>
      {challenges.map((c) => (
        <ChallengeCard key={c.id} challenge={c} onComplete={load} />
      ))}
    </div>
  );
}
