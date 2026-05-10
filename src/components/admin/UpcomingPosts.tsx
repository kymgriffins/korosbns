'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface Post {
  id: number;
  platform: string;
  platform_name: string;
  caption: string;
  scheduled_at: string;
  status: string;
}

export function UpcomingPosts({ posts }: { posts: Post[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Post History & Schedule</CardTitle>
        <CardDescription>
          View your upcoming and recently published content.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground border rounded-lg border-dashed">
              No posts found.
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold capitalize">{post.platform_name || post.platform}</span>
                    <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded ${
                      post.status === 'published' ? 'bg-green-100 text-green-700' : 
                      post.status === 'failed' ? 'bg-red-100 text-red-700' : 
                      post.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                  <p className="text-sm line-clamp-1 text-muted-foreground">{post.caption}</p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {format(new Date(post.scheduled_at), "MMM d, h:mm a")}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
