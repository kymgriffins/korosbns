"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";

/**
 * BuilderSection - A beautifully padded container for form groups
 */
export function BuilderSection({ 
  title, 
  icon, 
  children, 
  className 
}: { 
  title: string; 
  icon?: React.ReactNode; 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 group",
        className
      )}
    >
      <h3 className="text-lg font-semibold mb-8 flex items-center gap-3">
        {icon && (
          <span className="p-2 rounded-xl bg-white/50 shadow-inner group-hover:scale-110 transition-transform">
            {icon}
          </span>
        )}
        <span className="tracking-tight">{title}</span>
      </h3>
      {children}
    </motion.div>
  );
}

/**
 * BuilderField - A wrapper for inputs that handles labels and styling
 */
export function BuilderField({ 
  label, 
  description, 
  children, 
  className,
  error 
}: { 
  label: string; 
  description?: string; 
  children: React.ReactNode;
  className?: string;
  error?: string;
}) {
  return (
    <div className={cn("space-y-2 group/field", className)}>
      <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground group-focus-within/field:text-indigo-600 transition-colors ml-1">
        {label}
      </Label>
      <div className="relative">
        {children}
      </div>
      {description && <p className="text-[10px] text-muted-foreground ml-1">{description}</p>}
      {error && <p className="text-[10px] text-destructive ml-1">{error}</p>}
    </div>
  );
}

/**
 * Airy styles for standard components
 */
export const builderInputClass = "bg-transparent border-none border-b border-muted/50 focus-visible:ring-0 px-0 rounded-none transition-all focus:border-indigo-500 h-10 text-base placeholder:text-muted-foreground/30";
export const builderTextareaClass = "bg-transparent border-none border-b border-muted/50 focus-visible:ring-0 px-0 rounded-none transition-all focus:border-indigo-500 min-h-[100px] resize-none text-base placeholder:text-muted-foreground/30 py-2";

/**
 * BuilderBreadcrumbs - Standardized navigation
 */
export function BuilderBreadcrumbs({ modelName, isEditing }: { modelName: string; isEditing?: boolean }) {
  const displayModel = modelName.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  
  return (
    <Breadcrumb className="mb-8">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="font-medium">
            {isEditing ? `Edit ${displayModel}` : `New ${displayModel}`}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
