"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Checkbox } from "@/ui/checkbox";
import { Flame, Bell, Shield, ArrowRight, ArrowLeft, Sparkles, GraduationCap } from "lucide-react";
import { useUpdateProfile } from "@/hooks/use-profile";
import { useAuth } from "@/contexts/auth-context";
import { COUNTIES } from "@/constants/counties";

interface OnboardingWizardProps { onComplete: (profile: any) => void; }

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const { isLoggedIn } = useAuth();
  const updateProfileMutation = useUpdateProfile();
  const [step, setStep] = useState(1);
  const [breakName, setBreakName] = useState("");
  const [pseudoName, setPseudoName] = useState("");
  const [county, setCounty] = useState("");
  const [ward, setWard] = useState("");
  const [language, setLanguage] = useState<"EN" | "SW" | "SH">("EN");
  const [notifications, setNotifications] = useState(true);
  const [whatsappFallback, setWhatsappFallback] = useState(false);
  const [phone, setPhone] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (breakName) {
      const cleanName = breakName.trim().replace(/\s+/g, "");
      const countySuffix = county ? `_${county.replace(/\s+/g, "")}` : "_County";
      setPseudoName(`${cleanName}${countySuffix}`);
    } else setPseudoName("");
  }, [breakName, county]);

  const handleNext = () => {
    setError("");
    if (step === 1) {
      if (!breakName.trim()) { setError("Break Name is required."); return; }
      setStep(2);
    } else if (step === 2) {
      if (!county) { setError("County is required."); return; }
      setStep(3);
    } else if (step === 3) {
      if (!educationLevel) { setError("Education level is required."); return; }
      setStep(4);
    }
  };

  const handleBack = () => { setError(""); setStep((prev) => Math.max(1, prev - 1)); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!consent) { setError("You must accept the DPA consent to proceed."); return; }

    const profile = {
      userId: `user_${Math.random().toString(36).substr(2, 9)}`,
      breakName: breakName.trim(), pseudoName: pseudoName.trim(),
      county, ward: ward.trim() || undefined, language,
      educationLevel, ageRange, dateOfBirth,
      notifications, whatsappFallback, phone: phone.trim() || undefined,
      consentGranted: true, consentTimestamp: new Date().toISOString(),
      sovereigns: 0, stageProgress: [1], streakDays: 0, lastActive: Date.now(), trackedDocs: [] as string[]
    };

    localStorage.setItem("bns_user_profile", JSON.stringify(profile));
    window.dispatchEvent(new Event("bns-profile-updated"));
    if (isLoggedIn) {
      updateProfileMutation.mutate({
        display_name: breakName.trim(), location: county,
        metadata: {
          county, ward: ward.trim() || "",
          break_name: breakName.trim(), pseudo_name: pseudoName.trim(),
          language, education_level: educationLevel, age_range: ageRange, date_of_birth: dateOfBirth,
          notifications_enabled: notifications, whatsapp_fallback: whatsappFallback,
          phone: phone.trim() || "", dpa_consent: consent,
          dpa_consent_timestamp: new Date().toISOString(),
          onboarding_completed_at: new Date().toISOString(),
        },
      });
    }
    onComplete(profile);
  };

  return (
    <div className="w-full max-w-md mx-auto p-5 bg-card shadow-sm rounded-xl space-y-5">
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <span>Profile Setup</span>
          <span>Step {step} of 4</span>
        </div>
        <div className="h-1 bg-muted/50 rounded-full overflow-hidden">
          <div className={`h-full bg-primary transition-all duration-300 ${step === 1 ? 'w-1/4' : step === 2 ? 'w-2/4' : step === 3 ? 'w-3/4' : 'w-full'}`} />
        </div>
      </div>

      {error && (
        <div className="p-2.5 text-[11px] bg-destructive/10 text-destructive rounded-lg font-medium">{error}</div>
      )}

      {step === 1 && (
        <div className="space-y-3.5">
          <div className="space-y-1">
            <h2 className="text-lg font-bold tracking-tight">Who are you, citizen?</h2>
            <p className="text-xs text-muted-foreground">Set up your identity. This drives your profile.</p>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Break Name <span className="text-destructive">*</span></Label>
            <Input placeholder="e.g. BudgetBreaker, Shujaa" value={breakName} onChange={(e) => setBreakName(e.target.value)} className="rounded-lg h-10 text-sm" />
            <p className="text-[10px] text-muted-foreground">Your personal nickname used inside the app.</p>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Pseudo Username (Leaderboard)</Label>
            <Input placeholder="Auto-suggested" value={pseudoName} onChange={(e) => setPseudoName(e.target.value)} className="rounded-lg h-10 text-sm bg-muted/20" />
            <p className="text-[10px] text-muted-foreground">Anonymized username for the public leaderboard.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Phone <span className="text-muted-foreground font-normal">(Optional)</span></Label>
              <span className="text-[10px] text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded font-bold">Leaderboard Eligible</span>
            </div>
            <Input type="tel" placeholder="e.g. 0712345678" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-lg h-10 text-sm" />
            <p className="text-[10px] text-muted-foreground">For prize eligibility & verification.</p>
          </div>
          <Button onClick={handleNext} className="w-full rounded-lg h-10 font-bold text-xs gap-1.5">
            Continue <ArrowRight className="size-3.5" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3.5">
          <div className="space-y-1">
            <h2 className="text-lg font-bold tracking-tight">Your Location & Language</h2>
            <p className="text-xs text-muted-foreground">Helps target the right budget details for your county.</p>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold">County <span className="text-destructive">*</span></Label>
            <select value={county} onChange={(e) => setCounty(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border-0 bg-muted/40 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20">
              <option value="">Select your county</option>
              {COUNTIES.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Ward <span className="text-muted-foreground font-normal">(Optional)</span></Label>
            <Input placeholder="e.g. Kilimani" value={ward} onChange={(e) => setWard(e.target.value)} className="rounded-lg h-10 text-sm" />
            <p className="text-[10px] text-muted-foreground">For hyper-local participation alerts.</p>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Language</Label>
            <div className="grid grid-cols-3 gap-1 bg-muted/20 p-0.5 rounded-lg">
              {(["EN", "SW", "SH"] as const).map((lang) => (
                <button key={lang} type="button" onClick={() => setLanguage(lang)}
                  className={`py-1.5 text-[11px] font-bold rounded-md transition-colors ${language === lang ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}>
                  {lang === "EN" ? "English" : lang === "SW" ? "Kiswahili" : "Sheng"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={handleBack} variant="outline" className="flex-1 rounded-lg h-10 font-bold text-xs gap-1.5">
              <ArrowLeft className="size-3.5" /> Back
            </Button>
            <Button onClick={handleNext} className="flex-1 rounded-lg h-10 font-bold text-xs gap-1.5">
              Continue <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3.5">
          <div className="space-y-1">
            <h2 className="text-lg font-bold tracking-tight">About You</h2>
            <p className="text-xs text-muted-foreground">Help us tailor content to your needs.</p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">
              <GraduationCap className="size-3.5 inline mr-1" />
              Education Level <span className="text-destructive">*</span>
            </Label>
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border-0 bg-muted/40 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              <option value="">Select your education level</option>
              <option value="primary">Primary School</option>
              <option value="secondary">Secondary School</option>
              <option value="diploma">Diploma / Certificate</option>
              <option value="undergraduate">Undergraduate Degree</option>
              <option value="postgraduate">Postgraduate Degree</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Age Range <span className="text-destructive">*</span></Label>
            <select
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border-0 bg-muted/40 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              <option value="">Select your age range</option>
              <option value="under_18">Under 18</option>
              <option value="18_25">18 - 25</option>
              <option value="26_35">26 - 35</option>
              <option value="36_50">36 - 50</option>
              <option value="over_50">Over 50</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">
              Date of Birth <span className="text-muted-foreground font-normal">(Optional)</span>
            </Label>
            <Input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="rounded-lg h-10 text-sm"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleBack} variant="outline" className="flex-1 rounded-lg h-10 font-bold text-xs gap-1.5">
              <ArrowLeft className="size-3.5" /> Back
            </Button>
            <Button onClick={handleNext} className="flex-1 rounded-lg h-10 font-bold text-xs gap-1.5">
              Continue <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold tracking-tight">Consent & Alerts</h2>
            <p className="text-xs text-muted-foreground">Get notified when comment windows open.</p>
          </div>

          <div className="p-3 rounded-xl bg-muted/20 space-y-3">
            <div className="flex items-start gap-2.5">
              <Checkbox id="notifications" checked={notifications} onCheckedChange={(checked) => setNotifications(checked === true)} className="mt-0.5" />
              <div>
                <Label htmlFor="notifications" className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                  <Bell className="size-3.5 text-primary" /> Push Notifications
                </Label>
                <p className="text-[10px] text-muted-foreground">Receive alerts when public comment windows open.</p>
              </div>
            </div>
            {notifications && (
              <div className="flex items-start gap-2.5 pl-6 pt-2 border-t border-border/30">
                <Checkbox id="whatsappFallback" checked={whatsappFallback} onCheckedChange={(checked) => setWhatsappFallback(checked === true)} className="mt-0.5" />
                <div>
                  <Label htmlFor="whatsappFallback" className="text-[11px] font-semibold cursor-pointer">SMS / WhatsApp fallback</Label>
                  <p className="text-[10px] text-muted-foreground">If push notifications fail.</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-primary/5">
            <Checkbox id="consent" checked={consent} onCheckedChange={(checked) => setConsent(checked === true)} className="mt-0.5" />
            <div>
              <Label htmlFor="consent" className="text-[11px] font-bold cursor-pointer flex items-center gap-1">
                <Shield className="size-3 text-primary" /> Data Protection Consent (DPA 2019)
              </Label>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                I consent to anonymized analytics and retention of my progress logs per Kenya&apos;s Data Protection Act, 2019.
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button type="button" onClick={handleBack} variant="outline" className="flex-1 rounded-lg h-10 font-bold text-xs gap-1.5">
              <ArrowLeft className="size-3.5" /> Back
            </Button>
            <Button type="submit" className="flex-1 rounded-lg h-10 font-bold text-xs gap-1.5">
              Get Started <Sparkles className="size-3.5" />
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
