import { AuthBreadcrumbBar } from "@/components/citizen/auth-breadcrumb-bar";

export default function CitizenAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-muted/30">
      <AuthBreadcrumbBar />
      <main>{children}</main>
    </div>
  );
}
