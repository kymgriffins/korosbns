"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import {
  Database,
  Building2,
  ShieldCheck,
  Users2,
  FileText,
  Settings2,
  Plus,
  RefreshCw,
  Trash2,
  Edit,
  Save,
  X,
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Calendar,
  User,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Loader2,
  LayoutGrid,
  ListFilter,
  Sparkles,
  BookOpenText,
  Trophy,
  Quote,
  Megaphone,
  UserCog
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ModelField = {
  name: string;
  type: string;
  required: boolean;
  read_only: boolean;
  choices?: Array<{ value: string; label: string }>;
  related_model?: string;
};

type ModelMeta = {
  name: string;
  verbose_name: string;
  fields: ModelField[];
};

type AdminProfile = {
  email?: string;
  first_name?: string;
  last_name?: string;
};

type AdminCapabilities = {
  can_view_admin: boolean;
  can_create_records: boolean;
  can_edit_records: boolean;
  can_delete_records: boolean;
  can_manage_users: boolean;
  can_manage_memberships: boolean;
  can_manage_quotes: boolean;
  can_publish_content: boolean;
};

type WorkflowPreset = {
  id: string;
  label: string;
  description: string;
  model: string;
  icon: React.ComponentType<{ className?: string }>;
  formFields: string[];
};

type SeedStatus = {
  seeded: boolean;
  counts?: Record<string, number>;
  message?: string;
};

interface DashboardProps {
  activeModel: string;
  setActiveModel: (name: string) => void;
  onModelsLoaded?: (models: ModelMeta[]) => void;
  onProfileLoaded?: (profile: AdminProfile) => void;
  capabilities?: AdminCapabilities | null;
  membership?: {
    organization_id: string;
    organization_name: string;
    organization_slug: string;
    role: string;
    status: string;
  } | null;
  compact?: boolean;
}

const MODEL_CATEGORIES: Array<{
  id: "org" | "people" | "content" | "system" | "other";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  models: string[];
}> = [
  {
    id: "org",
    label: "Organization Operations",
    icon: Building2,
    models: ["organization", "project", "campaign", "partner", "program", "activity", "impactmetric"],
  },
  {
    id: "people",
    label: "People & Governance",
    icon: Users2,
    models: ["teammember", "teamquote", "organizationmember", "user", "auditlog"],
  },
  {
    id: "content",
    label: "Knowledge & Content",
    icon: FileText,
    models: ["deepdivearticle", "trivia", "story", "document", "docfolder", "knowledgeentry"],
  },
  {
    id: "system",
    label: "System & Product",
    icon: Settings2,
    models: ["roadmapitem", "changelog", "versioninfo", "subscriber", "gamificationprofile", "pointevent"],
  },
  {
    id: "other",
    label: "Other Models",
    icon: ShieldCheck,
    models: [],
  },
];

const SEED_ALIGNED_MODELS = new Set([
  "organization",
  "teammember",
  "activity",
  "impactmetric",
  "partner",
  "program",
  "project",
  "campaign",
]);

const DEV_TOOLS_MODELS = new Set([
  "auditlog",
  "roadmapitem",
  "changelog",
  "versioninfo",
  "gamificationprofile",
  "pointevent",
]);

const LEARN_HUB_MODELS = new Set([
  "trivia",
  "story",
  "deepdivearticle",
  "knowledgeentry",
  "document",
  "docfolder",
]);

const SOCIAL_MEDIA_MODELS = new Set([
  "campaign",
  "teamquote",
  "subscriber",
  "partner",
  "program",
]);

const CONTENT_VIEW_STORAGE_KEY = "bns-admin-content-view";

