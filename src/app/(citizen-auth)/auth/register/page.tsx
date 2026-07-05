"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/layouts/AuthShell";
import { FormStatus } from "@/components/citizen/form-status";
import { GuestOnly } from "@/components/citizen/guest-only";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Routes } from "@/constants/routes";
import { COUNTIES } from "@/constants/counties";
import { useRegister } from "@/hooks/use-auth-actions";
import { 
  Heart, 
  BookOpen, 
  Home, 
  Sprout, 
  Milestone, 
  Cpu, 
  ArrowRight, 
  ArrowLeft, 
  Check,
  ShieldAlert,
  Lock,
  Mail,
  User,
  Building
} from "lucide-react";

interface PriorityOption {
  id: string;
  label: string;
  context: string;
  icon: any;
}

const PRIORITIES: PriorityOption[] = [
  { id: "Healthcare", label: "Healthcare", context: "Hospitals, NHIF access, medicines", icon: Heart },
  { id: "Education", label: "Education", context: "Schools, bursaries, CBC support", icon: BookOpen },
  { id: "Affordable Housing", label: "Affordable Housing", context: "Rent, urban planning, settlements", icon: Home },
  { id: "Agriculture & Food", label: "Agriculture & Food", context: "Fertilizer, farming, food prices", icon: Sprout },
  { id: "Infrastructure", label: "Infrastructure", context: "Roads, clean water, electricity", icon: Milestone },
  { id: "Jobs & Digital Economy", label: "Jobs & Digital Economy", context: "Youth employment, internet access", icon: Cpu },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");
  const registerMutation = useRegister();

  // Step 1: Priorities (Multi-select)
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);

  // Step 2: Location
  const [county, setCounty] = useState("");
  const [ward, setWard] = useState("");

  // Step 3: Identity
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Step 4: Security
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Live Password Validation States
  const hasMinLength = password.length >= 10;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);

  const togglePriority = (id: string) => {
    setSelectedPriorities((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }

      return [...prev, id];
    });
  };

  const handleNext = () => {
    setFormError("");
    if (step === 1) {
      if (selectedPriorities.length === 0) {
        setFormError("Please select at least 1 budget priority.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!county) {
        setFormError("Please select your county.");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!firstName.trim() || !lastName.trim()) {
        setFormError("Please fill in both first and last names.");
        return;
      }
      setStep(4);
    }
  };

  const handleBack = () => {
    setFormError("");
    setStep((prev) => Math.max(1, prev - 1));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!hasMinLength || !hasNumber || !hasUppercase) {
      setFormError("Password does not meet the secure criteria.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const result = await registerMutation.mutateAsync({
        email: email.trim(),
        password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      });

      // Save onboarding choices locally for later sync when user verifies email
      const profile = {
        priorities: selectedPriorities,
        county,
        ward: ward.trim() || undefined,
        onboardingCompleted: true,
      };
      localStorage.setItem("bns_onboarding_profile", JSON.stringify(profile));

      // NOTE: Onboarding data saved to localStorage only - will be synced to
      // backend after user verifies email and logs in (see Learn Studio home).

      setSent(true);
      toast.success("Registration complete! Check your email.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed.";
      setFormError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <GuestOnly>
        <AuthShell title="Verify your email" description={`We sent a verification link to ${email}.`}>
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Please click the link in your email to activate your account and access your personalized citizen dashboard.
            </p>
            <Button asChild className="w-full h-11 rounded-xl font-bold">
              <Link href={Routes.Login}>Go to Sign In</Link>
            </Button>
          </div>
        </AuthShell>
      </GuestOnly>
    );
  }

  return (
    <GuestOnly>
      <AuthShell
          title={
            step === 1 ? "What matters most?" :
            step === 2 ? "Where do you live?" :
            step === 3 ? "Tell us about yourself" :
            "Secure your account"
          }
          description={
            step === 1 ? "Which issues should public funds prioritize in your community?" :
            step === 2 ? "We customize your dashboard metrics based on where you live." :
            step === 3 ? "Used to represent your voice in citizen panels." :
            "Complete registration and begin tracking your budget."
          }
        >
          {/* Custom progress indicators */}
          <div className="mb-6 space-y-2">
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <span>Citizen Onboarding</span>
              <span>Step {step} of 4</span>
            </div>
            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 w-[var(--progress)]"
                style={{ "--progress": `${(step / 4) * 100}%` } as React.CSSProperties}
              />
            </div>
          </div>

          <FormStatus message={formError} variant="error" />

          {/* STEP 1: Priorities */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {PRIORITIES.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedPriorities.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => togglePriority(option.id)}
                      className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
                        isSelected 
                          ? "border-primary bg-primary/5 text-primary shadow-xs ring-1 ring-primary/20" 
                          : "border-border/60 hover:border-border hover:bg-muted/30"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary/15' : 'bg-muted'}`}>
                        <Icon className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold leading-tight">{option.label}</p>
                        <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{option.context}</p>
                      </div>
                      {isSelected && (
                        <span className="absolute top-1.5 right-1.5 size-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <Check className="size-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div className="pt-2">
                <Button onClick={handleNext} className="w-full rounded-xl h-11 font-bold gap-2">
                  <span>Continue</span>
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Location */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="county" className="text-sm font-bold flex items-center gap-1.5">
                  <Building className="size-4 text-muted-foreground" />
                  Select County <span className="text-destructive">*</span>
                </Label>
                <select
                  id="county"
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-input bg-card text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Search or select county</option>
                  {COUNTIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ward" className="text-sm font-bold">Ward or local area <span className="text-xs text-muted-foreground font-normal">(Optional)</span></Label>
                <Input
                  id="ward"
                  placeholder="e.g. Kilimani, Roysambu"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="rounded-xl h-11"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleBack} variant="outline" className="flex-1 rounded-xl h-11 font-bold gap-1.5">
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
                <Button onClick={handleNext} className="flex-1 rounded-xl h-11 font-bold gap-1.5">
                  Continue
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Identity */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-bold flex items-center gap-1.5">
                    <User className="size-4 text-muted-foreground" />
                    First name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    required
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-bold">Last name <span className="text-destructive">*</span></Label>
                  <Input
                    id="lastName"
                    required
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleBack} variant="outline" className="flex-1 rounded-xl h-11 font-bold gap-1.5">
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
                <Button onClick={handleNext} className="flex-1 rounded-xl h-11 font-bold gap-1.5">
                  Continue
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Credentials */}
          {step === 4 && (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold flex items-center gap-1.5">
                    <Mail className="size-4 text-muted-foreground" />
                    Email address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-bold flex items-center gap-1.5">
                    <Lock className="size-4 text-muted-foreground" />
                    Password <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl h-11"
                  />
                  
                  {/* Live Validation Rules */}
                  <div className="p-3 bg-muted/30 border border-border/60 rounded-xl space-y-1.5 text-xs">
                    <p className="font-semibold text-muted-foreground mb-1">Password requirements:</p>
                    <div className="flex items-center gap-2">
                      <div className={`size-4 rounded-full flex items-center justify-center text-[10px] ${hasMinLength ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                        <Check className="size-3" />
                      </div>
                      <span className={hasMinLength ? 'text-emerald-500' : 'text-muted-foreground'}>At least 10 characters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`size-4 rounded-full flex items-center justify-center text-[10px] ${hasNumber ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                        <Check className="size-3" />
                      </div>
                      <span className={hasNumber ? 'text-emerald-500' : 'text-muted-foreground'}>At least one number</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`size-4 rounded-full flex items-center justify-center text-[10px] ${hasUppercase ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                        <Check className="size-3" />
                      </div>
                      <span className={hasUppercase ? 'text-emerald-500' : 'text-muted-foreground'}>At least one uppercase letter</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-bold flex items-center gap-1.5">
                    <Lock className="size-4 text-muted-foreground" />
                    Confirm password <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="rounded-xl h-11"
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-destructive flex items-center gap-1.5 mt-1">
                      <ShieldAlert className="size-3" />
                      Passwords do not match
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" onClick={handleBack} variant="outline" className="flex-1 rounded-xl h-11 font-bold gap-1.5" disabled={loading}>
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
                <Button type="submit" className="flex-1 rounded-xl h-11 font-bold gap-1.5" disabled={loading}>
                  {loading ? "Creating Account…" : "Join Movement"}
                </Button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href={Routes.Login} className="text-primary hover:underline font-bold">
              Sign in
            </Link>
          </p>
        </AuthShell>
      </GuestOnly>
  );
}
