import Link from "next/link";
import Image from "next/image";
import { Routes } from "@/constants/routes";
import { learnTabToHref } from "@/lib/learn-nav";
import { BudgetHubPage } from "@/components/budget-hub/layout/budget-hub-page";

const FOOTER_GROUPS = [
  {
    title: "Learn",
    links: [
      { label: "Budget Hub", href: Routes.Learn },
      { label: "Journeys", href: learnTabToHref("learn") },
      { label: "Articles", href: Routes.LearnArticles },
      { label: "Quests", href: Routes.LearnQuests },
    ],
  },
  {
    title: "Organization",
    links: [
      { label: "About", href: Routes.Research },
      { label: "Contact", href: Routes.Contact },
      { label: "FAQ", href: Routes.FAQ },
    ],
  },
] as const;

export function BudgetHubFooter() {
  return (
    <footer className="border-t border-[var(--bh-border)] py-12">
      <BudgetHubPage>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-2">
            <Link href={Routes.Home} className="inline-flex items-center gap-2 font-semibold">
              <Image src="/logo.svg" alt="" width={24} height={24} />
              Budget Ndio Story
            </Link>
            <p className="max-w-sm text-sm text-muted-foreground">
              Turning Kenya&apos;s budget into clear, bold civic narratives.
            </p>
          </div>
          {FOOTER_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold">{group.title}</p>
              <ul className="mt-4 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Budget Ndio Story. Civic editorial product.
        </p>
      </BudgetHubPage>
    </footer>
  );
}
