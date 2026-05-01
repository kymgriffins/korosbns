import * as React from "react"
import { useForm, type UseFormReturn, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Save, Loader2, X, ChevronLeft, ChevronRight, PlusCircle, Pencil } from "lucide-react"

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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

const FIELDS_PER_STEP = 8

function chunkFields<T extends unknown>(entries: [string, FieldConfig][], size: number): [string, FieldConfig][][] {
  if (!entries.length) return [[]]
  const out: [string, FieldConfig][][] = []
  for (let i = 0; i < entries.length; i += size) {
    out.push(entries.slice(i, i + size))
  }
  return out
}

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
  const [fieldStep, setFieldStep] = React.useState(0)
  const isEditing = !!id

  React.useEffect(() => {
    if (open) {
      setFieldStep(0)
      setActiveTab("fields")
    }
  }, [open])

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

  const fieldChunks = React.useMemo(
    () => chunkFields(visibleFields, FIELDS_PER_STEP),
    [visibleFields],
  )

  const fieldStepChunks = activeTab === "fields" ? fieldChunks : []
  const totalFieldSteps = fieldStepChunks.length
  const steppedFields =
    activeTab === "fields" && totalFieldSteps > 1
      ? fieldStepChunks[Math.min(fieldStep, totalFieldSteps - 1)] ?? []
      : visibleFields

  const formSlug = React.useMemo(
    () => title.toLowerCase().replace(/\s+/g, "-"),
    [title],
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1.25rem)] max-w-2xl h-[min(90dvh,880px)] gap-0 overflow-hidden p-0 shadow-lg ring-1 ring-border/20 flex flex-col sm:rounded-xl">
        <DialogHeader className="gap-1 px-4 pb-3 pt-4 sm:px-6 sm:pt-5">
          <DialogTitle className="flex items-center gap-2 text-base">
            {isEditing ? (
              <>
                <Pencil className="text-primary size-4 shrink-0" aria-hidden />
                Edit {title}
              </>
            ) : (
              <>
                <PlusCircle className="text-primary size-4 shrink-0" aria-hidden />
                New {title}
              </>
            )}
          </DialogTitle>
          {description && <DialogDescription className="text-xs">{description}</DialogDescription>}
        </DialogHeader>

        <Separator className="bg-border/25" />

          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="px-4 pt-3 sm:px-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList
                className={`grid h-9 w-full p-0.5 bg-muted/40 ring-1 ring-border/15 ${isEditing ? "grid-cols-2" : "grid-cols-1"}`}
              >
                <TabsTrigger value="fields" className="text-xs">
                  Fields
                </TabsTrigger>
                {isEditing ? (
                  <TabsTrigger value="advanced" className="text-xs">
                    Danger zone
                  </TabsTrigger>
                ) : null}
              </TabsList>
            </Tabs>
          </div>

          {activeTab === "fields" && totalFieldSteps > 1 ? (
            <div className="flex items-center justify-between px-4 py-2 sm:px-6">
              <p className="text-[11px] text-muted-foreground">
                Step {Math.min(fieldStep + 1, totalFieldSteps)} of {totalFieldSteps}
              </p>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  disabled={fieldStep <= 0}
                  onClick={() => setFieldStep((s) => Math.max(0, s - 1))}
                >
                  <ChevronLeft className="size-3.5" />
                  Back
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  disabled={fieldStep >= totalFieldSteps - 1}
                  onClick={() => setFieldStep((s) => Math.min(totalFieldSteps - 1, s + 1))}
                >
                  Next
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          ) : null}

          <ScrollArea className="min-h-[200px] flex-1 px-4 py-3 sm:px-6">
            <Form {...form}>
              <form
                id={`${formSlug}-form`}
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-3"
              >
                {activeTab === "fields" && (
                  <div className="grid gap-3 py-1">
                    {steppedFields.map(([key, config]) => (
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
                                <span className="text-[10px] text-muted-foreground rounded bg-muted/60 px-1.5 py-0.5 ring-1 ring-border/15">
                                  read-only
                                </span>
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
                  <div className="space-y-3 py-1">
                    <div className="rounded-lg bg-destructive/5 p-3 ring-1 ring-destructive/20">
                      <h4 className="mb-1 text-sm font-semibold text-destructive">Delete record</h4>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        This cannot be undone. Use <span className="font-medium text-foreground">Delete</span> in the
                        bar below when you are certain.
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </ScrollArea>

          <Separator className="bg-border/25" />

          <DialogFooter className="flex-row flex-wrap justify-end gap-2 border-t border-border/20 bg-muted/15 px-4 py-2.5 sm:px-6 sm:py-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetForm}
              disabled={isSaving}
            >
              <X className="mr-1.5 size-3.5" />
              Cancel
            </Button>
            {isEditing && onDelete && activeTab === "fields" ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setActiveTab("advanced")}
                disabled={isSaving}
              >
                Delete…
              </Button>
            ) : null}
            {isEditing && onDelete && activeTab === "advanced" ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isSaving}
                className="gap-1.5"
              >
                {isSaving ? <Loader2 className="size-3.5 animate-spin" /> : null}
                {deleteLabel}
              </Button>
            ) : null}
            <Button
              type="submit"
              form={`${formSlug}-form`}
              disabled={
                isSaving ||
                activeTab === "advanced" ||
                (activeTab === "fields" && totalFieldSteps > 1 && fieldStep < totalFieldSteps - 1)
              }
              size="sm"
              className="gap-1.5 min-w-[96px]"
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
      <div className="flex items-center gap-2 rounded-md bg-muted/40 p-2 text-sm text-muted-foreground ring-1 ring-border/15">
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
