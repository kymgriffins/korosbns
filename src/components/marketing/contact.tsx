"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utils";
import {
    ArrowRight,
    MessageSquare,
    Send,
} from "lucide-react";
import { IconBrandInstagram, IconBrandLinkedin, IconBrandYoutube, IconBrandX, IconBrandWhatsapp, IconBrandTiktok, IconBrandFacebook } from "@tabler/icons-react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import React, { useRef, useState } from "react";
import Balancer from "react-wrap-balancer";
import { toast } from "sonner";
import Container from "../global/container";
import Wrapper from "../global/wrapper";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";

// Compact X icon
const XIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.482 3.239H4.293L17.607 20.65z" />
  </svg>
);

const socials = [
  {
    name: "X",
    icon: IconBrandX,
    href: "https://x.com/budgetndiostory",
    color: "bg-black",
    hoverColor: "hover:bg-neutral-800",
  },
  {
    name: "YouTube",
    icon: IconBrandYoutube,
    href: "https://youtube.com/@budgetndiostory",
    color: "bg-[#FF0000]",
    hoverColor: "hover:bg-[#E60000]",
  },
  {
    name: "Instagram",
    icon: IconBrandInstagram,
    href: "https://instagram.com/budgetndiostory",
    color: "bg-linear-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
    hoverColor: "opacity-90",
  },
  {
    name: "LinkedIn",
    icon: IconBrandLinkedin,
    href: "https://www.linkedin.com/company/budget-ndio-story/",
    color: "bg-[#0077B5]",
    hoverColor: "hover:bg-[#006396]",
  },
  {
    name: "WhatsApp",
    icon: IconBrandWhatsapp,
    href: "https://wa.me/254790631623",
    color: "bg-[#25D366]",
    hoverColor: "hover:bg-[#128C7E]",
  },
  {
    name: "TikTok",
    icon: IconBrandTiktok,
    href: "https://www.tiktok.com/@budget.ndio.story",
    color: "bg-black",
    hoverColor: "hover:bg-neutral-800",
  },
  {
    name: "Facebook",
    icon: IconBrandFacebook,
    href: "https://www.facebook.com/share/1CPg2LgfVJ/",
    color: "bg-[#1877F2]",
    hoverColor: "hover:bg-[#0E52B0]",
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formExpanded, setFormExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const bgShift = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const blobOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.3, 0.5, 0.3, 0.1],
  );
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    // Impeccable note: useSpring with damping keeps this scroll-linked value smooth; acceptable for scroll-linked transforms
  });

  const submitMutation = useMutation({
    mutationFn: (body: { name: string; email: string; message: string }) =>
      fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }).then((r) => r.json()),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Message sent! We'll reply within 48 hours.");
        setFormData({ name: "", email: "", message: "" });
        setFormExpanded(false);
      } else {
        toast.error("Something went wrong. Try again.");
      }
    },
    onError: () => {
      toast.error("Network error. Check your connection.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }
    submitMutation.mutate(formData);
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-dvh bg-background overflow-hidden flex flex-col pt-20"
    >
      {/* Ambient background motion */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full"
          style={{
            backgroundPosition: bgShift,
            opacity: blobOpacity,
          }}
        />
        <motion.div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"
          style={{
            backgroundPosition: bgShift,
            opacity: blobOpacity,
          }}
        />
        {/* Subtle particle drift */}
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.03)_1px,transparent_0)] bg-[size:40px_40px]"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <Wrapper className="relative z-10 w-full flex-1 flex flex-col justify-between py-6">
        {/* Spacer to keep content centered vertically within the flex-1 area */}
        <div className="flex-1 flex flex-col justify-center py-4">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-10 w-full">
            {/* SECTION 1: HOOK */}
            <Container animation="fadeUp" className="text-center space-y-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl sm:text-5xl font-bold font-heading tracking-tight">
                  Let&apos;s talk{" "}
                  <span className="text-primary">
                    Budget Stories.
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-foreground/60 mt-2 max-w-md mx-auto">
                  <Balancer>
                    Have a question or want to collaborate? We&apos;re here to
                    help you tell better stories with data.
                  </Balancer>
                </p>
              </motion.div>
            </Container>

            {/* SECTION 2: SOCIALS */}
            <Container animation="fadeUp" delay={0.2} className="space-y-4">
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {socials.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "group relative flex items-center gap-2 px-3 py-2 rounded-xl border transition-all overflow-hidden",
                      social.color,
                      social.hoverColor,
                      "border-white/10 hover:border-white/30",
                    )}
                  >
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 rounded-xl border border-white/20"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 11 + index,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <div className="relative flex items-center justify-center size-8 rounded-lg bg-white/20 backdrop-blur-sm">
                      <motion.span
                        aria-hidden
                        className="absolute inset-0 rounded-lg border border-white/40"
                        animate={{
                          opacity: [0.3, 0.9, 0.3],
                          scale: [0.92, 1.04, 0.92],
                        }}
                        transition={{
                          duration: 2.3,
                          repeat: Infinity,
                          delay: index * 0.07,
                        }}
                      />
                      <social.icon className="size-4 text-white relative z-10" />
                    </div>
                    <span className="text-xs font-medium text-white hidden sm:inline">
                      {social.name}
                    </span>
                  </motion.a>
                ))}
              </div>
            </Container>

            {/* SECTION 3: CONTACT (Inline, Expandable) */}
            <Container animation="fadeUp" delay={0.3} className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-semibold">Ready to collaborate?</h2>
                <p className="text-sm text-foreground/60 mt-1">
                  Send us a message — we read every one.
                </p>
              </div>

              {!formExpanded ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center"
                >
                  <Button
                    size="lg"
                    onClick={() => setFormExpanded(true)}
                    className="h-11 px-6 rounded-xl text-sm font-medium shadow-lg shadow-primary/10 group"
                  >
                    <MessageSquare className="mr-2 size-4 group-hover:rotate-12 transition-transform" />
                    Start a conversation
                    <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 p-4 sm:p-6 rounded-2xl bg-muted/30 border border-border"
                  onSubmit={handleSubmit}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="name"
                        className="text-[10px] font-bold uppercase tracking-widest text-foreground/40"
                      >
                        Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="bg-muted/30 border-border h-10 rounded-lg focus:ring-primary focus:bg-muted/50 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="email"
                        className="text-[10px] font-bold uppercase tracking-widest text-foreground/40"
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="bg-muted/30 border-border h-10 rounded-lg focus:ring-primary focus:bg-muted/50 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="message"
                      className="text-[10px] font-bold uppercase tracking-widest text-foreground/40"
                    >
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="What's on your mind?"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="bg-muted/30 border-border min-h-[100px] rounded-lg focus:ring-primary focus:bg-muted/50 text-sm resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      size="sm"
                      className="flex-1 h-10 text-sm rounded-lg font-medium"
                      disabled={submitMutation.isPending}
                    >
                      {submitMutation.isPending ? (
                        <span className="animate-spin mr-2">◌</span>
                      ) : (
                        <Send className="mr-2 size-3.5" />
                      )}
                      {submitMutation.isPending ? "Sending..." : "Send message"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormExpanded(false)}
                      className="h-10 px-3 text-sm text-foreground/60 hover:text-foreground"
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.form>
              )}
            </Container>
          </div>
        </div>

        {/* FOOTER - Anchored at the bottom */}
        <Container
          animation="fadeUp"
          delay={0.4}
          className="max-w-3xl mx-auto w-full pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-foreground/30 px-4 sm:px-6"
        >
          <p className="text-[10px] font-medium">© 2026 Budget Ndio Story.</p>
          <div className="flex items-center gap-4 text-[9px] font-medium uppercase tracking-wider">
            <a
              href="mailto:info@budgetndiostory.org"
              className="group inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <motion.span
                aria-hidden
                className="size-1.5 rounded-full bg-primary/70"
                animate={{ scale: [0.8, 1.5, 0.8], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              />
              Email
            </a>
            <a
              href="/privacy"
              className="group inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <motion.span
                aria-hidden
                className="size-1.5 rounded-full bg-blue-400/70"
                animate={{ scale: [0.8, 1.5, 0.8], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: 0.2 }}
              />
              Privacy
            </a>
            <a
              href="/terms"
              className="group inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <motion.span
                aria-hidden
                className="size-1.5 rounded-full bg-teal-400/70"
                animate={{ scale: [0.8, 1.5, 0.8], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.6, repeat: Infinity, delay: 0.35 }}
              />
              Terms
            </a>
          </div>
        </Container>
      </Wrapper>
    </section>
  );
}
