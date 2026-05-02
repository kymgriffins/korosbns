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
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function EditTriviaPage() {
  const router = useRouter();
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [trivia, setTrivia] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, triviaRes] = await Promise.all([
          fetch("/api/auth/profile"),
          fetch(`/api/admin/models/trivia/${id}`)
        ]);

        if (profileRes.status === 401) {
          router.push("/admin/login");
          return;
        }

        if (profileRes.ok) setProfile(await profileRes.json());
        
        if (triviaRes.ok) {
          const data = await triviaRes.json();
          // The generic admin API returns { items: [...] }
          setTrivia(data.items?.[0] || data);
        }
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, router]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-indigo-600" />
      </div>
    );
  }

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
          title="Edit Trivia" 
          subtitle={`Updating trivia ID: ${id}`}
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
                  <BreadcrumbPage>Edit Trivia</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <TriviaForm initialData={trivia} isEditing />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
