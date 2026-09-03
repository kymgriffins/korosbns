"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageSquare, Send, X } from "lucide-react";
import { citizenApi } from "@/lib/api-client";
import { toast } from "sonner";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  STUDIO_CONTENT_TYPES,
  STUDIO_ORGANIZATION_TYPES,
} from "@/constants/bns-studio-content";
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

/**
 * Commission enquiry form — click-to-reveal only.
 * Controlled usage renders nothing inline until opened (dialog overlay),
 * so embedding sections never pay whitespace for a hidden form.
 */
export function StudioBookingForm({ open, onOpenChange }: StudioBookingFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const [submitting, setSubmitting] = useState(false);
  const controlled = open !== undefined;
  const isOpen = controlled ? open : internalOpen;

  const setOpen = (next: boolean) => {
    if (onOpenChange) onOpenChange(next);
    else setInternalOpen(next);
  };

  useEffect(() => {
    const syncFromHash = () => {
      if (window.location.hash !== "#booking") return;
      setOpen(true);
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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
    <>
      {!controlled && !isOpen ? (
        <div className="mx-auto max-w-xl text-center">
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
      ) : null}

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="studio-booking-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="studio-booking-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Commission BNS Studios"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
              transition={{ duration: reduceMotion ? 0 : 0.28 }}
              className="studio-booking-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="studio-booking-dialog-head">
                <div>
                  <p className="studio-about-index">Commission impact production</p>
                  <h2 className="studio-booking-dialog-title">
                    Start your impact production
                  </h2>
                  <p className="studio-booking-dialog-lede">
                    Share goals, format, and timeline — we respond with an
                    evidence treatment and quote within 24 hours.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="studio-booking-dialog-close"
                  aria-label="Close enquiry form"
                  autoFocus
                >
                  <X className="size-5" aria-hidden />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="studio-booking-form">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="booking-name">Full Name *</Label>
                    <Input
                      id="booking-name"
                      placeholder="e.g. Amani Mwangi"
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name ? (
                      <p className="text-xs text-destructive">{errors.name.message}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="booking-org">Organization / Project Name</Label>
                    <Input
                      id="booking-org"
                      placeholder="e.g. County Civic Desk, NGO, or Brand"
                      {...register("organization_name")}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="booking-email">Work Email *</Label>
                    <Input
                      id="booking-email"
                      type="email"
                      placeholder="your@organization.org"
                      {...register("email", { required: "Email is required" })}
                    />
                    {errors.email ? (
                      <p className="text-xs text-destructive">{errors.email.message}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="booking-phone">Phone / WhatsApp *</Label>
                    <Input
                      id="booking-phone"
                      type="tel"
                      placeholder="e.g. +254 700 000000"
                      {...register("phone", { required: "Phone number is required" })}
                    />
                    {errors.phone ? (
                      <p className="text-xs text-destructive">{errors.phone.message}</p>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="booking-sector">Organisation Sector</Label>
                    <select
                      id="booking-sector"
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="booking-format">Content Format *</Label>
                    <select
                      id="booking-format"
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
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="booking-message">Project Scope & Evidence Needs *</Label>
                  <Textarea
                    id="booking-message"
                    rows={4}
                    placeholder="Tell us about the project: the core data/policy evidence to communicate, target audience, preferred timeline, and deliverables..."
                    {...register("message", {
                      required: "Please provide a brief project description",
                    })}
                  />
                  {errors.message ? (
                    <p className="text-xs text-destructive">{errors.message.message}</p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
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
                </div>
                <p className="text-center text-[11px] text-muted-foreground">
                  Every commission funds BNS Foundation&apos;s civic accountability missions.
                </p>
              </form>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
