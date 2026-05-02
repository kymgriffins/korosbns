"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { GenericBuilderForm } from "@/components/admin/builder/generic-builder-form";
import { BuilderBreadcrumbs } from "@/components/admin/builder/builder-components";
import { Loader2 } from "lucide-react";

export default function GenericCreatePage() {
  const router = useRouter();
  const { model } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [modelMeta, setModelMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // If this is trivia, redirect to the specialized trivia builder
  useEffect(() => {
    if (model === "trivia") {
      router.replace("/admin/trivia/create");
    }
  }, [model, router]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, modelsRes] = await Promise.all([
          fetch("/api/auth/profile"),
          fetch("/api/admin/models")
        ]);

        if (profileRes.status === 401) {
          router.push("/admin/login");
          return;
        }

        if (profileRes.ok) setProfile(await profileRes.json());
        
        if (modelsRes.ok) {
          const data = await modelsRes.json();
          const meta = data.models.find((m: any) => m.name === model);
          if (!meta) {
            router.push("/admin/dashboard");
            return;
          }
          setModelMeta(meta);
        }
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [model, router]);

  if (loading || model === "trivia") {
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
          title={`New ${modelMeta.verbose_name}`} 
          subtitle={`Creating a new record for ${modelMeta.verbose_name}.`}
        />
        
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
            <BuilderBreadcrumbs modelName={model as string} />
            <GenericBuilderForm 
              modelName={model as string} 
              modelMeta={modelMeta} 
            />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
