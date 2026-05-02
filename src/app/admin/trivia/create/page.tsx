"use client";

import { TriviaForm } from "@/components/admin/trivia/trivia-form";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateTriviaPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const res = await fetch("/api/auth/profile");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (res.ok) {
        setProfile(await res.json());
      }
    };
    loadProfile();
  }, [router]);

  return (
    <SidebarProvider>
      <AppSidebar 
        navMainItems={[
          { title: "Dashboard", url: "/admin/dashboard", icon: () => null, isActive: false },
        ]}
        user={profile ? { name: `${profile.first_name} ${profile.last_name}`, email: profile.email } : undefined}
      />
      <SidebarInset className="bg-slate-50/50">
        <SiteHeader 
          title="Trivia Builder" 
          subtitle="Create new trivia questions with AI assistance."
        />
        
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-4xl mx-auto mb-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin/dashboard?section=academy">Learn Hub</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Create Trivia</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <TriviaForm />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
