"use client";

import React, { useState } from "react";
import { Mail, Phone, MessageSquare, Globe, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ContactStudioEditorProps {
  data: Record<string, any>;
  onChange: (updatedData: Record<string, any>) => void;
}

export function ContactStudioEditor({ data, onChange }: ContactStudioEditorProps) {
  const [activeSubTab, setActiveSubTab] = useState<"hero" | "direct" | "socials">("hero");

  const hero = data?.hero || {
    eyebrow: "Contact",
    title: "Let's talk budget stories",
    description: "Have a question or want to collaborate? We read every message and typically reply within 48 hours.",
  };

  const direct = data?.directContact || {
    email: "info@budgetndiostory.org",
    phone: "+254 790 631 623",
    whatsapp: "https://wa.me/254790631623",
    prompt: "Ready to collaborate?",
  };

  const socials = (data?.socials as Array<{ name: string; url: string }>) || [];

  const updateField = (path: string[], value: any) => {
    const next = JSON.parse(JSON.stringify(data || {}));
    let curr: any = next;
    for (let i = 0; i < path.length - 1; i++) {
      if (!curr[path[i]]) curr[path[i]] = {};
      curr = curr[path[i]];
    }
    curr[path[path.length - 1]] = value;
    onChange(next);
  };

  const handleUpdateSocial = (index: number, field: "name" | "url", value: string) => {
    const next = [...socials];
    next[index] = { ...next[index], [field]: value };
    updateField(["socials"], next);
  };

  const handleDeleteSocial = (index: number) => {
    const next = socials.filter((_, i) => i !== index);
    updateField(["socials"], next);
  };

  const handleAddSocial = () => {
    const next = [...socials, { name: "Platform", url: "https://" }];
    updateField(["socials"], next);
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab("hero")}
          className={'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ' + (
            activeSubTab === "hero"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <MessageSquare className="size-3.5" />
          <span>Hero & Headlines</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("direct")}
          className={'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ' + (
            activeSubTab === "direct"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Phone className="size-3.5" />
          <span>Direct Email & Phone</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("socials")}
          className={'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ' + (
            activeSubTab === "socials"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Globe className="size-3.5" />
          <span>Social Media Channels ({socials.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: HERO */}
      {activeSubTab === "hero" && (
        <div className="rounded-2xl border border-border/70 bg-card p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">Contact Page Hero</h3>
            <p className="text-xs text-muted-foreground">
              Customize the top banner eyebrow, main headline, and response time promise.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-foreground">Eyebrow Tag</label>
              <Input
                value={hero.eyebrow || ""}
                onChange={(e) => updateField(["hero", "eyebrow"], e.target.value)}
                placeholder="Contact"
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Main Page Title</label>
              <Input
                value={hero.title || ""}
                onChange={(e) => updateField(["hero", "title"], e.target.value)}
                placeholder="Let's talk budget stories"
                className="mt-1 h-9 text-xs font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Subtitle / Lede Description</label>
              <Textarea
                value={hero.description || ""}
                onChange={(e) => updateField(["hero", "description"], e.target.value)}
                placeholder="Have a question or want to collaborate?..."
                className="mt-1 min-h-[80px] text-xs resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: DIRECT CONTACT */}
      {activeSubTab === "direct" && (
        <div className="rounded-2xl border border-border/70 bg-card p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">Direct Contact Coordinates</h3>
            <p className="text-xs text-muted-foreground">
              Official email addresses and WhatsApp phone numbers displayed to citizens and partners.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Mail className="size-3.5 text-primary" />
                <span>Contact Email</span>
              </label>
              <Input
                value={direct.email || ""}
                onChange={(e) => updateField(["directContact", "email"], e.target.value)}
                placeholder="info@budgetndiostory.org"
                className="mt-1 h-9 text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Phone className="size-3.5 text-primary" />
                <span>Official Phone Number / WhatsApp</span>
              </label>
              <Input
                value={direct.phone || ""}
                onChange={(e) => updateField(["directContact", "phone"], e.target.value)}
                placeholder="+254 790 631 623"
                className="mt-1 h-9 text-xs font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-foreground">Collaboration Prompt</label>
              <Input
                value={direct.prompt || ""}
                onChange={(e) => updateField(["directContact", "prompt"], e.target.value)}
                placeholder="Ready to collaborate?"
                className="mt-1 h-9 text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: SOCIALS */}
      {activeSubTab === "socials" && (
        <div className="rounded-2xl border border-border/70 bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">Social Channels</h3>
              <p className="text-xs text-muted-foreground">
                Pill buttons linking to BNS social feeds displayed across the contact hero.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddSocial}
              className="gap-1 text-xs h-8"
            >
              <Plus className="size-3.5" />
              <span>Add Channel</span>
            </Button>
          </div>

          <div className="space-y-2.5">
            {socials.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/20 p-2.5"
              >
                <div className="w-32 shrink-0">
                  <Input
                    value={s.name}
                    onChange={(e) => handleUpdateSocial(idx, "name", e.target.value)}
                    placeholder="Platform"
                    className="h-8 text-xs font-semibold"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    value={s.url}
                    onChange={(e) => handleUpdateSocial(idx, "url", e.target.value)}
                    placeholder="https://..."
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteSocial(idx)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-500"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
