"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { citizenApi } from "@/lib/api-client";
import { COUNTIES } from "@/constants/counties";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building,
  Check,
  Cpu,
  Heart,
  Home,
  Lock,
  Mail,
  Milestone,
  ShieldAlert,
  Sprout,
  User,
} from "lucide-react";

interface PriorityOption {
  id: string;
  label: string;
  context: string;
  icon: React.ComponentType<{ className?: string }>;
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

  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [county, setCounty] = useState("");
  const [ward, setWard] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const hasMinLength = password.length >= 10;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);

  const togglePriority = (id: string) => {
    setSelectedPriorities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
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
      await citizenApi.register({
        email: email.trim(),
        password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      });

      const profile = {
        priorities: selectedPriorities,
        county,
        ward: ward.trim() || undefined,
        onboardingCompleted: true,
      };
      localStorage.setItem("bns_onboarding_profile", JSON.stringify(profile));

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
      <Card className="shadow-xs">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Verify your email</CardTitle>
          <CardDescription>We sent a verification link to {email}.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            Please click the link in your email to activate your account and access your personalized dashboard.
          </p>
          <Button asChild className="w-full">
            <Link href="/budgethub/auth/login">Go to Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xs">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          {step === 1
            ? "What matters most?"
            : step === 2
              ? "Where do you live?"
              : step === 3
                ? "Tell us about yourself"
                : "Secure your account"}
        </CardTitle>
        <CardDescription>
          {step === 1
            ? "Which issues should public funds prioritize in your community?"
            : step === 2
              ? "We customize your dashboard metrics based on where you live."
              : step === 3
                ? "Used to represent your voice in citizen panels."
                : "Complete registration and begin tracking your budget."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <span>Citizen Onboarding</span>
            <span>Step {step} of 4</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {formError && (
          <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {formError}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
              {PRIORITIES.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedPriorities.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => togglePriority(option.id)}
                    className={`relative flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 text-primary shadow-xs ring-1 ring-primary/20"
                        : "border-border/60 hover:border-border hover:bg-muted/30"
                    }`}
                  >
                    <div className={`rounded-lg p-2 ${isSelected ? "bg-primary/15" : "bg-muted"}`}>
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold leading-tight">{option.label}</p>
                      <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
                        {option.context}
                      </p>
                    </div>
                    {isSelected && (
                      <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="pt-2">
              <Button onClick={handleNext} className="w-full gap-2 font-bold">
                <span>Continue</span>
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="county" className="flex items-center gap-1.5 text-sm font-bold">
                <Building className="size-4 text-muted-foreground" />
                Select County <span className="text-destructive">*</span>
              </Label>
              <select
                id="county"
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Search or select county</option>
                {COUNTIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ward" className="text-sm font-bold">
                Ward or local area{" "}
                <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
              </Label>
              <Input
                id="ward"
                placeholder="e.g. Kilimani, Roysambu"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleBack} variant="outline" className="flex-1 gap-1.5 font-bold">
                <ArrowLeft className="size-4" />
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1 gap-1.5 font-bold">
                Continue
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center gap-1.5 text-sm font-bold">
                  <User className="size-4 text-muted-foreground" />
                  First name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  required
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-bold">
                  Last name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastName"
                  required
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleBack} variant="outline" className="flex-1 gap-1.5 font-bold">
                <ArrowLeft className="size-4" />
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1 gap-1.5 font-bold">
                Continue
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1.5 text-sm font-bold">
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-1.5 text-sm font-bold">
                  <Lock className="size-4 text-muted-foreground" />
                  Password <span className="text-destructive">*</span>
                </Label>
                <PasswordInput
                  id="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="space-y-1.5 rounded-xl border border-border/60 bg-muted/30 p-3 text-xs">
                  <p className="mb-1 font-semibold text-muted-foreground">Password requirements:</p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex size-4 items-center justify-center rounded-full text-[10px] ${
                        hasMinLength
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Check className="size-3" />
                    </div>
                    <span className={hasMinLength ? "text-emerald-500" : "text-muted-foreground"}>
                      At least 10 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex size-4 items-center justify-center rounded-full text-[10px] ${
                        hasNumber
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Check className="size-3" />
                    </div>
                    <span className={hasNumber ? "text-emerald-500" : "text-muted-foreground"}>
                      At least one number
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex size-4 items-center justify-center rounded-full text-[10px] ${
                        hasUppercase
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Check className="size-3" />
                    </div>
                    <span className={hasUppercase ? "text-emerald-500" : "text-muted-foreground"}>
                      At least one uppercase letter
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-1.5 text-sm font-bold">
                  <Lock className="size-4 text-muted-foreground" />
                  Confirm password <span className="text-destructive">*</span>
                </Label>
                <PasswordInput
                  id="confirmPassword"
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-destructive">
                    <ShieldAlert className="size-3" />
                    Passwords do not match
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                className="flex-1 gap-1.5 font-bold"
                disabled={loading}
              >
                <ArrowLeft className="size-4" />
                Back
              </Button>
              <Button type="submit" className="flex-1 gap-1.5 font-bold" disabled={loading}>
                {loading ? "Creating Account\u2026" : "Join Movement"}
              </Button>
            </div>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/budgethub/auth/login" className="font-bold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
