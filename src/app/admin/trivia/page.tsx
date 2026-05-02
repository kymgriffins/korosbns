"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Sparkles,
  Calendar,
  LayoutGrid,
  List,
  Loader2,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export default function TriviaLibraryPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, itemsRes] = await Promise.all([
          fetch("/api/auth/profile"),
          fetch("/api/admin/models/trivia")
        ]);

        if (profileRes.status === 401) {
          router.push("/admin/login");
          return;
        }

        if (profileRes.ok) setProfile(await profileRes.json());
        if (itemsRes.ok) {
          const data = await itemsRes.json();
          setItems(data.items || []);
        }
      } catch (error) {
        console.error("Failed to load trivia", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [router]);

  const filteredItems = items.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trivia?")) return;
    
    try {
      const res = await fetch(`/api/admin/models/trivia/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Trivia deleted");
      setItems(items.filter(i => i.id !== id));
    } catch (error) {
      toast.error("Failed to delete trivia");
    }
  };

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
          title="Trivia Library" 
          subtitle="Manage your collection of budget and history trivia."
        />
        
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Breadcrumbs & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Trivia Library</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              
              <Button 
                onClick={() => router.push("/admin/trivia/create")}
                className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100"
              >
                <Plus className="size-4 mr-2" />
                Create New Trivia
              </Button>
            </div>

            {/* Search & Filters */}
            <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-2 rounded-2xl border border-white/20 shadow-sm">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input 
                  placeholder="Search questions or categories..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-transparent border-none focus-visible:ring-0"
                />
              </div>
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Filter className="size-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 rounded-3xl bg-white/40 animate-pulse border border-white/20" />
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="size-16 rounded-3xl bg-muted/50 flex items-center justify-center mb-4">
                  <Sparkles className="size-8 text-muted-foreground/40" />
                </div>
                <h3 className="text-xl font-semibold">No trivia found</h3>
                <p className="text-muted-foreground mt-2">Start by creating your first trivia question.</p>
                <Button variant="outline" className="mt-6" onClick={() => router.push("/admin/trivia/create")}>
                  Create Trivia
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className="group relative overflow-hidden bg-white/40 backdrop-blur-md border-white/20 hover:bg-white/60 transition-all duration-300 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-100/50 capitalize">
                              {item.category}
                            </Badge>
                            <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                              <Calendar className="size-3" />
                              {item.year || "N/A"}
                            </span>
                          </div>
                          <CardTitle className="text-lg line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                            {item.question}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {item.answer}
                          </p>
                          <div className="flex items-center justify-between pt-4 border-t border-muted/20">
                            <div className="flex -space-x-2">
                              {/* Avatars or other meta info could go here */}
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="size-8 rounded-full"
                                onClick={() => router.push(`/admin/trivia/${item.id}/edit`)}
                              >
                                <Edit className="size-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="size-8 rounded-full text-destructive hover:bg-destructive/10"
                                onClick={() => handleDelete(item.id)}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                        {item.image_url && (
                          <div className="absolute top-0 right-0 size-20 -mr-4 -mt-4 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
                        )}
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
