"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import { usePathname } from "next/navigation";
import { PageBreadcrumbs } from "@/components/global/page-breadcrumbs";
import { TaskForm } from "../_components/task-form";

export default function NewTaskPage() {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();

  if (!isLoggedIn) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center p-6">
        <Card className="w-full text-center">
          <CardContent className="py-12">
            <h2 className="mb-2 text-lg font-semibold">Authentication Required</h2>
            <p className="mb-6 text-sm text-muted-foreground">Sign in to create tasks.</p>
            <Button asChild>
              <a href={`/auth/login?next=${encodeURIComponent(pathname)}`}>Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageBreadcrumbs
        items={[
          { label: "Task Board", href: "/task" },
          { label: "New Task" },
        ]}
      />

      <Card className="border-border/60 bg-card/80 backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl tracking-tight">New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