const WORKFLOW_PRESETS: WorkflowPreset[] = [
  {
    id: "team-editor",
    label: "Team Editor",
    description: "Manage team members, roles, bios, and profile visibility.",
    model: "teammember",
    icon: Users2,
    formFields: ["name", "title", "role", "bio", "email", "photo", "is_active"],
  },
  {
    id: "campaign-scheduler",
    label: "Campaign Scheduler",
    description: "Create and track campaign timing, ownership, and status.",
    model: "campaign",
    icon: Megaphone,
    formFields: ["title", "name", "slug", "status", "start_date", "end_date", "description"],
  },
  {
    id: "impact-manager",
    label: "Impact Metrics Manager",
    description: "Track KPI metrics, targets, and reported impact data.",
    model: "impactmetric",
    icon: Trophy,
    formFields: ["name", "metric_name", "value", "target", "unit", "period", "notes"],
  },
  {
    id: "story-studio",
    label: "Stories Studio",
    description: "Write and publish org stories with structured metadata.",
    model: "story",
    icon: FileText,
    formFields: ["title", "slug", "summary", "content", "author", "is_published", "published_at"],
  },
  {
    id: "trivia-studio",
    label: "Trivia Builder",
    description: "Create trivia prompts, options, explanations, and levels.",
    model: "trivia",
    icon: Sparkles,
    formFields: ["question", "prompt", "options", "answer", "correct_answer", "explanation", "difficulty"],
  },
  {
    id: "learn-articles",
    label: "Learn Articles Editor",
    description: "WYSIWYG-first deep dive article editing and publishing.",
    model: "deepdivearticle",
    icon: BookOpenText,
    formFields: ["title", "slug", "summary", "content", "body", "is_published", "published_at"],
  },
  {
    id: "quotes",
    label: "Quotes Moderation",
    description: "Review, approve, schedule, and archive team quotes.",
    model: "teamquote",
    icon: Quote,
    formFields: ["quote", "text", "topic", "status", "publication_date", "author"],
  },
  {
    id: "users",
    label: "Users & Access",
    description: "Manage user records and access state.",
    model: "user",
    icon: UserCog,
    formFields: ["email", "first_name", "last_name", "is_active", "is_staff", "is_superuser"],
  },
];

const mockData: Record<string, Record<string, unknown>[]> = {
  user: [
    { id: "1", email: "admin@budgetndiostory.org", first_name: "Admin", last_name: "User", is_staff: true, is_active: true, created_at: "2025-01-01T00:00:00Z" },
  ],
  organization: [
    { id: "1", name: "Budget Ndio Story", slug: "budgetndiostory", description: "Youth-led civic platform", is_active: true, created_at: "2025-01-01T00:00:00Z" },
  ],
  organizationmember: [
    { id: "1", user: "1", organization: "1", role: "owner", status: "active", joined_at: "2025-01-01T00:00:00Z" },
  ],
};

