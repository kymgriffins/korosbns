import Link from "next/link";
import type { NavigationItem } from "@/components/clean-slate/nav";
import { Separator } from "@/components/ui/separator";

type SocialLink = {
  name: string;
  url: string;
};

type CleanSlateFooterProps = {
  items: NavigationItem[];
  email: string;
  socials: SocialLink[];
};

export function CleanSlateFooter({ items, email, socials }: CleanSlateFooterProps) {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="flex flex-col gap-3">
            <Link href="/" className="w-fit text-lg font-bold tracking-tight">
              Budget Ndio Story
            </Link>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              Following public money and turning budget evidence into stories people can use.
            </p>
            <a className="w-fit text-sm font-medium underline-offset-4 hover:underline" href={`mailto:${email}`}>
              {email}
            </a>
          </div>
          <nav className="flex flex-col gap-2" aria-label="Footer navigation">
            <p className="text-sm font-semibold">Pages</p>
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="w-fit text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold">Follow</p>
            {socials.map((social) => (
              <a
                key={social.url}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="w-fit text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} Budget Ndio Story</span>
          <span>Nairobi, Kenya</span>
        </div>
      </div>
    </footer>
  );
}
