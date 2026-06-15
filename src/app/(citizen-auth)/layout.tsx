import { AuthBreadcrumbBar } from "@/components/citizen/auth-breadcrumb-bar";
import { Scale, BarChart3, Users, Shield } from "lucide-react";

export default function CitizenAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh flex flex-col lg:flex-row bg-muted/30">
      {/* Left brand panel — hidden on mobile */}
      <aside className="hidden lg:flex lg:w-1/2 xl:w-[45%] relative flex-col items-center justify-center p-12 bg-gradient-to-br from-primary/[0.04] via-background to-muted/40 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/gradient.svg')] bg-cover bg-center opacity-[0.04] pointer-events-none" />
        <div className="relative z-10 max-w-md w-full space-y-10">
          <div>
            <img src="/logo.svg" alt="Budget Ndio Story" className="h-7 w-auto" />
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">
              Know Your<br />
              <span className="text-primary">Budget.</span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
              Track how public funds flow from Nairobi to your community. Understand, participate, and hold leaders accountable.
            </p>
          </div>
          <div className="space-y-5">
            {[
              { icon: Scale, label: "Follow the money", desc: "See every shilling allocated to your county" },
              { icon: BarChart3, label: "Track performance", desc: "Compare budget vs actual spending in real time" },
              { icon: Users, label: "Join the movement", desc: "Connect with citizens tracking their budgets" },
              { icon: Shield, label: "Demand transparency", desc: "Use data to hold leaders accountable" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <footer className="absolute bottom-8 z-10 text-[11px] text-muted-foreground/60">
          &copy; {new Date().getFullYear()} Budget Ndio Story. All rights reserved.
        </footer>
      </aside>

      {/* Right panel — form area */}
      <div className="flex-1 flex flex-col min-h-dvh">
        {/* Breadcrumb bar (mobile + desktop) */}
        <AuthBreadcrumbBar />

        {/* Scrollable form area */}
        <main className="flex-1 flex items-center justify-center px-4 py-8 lg:py-12 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
