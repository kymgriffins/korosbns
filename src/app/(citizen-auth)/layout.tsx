import { CitizenNav } from "@/components/citizen/citizen-nav";

export default function CitizenAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh pt-14">
      <CitizenNav />
      {children}
    </div>
  );
}
