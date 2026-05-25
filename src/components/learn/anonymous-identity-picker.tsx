"use client";

import React, { useState } from "react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Checkbox } from "@/ui/checkbox";
import { Shield, ArrowRight, Edit3, RefreshCw, Sparkles } from "lucide-react";
import { FemaleBitmoji, MaleBitmoji, type Gender } from "./bitmoji-avatar";

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

interface AnonymousIdentityPickerProps {
  onComplete: (profile: any) => void;
}

export function AnonymousIdentityPicker({ onComplete }: AnonymousIdentityPickerProps) {
  const [gender, setGender] = useState<Gender | null>(null);
  const [suggestions, setSuggestions] = useState<[string, string]>(pickTwo(PATRIOTIC_WORDS).map(generateName) as [string, string]);
  const [selected, setSelected] = useState<string | null>(null);
  const [craftMode, setCraftMode] = useState(false);
  const [customName, setCustomName] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");

  const handleGenderSelect = (g: Gender) => {
    setGender(g);
    setSelected(null);
    setError("");
    setSuggestions(pickTwo(PATRIOTIC_WORDS).map(generateName) as [string, string]);
  };

  const handleSelect = (name: string) => {
    setSelected(name);
    setCraftMode(false);
    setCustomName("");
    setError("");
  };

  const handleRefresh = () => {
    setSuggestions(pickTwo(PATRIOTIC_WORDS).map(generateName) as [string, string]);
    setSelected(null);
    setError("");
  };

  const handleSubmit = () => {
    const finalName = craftMode ? customName.trim() : selected;
    if (!finalName) {
      setError("Pick a name or craft your own.");
      return;
    }
    if (finalName.length < 3) {
      setError("Name must be at least 3 characters.");
      return;
    }
    if (!consent) {
      setError("You must accept the DPA consent to proceed.");
      return;
    }

    const profile = {
      userId: `anon_${Math.random().toString(36).substr(2, 9)}`,
      breakName: finalName,
      pseudoName: finalName,
      gender,
      isAnonymous: true,
      county: "Kenya",
      ward: "",
      language: "EN" as const,
      notifications: false,
      whatsappFallback: false,
      phone: "",
      consentGranted: true,
      consentTimestamp: new Date().toISOString(),
      sovereigns: 0,
      stageProgress: [1],
      streakDays: 0,
      lastActive: Date.now(),
      trackedDocs: [] as string[],
      badges: [] as string[],
    };

    localStorage.setItem("bns_user_profile", JSON.stringify(profile));
    onComplete(profile);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card border border-border rounded-2xl shadow-xl space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-black tracking-tight">Welcome, Citizen</h2>
        <p className="text-sm text-muted-foreground">
          Pick your identity to explore the learn hub. No account needed.
        </p>
      </div>

      {error && (
        <div className="p-3 text-xs bg-destructive/10 border border-destructive/20 text-destructive rounded-lg font-medium">
          {error}
        </div>
      )}

      {/* Bitmoji Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Choose your avatar</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleGenderSelect("female")}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              gender === "female"
                ? "border-pink-400 bg-pink-500/10 shadow-md"
                : "border-border bg-muted/20 hover:bg-muted/40 hover:border-muted-foreground/30"
            }`}
          >
            <FemaleBitmoji selected={gender === "female"} className="size-16 md:size-20" />
            <span className={`text-xs font-bold ${gender === "female" ? "text-pink-500" : "text-muted-foreground"}`}>
              Female
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleGenderSelect("male")}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              gender === "male"
                ? "border-blue-400 bg-blue-500/10 shadow-md"
                : "border-border bg-muted/20 hover:bg-muted/40 hover:border-muted-foreground/30"
            }`}
          >
            <MaleBitmoji selected={gender === "male"} className="size-16 md:size-20" />
            <span className={`text-xs font-bold ${gender === "male" ? "text-blue-500" : "text-muted-foreground"}`}>
              Male
            </span>
          </button>
        </div>
      </div>

      {/* Name Selection */}
      {gender && !craftMode && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold">Pick a name</Label>
            <button
              type="button"
              onClick={handleRefresh}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="size-3" /> Refresh
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {suggestions.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => handleSelect(name)}
                className={`px-3 py-4 rounded-xl border-2 text-sm font-mono font-bold transition-all ${
                  selected === name
                    ? "bg-primary/10 border-primary text-primary shadow-sm"
                    : "bg-muted/20 border-border text-foreground hover:bg-muted/40 hover:border-foreground/30"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="truncate">{name}</span>
                  {selected === name && <Sparkles className="size-4 fill-primary shrink-0" />}
                </div>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => { setCraftMode(true); setError(""); }}
            className="w-full text-xs text-muted-foreground hover:text-foreground font-semibold flex items-center justify-center gap-1 py-2"
          >
            <Edit3 className="size-3.5" /> Or craft your own name
          </button>
        </div>
      )}

      {gender && craftMode && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <Label htmlFor="customName" className="text-sm font-semibold">Craft your name</Label>
          <Input
            id="customName"
            placeholder="e.g. shujaa_254, budget_breaker"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="rounded-xl h-11 font-mono"
          />
          <button
            type="button"
            onClick={() => { setCraftMode(false); setCustomName(""); setError(""); }}
            className="w-full text-xs text-muted-foreground hover:text-foreground font-semibold flex items-center justify-center gap-1 py-1"
          >
            Back to suggestions
          </button>
        </div>
      )}

      {/* DPA Consent */}
      {gender && (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
          <Checkbox
            id="consent"
            checked={consent}
            onCheckedChange={(checked) => setConsent(checked === true)}
            className="mt-1"
          />
          <div className="space-y-1">
            <Label htmlFor="consent" className="text-xs font-bold cursor-pointer flex items-center gap-1">
              <Shield className="size-3.5 text-primary" /> Data Protection Consent (DPA 2019)
            </Label>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              I consent to anonymized analytics and 24-month retention of my progress logs as per Kenya&apos;s Data Protection Act, 2019.
            </p>
          </div>
        </div>
      )}

      {gender && (
        <Button
          onClick={handleSubmit}
          disabled={!((selected || (craftMode && customName.trim())) && consent)}
          className="w-full rounded-xl h-12 font-bold gap-2 text-sm"
        >
          Enter Learn Hub <ArrowRight className="size-4" />
        </Button>
      )}

      <p className="text-[10px] text-muted-foreground text-center">
        Your identity stays on this device. No sign-up required.
      </p>
    </div>
  );
}
