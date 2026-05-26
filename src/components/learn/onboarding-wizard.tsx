"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Checkbox } from "@/ui/checkbox";
import { Flame, Bell, Shield, ArrowRight, ArrowLeft } from "lucide-react";
import { citizenApi } from "@/lib/api-client";
import { useAuth } from "@/contexts/auth-context";

// List of all 47 Kenyan Counties
const COUNTIES = [
  "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita Taveta",
  "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru",
  "Tharaka-Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua",
  "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot",
  "Samburu", "Trans Nzoia", "Uasin Gishu", "Elgeyo-Marakwet", "Nandi",
  "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho",
  "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya",
  "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi"
];

interface OnboardingWizardProps {
  onComplete: (profile: any) => void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const { isLoggedIn } = useAuth();
  const [step, setStep] = useState(1);
  const [breakName, setBreakName] = useState("");
  const [pseudoName, setPseudoName] = useState("");
  const [county, setCounty] = useState("");
  const [ward, setWard] = useState("");
  const [language, setLanguage] = useState<"EN" | "SW" | "SH">("EN");
  const [notifications, setNotifications] = useState(true);
  const [whatsappFallback, setWhatsappFallback] = useState(false);
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");

  // Handle auto-suggesting the pseudo username
  useEffect(() => {
    if (breakName) {
      const cleanName = breakName.trim().replace(/\s+/g, "");
      const countySuffix = county ? `_${county.replace(/\s+/g, "")}` : "_County";
      setPseudoName(`${cleanName}${countySuffix}`);
    } else {
      setPseudoName("");
    }
  }, [breakName, county]);

