"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Loader2, Send } from "lucide-react";
import { citizenApi } from "@/lib/api-client";
import { toast } from "sonner";

type FormData = {
  name: string;
  email: string;
  phone: string;
  service_type: string;
  message: string;
};

const serviceTypes = [
  "Videography",
  "Photography",
  "Studio Rental",
  "Post-Production",
  "Other",
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
      await citizenApi.submitStudioBooking(data);
      toast.success("Booking request submitted! We'll be in touch within 24 hours.");
      reset();
    } catch {
      toast.error("Failed to submit booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="booking" className="w-full py-20 md:py-32 bg-muted/30">
      <div className="max-w-2xl mx-auto px-6 md:px-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <motion.span
            variants={fadeInUp}
            className="text-xs font-bold uppercase tracking-widest text-primary"
          >
            Book Now
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl font-bold font-heading tracking-tight mt-3"
          >
            Book a Shoot
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-muted-foreground mt-4"
          >
            Fill in the form and we&apos;ll get back to you within 24 hours.
          </motion.p>
        </motion.div>

        <motion.form
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 p-8 rounded-2xl border border-border/60 bg-card"
        >
          <motion.div variants={fadeInUp} className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="Your full name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="e.g. 0712345678"
              {...register("phone", { required: "Phone is required" })}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">
                {errors.phone.message}
              </p>
            )}
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-2">
            <Label htmlFor="service_type">Service Type *</Label>
            <select
              id="service_type"
              className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              {...register("service_type", {
                required: "Service type is required",
              })}
            >
              <option value="">Select a service</option>
              {serviceTypes.map((s) => (
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

          <motion.div variants={fadeInUp} className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              rows={5}
              placeholder="Tell us about your project, budget, and preferred dates..."
              {...register("message", { required: "Message is required" })}
            />
            {errors.message && (
              <p className="text-xs text-destructive">
                {errors.message.message}
              </p>
            )}
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Button
              type="submit"
              size="lg"
              className="w-full gap-2 rounded-full"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              {submitting ? "Sending..." : "Send Booking Request"}
            </Button>
          </motion.div>
        </motion.form>
      </div>
    </section>
  );
}
