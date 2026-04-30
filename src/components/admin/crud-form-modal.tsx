import * as React from "react"
import { useForm, type UseFormReturn, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Save, Loader2, X } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"

export type FieldConfig = {
  name: string
  label: string
  type?: "text" | "textarea" | "number" | "email" | "password" | "date" | "datetime-local" | "boolean" | "select" | "json"
  placeholder?: string
  description?: string
  required?: boolean
  readOnly?: boolean
  options?: Array<{ label: string; value: string }>
  rows?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  hidden?: boolean
  validation?: z.ZodTypeAny
  renderInput?: (props: {
    field: { value: unknown; onChange: (val: unknown) => void; onBlur: () => void }
    meta: { touched: boolean; error?: string }
  }) => React.ReactNode
}

export type FormSchema = Record<string, FieldConfig>

interface CrudFormModalProps<T extends Record<string, unknown>> {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  schema: FormSchema
  defaultValues: Partial<T>
  onSubmit: (values: Partial<T>) => Promise<void>
  onDelete?: (id: string | number) => Promise<void>
  isSaving?: boolean
  deleteLabel?: string
  id?: string | number
}

export function CrudFormModal<T extends Record<string, unknown>>({
  open,
  onOpenChange,
  title = "Form",
  description,
  schema,
  defaultValues,
  onSubmit,
  onDelete,
  isSaving = false,
  deleteLabel = "Delete",
  id,
}: CrudFormModalProps<T>) {
  const [activeTab, setActiveTab] = React.useState("fields")
  const isEditing = !!id

  // Build dynamic Zod schema from field configs
  const zodSchemaFields: Record<string, z.ZodTypeAny> = {}
  Object.entries(schema).forEach(([key, config]) => {
    let fieldSchema: z.ZodTypeAny = z.any()

    if (config.type === "boolean") {
      fieldSchema = z.boolean()
    } else if (config.type === "number" || config.type === "datetime-local") {
      fieldSchema = z.number().min(0)
    } else if (config.type === "email") {
      fieldSchema = z.string().email("Invalid email address")
    } else {
      fieldSchema = z.string()
    }

    if (config.required) {
      fieldSchema = fieldSchema.refine(
        (val) => val !== null && val !== undefined && val !== "",
        { message: `${config.label} is required` }
      )
    }

    if (config.validation) {
      fieldSchema = config.validation
    }

    zodSchemaFields[key] = fieldSchema
  })

  const formSchema = z.object(zodSchemaFields)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: Object.fromEntries(
      Object.entries(schema).map(([key, config]) => [
        key,
        defaultValues[key] ?? (config.type === "boolean" ? false : ""),
      ])
    ) as z.infer<typeof formSchema>,
  })

  const handleSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {
    try {
      await onSubmit(values as Partial<T>)
      form.reset()
      onOpenChange(false)
      toast.success(isEditing ? "Record updated successfully" : "Record created successfully")
    } catch (error) {
      console.error("Form submission error:", error)
      // Error is handled by parent component
    }
  }

  const handleDelete = async () => {
    if (!onDelete || !id) return
    try {
      await onDelete(id)
      onOpenChange(false)
      toast.success("Record deleted successfully")
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  const resetForm = () => {
    form.reset()
    onOpenChange(false)
  }

  const visibleFields = Object.entries(schema).filter(([_, config]) => !config.hidden)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1.5rem)] max-w-2xl h-[min(92vh,920px)] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-4 pt-4 pb-2 sm:px-6 sm:pt-6">
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <>
                <span className="text-primary">✏️</span>
                Edit {title}
              </>
            ) : (
              <>
                <span className="text-primary">➕</span>
                Create New {title}
              </>
            )}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <Separator className="my-2" />

          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="px-4 sm:px-6">
            <div className="flex gap-4 border-b">
              <button
                type="button"
                onClick={() => setActiveTab("fields")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "fields"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Fields
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setActiveTab("advanced")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "advanced"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Advanced
                </button>
              )}
            </div>
          </div>

          <ScrollArea className="flex-1 px-4 py-4 min-h-0 sm:px-6">
            <Form {...form}>
              <form
                id={`${title.toLowerCase().replace(/\s+/g, "-")}-form`}
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                {activeTab === "fields" && (
                  <div className="grid gap-4 py-2">
                    {visibleFields.map(([key, config]) => (
                      <FormField
                        key={key}
                        control={form.control}
                        name={key as any}
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1.5">
                              {config.label}
                              {config.required && <span className="text-destructive text-sm">*</span>}
                              {config.readOnly && (
                                <span className="text-[10px] text-muted-foreground border px-1 rounded">read-only</span>
                              )}
                            </FormLabel>
                            <FormControl>
                              {renderFieldInput(config, field)}
                            </FormControl>
                            {config.description && (
                              <FormDescription className="text-xs">
                                {config.description}
                              </FormDescription>
                            )}
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                )}

                {activeTab === "advanced" && isEditing && (
                  <div className="space-y-4 py-2">
                    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                      <h4 className="font-semibold text-destructive mb-2">Danger Zone</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Permanently delete this record. This action cannot be undone.
                      </p>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        disabled={isSaving}
                        className="gap-2"
                      >
                        {isSaving ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <span>🗑️</span>
                        )}
                        {deleteLabel}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </ScrollArea>

          <Separator className="my-2" />

          <DialogFooter className="px-4 py-3 bg-muted/20 border-t sm:px-6 sm:py-4 flex-row justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={isSaving}
            >
              <X className="size-4 mr-2" />
              Cancel
            </Button>
            {isEditing && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <span>🗑️</span>
                )}
                {deleteLabel}
              </Button>
            )}
            <Button
              type="submit"
              form={`${title.toLowerCase().replace(/\s+/g, "-")}-form`}
              disabled={isSaving}
              className="gap-2 min-w-[100px]"
            >
              {isSaving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              {isSaving ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function renderFieldInput(
  config: FieldConfig,
  field: {
    value: unknown
    onChange: (val: unknown) => void
    onBlur: () => void
  }
) {
  const { value, onChange, onBlur } = field

  if (config.readOnly) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 bg-muted/30 rounded-md border">
        <span>{String(value ?? "-")}</span>
        <span className="text-xs ml-auto text-muted-foreground/70">(read-only)</span>
      </div>
    )
  }

  if (config.renderInput) {
    return config.renderInput({ field, meta: { touched: false } })
  }

  switch (config.type) {
    case "textarea":
      return (
        <textarea
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          rows={config.rows || 4}
          placeholder={config.placeholder}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
        />
      )
    case "select":
      return (
        <Select
          value={value as string}
          onValueChange={onChange as (val: string) => void}
          disabled={config.disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder={config.placeholder || "Select an option"} />
          </SelectTrigger>
          <SelectContent>
            {config.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    case "boolean":
      return (
        <Checkbox
          checked={value as boolean}
          onCheckedChange={onChange as (val: boolean) => void}
          disabled={config.disabled}
        />
      )
    case "json":
      return (
        <textarea
          value={typeof value === "object" ? JSON.stringify(value, null, 2) : (value as string)}
          onChange={(e) => {
            try {
              onChange(JSON.parse(e.target.value))
            } catch {
              onChange(e.target.value)
            }
          }}
          onBlur={onBlur}
          rows={config.rows || 6}
          placeholder={config.placeholder}
          className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      )
    case "date":
    case "datetime-local":
      return (
        <Input
          type={config.type}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={config.placeholder}
          disabled={config.disabled}
        />
      )
    case "number":
      return (
        <Input
          type="number"
          value={value as number}
          onChange={(e) => onChange(Number(e.target.value))}
          onBlur={onBlur}
          placeholder={config.placeholder}
          min={config.min}
          max={config.max}
          step={config.step}
          disabled={config.disabled}
        />
      )
    default:
      return (
        <Input
          type="text"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={config.placeholder}
          disabled={config.disabled}
          readOnly={config.readOnly}
        />
      )
  }
}
