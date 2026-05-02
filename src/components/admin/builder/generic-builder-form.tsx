"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  Save, 
  Sparkles, 
  X, 
  Wand2, 
  ChevronRight,
  Info,
  Layers,
  Settings,
  Type
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/utils";
import { 
  BuilderSection, 
  BuilderField, 
  builderInputClass, 
  builderTextareaClass 
} from "./builder-components";

interface ModelField {
  name: string;
  type: string;
  required: boolean;
  read_only: boolean;
}

interface GenericBuilderFormProps {
  modelName: string;
  modelMeta: {
    verbose_name: string;
    fields: ModelField[];
  };
  initialData?: any;
  isEditing?: boolean;
}

export function GenericBuilderForm({ 
  modelName, 
  modelMeta, 
  initialData, 
  isEditing 
}: GenericBuilderFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>(initialData || {});

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const url = isEditing 
        ? `/api/admin/models/${modelName}/${initialData.id}`
        : `/api/admin/models/${modelName}`;
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save record");
      }

      toast.success(`${modelMeta.verbose_name} ${isEditing ? "updated" : "created"} successfully`);
      router.push("/admin/dashboard");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Group fields into logical sections (Primary, Metadata, Settings)
  const primaryFields = modelMeta.fields.filter(f => 
    !f.read_only && 
    (f.name.includes("title") || f.name.includes("name") || f.name.includes("question") || f.name.includes("content") || f.name.includes("description"))
  );
  
  const metadataFields = modelMeta.fields.filter(f => 
    !f.read_only && 
    !primaryFields.includes(f) && 
    (f.name.includes("category") || f.name.includes("year") || f.name.includes("type") || f.name.includes("status") || f.name.includes("_at"))
  );

  const otherFields = modelMeta.fields.filter(f => 
    !f.read_only && 
    !primaryFields.includes(f) && 
    !metadataFields.includes(f) &&
    f.name !== "id" && f.name !== "pk"
  );

  const renderInput = (field: ModelField) => {
    const value = formData[field.name] ?? "";
    
    if (field.type === "TextField" || field.name.includes("content") || field.name.includes("description")) {
      return (
        <Textarea 
          value={value}
          onChange={(e) => handleChange(field.name, e.target.value)}
          className={builderTextareaClass}
          placeholder={`Enter ${field.name.replace(/_/g, " ")}...`}
        />
      );
    }

    if (field.name.includes("status")) {
      return (
        <Select value={String(value)} onValueChange={(v) => handleChange(field.name, v)}>
          <SelectTrigger className={builderInputClass}>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input 
        type={field.type === "IntegerField" ? "number" : "text"}
        value={value}
        onChange={(e) => handleChange(field.name, field.type === "IntegerField" ? parseInt(e.target.value) : e.target.value)}
        className={builderInputClass}
        placeholder={`Enter ${field.name.replace(/_/g, " ")}...`}
      />
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      {/* Dynamic Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            {isEditing ? `Edit ${modelMeta.verbose_name}` : `Build ${modelMeta.verbose_name}`}
          </h2>
          <p className="text-muted-foreground">
            Manage your {modelMeta.verbose_name.toLowerCase()} with an airy, borderless interface.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl" onClick={() => router.back()}>
            Discard
          </Button>
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 rounded-xl px-6"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
            {isEditing ? "Save Changes" : `Create ${modelMeta.verbose_name}`}
          </Button>
        </div>
      </div>

      <div className="space-y-10">
        {/* Primary Content Section */}
        {primaryFields.length > 0 && (
          <BuilderSection title="Content" icon={<Type className="size-5 text-indigo-500" />}>
            <div className="grid gap-8">
              {primaryFields.map(field => (
                <BuilderField key={field.name} label={field.name.replace(/_/g, " ")} required={field.required}>
                  {renderInput(field)}
                </BuilderField>
              ))}
            </div>
          </BuilderSection>
        )}

        {/* Metadata & Classification Section */}
        {metadataFields.length > 0 && (
          <BuilderSection title="Classification" icon={<Layers className="size-5 text-emerald-500" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {metadataFields.map(field => (
                <BuilderField key={field.name} label={field.name.replace(/_/g, " ")} required={field.required}>
                  {renderInput(field)}
                </BuilderField>
              ))}
            </div>
          </BuilderSection>
        )}

        {/* Advanced / Other Fields Section */}
        {otherFields.length > 0 && (
          <BuilderSection title="Advanced Details" icon={<Settings className="size-5 text-amber-500" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {otherFields.map(field => (
                <BuilderField key={field.name} label={field.name.replace(/_/g, " ")} required={field.required}>
                  {renderInput(field)}
                </BuilderField>
              ))}
            </div>
          </BuilderSection>
        )}
      </div>

      {/* Quick Save Bar (Mobile/Bottom) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-3 flex items-center justify-between shadow-2xl">
          <p className="text-white/60 text-xs ml-4 font-medium">Unsaved changes detected</p>
          <Button 
            size="sm" 
            className="rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white px-6"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? <Loader2 className="size-3 animate-spin mr-2" /> : <Sparkles className="size-3 mr-2" />}
            Quick Save
          </Button>
        </div>
      </div>
    </div>
  );
}
