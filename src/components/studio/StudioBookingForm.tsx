"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
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

export function StudioBookingForm() {
  const [submitting, setSubmitting] = useState(false);

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
      toast.success("Commission inquiry submitted! Our creative producers will respond within 24 hours.");
      reset();
    } catch {
      toast.error("Failed to submit booking. Please try again or reach out to info@budgetndiostory.org directly.");
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
        <motion.form
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
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
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
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
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-2">
              <Label htmlFor="phone">Phone / WhatsApp *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g. +254 700 000000"
                {...register("phone", { required: "Phone number is required" })}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </motion.div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <motion.div variants={fadeInUp} className="space-y-2">
              <Label htmlFor="organization_type">Organisation Sector</Label>
              <select
                id="organization_type"
                className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
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
                className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
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
              {errors.service_type && (
                <p className="text-xs text-destructive">
                  {errors.service_type.message}
                </p>
              )}
            </motion.div>
          </div>

          <motion.div variants={fadeInUp} className="space-y-2">
            <Label htmlFor="message">Project Scope & Evidence Needs *</Label>
            <Textarea
              id="message"
              rows={4}
              placeholder="Tell us about the project: the core data/policy evidence to communicate, target audience, preferred timeline, and deliverables..."
              {...register("message", { required: "Please provide a brief project description" })}
            />
            {errors.message && (
              <p className="text-xs text-destructive">
                {errors.message.message}
              </p>
            )}
          </motion.div>

          <motion.div variants={fadeInUp} className="pt-2">
            <Button
              type="submit"
              size="lg"
              className={cn(T.btnPrimary, "w-full gap-2 rounded-full text-xs font-semibold py-3")}
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
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Every commission funds BNS Foundation's civic accountability missions.
            </p>
          </motion.div>
        </motion.form>
      </LandingContent>
    </LandingSection>
  );
}