const Dashboard = ({ activeModel, setActiveModel, onModelsLoaded, onProfileLoaded, capabilities, compact = false }: DashboardProps) => {
  const router = useRouter();
  const [models, setModels] = useState<ModelMeta[]>([]);
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string>("-created_at");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>("org");
  const [seedStatus, setSeedStatus] = useState<SeedStatus | null>(null);
  const [seedLoading, setSeedLoading] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState<string[]>([]);
  const [contentViewMode, setContentViewMode] = useState<"cards" | "table">("cards");

  const addNotification = useCallback((message: string) => {
    setRecentNotifications((prev) => [message, ...prev].slice(0, 5));
    toast.info(message, { duration: 5000 });
  }, []);

  const redirectToLogin = useCallback(() => {
    toast.error("Your session has ended. Please log in again.");
    router.replace("/admin/login");
  }, [router]);

  const loadSeedStatus = useCallback(async () => {
    try {
      setSeedLoading(true);
      const response = await fetch("/api/admin/seed", { cache: "no-store" });
      if (response.status === 401) {
        redirectToLogin();
        return;
      }
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = payload?.message || payload?.error || "Seed status request failed.";
        setSeedStatus({ seeded: false, message });
        return;
      }
      setSeedStatus({ seeded: Boolean(payload?.seeded), counts: payload?.counts, message: payload?.message });
    } catch (error) {
      setSeedStatus({ seeded: false, message: error instanceof Error ? error.message : "Seed check failed." });
    } finally {
      setSeedLoading(false);
    }
  }, []);

  const runSeed = useCallback(async () => {
    try {
      setSeedLoading(true);
      const response = await fetch("/api/admin/seed", { method: "POST", headers: { "Content-Type": "application/json" } });
      if (response.status === 401) {
        redirectToLogin();
        return;
      }
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = payload?.message || payload?.error || "Seed request failed.";
        addNotification(`Seed failed: ${message}`);
        throw new Error(message);
      }
      setSeedStatus({ seeded: Boolean(payload?.seeded ?? true), counts: payload?.counts, message: payload?.message });
      addNotification("Database seed completed successfully.");
      return payload;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Seed action failed.";
      addNotification(message);
      throw error;
    } finally {
      setSeedLoading(false);
    }
  }, [addNotification, redirectToLogin]);

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Record<string, unknown> | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  const loadModels = useCallback(async () => {
    try {
      setError("");
      setLoading(true);
      const response = await fetch("/api/admin/models", { cache: "no-store" });
      if (response.status === 401) {
        redirectToLogin();
        return;
      }
      if (!response.ok) throw new Error("Failed to load models");
      const payload = await response.json();
      const list = payload.models ?? [];
      setModels(list);
      onModelsLoaded?.(list);
      if (!activeModel && list.length) {
        setActiveModel(list[0].name);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load model list.");
      toast.error("Failed to load models");
    } finally {
      setLoading(false);
    }
  }, [activeModel, setActiveModel, onModelsLoaded, redirectToLogin]);

  const loadItems = useCallback(async (modelName: string, params?: { query?: string; ordering?: string }) => {
    if (!modelName) return;
    try {
      setLoading(true);
      setError("");
      const queryParams = new URLSearchParams({ limit: "50" });
      if (params?.query) queryParams.set("q", params.query);
      if (params?.ordering) queryParams.set("ordering", params.ordering);
      const response = await fetch(`/api/admin/models/${modelName}?${queryParams.toString()}`, { cache: "no-store" });
      if (response.status === 401) {
        redirectToLogin();
        return;
      }
      if (!response.ok) throw new Error("Failed to load records");
      const payload = await response.json();
      setItems(payload.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load records.");
      setItems([]);
      toast.error("Failed to load records");
    } finally {
      setLoading(false);
    }
  }, [redirectToLogin]);

  const loadProfile = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/profile", { cache: "no-store" });
      if (response.status === 401) {
        redirectToLogin();
        return;
      }
      if (!response.ok) return;
      const payload = await response.json();
      onProfileLoaded?.(payload);
    } catch {
      // no-op
    }
  }, [onProfileLoaded, redirectToLogin]);

  useEffect(() => {
    void loadModels();
    void loadProfile();
    void loadSeedStatus();
  }, [loadModels, loadProfile, loadSeedStatus]);

  useEffect(() => {
    if (!activeModel) {
      setItems([]);
      setSelectedRows(new Set());
      setCurrentItem(null);
      setFormData({});
      return;
    }

    setItems([]);
    setSelectedRows(new Set());
    setCurrentItem(null);
    setFormData({});
    void loadItems(activeModel, { query: searchQuery, ordering: sortField });
  }, [activeModel, loadItems, searchQuery, sortField]);

  const activeMeta = useMemo(
    () => models.find((model) => model.name === activeModel),
    [models, activeModel]
  );

  const activeWorkflow = useMemo(
    () => WORKFLOW_PRESETS.find((preset) => preset.model === activeModel),
    [activeModel]
  );
  const canCreate = capabilities?.can_create_records ?? true;
  const canEdit = capabilities?.can_edit_records ?? true;
  const canDelete = capabilities?.can_delete_records ?? true;
  const isDevToolsModel = DEV_TOOLS_MODELS.has(activeModel);
  const isLearnOrSocialModel = LEARN_HUB_MODELS.has(activeModel) || SOCIAL_MEDIA_MODELS.has(activeModel);

  const modelCountMap = useMemo(() => {
    const map = new Map<string, number>();
    MODEL_CATEGORIES.forEach((category) => {
      category.models.forEach((modelName) => map.set(modelName, 0));
    });
    models.forEach((model) => {
      if (!map.has(model.name)) {
        map.set(model.name, 0);
      }
    });
    return map;
  }, [models]);

  const categoryModels = useMemo(() => {
    const knownModelNames = new Set(MODEL_CATEGORIES.flatMap((c) => c.models));
    return MODEL_CATEGORIES.map((category) => {
      if (category.id === "other") {
        const uncategorized = models.filter((m) => !knownModelNames.has(m.name));
        return { ...category, entries: uncategorized };
      }
      return {
        ...category,
        entries: models.filter((m) => category.models.includes(m.name)),
      };
    });
  }, [models]);

  const visibleModels = useMemo(() => {
    const category = categoryModels.find((c) => c.id === activeCategory);
    if (!category) return models;
    return category.entries.length > 0 ? category.entries : models;
  }, [categoryModels, activeCategory, models]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return Object.values(item).some((val) =>
        String(val).toLowerCase().includes(query)
      );
    });
  }, [items, searchQuery]);

  const openCreateModal = () => {
    if (!canCreate) return;
    setCurrentItem(null);
    setFormData({});
    setEditModalOpen(true);
  };

  const applyTemplate = (fieldName: string, before: string, after = "") => {
    const current = String(formData[fieldName] ?? "");
    const nextValue = `${current}${before}${after}`;
    setFormData((prev) => ({ ...prev, [fieldName]: nextValue }));
  };

  const getPrioritizedFields = () => {
    const editableFields =
      activeMeta?.fields.filter(
        (f) =>
          !f.read_only &&
          f.name !== "id" &&
          f.name !== "pk" &&
          f.name !== "created_at" &&
          f.name !== "updated_at"
      ) ?? [];

    if (!activeWorkflow) {
      return editableFields;
    }

    const rank = new Map(activeWorkflow.formFields.map((name, index) => [name, index]));
    return [...editableFields].sort((a, b) => {
      const aRank = rank.get(a.name) ?? Number.MAX_SAFE_INTEGER;
      const bRank = rank.get(b.name) ?? Number.MAX_SAFE_INTEGER;
      return aRank - bRank;
    });
  };

  const openEditModal = (item: Record<string, unknown>) => {
    if (!canEdit) return;
    setCurrentItem(item);
    setFormData({ ...item });
    setEditModalOpen(true);
  };

  const openDeleteDialog = (item: Record<string, unknown>) => {
    if (!canDelete) return;
    setCurrentItem(item);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!currentItem?.id && !canCreate) {
      setError("You do not have permission to create records.");
      return;
    }
    if (currentItem?.id && !canEdit) {
      setError("You do not have permission to edit records.");
      return;
    }
    if (!activeModel || !currentItem?.id && !formData) return;

    setSaving(true);
    setError("");

    try {
      const url = currentItem?.id
        ? `/api/admin/models/${activeModel}/${currentItem.id}`
        : `/api/admin/models/${activeModel}`;
      const method = currentItem?.id ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.status === 401) {
        redirectToLogin();
        return;
      }

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error((result?.message) ?? (currentItem?.id ? "Update failed." : "Create failed."));
      }

      const activityMessage = currentItem?.id
        ? `Updated ${activeMeta?.verbose_name || activeModel} record ${currentItem.id}`
        : `Created ${activeMeta?.verbose_name || activeModel} record`;
      toast.success(currentItem?.id ? "Record updated" : "Record created");
      addNotification(activityMessage);
      setEditModalOpen(false);
      await loadItems(activeModel, { query: searchQuery, ordering: sortField });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Operation failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!canDelete) {
      setError("You do not have permission to delete records.");
      return;
    }
    if (!activeModel || !currentItem?.id) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/models/${activeModel}/${currentItem.id}`, {
        method: "DELETE",
      });
      if (response.status === 401) {
        redirectToLogin();
        return;
      }

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result?.message ?? "Delete failed");
      }

      const activityMessage = `Deleted ${activeMeta?.verbose_name || activeModel} record ${currentItem.id}`;
      toast.success("Record deleted");
      addNotification(activityMessage);
      setDeleteDialogOpen(false);
      await loadItems(activeModel, { query: searchQuery, ordering: sortField });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const renderFieldInput = (field: ModelField, value: unknown, onChange: (val: unknown) => void) => {
    if (field.read_only) {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 bg-muted/30 rounded-md">
          <span>{String(value ?? "-")}</span>
          <span className="text-xs ml-auto text-muted-foreground/70">(read-only)</span>
        </div>
      );
    }

    if (field.type === "boolean") {
      return (
        <Checkbox
          checked={value as boolean}
          onCheckedChange={onChange}
        />
      );
    }

    if (field.related_model) {
      // For simplicity, use a text input - ideally would fetch related options
      return (
        <Input
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Select ${field.name}...`}
        />
      );
    }

    if (field.choices && field.choices.length > 0) {
      return (
        <Select value={value as string} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder={`Select ${field.name}...`} />
          </SelectTrigger>
          <SelectContent>
            {field.choices.map((choice) => (
              <SelectItem key={choice.value} value={choice.value}>
                {choice.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (field.type?.includes("text") || field.type === "char") {
      return (
        <Textarea
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="font-mono text-xs"
        />
      );
    }

    if (field.type?.includes("json")) {
      return (
        <Textarea
          value={typeof value === "object" ? JSON.stringify(value, null, 2) : (value as string)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              onChange(parsed);
            } catch {
              onChange(e.target.value);
            }
          }}
          rows={6}
          className="font-mono text-xs"
        />
      );
    }

    if (field.type?.includes("date") || field.type?.includes("datetime")) {
      return (
        <Input
          type="datetime-local"
          value={value ? format(new Date(String(value)), "yyyy-MM-dd'T'HH:mm") : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    }

    return (
      <Input
        type={field.type === "integer" || field.type === "float" ? "number" : "text"}
        value={value as string}
        onChange={(e) => onChange(field.type?.includes("int") ? parseInt(e.target.value) : e.target.value)}
        placeholder={`Enter ${field.name}...`}
      />
    );
  };

  const getFieldValue = (field: ModelField, item: Record<string, unknown>) => {
    const val = item[field.name];
    if (field.type?.includes("boolean")) return Boolean(val);
    return val;
  };

  const visibleTableFields = useMemo(() => {
    if (!activeMeta?.fields) return [];
    const fields = activeMeta.fields.filter((field) => {
      if (isDevToolsModel) return true;
      return field.name !== "id" && field.name !== "pk";
    });
    return fields.slice(0, 5);
  }, [activeMeta?.fields, isDevToolsModel]);

  const summaryFields = useMemo(() => {
    if (!activeMeta?.fields) return [];
    return activeMeta.fields
      .filter((field) =>
        !field.read_only &&
        field.name !== "id" &&
        field.name !== "pk" &&
        field.name !== "created_at" &&
        field.name !== "updated_at"
      )
      .slice(0, 3);
  }, [activeMeta?.fields]);

  const suggestedModels = useMemo(() => {
    if (isLearnOrSocialModel) {
      const options = activeModel && LEARN_HUB_MODELS.has(activeModel)
        ? ["story", "deepdivearticle", "trivia"]
        : ["campaign", "teamquote", "subscriber"];
      return options.filter((name) => models.some((model) => model.name === name));
    }
    if (isDevToolsModel) {
      return ["auditlog", "roadmapitem", "versioninfo"].filter((name) => models.some((model) => model.name === name));
    }
    return ["project", "activity", "impactmetric"].filter((name) => models.some((model) => model.name === name));
  }, [activeModel, isLearnOrSocialModel, isDevToolsModel, models]);

  useEffect(() => {
    if (!isLearnOrSocialModel) {
      setContentViewMode("table");
      return;
    }
    try {
      const raw = window.localStorage.getItem(CONTENT_VIEW_STORAGE_KEY);
      if (raw === "cards" || raw === "table") {
        setContentViewMode(raw);
        return;
      }
    } catch {
      // ignore storage access errors
    }
    setContentViewMode("cards");
  }, [activeModel, isLearnOrSocialModel]);

  const setPreferredContentView = (mode: "cards" | "table") => {
    setContentViewMode(mode);
    try {
      window.localStorage.setItem(CONTENT_VIEW_STORAGE_KEY, mode);
    } catch {
      // ignore storage access errors
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            toast.promise(loadItems(activeModel, { query: searchQuery, ordering: sortField }), {
              loading: "Refreshing...",
              success: "Updated",
              error: "Refresh failed"
            });
          }}
          className="gap-2"
        >
          <RefreshCw className="size-4" />
          Refresh
        </Button>
        <Button
          onClick={openCreateModal}
          disabled={!activeModel || !canCreate}
          className="gap-2 shadow-lg shadow-primary/20"
        >
          <Plus className="size-4" />
          Create
        </Button>
      </div>

      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 flex items-start gap-3"
          >
            <AlertCircle className="size-5 shrink-0 text-destructive mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-destructive">Error</h4>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setError("")}>
              <X className="size-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Row */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="border-border/40 bg-gradient-to-b from-background to-muted/20">
            <CardHeader className="pb-2">
              <CardDescription>Total Records</CardDescription>
              <CardTitle className="text-3xl">{items.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-border/40 bg-gradient-to-b from-background to-muted/20">
            <CardHeader className="pb-2">
              <CardDescription>Active Model</CardDescription>
              <CardTitle className="text-xl truncate">{activeMeta?.verbose_name || "None"}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-border/40 bg-gradient-to-b from-background to-muted/20">
            <CardHeader className="pb-2">
              <CardDescription>Available Models</CardDescription>
              <CardTitle className="text-3xl">{models.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-border/40 bg-gradient-to-b from-background to-muted/20">
            <CardHeader className="pb-2">
              <CardDescription>Search</CardDescription>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Filter records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
          </Card>
        </motion.div>
      )}

      {isDevToolsModel ? (
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="border-b border-border/40 pb-4">
            <CardTitle className="text-lg">Seed Status + Admin Feed</CardTitle>
            <CardDescription>
              Keep your workspace ready and track recent actions.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4">
              <div className="rounded-3xl border border-border/50 bg-background/80 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">Database Seed Status</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {seedStatus == null
                        ? "Checking setup..."
                        : seedStatus.seeded
                        ? "Starter data is ready. You can continue working."
                        : seedStatus.message || "Starter data is missing. Add it to use all dashboard screens."}
                    </p>
                  </div>
                  <Badge variant={seedStatus?.seeded ? "secondary" : "destructive"}>
                    {seedStatus?.seeded ? "Ready" : "Setup needed"}
                  </Badge>
                </div>

                {seedStatus?.counts ? (
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {Object.entries(seedStatus.counts).map(([key, count]) => (
                      <div key={key} className="rounded-2xl bg-muted p-3 text-sm">
                        <p className="font-semibold capitalize">{key.replace(/_/g, " ")}</p>
                        <p className="text-muted-foreground">{count}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.promise(loadSeedStatus(), {
                    loading: "Checking setup...",
                    success: "Setup checked.",
                    error: "Could not check setup.",
                  })}
                  disabled={seedLoading}
                >
                  Check setup
                </Button>
                <Button
                  size="sm"
                  onClick={() => toast.promise(runSeed(), {
                    loading: "Adding starter data...",
                    success: "Starter data added.",
                    error: "Setup failed.",
                  })}
                  disabled={seedLoading}
                >
                  {seedStatus?.seeded ? "Refresh starter data" : "Add starter data"}
                </Button>
              </div>
            </div>

            <div className="space-y-3 rounded-3xl border border-border/50 bg-muted p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Recent admin activity</p>
                  <p className="text-sm text-muted-foreground">Updates appear when someone creates, edits, deletes, or runs setup.</p>
                </div>
              </div>
              <div className="space-y-2">
                {recentNotifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No updates yet. Start creating or editing to see activity here.</p>
                ) : (
                  recentNotifications.map((note, idx) => (
                    <div key={`${note}-${idx}`} className="rounded-2xl bg-background p-3 text-sm shadow-sm">
                      {note}
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {!compact ? <Card className="border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/40 pb-4">
          <CardTitle className="text-lg">Model Categories</CardTitle>
          <CardDescription>
            Pick an area to quickly find related content.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 pt-4 md:grid-cols-2 xl:grid-cols-3">
          {categoryModels.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            return (
              <Button
                key={category.id}
                variant={isActive ? "default" : "outline"}
                className="h-auto items-start justify-start gap-3 p-4 text-left"
                onClick={() => setActiveCategory(category.id)}
              >
                <Icon className="mt-0.5 size-4 shrink-0" />
                <span className="flex flex-col">
                  <span className="font-semibold">{category.label}</span>
                  <span className="text-xs opacity-80">
                    {category.entries.length} items
                  </span>
                </span>
              </Button>
            );
          })}
        </CardContent>
      </Card> : null}

      {!compact ? <Card className="border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/40 pb-4">
          <CardTitle className="text-lg">Workflow Editors</CardTitle>
          <CardDescription>
            Quick shortcuts for common team tasks.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 pt-4 md:grid-cols-2 xl:grid-cols-4">
          {WORKFLOW_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isActive = activeModel === preset.model;
            const isAvailable = models.some((m) => m.name === preset.model);
            return (
              <Button
                key={preset.id}
                variant={isActive ? "default" : "outline"}
                className="h-auto items-start justify-start gap-3 p-4 text-left"
                disabled={!isAvailable}
                onClick={() => setActiveModel(preset.model)}
              >
                <Icon className="mt-0.5 size-4 shrink-0" />
                <span className="flex flex-col">
                  <span className="font-semibold">{preset.label}</span>
                  <span className="text-xs opacity-80">{preset.description}</span>
                </span>
              </Button>
            );
          })}
        </CardContent>
      </Card> : null}

      {!compact ? <Card className="border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/40 pb-4">
          <CardTitle className="text-lg">Manage Category Models</CardTitle>
          <CardDescription>
            Choose what you want to manage.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 pt-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleModels.map((model) => (
            <Button
              key={model.name}
              variant={activeModel === model.name ? "default" : "outline"}
              className="h-auto items-start justify-between p-4 text-left"
              onClick={() => setActiveModel(model.name)}
            >
              <span className="flex flex-col">
                <span className="font-semibold">{model.verbose_name}</span>
                <span className="text-xs opacity-80">{model.name}</span>
              </span>
              {SEED_ALIGNED_MODELS.has(model.name) ? (
                <Badge variant="secondary" className="ml-2">Seed</Badge>
              ) : null}
            </Button>
          ))}
          {visibleModels.length === 0 ? (
            <p className="text-sm text-muted-foreground">No models in this category.</p>
          ) : null}
        </CardContent>
      </Card> : null}

      {/* Main Content */}
      <Card className="border-border/30 shadow-sm">
        <CardHeader className="border-b border-border/40">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <LayoutGrid className="size-5 text-primary" />
                Items
                <Badge variant="secondary" className="ml-2">
                  {filteredItems.length}
                </Badge>
              </CardTitle>
              <CardDescription>
                {activeMeta?.verbose_name
                  ? `Viewing ${activeMeta.verbose_name.toLowerCase()}`
                  : "Select a section to view items"}
              </CardDescription>
            </div>
            {filteredItems.length > 0 && (
              <div className="flex items-center gap-2">
                {isLearnOrSocialModel ? (
                  <>
                    <Button
                      variant={contentViewMode === "cards" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreferredContentView("cards")}
                    >
                      Cards
                    </Button>
                    <Button
                      variant={contentViewMode === "table" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreferredContentView("table")}
                    >
                      Table
                    </Button>
                  </>
                ) : null}
                {contentViewMode === "table" ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRows(new Set(items.map(i => String(i.id || i.pk))))}
                    >
                      Select All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRows(new Set())}
                    >
                      Clear
                    </Button>
                  </>
                ) : null}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-4 p-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Database className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No items yet</h3>
              <p className="text-muted-foreground max-w-sm mt-1">
                {searchQuery
                  ? "Try a different search"
                  : isLearnOrSocialModel
                  ? "Create your first content item or switch to another workspace item."
                  : isDevToolsModel
                  ? "No developer activity has been recorded yet."
                  : "Start by creating your first item."}
              </p>
              {!searchQuery && (
                <div className="mt-4 space-y-3">
                  <Button onClick={openCreateModal} className="gap-2" disabled={!canCreate}>
                    <Plus className="size-4" />
                    Create item
                  </Button>
                  {suggestedModels.length > 0 ? (
                    <div className="flex flex-wrap justify-center gap-2">
                      {suggestedModels.map((modelName) => (
                        <Button
                          key={modelName}
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveModel(modelName)}
                        >
                          Open {modelName.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
                        </Button>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ) : isLearnOrSocialModel && contentViewMode === "cards" ? (
            <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item, idx) => {
                const pk = String(item.id ?? item.pk ?? `row-${idx}`);
                const title =
                  String(
                    item.title ??
                    item.name ??
                    item.question ??
                    item.prompt ??
                    item.email ??
                    `${activeMeta?.verbose_name ?? "Item"} ${idx + 1}`
                  );
                const detailText = summaryFields
                  .map((field) => {
                    const val = item[field.name];
                    if (val == null || String(val).trim() === "") return null;
                    return `${field.name.replace(/_/g, " ")}: ${String(val)}`;
                  })
                  .filter(Boolean)
                  .join(" • ");

                return (
                  <Card key={pk} className="border-border/30 shadow-none">
                    <CardHeader className="space-y-2 pb-3">
                      <CardTitle className="text-base leading-snug">{title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {detailText || "Open this item to edit details."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between pt-0">
                      <Badge variant="outline" className="border-border/40 capitalize">
                        {activeMeta?.verbose_name ?? activeModel}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            aria-label={`Actions for ${pk}`}
                            className="gap-1"
                          >
                            <MoreHorizontal className="size-4" />
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditModal(item)} disabled={!canEdit}>
                            <Edit className="mr-2 size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => openDeleteDialog(item)}
                            disabled={!canDelete}
                          >
                            <Trash2 className="mr-2 size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-340px)]">
              <Table>
                <TableHeader className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <TableRow className="border-border/30">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedRows.size === filteredItems.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedRows(new Set(filteredItems.map(i => String(i.id || i.pk))));
                          } else {
                            setSelectedRows(new Set());
                          }
                        }}
                      />
                    </TableHead>
                    {visibleTableFields.map((field) => (
                      <TableHead key={field.name} className="font-semibold">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSortField(sortField === field.name ? `-${field.name}` : field.name)}
                          className="-ml-3 h-8 gap-1"
                        >
                          {field.name}
                          {sortField === field.name && <ChevronDown className="size-3" />}
                        </Button>
                      </TableHead>
                    ))}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredItems.map((item, idx) => {
                      const pk = String(item.id ?? item.pk ?? `row-${idx}`);
                      return (
                        <motion.tr
                          key={pk}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2, delay: idx * 0.02 }}
                          className={`group border-border/20 hover:bg-muted/40 transition-colors ${selectedRows.has(pk) ? "bg-muted/30" : ""}`}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedRows.has(pk)}
                              onCheckedChange={(checked) => {
                                const next = new Set(selectedRows);
                                if (checked) next.add(pk); else next.delete(pk);
                                setSelectedRows(next);
                              }}
                            />
                          </TableCell>
                          {visibleTableFields.map((field) => (
                            <TableCell key={field.name} className="font-mono text-xs max-w-xs truncate">
                              <div className="flex items-center gap-2">
                                {isDevToolsModel && (field.name === "id" || field.name === "pk") && (
                                  <Badge variant="outline" className="gap-1">
                                    <span className="size-1.5 rounded-full bg-primary" />
                                    {String(item[field.name] ?? "-")}
                                  </Badge>
                                )}
                                {field.name.includes("date") || field.name.includes("created") || field.name.includes("updated") ? (
                                  <span className="flex items-center gap-1.5 text-muted-foreground">
                                    <Calendar className="size-3" />
                                    {item[field.name] ? format(new Date(String(item[field.name])), "MMM d, yyyy HH:mm") : "-"}
                                  </span>
                                ) : field.name.includes("user") || field.name.includes("owner") || field.name.includes("created_by") ? (
                                  <div className="flex items-center gap-2">
                                    <Avatar className="size-6">
                                      <AvatarImage src={""} />
                                      <AvatarFallback className="text-[10px]">
                                        {String(item[field.name] ?? "U").slice(0, 2).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>{String(item[field.name] ?? "-")}</span>
                                  </div>
                                ) : (
                                  <span className="truncate block max-w-[200px]">
                                    {String(item[field.name] ?? "-")}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                          ))}
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Edit ${pk}`}
                                onClick={() => openEditModal(item)}
                                disabled={!canEdit}
                              >
                                <Edit className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Delete ${pk}`}
                                onClick={() => openDeleteDialog(item)}
                                disabled={!canDelete}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label={`Actions for ${pk}`}
                                  >
                                    <MoreHorizontal className="size-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => openEditModal(item)}>
                                    <Edit className="mr-2 size-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => window.open(`/api/admin/models/${activeModel}/${item.id}`, '_blank')}>
                                    <ExternalLink className="mr-2 size-4" />
                                    View JSON
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => openDeleteDialog(item)}
                                  >
                                    <Trash2 className="mr-2 size-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] max-w-2xl h-[min(92vh,920px)] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-4 pt-4 pb-2 sm:px-6 sm:pt-6">
            <DialogTitle className="flex items-center gap-2">
              {currentItem?.id ? (
                <>
                  <Edit className="size-5 text-primary" />
                  Edit Item
                </>
              ) : (
                <>
                  <Plus className="size-5 text-primary" />
                  Create New Item
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {currentItem?.id
                ? "Update the fields below."
                : "Fill in the details below."}
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <ScrollArea className="flex-1 min-h-0">
            <div className="space-y-4 px-5 py-4 sm:px-6">
              {activeWorkflow ? (
                <Card className="border-border/50 bg-muted/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">{activeWorkflow.label}</CardTitle>
                    <CardDescription>{activeWorkflow.description}</CardDescription>
                  </CardHeader>
                </Card>
              ) : null}
              {getPrioritizedFields().map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name} className="flex items-center gap-2">
                      {field.name}
                      {field.required && <span className="text-destructive">*</span>}
                    </Label>
                    {(field.name.includes("content") ||
                      field.name.includes("body") ||
                      field.name.includes("article") ||
                      field.name.includes("description") ||
                      field.name.includes("explanation")) && (
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => applyTemplate(field.name, "**bold text**")}>
                          Bold
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => applyTemplate(field.name, "*italic text*")}>
                          Italic
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => applyTemplate(field.name, "\n## Section title\n")}>
                          Heading
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => applyTemplate(field.name, "\n- bullet item\n")}>
                          Bullet
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => applyTemplate(field.name, "\n[Link title](https://)\n")}>
                          Link
                        </Button>
                      </div>
                    )}
                    {renderFieldInput(field, formData[field.name], (val) =>
                      setFormData((prev) => ({ ...prev, [field.name]: val }))
                    )}
                  </div>
                ))}
            </div>
          </ScrollArea>

          <DialogFooter className="border-t border-border/30 px-5 py-3 sm:px-6 sm:py-4 mt-0 flex-row justify-end gap-2">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  {currentItem?.id ? "Update" : "Create"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] max-w-lg h-auto max-h-[92vh] overflow-y-auto">
          <DialogHeader className="pr-8">
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="size-5" />
              Delete Item
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              This will permanently delete the record with ID: <strong>{String(currentItem?.id ?? 'unknown')}</strong>
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={saving} className="gap-2">
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="size-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
