"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import React, { useState } from 'react';
import Dashboard from "@/components/admin-dashboard";

const DashboardPage = () => {
    const [activeModel, setActiveModel] = useState<string>("");
    const [models, setModels] = useState<any[]>([]);
    const [profile, setProfile] = useState<any>(null);

    return (
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 64)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar 
            variant="inset" 
            models={models} 
            activeModel={activeModel} 
            onModelSelect={setActiveModel}
            user={profile ? { name: `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "Admin", email: profile.email } : undefined}
          />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
               <Dashboard 
                 activeModel={activeModel} 
                 setActiveModel={setActiveModel} 
                 onModelsLoaded={setModels}
                 onProfileLoaded={setProfile}
               />
            </div>
          </SidebarInset>
        </SidebarProvider>
    );
};

export default DashboardPage;

