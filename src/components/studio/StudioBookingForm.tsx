"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageSquare, Send } from "lucide-react";
import { citizenApi } from "@/lib/api-client";
import { toast } from "sonner";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  STUDIO_CONTENT_TYPES,
  STUDIO_ORGANIZATION_TYPES,
} from "@/constants/bns-studio-content";
import {
  LandingContent,
  LandingSection,
  LandingSectionHeader,
} from "@/layouts/landing-section";
import { cn } from "@/utils";

type FormData = {
  name: string;
  organization_name?: string;
  organization_type?: string;
  email: string;
  phone: string;
  service_type: string;
  message: string;
};

const serviceOptions = [
  ...STUDIO_CONTENT_TYPES.map((t) => t.id),
  "Studio / Multi-Camera Space Rental",
  "Full Multi-Format Campaign Package",
  "Other Custom Production",
];

const orgOptions = [
  ...STUDIO_ORGANIZATION_TYPES.map((o) => o.id),
  "Independent Creator / Other",
];

type StudioBookingFormProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function StudioBookingForm({ open, onOpenChange }: StudioBookingFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isOpen = open ?? internalOpen;

  const setOpen = (next: boolean) => {
    if (onOpenChange) onOpenChange(next);
    else setInternalOpen(next);
  };

  useEffect(() => {
    const syncFromHash = () => {
      if (window.location.hash !== "#booking") return;
      if (onOpenChange) onOpenChange(true);
      else setInternalOpen(true);
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [onOpenChange]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const enrichedMessage = [
        data.organization_name ? `Organization: ${data.organization_name}` : "",
        data.organization_type ? `Sector: ${data.organization_type}` : "",
        "",
        data.message,
      ]
        .filter(Boolean)
        .join("\n");

      await citizenApi.submitStudioBooking({
        name: data.name,
        email: data.email,
        phone: data.phone,
        service_type: data.service_type,
        message: enrichedMessage,
      });
      toast.success(
        "Commission inquiry submitted! Our creative producers will respond within 24 hours.",
      );
      reset();
      setOpen(false);
    } catch {
      toast.error(
        "Failed to submit booking. Please try again or reach out to info@budgetndiostory.org directly.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LandingSection id="booking">
      <LandingSectionHeader
        align="center"
        eyebrow="Commission impact production"
        title="Start your impact production"
        description="Tell us about your organization's goals, desired format, and target timeline. We will structure an evidence treatment and quote within 24 hours."
      />

      <LandingContent>
        {!isOpen ? (
          <div className="mx-auto max-w-xl space-y-5 rounded-3xl border border-border bg-card p-8 text-center shadow-sm md:p-10">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MessageSquare className="size-5" />
            </div>
            <div className="space-y-2">
              <h3 className={cn(T.sectionTitle, "text-xl md:text-2xl")}>
                Ready to commission?
              </h3>
              <p className={cn(T.lead, "text-sm text-foreground/75")}>
                Open the inquiry form when you are ready to share project scope,
                format, and timeline. Phone and WhatsApp stay available in the
                bar below.
              </p>
            </div>
            <Button
              type="button"
              size="lg"
              className={cn(T.btnPrimary, "gap-2 rounded-full px-8")}
              onClick={() => setOpen(true)}
            >
              <MessageSquare className="size-4" />
              Start commission inquiry
            </Button>
          </div>
        ) : (
          <motion.form
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto max-w-2xl space-y-5 rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <motion.div variants={fadeInUp} className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. Amani Mwangi"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name ? (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                ) : null}
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-2">
                <Label htmlFor="organization_name">Organization / Project Name</Label>
                <Input
                  id="organization_name"
                  placeholder="e.g. County Civic Desk, NGO, or Brand"
                  {...register("organization_name")}
                />
              </motion.div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <motion.div variants={fadeInUp} className="space-y-2">
                <Label htmlFor="email">Work Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@organization.org"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email ? (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                ) : null}
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-2">
                <Label htmlFor="phone">Phone / WhatsApp *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g. +254 700 000000"
                  {...register("phone", { required: "Phone number is required" })}
                />
                {errors.phone ? (
                  <p className="text-xs text-destructive">{errors.phone.message}</p>
                ) : null}
              </motion.div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <motion.div variants={fadeInUp} className="space-y-2">
                <Label htmlFor="organization_type">Organisation Sector</Label>
                <select
                  id="organization_type"
                  className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                  {...register("organization_type")}
                >
                  <option value="">Select organisation type</option>
                  {orgOptions.map((org) => (
                    <option key={org} value={org}>
                      {org}
                    </option>
                  ))}
                </select>
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-2">
                <Label htmlFor="service_type">Content Format *</Label>
                <select
                  id="service_type"
                  className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                  {...register("service_type", {
                    required: "Please select a content format",
                  })}
                >
                  <option value="">Select primary format</option>
                  {serviceOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.service_type ? (
                  <p className="text-xs text-destructive">
                    {errors.service_type.message}
                  </p>
                ) : null}
              </motion.div>
            </div>

            <motion.div variants={fadeInUp} className="space-y-2">
              <Label htmlFor="message">Project Scope & Evidence Needs *</Label>
              <Textarea
                id="message"
                rows={4}
                placeholder="Tell us about the project: the core data/policy evidence to communicate, target audience, preferred timeline, and deliverables..."
                {...register("message", {
                  required: "Please provide a brief project description",
                })}
              />
              {errors.message ? (
                <p className="text-xs text-destructive">{errors.message.message}</p>
              ) : null}
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="rounded-full"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                className={cn(
                  T.btnPrimary,
                  "flex-1 gap-2 rounded-full text-xs font-semibold py-3",
                )}
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    <Send className="size-4" />
                    <span>Submit Commission Request</span>
                  </>
                )}
              </Button>
            </motion.div>
            <p className="text-center text-[11px] text-muted-foreground">
              Every commission funds BNS Foundation&apos;s civic accountability missions.
            </p>
          </motion.form>
        )}
      </LandingContent>
    </LandingSection>
  );
}
