"use client";

import React, { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageFieldControl } from "./ImageFieldControl";

interface NavigationStudioEditorProps {
  data: Record<string, any>;
  onChange: (updatedData: Record<string, any>) => void;
  onOpenMediaPicker: (onSelect: (url: string) => void) => void;
  onUploadToR2: (file: File, onSuccess: (url: string) => void) => void;
}

export function NavigationStudioEditor({
  data,
  onChange,
  onOpenMediaPicker,
  onUploadToR2,
}: NavigationStudioEditorProps) {
  const [activeSubTab, setActiveSubTab] = useState<"navbar" | "actions" | "footer" | "columns">("navbar");

  const logo = data?.logo || {
    src: "/logo.svg",
    alt: "Budget Ndio Story",
    href: "/",
  };

  const navLinks = (data?.navLinks as any[]) || [];
  const actions = data?.actions || {
    showSignIn: true,
    signInLabel: "Sign in",
    signInHref: "/login",
    cta: {
      show: true,
      label: "Discuss Partnership",
      href: "/contact?intent=partner",
      variant: "white",
    },
  };

  const footer = data?.footer || {
    blurb: "",
    newsletter: {
      headline: "",
      subhead: "",
      placeholder: "",
      buttonLabel: "",
    },
    columns: {
      product: { title: "Product", links: [] },
      resources: { title: "Resources", links: [] },
      company: { title: "Company", links: [] },
    },
    legal: "",
  };

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

  const handleMoveNavLink = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= navLinks.length) return;
    const next = [...navLinks];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    updateField(["navLinks"], next);
  };

  const handleDeleteNavLink = (index: number) => {
    const next = navLinks.filter((_, i) => i !== index);
    updateField(["navLinks"], next);
  };

  const handleAddNavLink = () => {
    const next = [
      ...navLinks,
      {
        id: `nav-${Date.now()}`,
        label: "New Link",
        href: "/",
        badge: "",
      },
    ];
    updateField(["navLinks"], next);
  };

  const handleAddFooterLink = (colKey: "product" | "resources" | "company") => {
    const col = footer.columns?.[colKey] || { title: colKey, links: [] };
    const nextLinks = [...(col.links || []), { label: "New Page Link", href: "/" }];
    updateField(["footer", "columns", colKey, "links"], nextLinks);
  };

  const handleDeleteFooterLink = (colKey: "product" | "resources" | "company", index: number) => {
    const col = footer.columns?.[colKey] || { title: colKey, links: [] };
    const nextLinks = (col.links || []).filter((_: any, i: number) => i !== index);
    updateField(["footer", "columns", colKey, "links"], nextLinks);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-border/60 pb-3">
        <Button
          type="button"
          size="sm"
          variant={activeSubTab === "navbar" ? "default" : "outline"}
          onClick={() => setActiveSubTab("navbar")}
          className="text-xs"
        >
          Navbar &amp; Links
        </Button>
        <Button
          type="button"
          size="sm"
          variant={activeSubTab === "actions" ? "default" : "outline"}
          onClick={() => setActiveSubTab("actions")}
          className="text-xs"
        >
          Header Actions &amp; Buttons
        </Button>
        <Button
          type="button"
          size="sm"
          variant={activeSubTab === "footer" ? "default" : "outline"}
          onClick={() => setActiveSubTab("footer")}
          className="text-xs"
        >
          Footer Copy &amp; Newsletter
        </Button>
        <Button
          type="button"
          size="sm"
          variant={activeSubTab === "columns" ? "default" : "outline"}
          onClick={() => setActiveSubTab("columns")}
          className="text-xs"
        >
          Footer Column Links
        </Button>
      </div>

      {activeSubTab === "navbar" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="border-b border-border/50 pb-3">
              <h2 className="text-base font-bold text-foreground">Brand Logo &amp; Identity</h2>
              <p className="text-xs text-muted-foreground">
                Configured brand SVG or image that appears in the global top header and footer.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ImageFieldControl
                label="Logo Image (R2 / SVG / WebP)"
                value={logo.src ?? "/logo.svg"}
                onChange={(val) => updateField(["logo", "src"], val)}
                onOpenBucket={() =>
                  onOpenMediaPicker((url) => updateField(["logo", "src"], url))
                }
                description="160x32 SVG or transparent PNG"
              />

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground">Logo Alt Text</label>
                  <Input
                    value={logo.alt ?? ""}
                    onChange={(e) => updateField(["logo", "alt"], e.target.value)}
                    placeholder="Budget Ndio Story"
                    className="mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Logo Destination Link</label>
                  <Input
                    value={logo.href ?? "/"}
                    onChange={(e) => updateField(["logo", "href"], e.target.value)}
                    placeholder="/"
                    className="mt-1 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div>
                <h2 className="text-base font-bold text-foreground">Top Navigation Links</h2>
                <p className="text-xs text-muted-foreground">
                  Order and titles of links displayed across desktop and mobile menus.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAddNavLink}
                className="gap-1 text-xs"
              >
                <Plus className="size-3.5" />
                <span>Add Nav Link</span>
              </Button>
            </div>

            <div className="space-y-3">
              {navLinks.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-xl border border-border/70 bg-muted/20 p-3"
                >
                  <div className="flex items-center gap-1.5 self-start sm:self-center">
                    <span className="font-mono text-[10px] text-muted-foreground w-4 text-center">
                      #{idx + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={idx === 0}
                      onClick={() => handleMoveNavLink(idx, "up")}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <ArrowUp className="size-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={idx === navLinks.length - 1}
                      onClick={() => handleMoveNavLink(idx, "down")}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <ArrowDown className="size-3" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 w-full">
                    <div>
                      <span className="text-[10px] font-semibold text-muted-foreground">Label</span>
                      <Input
                        value={item.label ?? ""}
                        onChange={(e) => {
                          const next = [...navLinks];
                          next[idx] = { ...next[idx], label: e.target.value };
                          updateField(["navLinks"], next);
                        }}
                        className="text-xs"
                        placeholder="Link Label"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-muted-foreground">Href (URL)</span>
                      <Input
                        value={item.href ?? ""}
                        onChange={(e) => {
                          const next = [...navLinks];
                          next[idx] = { ...next[idx], href: e.target.value };
                          updateField(["navLinks"], next);
                        }}
                        className="text-xs font-mono"
                        placeholder="/path"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-muted-foreground">Badge (Optional)</span>
                      <Input
                        value={item.badge ?? ""}
                        onChange={(e) => {
                          const next = [...navLinks];
                          next[idx] = { ...next[idx], badge: e.target.value };
                          updateField(["navLinks"], next);
                        }}
                        className="text-xs"
                        placeholder="e.g. Studio, New"
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteNavLink(idx)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-500 self-end sm:self-center"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "actions" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
          <div className="border-b border-border/50 pb-3">
            <h2 className="text-base font-bold text-foreground">Header Action Buttons</h2>
            <p className="text-xs text-muted-foreground">
              Configure the Sign In button and primary Call to Action in the header.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border/70 p-4 space-y-3 bg-muted/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Sign In Button</h3>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showSignIn"
                  checked={actions.showSignIn ?? true}
                  onChange={(e) => updateField(["actions", "showSignIn"], e.target.checked)}
                  className="rounded border-border"
                />
                <label htmlFor="showSignIn" className="text-xs font-medium text-foreground cursor-pointer">
                  Display Sign In button when visitor is logged out
                </label>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">Label</label>
                <Input
                  value={actions.signInLabel ?? "Sign in"}
                  onChange={(e) => updateField(["actions", "signInLabel"], e.target.value)}
                  className="text-xs mt-1"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">Href (URL)</label>
                <Input
                  value={actions.signInHref ?? "/login"}
                  onChange={(e) => updateField(["actions", "signInHref"], e.target.value)}
                  className="text-xs font-mono mt-1"
                />
              </div>
            </div>

            <div className="rounded-xl border border-border/70 p-4 space-y-3 bg-muted/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Primary Action CTA</h3>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showCta"
                  checked={actions.cta?.show ?? true}
                  onChange={(e) => updateField(["actions", "cta", "show"], e.target.checked)}
                  className="rounded border-border"
                />
                <label htmlFor="showCta" className="text-xs font-medium text-foreground cursor-pointer">
                  Display Primary CTA Button
                </label>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">CTA Label</label>
                <Input
                  value={actions.cta?.label ?? "Discuss Partnership"}
                  onChange={(e) => updateField(["actions", "cta", "label"], e.target.value)}
                  className="text-xs mt-1"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">CTA Href (URL)</label>
                <Input
                  value={actions.cta?.href ?? "/contact?intent=partner"}
                  onChange={(e) => updateField(["actions", "cta", "href"], e.target.value)}
                  className="text-xs font-mono mt-1"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">Style Variant</label>
                <select
                  value={actions.cta?.variant ?? "white"}
                  onChange={(e) => updateField(["actions", "cta", "variant"], e.target.value)}
                  className="w-full mt-1 text-xs rounded-lg border border-border bg-background px-3 py-2"
                >
                  <option value="white">White / High-Contrast</option>
                  <option value="primary">Primary Brand</option>
                  <option value="outline">Subtle Outline</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "footer" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
          <div className="border-b border-border/50 pb-3">
            <h2 className="text-base font-bold text-foreground">Footer Copy &amp; Newsletter Configuration</h2>
            <p className="text-xs text-muted-foreground">
              Control the organization mission blurb, newsletter invitation, and legal declaration.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground">Footer Mission Blurb</label>
              <textarea
                rows={2}
                value={footer.blurb ?? ""}
                onChange={(e) => updateField(["footer", "blurb"], e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Budget Ndio Story — civic fiscal literacy and public finance intelligence for Kenya."
              />
            </div>

            <div className="rounded-xl border border-border/70 p-4 space-y-3 bg-muted/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Newsletter Box</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground">Headline</label>
                  <Input
                    value={footer.newsletter?.headline ?? ""}
                    onChange={(e) => updateField(["footer", "newsletter", "headline"], e.target.value)}
                    className="text-xs mt-1"
                    placeholder="Stay ahead on the national budget"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground">Button Label</label>
                  <Input
                    value={footer.newsletter?.buttonLabel ?? ""}
                    onChange={(e) => updateField(["footer", "newsletter", "buttonLabel"], e.target.value)}
                    className="text-xs mt-1"
                    placeholder="Subscribe"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">Subhead / Promise</label>
                <Input
                  value={footer.newsletter?.subhead ?? ""}
                  onChange={(e) => updateField(["footer", "newsletter", "subhead"], e.target.value)}
                  className="text-xs mt-1"
                  placeholder="Forensic fiscal breakdowns, county scorecards, and investigations delivered to your inbox."
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">Input Placeholder</label>
                <Input
                  value={footer.newsletter?.placeholder ?? ""}
                  onChange={(e) => updateField(["footer", "newsletter", "placeholder"], e.target.value)}
                  className="text-xs mt-1"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Legal &amp; Registration Statement</label>
              <Input
                value={footer.legal ?? ""}
                onChange={(e) => updateField(["footer", "legal"], e.target.value)}
                className="mt-1 text-xs"
                placeholder="Budget Ndio Story. Civic fiscal intelligence. Registered Non-Profit Entity in Kenya."
              />
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "columns" && (
        <div className="space-y-6">
          {(["product", "resources", "company"] as const).map((colKey) => {
            const col = footer.columns?.[colKey] || { title: colKey, links: [] };
            return (
              <div key={colKey} className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      Column: {colKey}
                    </span>
                    <Input
                      value={col.title ?? colKey}
                      onChange={(e) => updateField(["footer", "columns", colKey, "title"], e.target.value)}
                      className="w-40 h-8 text-xs font-bold"
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddFooterLink(colKey)}
                    className="gap-1 text-xs"
                  >
                    <Plus className="size-3" />
                    <span>Add Link</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(col.links || []).map((link: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/20 p-2.5"
                    >
                      <div className="space-y-1 flex-1">
                        <Input
                          value={link.label ?? ""}
                          onChange={(e) => {
                            const next = [...(col.links || [])];
                            next[idx] = { ...next[idx], label: e.target.value };
                            updateField(["footer", "columns", colKey, "links"], next);
                          }}
                          className="h-7 text-xs font-medium"
                          placeholder="Label"
                        />
                        <Input
                          value={link.href ?? ""}
                          onChange={(e) => {
                            const next = [...(col.links || [])];
                            next[idx] = { ...next[idx], href: e.target.value };
                            updateField(["footer", "columns", colKey, "links"], next);
                          }}
                          className="h-7 text-[11px] font-mono text-muted-foreground"
                          placeholder="/url"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFooterLink(colKey, idx)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-rose-500"
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
