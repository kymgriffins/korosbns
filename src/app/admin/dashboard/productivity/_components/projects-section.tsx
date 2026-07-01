"use client";

import { useCallback, useEffect, useState } from "react";
import { ClipboardCheck, Globe, Orbit, Plus, Pencil, Trash2, Upload, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { taskApi } from "@/lib/task-api";

type Project = {
  id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  due_date?: string | null;
  image?: string | null;
  file?: string | null;
};

const STATUS_ICONS: Record<string, typeof Orbit> = {
  active: Orbit,
  planning: ClipboardCheck,
  completed: Globe,
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  planning: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
  completed: "bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20",
  on_hold: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
};

function formatDue(due: string | null | undefined): string {
  if (!due) return "";
  const d = new Date(due);
  const now = new Date();
  const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "Overdue";
  if (diff === 0) return "Due today";
  if (diff === 1) return "Due tomorrow";
  return `Due in ${diff} days`;
}

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");

  // CRUD States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("planning");
  const [progress, setProgress] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  // Previews
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await taskApi.getProjects(filter === "all" ? undefined : filter);
      setProjects((res as any).results ?? []);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleOpenNew = () => {
    setSelectedProject(null);
    setTitle("");
    setDescription("");
    setStatus("planning");
    setProgress(0);
    setDueDate("");
    setImageFile(null);
    setAttachmentFile(null);
    setImagePreview(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setSelectedProject(project);
    setTitle(project.title);
    setDescription(project.description || "");
    setStatus(project.status);
    setProgress(project.progress);
    setDueDate(project.due_date ? project.due_date.substring(0, 10) : "");
    setImageFile(null);
    setAttachmentFile(null);
    setImagePreview(project.image || null);
    setIsDialogOpen(true);
  };

  const handleOpenDelete = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentFile(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Project title is required");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("status", status);
      formData.append("progress", String(progress));
      if (dueDate) {
        formData.append("due_date", dueDate);
      }
      if (imageFile) {
        formData.append("image", imageFile);
      }
      if (attachmentFile) {
        formData.append("file", attachmentFile);
      }

      if (selectedProject) {
        await taskApi.updateProject(selectedProject.id, formData);
        toast.success("Project updated successfully");
      } else {
        await taskApi.createProject(formData);
        toast.success("Project created successfully");
      }
      setIsDialogOpen(false);
      fetchProjects();
    } catch (err: any) {
      toast.error(err.message || "Failed to save project");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProject) return;
    setSubmitting(true);
    try {
      await taskApi.deleteProject(selectedProject.id);
      toast.success("Project deleted successfully");
      setIsDeleteOpen(false);
      fetchProjects();
    } catch {
      toast.error("Failed to delete project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl tracking-tight font-semibold">Projects</h2>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32 rounded-xl">
              <SelectValue placeholder="Active" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={handleOpenNew} className="rounded-xl">
            <Plus className="mr-1.5 size-4" />
            New Project
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <p className="rounded-2xl border p-12 text-center text-sm text-muted-foreground">No projects found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {projects.map((project) => {
            const Icon = STATUS_ICONS[project.status] ?? Orbit;
            const statusColor = STATUS_COLORS[project.status] ?? STATUS_COLORS.active;
            return (
              <Card key={project.id} className="shadow-xs border-border/60 hover:border-primary/20 transition-all duration-300 hover:shadow-md relative overflow-hidden group flex flex-col justify-between min-h-[190px] rounded-2xl">
                <div>
                  <CardHeader className="pb-2">
                    <CardTitle className="pr-16">
                      <div className="flex items-center gap-2">
                        <Icon className="size-4 text-muted-foreground shrink-0" />
                        <span className="truncate">{project.title}</span>
                      </div>
                    </CardTitle>
                    <CardAction className="flex items-center gap-1.5">
                      <Badge variant="outline" className={`${statusColor} capitalize rounded-full px-2.5 py-0.5 text-[10px] font-semibold`}>
                        {project.status}
                      </Badge>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="size-7 rounded-lg" onClick={() => handleOpenEdit(project)} aria-label="Edit project">
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-7 rounded-lg text-destructive hover:bg-destructive/10" onClick={() => handleOpenDelete(project)} aria-label="Delete project">
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </CardAction>
                  </CardHeader>
                  <CardContent className="pb-3 text-xs text-muted-foreground leading-relaxed">
                    {project.description ? (
                      <p className="line-clamp-2">{project.description}</p>
                    ) : (
                      <p className="italic text-muted-foreground/60">No description provided.</p>
                    )}
                  </CardContent>
                </div>
                <div>
                  <CardContent className="pt-0 pb-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[10px] font-semibold">
                        <span className="text-muted-foreground">Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={project.progress} className="h-1.5" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="py-2.5 bg-muted/20 border-t border-border/40 flex justify-between items-center text-[10px] px-4">
                    <span className="font-medium text-muted-foreground">
                      {project.due_date ? formatDue(project.due_date) : "No due date"}
                    </span>
                    <div className="flex items-center gap-2">
                      {project.image && (
                        <a href={project.image} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-0.5">
                          <ImageIcon className="size-3" /> Image
                        </a>
                      )}
                      {project.file && (
                        <a href={project.file} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-0.5">
                          <FileText className="size-3" /> Doc
                        </a>
                      )}
                    </div>
                  </CardFooter>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* CRUD Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>{selectedProject ? "Edit Project" : "New Project"}</DialogTitle>
            <DialogDescription>
              Provide the details below to {selectedProject ? "update" : "create"} a project.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="proj-title">Project Title *</Label>
              <Input
                id="proj-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. County Civic Outreach"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proj-desc">Description</Label>
              <Textarea
                id="proj-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details and objectives of the project..."
                rows={3}
                className="resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="proj-status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="proj-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="proj-due">Due Date</Label>
                <Input
                  id="proj-due"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proj-progress">Progress ({progress}%)</Label>
              <Input
                id="proj-progress"
                type="number"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
              />
            </div>

            {/* File Upload Fields */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <Label className="text-xs">Project Image</Label>
                <div className="border border-dashed border-border/80 rounded-xl p-2.5 text-center flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 transition relative min-h-[90px]">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                  />
                  {imagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imagePreview} alt="Preview" className="h-16 w-full object-cover rounded-lg" />
                  ) : (
                    <>
                      <Upload className="size-4 text-muted-foreground mb-1" />
                      <span className="text-[10px] text-muted-foreground">Upload Image</span>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Project Document</Label>
                <div className="border border-dashed border-border/80 rounded-xl p-2.5 text-center flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 transition relative min-h-[90px]">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleAttachmentChange}
                  />
                  {attachmentFile ? (
                    <div className="flex flex-col items-center">
                      <FileText className="size-5 text-primary mb-1" />
                      <span className="text-[9px] text-foreground font-medium truncate max-w-[120px]">{attachmentFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="size-4 text-muted-foreground mb-1" />
                      <span className="text-[10px] text-muted-foreground">Upload File</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-1.5 size-4 animate-spin" />}
                {selectedProject ? "Save Changes" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
              {submitting && <Loader2 className="mr-1.5 size-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