  const handleNext = () => {
    setError("");
    if (step === 1) {
      if (!breakName.trim()) {
        setError("Break Name is required.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!county) {
        setError("County is required.");
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    setError("");
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!consent) {
      setError("You must accept the DPA consent to proceed.");
      return;
    }

    const profile = {
      userId: `user_${Math.random().toString(36).substr(2, 9)}`,
      breakName: breakName.trim(),
      pseudoName: pseudoName.trim(),
      county,
      ward: ward.trim() || undefined,
      language,
      notifications,
      whatsappFallback,
      phone: phone.trim() || undefined,
      consentGranted: true,
      consentTimestamp: new Date().toISOString(),
      sovereigns: 0,
      stageProgress: [1],
      streakDays: 0,
      lastActive: Date.now(),
      trackedDocs: [] as string[]
    };

    // Save to localStorage
    localStorage.setItem("bns_user_profile", JSON.stringify(profile));

    // Persist to backend if logged in
    if (isLoggedIn) {
      citizenApi.patchMe({
        display_name: breakName.trim(),
        location: county,
        metadata: {
          county,
          ward: ward.trim() || "",
          break_name: breakName.trim(),
          pseudo_name: pseudoName.trim(),
          language,
          notifications_enabled: notifications,
          whatsapp_fallback: whatsappFallback,
          phone: phone.trim() || "",
          dpa_consent: consent,
          dpa_consent_timestamp: new Date().toISOString(),
          onboarding_completed_at: new Date().toISOString(),
        },
      }).catch(() => {
        // Backend metadata field may not be fully exposed yet
      });
    }
    
    // Complete wizard
    onComplete(profile);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card border border-border rounded-2xl shadow-xl space-y-6">
      {/* Step Header */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <span>Module 1: Profile Setup</span>
          <span>Step {step} of 3</span>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex">
          <div className={`h-full bg-primary transition-all duration-300 ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`} />
        </div>
      </div>

      {error && (
        <div className="p-3 text-xs bg-destructive/10 border border-destructive/20 text-destructive rounded-lg font-medium">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight">Who are you, citizen?</h2>
            <p className="text-sm text-muted-foreground">Set up your identity. This is personal to you and drives your profile.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="breakName" className="text-sm font-semibold">Break Name <span className="text-destructive">*</span></Label>
            <Input
              id="breakName"
              placeholder="e.g. BudgetBreaker, Shujaa"
              value={breakName}
              onChange={(e) => setBreakName(e.target.value)}
              className="rounded-xl h-11"
            />
            <p className="text-[11px] text-muted-foreground">Your personal nickname used inside the app.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pseudoName" className="text-sm font-semibold">Pseudo Username (For Leaderboards)</Label>
            <Input
              id="pseudoName"
              placeholder="Auto-suggested username"
              value={pseudoName}
              onChange={(e) => setPseudoName(e.target.value)}
              className="rounded-xl h-11 bg-muted/30"
            />
            <p className="text-[11px] text-muted-foreground">Anonymized username shown on the public Citizen Assembly leaderboard.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="phone" className="text-sm font-semibold flex items-center gap-1.5">
                Phone Number <span className="text-[10px] text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <span className="text-[10px] text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full font-bold">Leaderboard Eligible</span>
            </div>
            <Input
              id="phone"
              type="tel"
              placeholder="e.g. 0712345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-xl h-11"
            />
            <p className="text-[11px] text-muted-foreground">Required only for leaderboard prize eligibility & verification.</p>
          </div>

          <Button onClick={handleNext} className="w-full rounded-xl h-11 font-bold gap-2">
            Continue <ArrowRight className="size-4" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight">Your Location & Language</h2>
            <p className="text-sm text-muted-foreground">Locating where you belong ensures we target the right budget details for your county.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="county" className="text-sm font-semibold">County <span className="text-destructive">*</span></Label>
            <select
              id="county"
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Select your county</option>
              {COUNTIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ward" className="text-sm font-semibold">Ward <span className="text-[10px] text-muted-foreground font-normal">(Optional)</span></Label>
            <Input
              id="ward"
              placeholder="e.g. Kilimani, Roysambu"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className="rounded-xl h-11"
            />
            <p className="text-[11px] text-muted-foreground">Helps with hyper-local future public participation alerts.</p>
          </div>

          <div className="space-y-2 pt-2">
            <Label className="text-sm font-semibold">Language / Lugha</Label>
            <div className="grid grid-cols-3 gap-2 bg-muted p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setLanguage("EN")}
                className={`py-2 text-xs font-bold rounded-lg transition-colors ${language === "EN" ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage("SW")}
                className={`py-2 text-xs font-bold rounded-lg transition-colors ${language === "SW" ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Kiswahili
              </button>
              <button
                type="button"
                onClick={() => setLanguage("SH")}
                className={`py-2 text-xs font-bold rounded-lg transition-colors ${language === "SH" ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Sheng
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleBack} variant="outline" className="flex-1 rounded-xl h-11 font-bold gap-2">
              <ArrowLeft className="size-4" /> Back
            </Button>
            <Button onClick={handleNext} className="flex-1 rounded-xl h-11 font-bold gap-2">
              Continue <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight">Consent & Alerts</h2>
            <p className="text-sm text-muted-foreground">Get notified when comment windows open and agree on our data guidelines.</p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="notifications"
                checked={notifications}
                onCheckedChange={(checked) => setNotifications(checked === true)}
                className="mt-1"
              />
              <div className="space-y-1">
                <Label htmlFor="notifications" className="text-sm font-semibold flex items-center gap-1.5 cursor-pointer">
                  <Bell className="size-4 text-primary" /> Opt-in to Push Notifications
                </Label>
                <p className="text-xs text-muted-foreground">Receive hyper-local alerts for your county when public comment windows open.</p>
              </div>
            </div>

            {notifications && (
              <div className="flex items-start gap-3 pl-7 pt-1 border-t border-border">
                <Checkbox
                  id="whatsappFallback"
                  checked={whatsappFallback}
                  onCheckedChange={(checked) => setWhatsappFallback(checked === true)}
                  className="mt-1"
                />
                <div className="space-y-1">
                  <Label htmlFor="whatsappFallback" className="text-xs font-semibold cursor-pointer">
                    Enable SMS / WhatsApp alert fallback
                  </Label>
                  <p className="text-[11px] text-muted-foreground">Sends legal alert notifications if push fails.</p>
                </div>
              </div>
            )}
          </div>

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
                I consent to anonymized analytics and 24-month retention of my progress logs as per Kenya's Data Protection Act, 2019.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" onClick={handleBack} variant="outline" className="flex-1 rounded-xl h-11 font-bold gap-2">
              <ArrowLeft className="size-4" /> Back
            </Button>
            <Button type="submit" className="flex-1 rounded-xl h-11 font-bold gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started <Flame className="size-4 fill-current" />
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
