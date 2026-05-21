"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Wrapper from "@/components/global/wrapper";
import { citizenApi } from "@/lib/api-client";

export default function PublicProfilePage() {
  const params = useParams();
  const id = String(params.id || "");
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    void citizenApi
      .getPublicUser(id)
      .then(setProfile)
      .catch((err) => setError(err instanceof Error ? err.message : "Profile not found."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <Wrapper className="py-16">
      <div className="max-w-lg mx-auto text-center">
        {loading && <Loader2 className="size-8 animate-spin mx-auto" />}
        {error && <p className="text-destructive">{error}</p>}
        {profile && (
          <>
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={String(profile.avatar_url)}
                alt=""
                className="size-24 rounded-full mx-auto mb-4 object-cover"
              />
            ) : null}
            <h1 className="text-2xl font-bold">
              {String(profile.display_name || profile.first_name || "Member")}
            </h1>
            {profile.bio ? (
              <p className="mt-4 text-muted-foreground">{String(profile.bio)}</p>
            ) : null}
          </>
        )}
      </div>
    </Wrapper>
  );
}
