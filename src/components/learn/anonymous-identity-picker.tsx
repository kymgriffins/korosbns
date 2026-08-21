"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, ArrowRight, Edit3, RefreshCw, Check } from "lucide-react";
import { FemaleBitmoji, MaleBitmoji, type Gender } from "./bitmoji-avatar";

import { writeHubProfile } from "@/lib/profile-local-storage";

const PATRIOTIC_WORDS = [
  "halisi", "daima", "mzalendo", "huruma", "amani", "umoja",
  "saba", "azimio", "uhuru", "harambee", "nyayo", "ishara",
  "mwangaza", "nuru", "fahari", "heshima", "taifa", "shujaa",
];

function pickTwo(words: string[]): [string, string] {
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
}

function generateName(word: string): string {
  const suffix = Math.random() > 0.5
    ? String(Math.floor(Math.random() * 9000) + 1000)
    : Math.random().toString(36).substr(2, 4);
  return `mkenya${word}${suffix}`;
}

interface AnonymousIdentityPickerProps { onComplete: (profile: any) => void; }

export function AnonymousIdentityPicker({ onComplete }: AnonymousIdentityPickerProps) {
  const [gender, setGender] = useState<Gender | null>(null);
  const [suggestions, setSuggestions] = useState<[string, string]>(pickTwo(PATRIOTIC_WORDS).map(generateName) as [string, string]);
  const [selected, setSelected] = useState<string | null>(null);
  const [craftMode, setCraftMode] = useState(false);
  const [customName, setCustomName] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");

  const handleGenderSelect = (g: Gender) => {
    setGender(g); setSelected(null); setError("");
    setSuggestions(pickTwo(PATRIOTIC_WORDS).map(generateName) as [string, string]);
  };

  const handleSelect = (name: string) => { setSelected(name); setCraftMode(false); setCustomName(""); setError(""); };
  const handleRefresh = () => { setSuggestions(pickTwo(PATRIOTIC_WORDS).map(generateName) as [string, string]); setSelected(null); setError(""); };

  const handleSubmit = () => {
    const finalName = craftMode ? customName.trim() : selected;
    if (!finalName) { setError("Pick a name or craft your own."); return; }
    if (finalName.length < 3) { setError("Name must be at least 3 characters."); return; }
    if (!consent) { setError("You must accept the DPA consent to proceed."); return; }

    const profile = {
      userId: `anon_${Math.random().toString(36).substr(2, 9)}`,
      breakName: finalName, pseudoName: finalName, gender,
      isAnonymous: true, county: "Kenya", ward: "",
      language: "EN" as const, notifications: false, whatsappFallback: false, phone: "",
      consentGranted: true, consentTimestamp: new Date().toISOString(),
      sovereigns: 0, stageProgress: [1], streakDays: 0, lastActive: Date.now(),
      trackedDocs: [] as string[], badges: [] as string[],
    };

    writeHubProfile(profile as unknown as Record<string, unknown>);
    onComplete(profile);
  };

  return (
    <div className="w-full max-w-md mx-auto p-5 bg-card shadow-sm rounded-xl space-y-5">
      <div className="space-y-1.5 text-center">
        <h2 className="text-lg font-bold tracking-tight">Welcome, Citizen</h2>
        <p className="text-xs text-muted-foreground">Pick your identity. No account needed.</p>
      </div>

      {error && (
        <div className="p-2.5 text-[11px] bg-destructive/10 text-destructive rounded-lg font-medium">{error}</div>
      )}

      <div className="space-y-2">
        <Label className="text-xs font-semibold">Choose avatar</Label>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => handleGenderSelect("female")}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
              gender === "female" ? "border-pink-400 bg-pink-500/10 shadow-xs" : "border-border/50 bg-muted/15 hover:bg-muted/30"
            }`}>
            <FemaleBitmoji selected={gender === "female"} className="size-14 md:size-16" />
            <span className={`text-[10px] font-bold ${gender === "female" ? "text-pink-500" : "text-muted-foreground"}`}>Female</span>
          </button>
          <button type="button" onClick={() => handleGenderSelect("male")}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
              gender === "male" ? "border-blue-400 bg-blue-500/10 shadow-xs" : "border-border/50 bg-muted/15 hover:bg-muted/30"
            }`}>
            <MaleBitmoji selected={gender === "male"} className="size-14 md:size-16" />
            <span className={`text-[10px] font-bold ${gender === "male" ? "text-blue-500" : "text-muted-foreground"}`}>Male</span>
          </button>
        </div>
      </div>

      {gender && !craftMode && (
        <div className="space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold">Pick a name</Label>
            <button type="button" onClick={handleRefresh} className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 font-semibold">
              <RefreshCw className="size-3" /> Refresh
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {suggestions.map((name) => (
              <button key={name} type="button" onClick={() => handleSelect(name)}
                className={`px-3 py-3 rounded-xl border text-sm font-mono font-bold transition-all ${
                  selected === name ? "bg-primary/10 border-primary text-primary shadow-xs" : "bg-muted/15 border-border/50 text-foreground hover:bg-muted/30 hover:border-foreground/20"
                }`}>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="truncate text-xs">{name}</span>
                  {selected === name && <Check className="size-3.5 text-primary shrink-0" />}
                </div>
              </button>
            ))}
          </div>
          <button type="button" onClick={() => { setCraftMode(true); setError(""); }}
            className="w-full text-[10px] text-muted-foreground hover:text-foreground font-semibold flex items-center justify-center gap-1 py-1.5">
            <Edit3 className="size-3" /> Or craft your own
          </button>
        </div>
      )}

      {gender && craftMode && (
        <div className="space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <Label className="text-xs font-semibold">Craft your name</Label>
          <Input placeholder="e.g. shujaa_254" value={customName} onChange={(e) => setCustomName(e.target.value)} className="rounded-lg h-10 text-sm font-mono" />
          <button type="button" onClick={() => { setCraftMode(false); setCustomName(""); setError(""); }}
            className="w-full text-[10px] text-muted-foreground hover:text-foreground font-semibold">Back to suggestions</button>
        </div>
      )}

      {gender && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-primary/5">
          <Checkbox id="consent" checked={consent} onCheckedChange={(checked) => setConsent(checked === true)} className="mt-0.5" />
          <div>
            <Label htmlFor="consent" className="text-[11px] font-bold cursor-pointer flex items-center gap-1">
              <Shield className="size-3 text-primary" /> Data Protection Consent (DPA 2019)
            </Label>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              I consent to anonymized analytics per Kenya&apos;s Data Protection Act, 2019.
            </p>
          </div>
        </div>
      )}

      {gender && (
        <Button onClick={handleSubmit} disabled={!((selected || (craftMode && customName.trim())) && consent)}
          className="w-full rounded-lg h-10 font-bold text-xs gap-1.5">
          Enter Learn Hub <ArrowRight className="size-3.5" />
        </Button>
      )}

      <p className="text-[10px] text-muted-foreground text-center">Your identity stays on this device. No sign-up.</p>
    </div>
  );
}
