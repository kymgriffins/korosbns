"use client";

import { Protected } from "@/components/citizen/protected";
import { ForumView } from "@/components/learn/forum-view";

export default function LearnForumPage() {
  return (
    <Protected>
      <div className="h-full flex flex-col p-4 md:p-6">
        <ForumView />
      </div>
    </Protected>
  );
}
