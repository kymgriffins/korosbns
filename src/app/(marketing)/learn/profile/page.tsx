import Link from "next/link";
import { Bookmark, Download, Settings, Award } from "lucide-react";
import { LmsPage } from "@/components/lms/lms-page";
import { BitmojiAvatar } from "@/components/profile/bitmoji-avatar";
import { LmsRoutes } from "@/data/lms/routes";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Profile | Learn",
};

const STATS = [
  { label: "Lessons completed", value: "4" },
  { label: "Courses enrolled", value: "2" },
  { label: "Trivia correct", value: "7" },
  { label: "Day streak", value: "3" },
] as const;

export default function LearnProfilePage() {
  return (
    <LmsPage className="space-y-8">
      <header className="flex items-center gap-4">
        <BitmojiAvatar size="xl" className="rounded-full" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Learner profile</h1>
          <p className="text-sm text-muted-foreground">Civic education enthusiast</p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border/60 bg-card p-4 text-center shadow-sm">
            <p className="text-2xl font-semibold">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <nav className="space-y-2">
        {[
          { href: LmsRoutes.progress, icon: Award, label: "Certificates" },
          { href: "#", icon: Bookmark, label: "Bookmarks" },
          { href: "#", icon: Download, label: "Downloads" },
          { href: "#", icon: Settings, label: "Settings" },
        ].map((item) => (
          <Button key={item.label} variant="outline" className="h-12 w-full justify-start" asChild>
            <Link href={item.href}>
              <item.icon className="mr-2 size-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
    </LmsPage>
  );
}
